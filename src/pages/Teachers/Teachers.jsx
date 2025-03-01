import React, { useState, useEffect } from "react";
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import BookForm from "../../components/BookForm/BookForm";
import { db, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { setDoc, collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import css from "./Teachers.module.css";


export default function Teachers() {
    const [selectedLanguage, setSelectedLanguage] = useState("French");
    const [expandedTeacherId, setExpandedTeacherId] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState("A1");
    const [selectedPrice, setSelectedPrice] = useState("10");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(4);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState(() => {
        const savedLevels = localStorage.getItem("selectedLevels");
        return savedLevels ? JSON.parse(savedLevels) : {};
    });

    useEffect(() => {
        // Перевіряю статус авторизації користувача
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                loadFavorites(currentUser.uid);
            } else {
                const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
                setFavorites(savedFavorites);
            }
        });

        return () => unsubscribe();
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
        if (user) {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            // Якщо документ користувача не існує, створюю новий
            if (!userSnap.exists()) {
                console.log("User document does not exist. Creating a new document...");
                try {
                    // Створюю документ з полем "favorites", яке містить поточного викладача
                    await setDoc(userRef, { favorites: [teacherId] });
                    setFavorites([teacherId]);  // Оновлюю стейт локально
                } catch (error) {
                    console.error("Error creating user document:", error);
                }
                return;
            }

            // Якщо користувач вже має документ, додаю або видаляю викладача з його обраних
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
        } else {
            // Для неавторизованих користувачів
            const updatedFavorites = favorites.includes(teacherId)
                ? favorites.filter((id) => id !== teacherId)
                : [...favorites, teacherId];

            setFavorites(updatedFavorites);
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            console.log("Updated favorites saved to localStorage:", updatedFavorites);
        }
    };

// выдкриваю модалку
    const toggleModal = () => setIsModalOpen((prev) => !prev);

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };
    const handleLevelChange = (event) => {
        setSelectedLevel(event.target.value);
    };
    const handlePriceChange = (event) => {
        setSelectedPrice(event.target.value);
    };

// функція для завантаження білше вчителів
    const handleReadMore = (teacherId) => {
        setExpandedTeacherId(prevId => (prevId === teacherId ? null : teacherId));
    };
// завантажую вчителів
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

    useEffect(() => {
        fetchTeachers();
    }, []);

    // Додаю log після успішного отримання викладачів
    useEffect(() => {
        if (teachers.length > 0) {
            console.log("Teachers successfully fetched and set:", teachers);
        }
    }, [teachers]);
    useEffect(() => {
        console.log("Updated favorites state after toggle:", favorites);
    }, [favorites]);

    // Функція для зміни рівня мови
    const handleLevelClick = (teacherId, level) => {
        if (!teacherId) return;

        setSelectedLevels(prev => {
            const updatedLevels = { ...prev, [teacherId]: level };
            localStorage.setItem("selectedLevels", JSON.stringify(updatedLevels)); // Зберігаємо у localStorage
            return updatedLevels;
        });
    };

    // При завантаженні сторінки зчитую дані з localStorage
    useEffect(() => {
        const savedLevels = localStorage.getItem("selectedLevels");
        if (savedLevels) {
            setSelectedLevels(JSON.parse(savedLevels));
        }
    }, []);


    return (
        <div className={css.wrapperTeachers}>
            <ul className={css.selectorTeachers}>
                <li>
                    <label className={css.languagesTeachers}>
                        Languages:
                        <select className={css.selectItemLang} value={selectedLanguage} onChange={handleLanguageChange}>
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
                        <select className={css.selectItemLevel} value={selectedLevel} onChange={handleLevelChange}>
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
                        <select className={css.selectItemPrice} value={selectedPrice} onChange={handlePriceChange}>
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

            {loading && <p>Loading teachers...</p>}
            {error && <p className={css.error}>{error}</p>}

            {!loading && !error && (
                <div>
                    {teachers.slice(0, visibleCount).map((teacher) => (
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
                                    {/* Кнопка "серце" */}
                                    <svg
                                        className={`${css.iconsHeart} ${favorites.includes(teacher.id) ? css.heartActive : ""}`}
                                        aria-hidden="true"
                                        width="26"
                                        height="26"
                                        onClick={() => toggleFavorite(teacher.id)}
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
                                    {Array.isArray(teacher.levels) &&
                                        teacher.levels.map((level, index) => (
                                            <button
                                                key={index}
                                                className={`${css.levelLang} ${selectedLevels[teacher.id] === level ? css.selected : ""}`}
                                                onClick={() => handleLevelClick(teacher.id, level)}
                                            >
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
            )}
        </div>
    );
};