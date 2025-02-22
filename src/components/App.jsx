import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Teachers from '../pages/Teachers/Teachers';
import Favorites from '../pages/Favorites/Favorites'; 
import './App.css'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </>
  );
};

