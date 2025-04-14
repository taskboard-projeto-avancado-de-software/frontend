import React from "react";
import "../styles/Button.css";

const Button = ({
  children,
  onClick,
  variant = "default",
  disabled = false,
}) => {
  return (
    <button
      className={`custom-button ${variant} ${disabled ? "disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
