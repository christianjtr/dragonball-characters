import React from "react";
import "./Skeleton.css";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, style }) => {
  const classes = ["skeleton", className].filter(Boolean).join(" ");

  return <span className={classes} style={style} aria-hidden="true" />;
};
