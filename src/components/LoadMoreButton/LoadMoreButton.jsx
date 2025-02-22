import React from "react";
import css from "./LoadMoreButton.module.css";

const LoadMoreButton = ({ onLoadMore }) => {
    return (
        <button onClick={onLoadMore} className={css.showMoreButton}>
            Load More
        </button>
    );
};

export default LoadMoreButton;