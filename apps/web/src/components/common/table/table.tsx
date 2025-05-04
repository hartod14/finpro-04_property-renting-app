import React, { ReactNode, FC } from "react";
import Thead from "./thead";
import Tbody from "./tbody";
interface ITableProps {
  head: string[];
  body: ReactNode[][];
}
export default function Table(props: ITableProps) {
  const { body, head } = props;
  return (
    <div className="table-auto w-full bg-white ">
      <table className="w-full ">
        <Thead head={head} />
        {body.length > 0 && <Tbody body={body} />}
      </table>
      {body.length === 0 && (
        <div className="text-2xl font-bold capitalize h-[100px] flex justify-center items-center">
          No data
        </div>
      )}
    </div>
  );
};
