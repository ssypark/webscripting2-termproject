import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import BirdDetails from "./components/BirdDetails.jsx";
import Checklist from "./components/Checklist.jsx";

function App() {
 

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bird/:id" element={<BirdDetails />} />
      <Route path="/checklist" element={<Checklist />} />
    </Routes>
    </BrowserRouter>
   
  )
}

export default App;
