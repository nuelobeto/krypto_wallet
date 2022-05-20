import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

// Create context
export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // States
  const [address, setAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState(0);
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
  });
  const [history, setHistory] = useState([]);
  const [confirmTransaction, setConfirmTransaction] = useState(null);
  const [hash, setHash] = useState({});

  // vaiables
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time = today.getHours() + ":" + today.getMinutes();

  // Functions
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        return;
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        let currentAddress = await signer.getAddress();

        setAddress(currentAddress);
      }
    } catch (error) {
      console.log("error");
    }
  };

  const getAddress = async () => {
    if (typeof window.ethereum === "undefined") {
      return;
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let currentAddress = await signer.getAddress();

      setAddress(currentAddress);
    }
  };

  const handleAccountChange = () => {
    if (typeof window.ethereum === "undefined") {
      return;
    } else {
      window.ethereum.on("accountsChanged", (accounts) => {
        getAddress();
      });
    }
  };

  const getBalance = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        return;
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let balance = await provider.getBalance(address);
        balance = parseFloat(ethers.utils.formatEther(balance));

        setAccountBalance(balance.toFixed(2));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendTransaction = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const { addressTo, amount } = formData;
      const parsedAmount = ethers.utils.parseEther(amount);

      const tx = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: address,
            to: addressTo,
            gas: "0x5208",
            value: parsedAmount._hex,
          },
        ],
      });

      const confirmedTX = await provider.getTransaction(tx);
      setConfirmTransaction(confirmedTX);
      setHash(confirmedTX);
      setFormData({ ...formData, addressTo: "", amount: "" });
    } catch (error) {
      console.log(error);
    }
  };

  const getHistory = () => {
    const newTransaction = {
      txType: "Sent Ether",
      amount: formData.amount,
      date,
      time,
      dollarAmount: (formData.amount * 2016.14).toFixed(2),
    };

    if (formData.addressTo === "" || formData.amount === "") {
      return;
    }

    setHistory([newTransaction, ...history]);
  };

  useEffect(() => {
    getAddress();
    handleAccountChange();
    getBalance();
  });

  return (
    <GlobalContext.Provider
      value={{
        address,
        accountBalance,
        history,
        formData,
        confirmTransaction,
        hash,
        connectWallet,
        getHistory,
        setFormData,
        setConfirmTransaction,
        sendTransaction,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
