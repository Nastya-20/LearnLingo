import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../AuthModal/authSchema';

import css from './LoginForm.module.css';

const LoginForm = ({ onSubmit, onClose, onSwitchToLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    
    const {reset, register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
    });
    console.log("Form Errors:", errors);

    const login = async (data) => {
        console.log("Form data:", data); 
        try {
            await onSubmit(data);
            onClose();
            reset();
        } catch (error) {
            console.log("Login error:", error.code);
            if (error.code === 'auth/user-not-found'){
                setError("This user doesn't exist. Please register first.");
                onSwitchToLogin();
            } else if (error.code === 'auth/wrong-password') {
                setError("Incorrect password. Please try again.");
            } else {
                setError("Login failed. Please try again.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(login)} className={css.authForm} autoComplete="on">
            <div>
                {errors.email && <p className={css.errors}>{errors.email.message}</p>}
                <input
                    className={css.emailForm}
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
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
            <button className={css.buttonForm} type="submit">Log in</button>               
            {error && <p className={css.errors}>{error}</p>}
        </form>
    );
};

export default LoginForm;



