import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import "./Button.css";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  use?: "default" | "primary" | "text";
  size?: "default" | "small";
};

export const Button = ({
  children,
  use = "default",
  size = "default",
  className = "",
  ...props
}: ButtonProps) => {
  const smallClassName = size === "small" ? "btn--small" : "";

  return (
    <button
      className={`btn ${smallClassName} btn--${use} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
