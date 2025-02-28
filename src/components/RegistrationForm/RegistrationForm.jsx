import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { authSchema } from '../AuthModal/authSchema';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import css from './RegistrationForm.module.css';

const RegistrationForm = ({ onClose }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
           reset,
           formState: { errors },
       } = useForm({
           resolver: yupResolver(authSchema),
           defaultValues: { name: "", email: "", password: "" },
       });
   

    const onSubmit = async (data) => {
        const { email, password } = data; // Отримуємо дані з форми
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User registered:", userCredential);
            reset();
            onClose();
        } catch (error) {
            console.error(error);
            setError("Register failed. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={css.authForm}>
            <div>
                {errors.name && <p className={css.errors}>{errors.name.message}</p>}
                <input
                    className={css.nameForm}
                    type="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    {...register('name')}
                />
            </div>
            <div>
                {errors.email && <p className={css.errors}>{errors.email.message}</p>}
                <input
                    className={css.emailForm}
                    type="email"
                    placeholder="Email"
                    autoComplete="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    {...register('email')}
                />
            </div>
            <div className={css.inputWrapper}>
                {errors.password && <p className={css.errors}>{errors.password.message}</p>}
                <input
                    className={css.passwordForm}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    {...register('password')}
                />
                <svg
                    className={css.iconEye}
                    aria-hidden="true"
                    width="16"
                    height="16"
                    onClick={() => setShowPassword((prev) => !prev)}
                >
                    <use href={`/icons.svg#icon-eye${showPassword ? "" : "-off"}`} />
                </svg>
            </div>
            <button className={css.buttonForm} type="submit">Register</button>
            {error && <p className={css.errors}>{error}</p>}
        </form>
    );
};

export default RegistrationForm;

