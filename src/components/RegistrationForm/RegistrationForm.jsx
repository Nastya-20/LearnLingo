import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../AuthModal/authSchema';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import css from './RegistrationForm.module.css';

const RegistrationForm = ({ onSubmit, onClose, onSwitchToLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { reset, register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema),
    });
    console.log("Form Errors:", errors);

    const submitForm = async (data) => {
        console.log("Form data:", data);
        try {
            await onSubmit(data);
            onClose();
            reset(),
            onSwitchToLogin(data);

            toast.success("Registration successful! You can now log in.");
        } catch (error) {
            console.error("Registration error:", error);

            toast.error("Registration failed. Please try again.");
            if (error.code === 'auth/email-already-in-use') {
                onSwitchToLogin();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(submitForm)} className={css.authForm}>
            <div>
                {errors.name && <p className={css.errors}>{errors.name.message}</p>}
                <input
                    className={css.nameForm}
                    type="text"
                    placeholder="Name"
                    {...register('name')}
                />
            </div>
            <div>
                {errors.email && <p className={css.errors}>{errors.email.message}</p>}
                <input
                    className={css.emailForm}
                    type="email"
                    placeholder="Email"
                    {...register('email')}
                />
            </div>
            <div>
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
            <button className={css.buttonForm} type="submit">Register</button>
        </form>
    );
};

export default RegistrationForm;

