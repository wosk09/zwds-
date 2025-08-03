import React from "react";

// Тип пропсов
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
