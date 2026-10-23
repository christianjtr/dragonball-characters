import React from "react";
import "./Marquee.css";

interface MarqueeProps {
  items: string[];
}

export const Marquee: React.FC<MarqueeProps> = ({ items }) => {
  const content = items.map((item, index) => (
    <span className="marquee__item" key={`marquee_item_${index}`}>
      {item}
      <span className="marquee__dot" aria-hidden="true">
        ◆
      </span>
    </span>
  ));

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <div className="marquee__group">{content}</div>
        <div className="marquee__group">{content}</div>
      </div>
    </div>
  );
};
