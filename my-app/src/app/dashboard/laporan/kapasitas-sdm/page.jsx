"use client";
import { TableKapasitasSdm } from "@/app/component/fragment-laporan/kapasitas-sdm-7/Table";
import { useState, useEffect } from "react";
import { BiChevronRight } from "react-icons/bi";

export default function KapasitasSdm() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchingData = async () => {
    try {
      const res = await fetch("/api/laporan/kapasitas-sdm");
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
        className="flex text-xl font-bold items-center"
        style={{ color: "var(--text-sub-title)" }}
      >
        Kapasitas SDM
        <span className="px-2">
          <BiChevronRight />
        </span>
        List
      </h2>
      <h1
        className="text-4xl font-bold"
        style={{ color: "var( --text-title)" }}
      >
        Data Kapasitas SDM
      </h1>
      <div className="flex flex-wrap justify-center items-center w-full">
        {/* <TableDoc data={data} onFetchData={fetchingData} /> */}
        <TableKapasitasSdm data={data} onFetchData={fetchingData} />
      </div>
    </div>
  );
}
