"use client";
import { useRouter } from "next/navigation";

export const MenuPage = () => {
  const router = useRouter();

  const handleMenu = (e) => {
    const selectedMenu = e.target.value;
    if (selectedMenu) {
      router.push(selectedMenu);
    }
  };
  const menuLaporan = [
    {
      id: 1,
      title: "Menu Informasi Umum",
      path: "/dashboard/laporan/info-umum",
    },
    {
      id: 2,
      title: "Menu Inventarisasi",
      path: "/dashboard/laporan/inventarisasi",
    },
    {
      id: 3,
      title: "Menu Digitalisasi",
      path: "/dashboard/laporan/digitalisasi",
    },
    {
      id: 4,
      title: "Menu Penilaian Asset",
      path: "/dashboard/laporan/penilaian-asset",
    },
    {
      id: 5,
      title: "Menu Pengelolaan",
      path: "/dashboard/laporan/pengelolaan",
    },
    {
      id: 6,
      title: "Menu Pemanfaatan",
      path: "/dashboard/laporan/pemanfaatan",
    },
    {
      id: 7,
      title: "Menu Kapasitas SDM",
      path: "/dashboard/laporan/kapasitas-sdm",
    },
    {
      id: 8,
      title: "Menu Sistem IT",
      path: "/dashboard/laporan/sistem-it",
    },
    {
      id: 9,
      title: "Menu Kepatuhan",
      path: "/dashboard/laporan/kepatuhan",
    },
    {
      id: 10,
      title: "Menu Pelaporan",
      path: "/dashboard/laporan/pelaporan",
    },
    {
      id: 11,
      title: "Menu Resiko",
      path: "/dashboard/laporan/resiko",
    },
    {
      id: 12,
      title: "Menu Rangkuman",
      path: "/dashboard/laporan/rangkuman",
    },
  ];
  return (
    <div className="w-full sm:w-auto">
      <label
        style={{ color: "var( --text-title)" }}
        className="block text-md font-medium mb-2"
      >
        <span className="font-bold">Pilih Menu Laporan :</span>
      </label>

      <select
        onChange={handleMenu}
        className="search-input w-full pl-5 py-2 text-left md:text-left rounded-xl text-sm outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-300 hover:border-amber-400"
        style={{
          backgroundColor: "var(--bg-Table)",
          border: "2px solid var(--sidebar-border)",
        }}
        defaultValue=""
      >
        <option value="" disabled hidden>
          Pilih Menu Laporan
        </option>

        {menuLaporan.map((item) => (
          <option key={item.id} value={item.path}>
            {item.title}
          </option>
        ))}
      </select>
    </div>
  );
};
