import React, { FC, ReactNode } from 'react';
interface IBodyProps {
  body: ReactNode[][];
}
export default function Tbody(props: IBodyProps) {
  const { body } = props;
  return (
    <tbody>
      {body.map((row, index) => (
        <tr className="bg-white hover:bg-gray-50 transition" key={'body' + index}>
          {row.map((col, indexCol) => (
            <td
              key={'col' + indexCol}
              className="border-b-2  border-gray-100 py-4 px-8 "
            >
              {col}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
