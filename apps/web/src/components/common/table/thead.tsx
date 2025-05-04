import React, { FC } from "react";
interface IHeadProps {
  head: string[];
}
export default function Thead (props :IHeadProps) {
  const { head } = props;
  return (
    <thead className="sticky top-0 bg-white">
      <tr>
        {head.map((row, index) => (
          <th key={row + index} className="text-start uppercase p-4 border-b-4">{row}</th>
        ))}
      </tr>
    </thead>
  );
};