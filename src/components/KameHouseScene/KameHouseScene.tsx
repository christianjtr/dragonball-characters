import React from "react";
import "./KameHouseScene.css";

interface KameHouseSceneProps {
  className?: string;
}

export const KameHouseScene: React.FC<KameHouseSceneProps> = ({ className }) => {
  const classes = ["kame-house-scene", className].filter(Boolean).join(" ");

  return (
    <svg
      className={classes}
      viewBox="0 0 1200 760"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="kame-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f7fd8" />
          <stop offset="55%" stopColor="#63b8ea" />
          <stop offset="100%" stopColor="#a9ecf2" />
        </linearGradient>
        <linearGradient id="kame-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3fc4cf" />
          <stop offset="100%" stopColor="#1f8fae" />
        </linearGradient>
        <linearGradient id="kame-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbf1c8" />
          <stop offset="100%" stopColor="#e8d79a" />
        </linearGradient>
        <linearGradient id="kame-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b84a74" />
          <stop offset="100%" stopColor="#8f2f55" />
        </linearGradient>
        <linearGradient id="kame-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbd3e0" />
          <stop offset="100%" stopColor="#f2b6cb" />
        </linearGradient>
      </defs>

      <rect width="1200" height="520" fill="url(#kame-sky)" />

      <circle cx="980" cy="120" r="94" fill="#fff4c4" opacity="0.32" />
      <circle cx="980" cy="120" r="58" fill="#fff4c4" />

      <g className="kame-house-scene__clouds" fill="#fffdf6">
        <g opacity="0.92" transform="translate(120 110)">
          <ellipse cx="0" cy="0" rx="58" ry="24" />
          <ellipse cx="46" cy="-14" rx="52" ry="28" />
          <ellipse cx="96" cy="0" rx="44" ry="22" />
        </g>
        <g opacity="0.8" transform="translate(720 70)">
          <ellipse cx="0" cy="0" rx="46" ry="20" />
          <ellipse cx="40" cy="-10" rx="40" ry="22" />
          <ellipse cx="78" cy="2" rx="36" ry="18" />
        </g>
        <g opacity="0.65" transform="translate(300 230)">
          <ellipse cx="0" cy="0" rx="38" ry="16" />
          <ellipse cx="34" cy="-8" rx="34" ry="18" />
        </g>
      </g>

      <g stroke="#2f6f8f" strokeWidth="3" fill="none" opacity="0.55">
        <path d="M180 190 q 12 -10 24 0 q 12 -10 24 0" />
        <path d="M250 230 q 8 -7 16 0 q 8 -7 16 0" />
      </g>

      <rect y="500" width="1200" height="260" fill="url(#kame-sea)" />
      <rect y="492" width="1200" height="18" fill="#c9f5ef" opacity="0.8" />

      <g
        className="kame-house-scene__waves"
        fill="none"
        stroke="#d8fbf5"
        strokeWidth="3"
        opacity="0.35"
      >
        <path d="M0 548 Q 40 538 80 548 T 160 548 T 240 548 T 320 548 T 400 548 T 480 548 T 560 548 T 640 548 T 720 548 T 800 548 T 880 548 T 960 548 T 1040 548 T 1120 548 T 1200 548" />
        <path d="M0 612 Q 40 602 80 612 T 160 612 T 240 612 T 320 612 T 400 612 T 480 612 T 560 612 T 640 612 T 720 612 T 800 612 T 880 612 T 960 612 T 1040 612 T 1120 612 T 1200 612" />
        <path d="M0 690 Q 40 680 80 690 T 160 690 T 240 690 T 320 690 T 400 690 T 480 690 T 560 690 T 640 690 T 720 690 T 800 690 T 880 690 T 960 690 T 1040 690 T 1120 690 T 1200 690" />
      </g>

      <ellipse cx="600" cy="600" rx="310" ry="58" fill="url(#kame-sand)" />
      <ellipse cx="600" cy="588" rx="270" ry="40" fill="#fbf1c8" />
      <ellipse
        cx="600"
        cy="600"
        rx="310"
        ry="58"
        fill="none"
        stroke="#fff8dc"
        strokeWidth="6"
        opacity="0.7"
      />

      <ellipse cx="420" cy="586" rx="34" ry="18" fill="#c9c2a8" />
      <ellipse cx="794" cy="590" rx="28" ry="15" fill="#c9c2a8" />
      <circle cx="500" cy="568" r="26" fill="#3d8f4e" opacity="0.9" />
      <circle cx="530" cy="574" r="20" fill="#4caf50" opacity="0.9" />
      <circle cx="700" cy="572" r="24" fill="#3d8f4e" opacity="0.9" />
      <circle cx="728" cy="578" r="18" fill="#4caf50" opacity="0.9" />

      <ellipse cx="600" cy="590" rx="150" ry="16" fill="#c9b77e" opacity="0.45" />

      <rect
        x="505"
        y="455"
        width="190"
        height="132"
        rx="4"
        fill="url(#kame-wall)"
        stroke="#d998b2"
        strokeWidth="2"
      />
      <rect x="505" y="455" width="190" height="10" fill="#fffdf6" opacity="0.8" />
      <rect x="505" y="575" width="190" height="12" fill="#fffdf6" />

      <polygon
        points="480,458 600,358 720,458"
        fill="url(#kame-roof)"
        stroke="#7e2a4c"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <polygon points="600,358 720,458 660,458" fill="#c05a82" opacity="0.45" />

      <rect
        x="556"
        y="428"
        width="88"
        height="22"
        rx="3"
        fill="#fffdf6"
        stroke="#c94b4b"
        strokeWidth="2"
      />
      <text
        x="600"
        y="443"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        fontSize="10"
        fontWeight="700"
        letterSpacing="1"
        fill="#c94b4b"
      >
        KAME HOUSE
      </text>

      <rect
        x="578"
        y="515"
        width="44"
        height="72"
        rx="4"
        fill="#4f8fa2"
        stroke="#fffdf6"
        strokeWidth="3"
      />
      <circle cx="612" cy="552" r="3" fill="#fff4c4" />
      <path d="M565 500 H635 L625 512 H575 Z" fill="#c94b4b" />

      <g>
        <rect
          x="522"
          y="486"
          width="44"
          height="36"
          rx="3"
          fill="#9fe6f2"
          stroke="#fffdf6"
          strokeWidth="3"
        />
        <path d="M544 486 V522 M522 504 H566" stroke="#fffdf6" strokeWidth="2" />
      </g>
      <g>
        <rect
          x="634"
          y="486"
          width="44"
          height="36"
          rx="3"
          fill="#9fe6f2"
          stroke="#fffdf6"
          strokeWidth="3"
        />
        <path d="M656 486 V522 M634 504 H678" stroke="#fffdf6" strokeWidth="2" />
      </g>

      <rect x="545" y="587" width="110" height="10" rx="2" fill="#fffdf6" />
      <rect x="570" y="597" width="60" height="8" rx="2" fill="#e8d79a" />

      <g className="kame-house-scene__palm kame-house-scene__palm--left">
        <path
          d="M455 600 C 442 520 452 440 430 372"
          fill="none"
          stroke="#a9743f"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <g fill="#3d8f4e">
          <path d="M430 372 C 362 326 300 330 268 366 C 322 362 380 378 430 372 Z" />
          <path
            d="M430 372 C 372 300 320 286 286 302 C 332 322 386 352 430 372 Z"
            fill="#4caf50"
          />
          <path
            d="M430 372 C 430 296 450 264 482 244 C 472 296 456 340 430 372 Z"
            fill="#5cbf5c"
          />
          <path
            d="M430 372 C 500 316 552 312 590 338 C 540 354 480 374 430 372 Z"
            fill="#4caf50"
          />
          <path
            d="M430 372 C 482 396 520 428 540 468 C 498 448 458 418 430 372 Z"
            fill="#3d8f4e"
          />
        </g>
        <circle cx="438" cy="382" r="7" fill="#8a5a2b" />
        <circle cx="420" cy="386" r="6" fill="#8a5a2b" />
      </g>

      <g className="kame-house-scene__palm kame-house-scene__palm--right">
        <path
          d="M742 600 C 756 520 748 430 772 348"
          fill="none"
          stroke="#a9743f"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <g fill="#3d8f4e">
          <path
            d="M772 348 C 840 300 900 306 934 342 C 880 338 822 356 772 348 Z"
            fill="#4caf50"
          />
          <path
            d="M772 348 C 830 278 882 264 916 280 C 870 300 816 330 772 348 Z"
            fill="#5cbf5c"
          />
          <path d="M772 348 C 770 272 750 240 718 220 C 728 272 744 316 772 348 Z" />
          <path
            d="M772 348 C 702 292 650 288 612 314 C 662 330 722 350 772 348 Z"
            fill="#4caf50"
          />
          <path
            d="M772 348 C 720 372 682 404 662 444 C 704 424 744 394 772 348 Z"
            fill="#3d8f4e"
          />
        </g>
        <circle cx="764" cy="358" r="7" fill="#8a5a2b" />
        <circle cx="782" cy="362" r="6" fill="#8a5a2b" />
      </g>

      <g className="kame-house-scene__palm kame-house-scene__palm--small">
        <path
          d="M900 600 C 908 540 904 480 918 430"
          fill="none"
          stroke="#a9743f"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <g fill="#4caf50">
          <path d="M918 430 C 958 400 996 404 1018 426 C 984 424 948 436 918 430 Z" />
          <path
            d="M918 430 C 952 386 986 378 1008 388 C 976 402 944 418 918 430 Z"
            fill="#5cbf5c"
          />
          <path
            d="M918 430 C 916 382 902 360 880 346 C 888 382 900 410 918 430 Z"
            fill="#3d8f4e"
          />
          <path d="M918 430 C 878 398 844 396 820 412 C 852 422 890 434 918 430 Z" />
        </g>
      </g>

      <path
        d="M330 618 Q 420 602 520 612 T 720 612 T 870 620"
        stroke="#e8fffb"
        strokeWidth="5"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
};
