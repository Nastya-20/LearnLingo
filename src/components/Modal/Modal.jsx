import { useEffect } from "react";
import css from "./Modal.module.css";

export const Modal = ({ children, onClose }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    return (
        <div className={css.overlay} onClick={onClose}>
            <div className={css.modal} onClick={(e) => e.stopPropagation()}>
                <button className={css.close} onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};