import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import BirdDetails from "./components/BirdDetails.jsx";
import Favourites from "./components/Favourites.jsx";

function App() {
 

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bird/:id" element={<BirdDetails />} />
      <Route path="/favourites" element={<Favourites />} />
    </Routes>
    </BrowserRouter>
   
  )
}

export default App;
