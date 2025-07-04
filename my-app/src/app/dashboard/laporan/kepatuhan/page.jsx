"use client";
import { useState, useEffect } from "react";
import { BiChevronRight } from "react-icons/bi";

export default function Kepatuhan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // const fetchingData = async () => {
  //   try {
  //     const res = await fetch("/api/master-data/new-document");
  //     if (!res.ok) {
  //       throw new Error("gagal mengambil data");
  //     }
  //     const result = await res.json();
  //     setData(result || []);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchingData();
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="flex flex-col items-start p-5 space-y-3">
  //       {/* Header Skeleton */}
  //       <div className="h-6 bg-gray-300 rounded w-1/3 animate-pulse mt-10" />
  //       <div className="h-10 bg-gray-300 rounded w-1/2 animate-pulse" />

  //       {/* Table Skeleton */}
  //       <div className="w-full overflow-x-auto">
  //         <div className="min-w-full bg-white rounded-lg shadow animate-pulse">
  //           {/* Table Header Skeleton */}
  //           <div className="border-b border-gray-200">
  //             <div className="flex">
  //               {[...Array(5)].map((_, i) => (
  //                 <div key={i} className="flex-1 p-4">
  //                   <div className="h-4 bg-gray-300 rounded w-3/4" />
  //                 </div>
  //               ))}
  //             </div>
  //           </div>

  //           {/* Table Rows Skeleton */}
  //           {[...Array(8)].map((_, rowIndex) => (
  //             <div key={rowIndex} className="border-b border-gray-100">
  //               <div className="flex">
  //                 {[...Array(5)].map((_, colIndex) => (
  //                   <div key={colIndex} className="flex-1 p-4">
  //                     <div className="h-4 bg-gray-200 rounded w-full" />
  //                   </div>
  //                 ))}
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col items-start p-5 space-y-3">
      <h2
        className="flex text-xl font-bold items-center mt-10"
        style={{ color: "var(--text-sub-title)" }}
      >
        Kepatuhan
        <span className="px-2">
          <BiChevronRight />
        </span>
        List
      </h2>
      <h1
        className="text-4xl font-bold"
        style={{ color: "var( --text-title)" }}
      >
        Data Kepatuhan
      </h1>
      <div className="flex flex-wrap justify-center items-center w-full">
        {/* <TableDoc data={data} onFetchData={fetchingData} /> */}
      </div>
    </div>
  );
}
