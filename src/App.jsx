//import { Routes, Route, useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Teachers from './pages/Teachers/Teachers';
import Favorites from './pages/Favorites/Favorites';
import Navigation from './components/Navigation/Navigation';
// import UserMenu from './components/UserMenu/UserMenu';

export default function App() {
  // const location = useLocation(); // Отримуємо поточний шлях

  return (
    <>
      {/* Відображаємо Navigation та UserMenu лише на сторінці Home */}
      {/* {location.pathname === '/' && (
        <>
          <Navigation />
          <UserMenu />
        </>
      )} */}
      <Navigation />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/teachers" element={<Teachers />} />
        <Route exact path="/favorites" element={<Favorites />} />
      </Routes>
    </>
  );
};


