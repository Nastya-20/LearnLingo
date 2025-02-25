import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { authSchema } from '../AuthModal/authSchema';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import css from './RegistrationForm.module.css';

const RegistrationForm = ({ onSubmit }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(authSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    function registerUser(data) {
        console.log("Registering with:", data);

        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                console.log("User created:", userCredential.user);
                reset(); 

                if (onSubmit) {
                    onSubmit(userCredential.user);
                }
            })
            .catch((error) => {
                let errorMessage;
                switch (error.code) {
                    case "auth/email-already-in-use":
                        errorMessage = "This email is already registered. Try logging in.";
                        break;
                    case "auth/invalid-email":
                        errorMessage = "Invalid email format.";
                        break;
                    case "auth/weak-password":
                        errorMessage = "Password should be at least 6 characters.";
                        break;
                    default:
                        errorMessage = "Registration failed. Please try again.";
                }
                console.error("Registration error:", error.code, error.message);
                setError(errorMessage);
            });
    }

    return (
        <form onSubmit={handleSubmit(registerUser)} className={css.authForm}>
            <div>
                {errors.name && <p className={css.errors}>{errors.name.message}</p>}
                <input
                    {...register("name")}
                    className={css.nameForm}
                    type="text"
                    placeholder="Name"
                />
            </div>
            <div>
                {errors.email && <p className={css.errors}>{errors.email.message}</p>}
                <input
                    {...register("email")}
                    className={css.emailForm}
                    type="email"
                    placeholder="Email"
                />
            </div>
            <div className={css.inputWrapper}>
                {errors.password && <p className={css.errors}>{errors.password.message}</p>}
                <input
                    {...register("password")}
                    className={css.passwordForm}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
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

