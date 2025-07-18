"use client";
import { BiPlus, BiSolidEditAlt, BiSolidTrash, BiTrash } from "react-icons/bi";
import { Button } from "@material-tailwind/react";

export const BtnCreate = ({ onOpen }) => {
  return (
    <div>
      <Button
        onClick={onOpen}
        className="bg-amber-600 text-white flex items-center shadow-none"
      >
        Tambah Sistem IT{" "}
        <span className="ml-2">
          <BiPlus size={16} />
        </span>
      </Button>
    </div>
  );
};

export const BtnEdit = ({ openModalEdit }) => {
  return (
    <div>
      <Button
        onClick={openModalEdit}
        className="text-white bg-blue-500 hover:bg-blue-400 hover:shadow-blue-400 hover:shadow-lg duration-200 p-2 rounded-full text-md"
      >
        <BiSolidEditAlt size={20} />
      </Button>
    </div>
  );
};

export const BtnDelete = ({ openModalDelete }) => {
  return (
    <div>
      <Button
        onClick={openModalDelete}
        className="text-white bg-red-500  hover:bg-red-400 hover:shadow-red-400 hover:shadow-lg duration-200 p-2 rounded-full text-md"
      >
        <BiSolidTrash size={20} />
      </Button>
    </div>
  );
};
