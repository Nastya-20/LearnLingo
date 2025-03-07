import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Teachers from './pages/Teachers/Teachers';
import Favorites from './pages/Favorites/Favorites';
import Navigation from './components/Navigation/Navigation';
import { ToastContainer } from 'react-toastify';


export default function App() {

  return (
    <>
      <ToastContainer />
      <Navigation />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/teachers" element={<Teachers />} />
        <Route exact path="/favorites" element={<Favorites />} />
      </Routes>
    </>
  );
};


