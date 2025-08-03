import React from "react";

export interface ItemProps {
  title: string;
  content: string | undefined;
}

const Item = ({ title, content }: ItemProps) => (
  <li>
    <strong>{title}</strong> {content || "N/A"}
  </li>
);

export default Item;
