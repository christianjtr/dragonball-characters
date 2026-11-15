import React, { useEffect, useRef } from "react";
import { useMenuNavigation } from "@hooks/useMenuNavigation";
import "./ArcadeMenuList.css";

export type ArcadeMenuItemAccent = "orange" | "blue" | "gold";

export interface ArcadeMenuItem {
  id: string;
  label: string;
  description: string;
  accent?: ArcadeMenuItemAccent;
}

interface ArcadeMenuListProps {
  id?: string;
  items: ArcadeMenuItem[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
  onSelect: (index: number) => void;
  onBack?: () => void;
  className?: string;
}

const padIndex = (index: number): string => String(index + 1).padStart(2, "0");

export const ArcadeMenuList: React.FC<ArcadeMenuListProps> = ({
  id = "arcade-main-menu",
  items,
  activeIndex,
  onActiveChange,
  onSelect,
  onBack,
  className,
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  const { handleKey } = useMenuNavigation({
    itemCount: items.length,
    activeIndex,
    onMove: onActiveChange,
    onConfirm: onSelect,
    onBack: () => {
      if (document.querySelector(".arcade-options")) return;
      onBack?.();
    },
  });

  useEffect(() => {
    const handleWindowKeyDown = (event: globalThis.KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.closest(".arcade-options") ||
          target.isContentEditable ||
          ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName))
      ) {
        return;
      }
      handleKey(event);
    };

    window.addEventListener("keydown", handleWindowKeyDown);
    listRef.current?.focus({ preventScroll: true });

    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, [handleKey]);

  const activeItem = items[activeIndex];

  return (
    <nav
      className={["arcade-menu-list", className].filter(Boolean).join(" ")}
      aria-label="Menú principal"
    >
      <ul
        id={id}
        ref={listRef}
        className="arcade-menu-list__items"
        role="menu"
        tabIndex={0}
        aria-activedescendant={
          activeItem ? `arcade-menu-item-${activeItem.id}` : undefined
        }
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <li key={item.id} className="arcade-menu-list__row" role="none">
              <button
                id={`arcade-menu-item-${item.id}`}
                type="button"
                role="menuitem"
                tabIndex={-1}
                data-accent={item.accent ?? "orange"}
                className={[
                  "arcade-menu-list__item",
                  isActive ? "is-active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={isActive ? "true" : undefined}
                onFocus={() => onActiveChange(index)}
                onMouseEnter={() => onActiveChange(index)}
                onClick={() => onSelect(index)}
              >
                <span
                  className="arcade-menu-list__cursor"
                  aria-hidden="true"
                >
                  ▶
                </span>
                <span className="arcade-menu-list__copy">
                  <span className="arcade-menu-list__label">
                    {item.label}
                  </span>
                  <span className="arcade-menu-list__description">
                    {item.description}
                  </span>
                </span>
                <span className="arcade-menu-list__index" aria-hidden="true">
                  {padIndex(index)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
