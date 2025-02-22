import React from "react";
import { Link } from "react-router-dom";
import css from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <div className={css.container}>

      <Link to="/catalog" className={css.link}>
        Go back
      </Link>
    </div>
  );
}