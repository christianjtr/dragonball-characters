import React from "react";

interface KameHouseMarkProps {
  className?: string;
}

export const KameHouseMark: React.FC<KameHouseMarkProps> = ({ className }) => {
  const classes = ["kame-house-mark", className].filter(Boolean).join(" ");

  return (
    <svg
      className={classes}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="32"
        cy="32"
        r="29"
        fill="#fff8e9"
        stroke="#123a4d"
        strokeWidth="3"
      />

      <ellipse
        cx="32"
        cy="48"
        rx="20"
        ry="5.5"
        fill="#fbf1c8"
        stroke="#123a4d"
        strokeWidth="2"
      />

      <path
        d="M46 48C47 41 48 35 50 29"
        fill="none"
        stroke="#a9743f"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M50 29C43 23 37 24 33 28C39 28 45 30 50 29Z"
        fill="#3d8f4e"
        stroke="#123a4d"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M50 29C50 21 53 18 57 17C55 22 53 26 50 29Z"
        fill="#4caf50"
        stroke="#123a4d"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M50 29C56 25 61 26 63 30C58 31 53 31 50 29Z"
        fill="#3d8f4e"
        stroke="#123a4d"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <rect
        x="19"
        y="30"
        width="26"
        height="16"
        rx="2"
        fill="#f2b6cb"
        stroke="#123a4d"
        strokeWidth="2.5"
      />
      <polygon
        points="15,31 32,17 49,31"
        fill="#8f2f55"
        stroke="#123a4d"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <rect
        x="28.5"
        y="37"
        width="7"
        height="9"
        rx="1"
        fill="#4f8fa2"
        stroke="#123a4d"
        strokeWidth="1.5"
      />
      <rect
        x="22.5"
        y="33.5"
        width="5"
        height="5"
        rx="0.8"
        fill="#9fe6f2"
        stroke="#123a4d"
        strokeWidth="1.3"
      />
      <rect
        x="36.5"
        y="33.5"
        width="5"
        height="5"
        rx="0.8"
        fill="#9fe6f2"
        stroke="#123a4d"
        strokeWidth="1.3"
      />
    </svg>
  );
};
