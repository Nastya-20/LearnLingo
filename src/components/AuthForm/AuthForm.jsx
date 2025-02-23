import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import css from './AuthForm.module.css';
import { useState } from "react";

const schema = yup.object({
    name: yup.string().when("$isRegister", {
        is: true,
        then: (schema) => schema.required("Name is required"),
    }),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters long"),
});

export const AuthForm = ({ isRegister = false, onSubmit }) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        context: { isRegister },
        defaultValues: { name: "", email: "", password: "" },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={css.authForm}>
            {isRegister && (
                <div>
                    {errors.name && <p className={css.errors}>{errors.name.message}</p>}
                    <input className={css.nameForm} {...register("name")} placeholder="Name" />
                </div>
            )}
            <div>
                {errors.email && <p className={css.errors}>{errors.email.message}</p>}
                <input className={css.emailForm} type="email" {...register("email")} placeholder="Email" />
            </div>
            <div className={css.inputWrapper}>
                {errors.password && <p className={css.errors}>{errors.password.message}</p>}
                <input className={css.passwordForm}
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Password"
                />
                <svg
                    className={css.iconEye}
                    aria-hidden="true"
                    width="16"
                    height="16"
                    onClick={() => setShowPassword((prev) => !prev)} // Міняємо стан при кліку
                >
                    <use href={`/icons.svg#icon-eye${showPassword ? "" : "-off"}`} />
                </svg>
            </div>
            <button className={css.buttonForm} type="submit">{isRegister ? "Sign Up" : "Log in"}</button>
        </form>
    );
};

