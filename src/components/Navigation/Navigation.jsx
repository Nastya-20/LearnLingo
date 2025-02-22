import { NavLink } from 'react-router-dom';

export default function Navigation() {
    return (
        <nav>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
                <svg width="24" height="24">
                    <use href="/icons.svg#icon-ukraine"></use>
                </svg>
                <h3>LearnLingo</h3>
                Home
            </NavLink>
            
            <NavLink to="/teachers" className={({ isActive }) => isActive ? "active" : ""}>
                Teachers
            </NavLink>    
        </nav>
    );
};
