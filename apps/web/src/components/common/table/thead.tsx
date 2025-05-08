import React, { FC } from 'react';
interface IHeadProps {
  head: string[];
}
export default function Thead(props: IHeadProps) {
  const { head } = props;
  return (
    <thead className="sticky z-20 top-0 bg-white">
      <tr>
        {head.map((row, index) => (
          <th
            key={row + index}
            className="text-start py-4 px-8 font-semibold bg-gray-100 border-b border-gray-200"
          >
            {row}
          </th>
        ))}
      </tr>
    </thead>
  );
}
