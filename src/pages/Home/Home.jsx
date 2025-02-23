import { useState } from 'react';
import css from './Home.module.css';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

export default function Home() {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    }

    return (
        <div className={css.container}>
            <div className={css.wrapper}>
                <div className={css.homeWrapp}>
                    <h1 className={css.homeTitle}>Unlock your potential with the best <span className={css.language}>language</span> tutors</h1>
                    <p className={css.homeText}>Embark on an Exciting Language Journey with Expert Language
                        Tutors: Elevate your language proficiency to new heights by
                        connecting with highly qualified and experienced tutors.</p>
                    <Link to="/teachers">
                    <button onClick={handleClick} className={css.homeBtn} type="submit">
                        Get started
                        </button>
                    </Link>
                    {loading && <Loader />}{" "}
                    {/* Показуємо Loader, якщо завантаження активне */}
                </div>
                <img className={css.imgHero} src="/public/block_1x.png" />
            </div>
            <ul className={css.homeNumbers}>
                <li>32,000&nbsp;+<span className={css.numbers}>Experienced tutors</span></li>
                <li>300,000&nbsp;+<span className={css.numbers}>5-star tutor reviews</span></li>
                <li>120&nbsp;+<span className={css.numbers}>Subjects taught</span></li>
                <li>200&nbsp;+<span className={css.numbers}>Tutor nationalities</span></li>
            </ul>
        </div> 
    );
};