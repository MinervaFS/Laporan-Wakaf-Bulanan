"use client";
import { TableResiko } from "@/app/component/fragment-laporan/resiko-11/Table";
import { useState, useEffect } from "react";
import { BiChevronRight } from "react-icons/bi";

export default function Resiko() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchingData = async () => {
    try {
      const res = await fetch("/api/laporan/resiko");
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
      <h2
        className="flex text-xl font-bold items-center mt-10"
        style={{ color: "var(--text-sub-title)" }}
      >
        Pengelolaan Risiko
        <span className="px-2">
          <BiChevronRight />
        </span>
        List
      </h2>
      <h1
        className="text-4xl font-bold"
        style={{ color: "var( --text-title)" }}
      >
        Data Pengelolaan Risiko
      </h1>
      <div className="flex flex-wrap justify-center items-center w-full">
        <TableResiko data={data} onFetchData={fetchingData} />
      </div>
    </div>
  );
}
