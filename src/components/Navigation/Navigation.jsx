import { NavLink } from 'react-router-dom';
import UserMenu from '../UserMenu/UserMenu';
import css from './Navigation.module.css';

export default function Navigation() {
    return (
        <header className={css.header}>
            <nav className={css.nav}>
                <div className={css.logo}>
                    <svg width="24" height="24">
                        <use href="/icons.svg#icon-ukraine"></use>
                    </svg>
                    <NavLink to="/" className={css.navTitle}>LearnLingo</NavLink>
                </div>
                <div className={css.navigation}>
                    <NavLink to="/" className={({ isActive }) => isActive ? css.active : css.link}>
                        Home
                    </NavLink>
                    <NavLink to="/teachers" className={({ isActive }) => isActive ? css.active : css.link}>
                        Teachers
                    </NavLink>
                    <NavLink to="/favorites" className={({ isActive }) => isActive ? css.active : css.link}>
                        Favorites
                    </NavLink>
                </div>
            </nav>
            <nav>
                <UserMenu />
            </nav>
        </header>
    );
};

