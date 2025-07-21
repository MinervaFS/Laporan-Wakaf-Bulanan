"use client";
import { TableUser } from "@/app/component/fragment-user/TableUser";
import { useState, useEffect } from "react";
import { BiChevronRight } from "react-icons/bi";
import { ToastContainer } from "react-toastify";

export default function UserPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchingData = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        throw new Error("gagal mengambil data");
      }
      const result = await res.json();
      setData(result.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <span className="ml-4">Loading . . .</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start p-5 space-y-3">
      <ToastContainer />
      <h2
        className="flex text-xl font-bold items-center "
        style={{ color: "var(--text-sub-title)" }}
      >
        Users
        <span className="px-2">
          <BiChevronRight />
        </span>
        List
      </h2>
      <h1
        className="text-4xl font-bold"
        style={{ color: "var( --text-title)" }}
      >
        Daftar Users
      </h1>
      <div className="flex flex-wrap justify-center items-center w-full">
        <TableUser data={data} />
      </div>
    </div>
  );
}
