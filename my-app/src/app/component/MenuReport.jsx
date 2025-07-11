"use client";

import Link from "next/link";
import { BiDetail, BiCheckCircle, BiArrowToRight } from "react-icons/bi";

export default function MenuLaporan() {
  const menuItems = [
    {
      id: 1,
      title: "Info Umum",
      path: "/dashboard/laporan/info-umum",
    },
    {
      id: 2,
      title: "Inventarisasi",
      path: "/dashboard/laporan/inventarisasi",
    },
    {
      id: 3,
      title: "Digitalisasi",
      path: "/dashboard/laporan/digitalisasi",
    },
    {
      id: 4,
      title: "Penilaian Asset",
      path: "/dashboard/laporan/penilaian-asset",
    },
    {
      id: 5,
      title: "Pengelolaan",
      path: "/dashboard/laporan/pengelolaan",
    },
    {
      id: 6,
      title: "Pemanfaatan",
      path: "/dashboard/laporan/pemanfaatan",
    },
    {
      id: 7,
      title: "Kapasitas SDM",
      path: "/dashboard/laporan/kapasitas-sdm",
    },
    {
      id: 8,
      title: "Sistem IT",
      path: "/dashboard/laporan/sistem-it",
    },
    {
      id: 9,
      title: "Kepatuhan",
      path: "/dashboard/laporan/kepatuhan",
    },
    {
      id: 10,
      title: "Pelaporan",
      path: "/dashboard/laporan/pelaporan",
    },
    {
      id: 11,
      title: "Risiko",
      path: "/dashboard/laporan/risiko",
    },
    {
      id: 12,
      title: "Rangkuman",
      path: "/dashboard/laporan/rangkuman",
    },
  ];

  const handleClick = (index) => {
    console.log(`Navigasi ke form ${index + 1}`);
  };

  return (
    <div className="min-h-screen ">
      {/* Container with responsive padding */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-[#076653] to-[#0c342c] rounded-2xl mb-4 shadow-lg">
            <BiDetail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
            style={{
              color: "var(--text-title)",
            }}
          >
            Buat Laporan{" "}
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Sistem Manejemen Wakaf
          </p>
        </div>

        {/* Grid Menu with improved responsive breakpoints */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {menuItems.map((item, index) => (
              <Link key={item.id} href={item.path}>
                <div
                  onClick={() => handleClick(index)} // optional: klik tracking atau efek tambahan
                  className="group relative block bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 hover:border-emerald-400/60 rounded-2xl p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:scale-[1.02] lg:hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-green-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#076653] to-[#0c342c] rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:from-emerald-600 group-hover:to-teal-700 transition-all duration-300">
                        <BiDetail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div
                        style={{
                          color: "var(--text-title)",
                          background: "var(--bg-start-index)",
                        }}
                        className="text-xs font-medium text-gray-500 group-hover:bg-emerald-900/30 group-hover:text-emerald-300 px-2 py-1 rounded-full transition-all duration-300"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    <h3 className="text-white font-semibold text-sm sm:text-base mb-1 group-hover:text-emerald-300 transition-colors duration-300 text-left">
                      {item.title}
                    </h3>

                    {/* Arrow indicator */}
                    <div className="flex justify-end mt-2 sm:mt-3">
                      <BiArrowToRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Subtle border glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="inline-flex items-center space-x-2 text-gray-500 text-sm sm:text-base">
            <BiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
            <span>12 Formulir Tersedia</span>
          </div>
        </div>
      </div>
    </div>
  );
}
