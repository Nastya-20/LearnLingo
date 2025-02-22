import { useState } from "react";
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import css from "./Teachers.module.css";

export default function Teachers() {
    const [selectedLanguage, setSelectedLanguage] = useState("French");

    const handleChange = (event) => {
        setSelectedLanguage(event.target.value);
    }

    return (
        <div className={css.wrapperTeachers}>
            <ul className={css.selectorTeachers}>
                <li>
                    <label className={css.languagesTeachers}>
                        Languages:
                        <select className={css.selectItemLang} value={selectedLanguage} onChange={handleChange}>
                            <option className={css.languages} value="French">French</option>
                            <option className={css.languages} value="Spanish">English</option>
                            <option className={css.languages} value="German">German</option>
                            <option className={css.languages} value="Ukrainian">Ukrainian</option>
                            <option className={css.languages} value="Polish">Polish</option>
                        </select>
                    </label>
                </li>
                <li>
                    <label className={css.levelTeachers}>
                        Level of knowledge
                        <select className={css.selectItemLevel} >
                            <option className={css.level} value="French">A1 Beginner</option>
                            <option className={css.level} value="Spanish">A2 Elementary</option>
                            <option className={css.level} value="German">B1 Intermediate</option>
                            <option className={css.level} value="Spanish">B2 Upper-Intermediate</option>
                        </select>
                    </label>
                </li>
                <li>
                    <label className={css.priceTeachers}>
                        Price
                        <select className={css.selectItemPrice} >
                            <option className={css.price} value="French">10 $</option>
                            <option className={css.price} value="Spanish">20 $</option>
                            <option className={css.price} value="German">30 $</option>
                            <option className={css.price} value="Spanish">40 $</option>
                        </select>
                    </label>
                </li>
            </ul>
            <div className={css.detailsTeachers}>
                <div className={css.imgContainer}>
                    <img className={css.imgTeachers} width="96" height="96" src="/person.jpg" alt="Teacher" />
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
                                Lessons&nbsp;done:&nbsp;1098
                            </li>
                            <span className={css.line}>|</span>
                            <li className={css.detailsText}>
                                <svg className={css.iconStar} aria-hidden="true" width="16" height="16">
                                <use href="/icons.svg#icon-Star-2" />
                            </svg>
                                Rating:&nbsp;4.8
                            </li>
                            <span className={css.line}>|</span>
                            <li className={css.detailsText}>
                                Price&nbsp;/&nbsp;1&nbsp;hour:&nbsp;<span className={css.priceNumber}>30$</span>
                            </li>
                        </ul>
                        <svg className={css.iconsHeart} aria-hidden="true" width="26" height="26">
                            <use href="/icons.svg#icon-heart" />
                        </svg>
                    </div>
                    <h2 className={css.nameTeacher}>
                        Jane Smith
                    </h2>
                    <p className={css.infoSpeaks}><span className={css.speaks}>
                        Speaks:</span><span className={css.underlined}>German, French</span></p>
                    <p className={css.info}><span className={css.lesson}>
                        Lesson Info:</span> Lessons are structured to cover
                        grammar, vocabulary, and practical usage of
                        the language.
                    </p>
                    <p className={css.infoConditions}><span className={css.conditions}>
                        Conditions:</span> Welcomes both adult learners and
                        teenagers (13 years and above).Provides personalized
                        study plans
                    </p>
                    <a href="" className={css.readMore}>Read more</a>
                    <div className={css.levelLanguages}>
                        <button className={css.levelAOne}>#A1 Beginner</button>
                        <button className={css.levelLang}>#A2 Elementary</button>
                        <button className={css.levelLang}>#B1 Intermediate</button>
                        <button className={css.levelLang}>#B2 Upper-Intermediate</button>
                    </div>
                </div>
            </div>
            <LoadMoreButton />
        </div>
    );
};