import React from "react";
import "./ArcadeButton.css";

type ArcadeButtonVariant = "primary" | "ghost" | "danger";
type ArcadeButtonSize = "sm" | "md";

interface ArcadeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ArcadeButtonVariant;
  size?: ArcadeButtonSize;
}

export const ArcadeButton: React.FC<ArcadeButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...rest
}) => {
  const classes = [
    "arcade-button",
    `arcade-button--${variant}`,
    `arcade-button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button type={type} className={classes} {...rest} />;
};
