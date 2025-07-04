"use client";
import { useEffect, useState } from "react";

export default function DashboardDirector() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalReport, setTotalReport] = useState(0);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/report");
      if (!res.ok) throw new Error("Failed to fetch data");
      const result = await res.json();
      setData(result.data || []);
      setTotalReport(result.totalReport);
      console.log(result.data, result.totalReport);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const DashboardSkeleton = () => (
    <div className="flex flex-wrap p-5">
      <div className="w-full px-3 pt-7 pb-5 bg-transparent">
        <div className="mb-6 bg-white rounded-xl shadow-lg p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"
                />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <div className="h-8 bg-gray-200 rounded-md w-32 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-12 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded-md w-32 animate-pulse" />
            </div>
            <div className="h-8 bg-gray-300 rounded-md w-16 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="relative bg-gray-200 rounded-xl shadow-xl h-40 overflow-hidden p-4 animate-pulse"
            >
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-300 p-3 rounded-full w-12 h-12" />
                    <div className="h-4 bg-gray-300 rounded w-20" />
                  </div>
                </div>
                <div className="h-8 bg-gray-300 rounded w-16" />
                <div className="h-4 bg-gray-300 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4 animate-pulse" />
          <div className="h-80 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-4 animate-pulse" />
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-4 animate-pulse" />
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="w-full mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4 animate-pulse" />
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="border-b border-gray-200 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex-1 p-4">
                      <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
              {[...Array(6)].map((_, rowIndex) => (
                <div key={rowIndex} className="border-b border-gray-100">
                  <div className="flex">
                    {[...Array(5)].map((_, colIndex) => (
                      <div key={colIndex} className="flex-1 p-4">
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-5 space-y-6">
      {/* <CardReport /> */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* <BarChartWeekly />
          <BarChartMonthly /> */}
        </div>
        <div className="w-full">{/* <BarChartYearly /> */}</div>
      </div>
      {/* <div className="">
        <h1 className="text-3xl font-semibold text-gray-800">
          Total Tabel Laporan
        </h1>
      </div> */}
      <div className="">
        {/* <TableDashboard data={data} totalReport={totalReport} /> */}
      </div>
    </div>
  );
}
