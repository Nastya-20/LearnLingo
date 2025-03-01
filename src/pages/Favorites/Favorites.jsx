import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import BookForm from "../../components/BookForm/BookForm";
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import css from "./Favorites.module.css";

export default function Favorites() {
    const [expandedTeacherId, setExpandedTeacherId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(4);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);

    // Відстежую авторизації користувача
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Завантажую улюблених викладачів після оновлення `user`
    useEffect(() => {
        if (user) {
            loadFavorites(user.uid);
        }
    }, [user]);

    useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "teachers"));
                const teachersList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTeachers(teachersList);
            } catch (error) {
                console.error("Error fetching teachers:", error);
                setError("Failed to load teachers.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    // Завантажую обраних викладачів
    const loadFavorites = async (userId) => {
        try {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setFavorites(userSnap.data().favorites || []);
            }
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    };

    // Додаю/видаляю з обраних
    const toggleFavorite = async (teacherId) => {
        if (!user) {
            alert("This feature is available for authorized users only.");
            return;
        }

        const userRef = doc(db, "users", user.uid);
        const isFavorite = favorites.includes(teacherId);

        try {
            await updateDoc(userRef, {
                favorites: isFavorite ? arrayRemove(teacherId) : arrayUnion(teacherId),
            });
            setFavorites((prev) =>
                isFavorite ? prev.filter((id) => id !== teacherId) : [...prev, teacherId]
            );
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    const toggleModal = () => setIsModalOpen((prev) => !prev);

    const handleReadMore = (teacherId) => {
        setExpandedTeacherId((prevId) => (prevId === teacherId ? null : teacherId));
    };

    // Фільтруєю лише викладачів, які є в `favorites`
    const favoriteTeachers = teachers.filter((teacher) => favorites.includes(teacher.id));

        
     return (
        <div className={css.wrapperTeachers}>
            <ul className={css.selectorTeachers}>
                <li>
                    <label className={css.languagesTeachers}>
                        Languages:
                        <select className={css.selectItemLang}>
                            <option value="French">French</option>
                            <option value="English">English</option>
                            <option value="German">German</option>
                            <option value="Spanish">Spanish</option>
                            <option value="Italian">Italian</option>
                            <option value="Mandarin_Chinese">Mandarin Chinese</option>
                            <option value="Korean">Korean</option>
                            <option value="Vietnamese">Vietnamese</option>
                        </select>
                    </label>
                </li>
                <li>
                    <label className={css.levelTeachers}>
                        Level of knowledge
                        <select className={css.selectItemLevel} >
                            <option value="A1">A1 Beginner</option>
                            <option value="A2">A2 Elementary</option>
                            <option value="B1">B1 Intermediate</option>
                            <option value="B2">B2 Upper-Intermediate</option>
                        </select>
                    </label>
                </li>
                <li>
                    <label className={css.priceTeachers}>
                        Price
                        <select className={css.selectItemPrice}>
                            <option value="10">25 $</option>
                            <option value="20">27 $</option>
                            <option value="30">28 $</option>
                            <option value="40">30 $</option>
                            <option value="50">32 $</option>
                            <option value="60">35 $</option>
                        </select>
                    </label>
                </li>
            </ul>

            {loading && <p>Loading favorite teachers...</p>}
            {error && <p className={css.error}>{error}</p>}

             {!loading && !error && favoriteTeachers.length === 0 && <p>No favorite teachers yet.</p>}

             {!loading && !error && favoriteTeachers.slice(0, visibleCount).map((teacher) => (
                <div key={teacher.id} className={css.detailsTeachers}>
                    <div className={css.imgContainer}>
                        <img className={css.imgTeachers} width="96" height="96" src={teacher.avatar_url} alt={teacher.name} />
                    </div>
                    <div>
                        <div className={css.detailsItems}>
                            <h3 className={css.detailsTitle}>Languages</h3>
                            <ul className={css.detailsLink}>
                                <li className={css.detailsText}>
                                    <svg className={css.iconBook} aria-hidden="true" width="16" height="16">
                                        <use href="/icons.svg#icon-book-open-01" />
                                    </svg>Lessons&nbsp;online
                                </li>
                                <span className={css.line}>|</span>
                                <li className={css.detailsText}>
                                    Lessons&nbsp;done:{teacher.lessons_done}
                                </li>
                                <span className={css.line}>|</span>
                                <li className={css.detailsText}>
                                    <svg className={css.iconStar} aria-hidden="true" width="16" height="16">
                                        <use href="/icons.svg#icon-Star-2" />
                                    </svg>
                                    Rating:&nbsp;{teacher.rating}
                                </li>
                                <span className={css.line}>|</span>
                                <li className={css.detailsText}>
                                    Price&nbsp;/&nbsp;1&nbsp;hour:&nbsp;<span className={css.priceNumber}>{teacher.price_per_hour}$</span>
                                </li>
                            </ul>
                            {/* Heart icon for adding/removing favorite */}
                            <svg
                                onClick={() => {
                                    toggleFavorite(teacher.id);
                                     console.log(`Favorite status of teacher ${teacher.id}:`, favorites.includes(teacher.id));
                                }}
                                className={favorites.includes(teacher.id) ? css.iconHeartActive : css.iconHeart}
                                aria-hidden="true"
                                width="26"
                                height="26"
                            >
                                <use href="/icons.svg#icon-heart" />
                            </svg>
                        </div>
                        <h2 className={css.nameTeacher}>{teacher.name} {teacher.surname}</h2>
                        <p className={css.infoSpeaks}>
                            <span className={css.speaks}>Speaks: </span>
                            <span className={css.underlined}>{teacher.languages.join(", ")}</span>
                        </p>
                        <p className={css.info}><span className={css.lesson}>Lesson Info:</span> {teacher.lesson_info}</p>
                        <p className={css.infoConditions}><span className={css.conditions}>Conditions:</span> {teacher.conditions}</p>

                        {/* Кнопка Read more */}

                        {expandedTeacherId !== teacher.id && (
                            <button className={css.readMore} onClick={() => handleReadMore(teacher.id)}>
                                Read more
                            </button>
                        )}
                        {expandedTeacherId === teacher.id && (
                            <>
                                <p className={css.reviewText}>{teacher.experience}</p>
                                <div className={css.reviewsList}>
                                    {teacher.reviews.map((review, index) => (
                                        <div key={index} className={css.reviewItem}>
                                            <div className={css.reviewReiting}>
                                                <img className={css.imgReview} width="96" height="96" src={review.avatar_url || "/person.jpg"} alt={review.reviewer_name} />
                                                <div>
                                                    <h3 className={css.reviewName}>{review.reviewer_name}</h3>
                                                    <svg className={css.iconStar} aria-hidden="true" width="16" height="16">
                                                        <use href="/icons.svg#icon-Star-2" />
                                                    </svg>
                                                    {review.reviewer_rating}
                                                </div>
                                            </div>
                                            <p className={css.reviewItemText}>{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Додатковий контент: відгуки + кнопка Book trial lesson */}

                        <div className={css.levelLanguages}>
                            {teacher.levels.map((level, index) => (
                                <button key={index} className={css.levelLang}>
                                    {level}
                                </button>
                            ))}
                        </div>

                        {/* Кнопка Book trial lesson */}

                        {expandedTeacherId === teacher.id && (
                            <>
                                <button className={css.openModalBtn} onClick={() => setIsModalOpen(true)}>
                                    Book trial lesson
                                </button>
                                {isModalOpen && <BookForm onSubmit={toggleModal} toggleModal={toggleModal} isOpen={isModalOpen} />}
                            </>
                        )}
                    </div>
                </div>
            ))}
            {visibleCount < teachers.length && <LoadMoreButton onLoadMore={() => setVisibleCount(prev => prev + 4)} />}
        </div>
    );
}

