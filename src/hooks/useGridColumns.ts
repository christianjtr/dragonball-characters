import { useEffect, useState, type RefObject } from "react";

const countGridColumns = (element: HTMLElement): number => {
  const template = window.getComputedStyle(element).gridTemplateColumns;
  const columns = template.split(" ").filter(Boolean).length;

  return columns > 0 ? columns : 1;
};

export const useGridColumns = (
  ref: RefObject<HTMLElement | null>,
): number => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const measure = () => setColumns(countGridColumns(element));

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return columns;
};
