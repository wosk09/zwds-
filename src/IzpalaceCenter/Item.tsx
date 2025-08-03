import React from "react";

// Определение типа пропсов для Item
export interface ItemProps {
  title: string;
  content: string | undefined;
}

// Компонент Item
const Item = ({ title, content }: ItemProps) => (
  <li>
    <strong>{title}</strong> {content || "N/A"}
  </li>
);

export default Item;
