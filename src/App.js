import Home from "./components/home/Home";

import { Routes, Route } from "react-router-dom";
import SendTransaction from "./components/sendTransaction/SendTransaction";
import Success from "./components/success/Success";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="send-transaction" element={<SendTransaction />} />
        <Route path="success" element={<Success />} />
      </Routes>
    </div>
  );
}

export default App;

// 0xDa4F543544df611B7624D54B7712d7736DbB67B8
