import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import css from './BookForm.module.css';

const schema = yup.object().shape({
    name: yup.string().required('Full Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().matches(/^\d+$/, 'Only numbers allowed').required('Phone number is required'),
    reason: yup.string().required('Please select a reason'),
});

export default function BookForm({ toggleModal, isOpen }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        console.log('Form Submitted:', data);
        toggleModal();
    };

    return (
        <>
            {isOpen && (
                <div className={css.overlayBook} onClick={toggleModal}>
                    <div className={css.modalBook} onClick={(e) => e.stopPropagation()}>
                        <button className={css.closeBtn} onClick={toggleModal}>
                            &times;
                        </button>
                        <div className={css.bookWrap}>
                            <h1 className={css.bookTitle}>Book trial lesson</h1>
                            <p className={css.bookText}>
                                Our experienced tutor will assess your current language level,
                                discuss your learning goals, and tailor the lesson to your specific needs.
                            </p>
                            <div className={css.infoTeacher}>
                                <img className={css.imgTeacher} width="96" height="96" src="/person.jpg" alt="Teacher" />
                                <div className={css.myTeacher}>
                                    <p className={css.teacherText}>Your teacher</p>
                                    <h3 className={css.teacherName}>Jane Smith</h3>
                                </div>
                            </div>
                        </div>
                        <form className={css.bookForm} onSubmit={handleSubmit(onSubmit)}>
                            <fieldset className={css.select}>
                                <label className={css.selectItem}>
                                    <input type="radio" className={css.radio} value="Career and business" {...register('reason')} /> Career and business
                                </label>
                                <label className={css.selectItem}>
                                    <input type="radio" className={css.radio} value="Lesson for kids" {...register('reason')} /> Lesson for kids
                                </label>
                                <label className={css.selectItem}>
                                    <input type="radio" className={css.radio} value="Living abroad" {...register('reason')} /> Living abroad
                                </label>
                                <label className={css.selectItem}>
                                    <input type="radio" className={css.radio} value="Exams and coursework" {...register('reason')} /> Exams and coursework
                                </label>
                                <label className={css.selectItem}>
                                    <input type="radio" className={css.radio} value="Culture, travel or hobby" {...register('reason')} /> Culture, travel or hobby
                                </label>
                            </fieldset>
                            <p className={css.error}>{errors.reason?.message}</p>

                            <input
                                className={css.input}
                                type="text"
                                placeholder="Full Name"
                                {...register('name')}
                            />
                            <p className={css.error}>{errors.name?.message}</p>

                            <input
                                className={css.input}
                                type="email"
                                placeholder="Email"
                                {...register('email')}
                            />
                            <p className={css.error}>{errors.email?.message}</p>

                            <input
                                className={css.input}
                                type="text"
                                placeholder="Phone number"
                                {...register('phone')}
                            />
                            <p className={css.error}>{errors.phone?.message}</p>

                            <button className={css.buttonBook} type="submit">
                                Book
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}