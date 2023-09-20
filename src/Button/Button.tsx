import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import "./Button.css";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { use?: "default" | "primary" | "text" };

export const Button = ({
  children,
  use = "default",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button className={`btn btn--${use} ${className}`} {...props}>
      {children}
    </button>
  );
};
