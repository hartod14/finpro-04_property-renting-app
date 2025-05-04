import React, { FC, ReactNode } from "react";
interface IBodyProps {
  body: ReactNode[][];
}
export default function Tbody (props : IBodyProps)  {
  const { body } = props;
  return (
    <tbody>
      {body.map((row, index) => (
        <tr className=" " key={"body" + index} >
          {row.map((col, indexCol) => (
            <td key={"col" + indexCol} className="bg-white border-b-4 p-4 ">{col}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};