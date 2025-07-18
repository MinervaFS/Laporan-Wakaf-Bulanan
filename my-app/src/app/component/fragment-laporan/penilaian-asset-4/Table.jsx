"use client";
import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Checkbox,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { ItemsOptionDashboardAdmin } from "../../ItemOptionTable";
import {
  BiChevronLeft,
  BiChevronRight,
  BiFilter,
  BiSolidFilterAlt,
  BiTrash,
} from "react-icons/bi";
import {
  FaCalendarAlt,
  FaFilePdf,
  FaExclamationTriangle,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { SearchInput } from "../../SearchInput";
import { ModalEdit } from "./ModalEdit";
import { ModalDelete } from "./ModalDelete";
import { ModalCreate } from "./ModalCreate";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const TablePenilaianAsset = ({ data, onFetchData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [addingData, setAddingData] = useState(false);

  // Modal state for bulk delete
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Filter tanggal
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  // pindah menu laporan
  const router = useRouter();

  const handleMenu = (e) => {
    const selectedMenu = e.target.value;
    if (selectedMenu) {
      router.push(selectedMenu);
    }
  };

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  // Effect untuk menangani penambahan data baru - arahkan ke halaman terakhir
  useEffect(() => {
    if (addingData && filteredData) {
      const newTotalPages = Math.ceil(filteredData.length / itemsPerPage);
      if (newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      setAddingData(false);
    }
  }, [filteredData, itemsPerPage, addingData]);

  // Pagination calculations
  const totalPages = Math.ceil((filteredData || []).length / itemsPerPage);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currenDataPages = Array.isArray(filteredData)
    ? filteredData.slice(firstIndex, lastIndex)
    : [];

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setSearchQuery(searchValue);
    setCurrentPage(1);

    // Tampilkan loading indicator saat mencari
    setIsLoading(true);

    // Simulasi delay untuk menunjukkan loading (bisa dihapus jika tidak perlu)
    setTimeout(() => {
      if (searchValue.trim() === "") {
        applyAllFilters("", startDate, endDate);
      } else {
        applyAllFilters(searchValue, startDate, endDate);
      }
      setIsLoading(false);
    }, 300);
  };

  // Fungsi untuk menerapkan semua filter sekaligus
  const applyAllFilters = (searchValue, start, end) => {
    let filtered = [...data];

    // Filter berdasarkan kata kunci pencarian
    if (searchValue && searchValue.trim() !== "") {
      filtered = filtered.filter(
        (item) =>
          (item.name &&
            item.name.toLowerCase().includes(searchValue.toLowerCase())) ||
          (item.periode &&
            new Date(item.periode)
              .toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.createdAt &&
            new Date(item.createdAt)
              .toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.jumlahAssetDinilai &&
            item.jumlahAssetDinilai
              .toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.nilaiAssetWakaf &&
            item.nilaiAssetWakaf
              .toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.catatanPenilaianAsset &&
            item.catatanPenilaianAsset
              .toLowerCase()
              .includes(searchValue.toLowerCase()))
      );
    }

    // Filter berdasarkan tanggal (jika ada createdAt)
    if (start && end) {
      const startDateTime = new Date(start);
      const endDateTime = new Date(end);
      endDateTime.setHours(23, 59, 59); // Set end date to end of day

      filtered = filtered.filter((item) => {
        if (!item.createdAt) return true; // Skip filter jika tidak ada tanggal
        const itemDate = new Date(item.createdAt);
        return itemDate >= startDateTime && itemDate <= endDateTime;
      });
    }

    setFilteredData(filtered);
  };

  const handleDateFilterChange = () => {
    setCurrentPage(1);
    setIsLoading(true);

    // Simulasi loading untuk filter tanggal
    setTimeout(() => {
      applyAllFilters(searchQuery, startDate, endDate);
      setIsLoading(false);
    }, 200);
  };

  const handleResetDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setIsLoading(true);

    setTimeout(() => {
      applyAllFilters(searchQuery, "", "");
      setIsLoading(false);
    }, 200);
  };

  const handleFetchData = async () => {
    setIsLoading(true);
    try {
      await onFetchData();
      setAddingData(true); // Set flag untuk menunjukkan data baru ditambahkan
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal mengambil data");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((next) => next + 1);
  };

  const handleClickPage = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPage = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Select logic for bulk actions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = (filteredData || [])
        .map((item) => item.id)
        .filter(Boolean);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selectedIds.includes(id);
  const isAllSelected =
    filteredData?.length > 0 &&
    filteredData.every((item) => selectedIds.includes(item.id));

  // Function to generate compact pagination array
  const getPaginationArray = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];

    if (currentPage > 2 && currentPage < totalPages - 1) {
      pages.push("...");
      pages.push(currentPage);
      pages.push("...");
    } else if (currentPage === 2) {
      pages.push(2);
      pages.push("...");
    } else if (currentPage === totalPages - 1) {
      pages.push("...");
      pages.push(totalPages - 1);
    } else {
      pages.push("...");
    }

    pages.push(totalPages);

    // Pastikan tidak duplikat
    return [...new Set(pages)];
  };

  // Open bulk delete modal
  const handleBulkDeleteClick = () => {
    setShowBulkDeleteModal(true);
  };

  // Close bulk delete modal
  const handleCloseBulkDeleteModal = () => {
    setShowBulkDeleteModal(false);
  };

  // Confirm bulk delete
  const handleConfirmBulkDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        "/api/laporan/penilaian-asset-wakaf/bulk-delete",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedIds }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menghapus data.");
      }

      // Simpan IDs yang dihapus dan reset selectedIds
      const deletedIds = [...selectedIds];
      setSelectedIds([]);
      setShowBulkDeleteModal(false);

      // Tunggu sedikit waktu untuk memastikan server selesai memproses
      try {
        await onFetchData();
        toast.success(`${deletedIds.length} data berhasil dihapus`);
      } catch (fetchError) {
        console.error("Error fetching data after delete:", fetchError);
        toast.error(
          "Data berhasil dihapus, tetapi gagal memperbarui tampilan."
        );
        // Fallback - update filteredData secara manual
        setFilteredData((prevData) =>
          prevData.filter((item) => !deletedIds.includes(item.id))
        );
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Terjadi kesalahan saat menghapus data.");
      setShowBulkDeleteModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate PDF dengan jsPDF dan autoTable
  const generatePDF = () => {
    try {
      // Inisialisasi dokumen PDF dengan orientasi landscape
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Tambahkan judul dan tanggal
      const now = new Date();
      const dateStr = now.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Data Laporan Inventarisasi", 14, 15);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Tanggal: ${dateStr}`, 14, 22);

      // Filter yang diterapkan
      let filterText = `Filter: `;
      if (searchQuery) filterText += `Pencarian: "${searchQuery}" | `;
      if (startDate && endDate)
        filterText += `Tanggal: ${new Date(startDate).toLocaleDateString(
          "id-ID"
        )} s/d ${new Date(endDate).toLocaleDateString("id-ID")} | `;
      if (filterText === `Filter: `) filterText = "";
      else doc.text(filterText, 14, 27);

      // Data untuk tabel
      const tableBody = filteredData.map((item, index) => [
        index + 1,
        item.name || "-",
        item.periode
          ? new Date(item.periode).toLocaleDateString("id-ID", {
              month: "long",
              year: "numeric",
            })
          : "-",
        item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : "-",
        item.jumlahAssetDinilai || 0,
        item.nilaiAssetWakaf || 0,
        item.catatanPenilaianAsset || "-",
        item.user?.role
          ? item.user.role
              .toLowerCase()
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "Tanpa Role",
      ]);

      // Buat tabel
      autoTable(doc, {
        startY: filterText ? 32 : 27,
        head: [
          [
            "No",
            "Nama",
            "Periode",
            "Tanggal",
            "Jumlah Penilaian Asset (Bulan ini)",
            "Jumlah Nilai Asset (Currency)",
            "catatan Penilaian Asset",
            "Dibuat Oleh",
          ],
        ],
        body: tableBody,
        theme: "striped",
        styles: {
          fontSize: 9,
          cellPadding: 2,
          halign: "center",
        },
        headStyles: {
          fillColor: [66, 66, 66],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Halaman ${i} dari ${pageCount}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10
        );
      }

      // Simpan dokumen
      const fileName = `Laporan_Dokumen_Baru${now
        .toISOString()
        .slice(0, 10)}.pdf`;
      doc.save(fileName);
      toast.success("PDF berhasil dibuat!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Gagal membuat PDF");
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
      title: "Menu Risiko",
      path: "/dashboard/laporan/risiko",
    },
    {
      id: 12,
      title: "Menu Rangkuman",
      path: "/dashboard/laporan/rangkuman",
    },
  ];

  return (
    <div className="w-full mb-10 bg-transparent max-w-full rounded-xl">
      <div className="flex flex-wrap-reverse flex-row-reverse md:flex-row justify-between items-center mt-10 gap-5">
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
        <div className="mt-6">
          <ModalCreate checkFetchData={handleFetchData} />
        </div>
      </div>

      <div className="flex flex-col  md:flex-row md:justify-between md:items-center my-5 gap-4">
        {/* Kiri: Tombol Hapus dan PDF */}
        <div className="flex flex-col-reverse sm:flex-row gap-2">
          {selectedIds.length > 0 && (
            <Button
              className="flex items-center bg-red-500 text-white hover:bg-red-600"
              onClick={handleBulkDeleteClick}
              disabled={isLoading}
            >
              <BiTrash size={20} />
              <span className="ml-1">
                Hapus Terpilih ({selectedIds.length})
              </span>
            </Button>
          )}
          {/* <Button
            className="w-full sm:w-auto flex items-center justify-center bg-red-500 text-white hover:bg-red-600"
            onClick={handleBulkDeleteClick}
            disabled={isLoading}
          >
            <BiTrash size={20} />
            <span className="ml-1">Hapus Terpilih ({selectedIds.length})</span>
          </Button> */}

          <Button
            className="w-full sm:w-auto flex items-center justify-center bg-amber-600 text-white hover:bg-amber-700"
            onClick={generatePDF}
            disabled={isLoading}
          >
            <FaFilePdf className="mr-1" />
            <span>Buat PDF</span>
          </Button>
        </div>

        {/* Kanan: Search dan Filter */}
        <div className="flex flex-row gap-2 md:items-center">
          {/* SearchInput memanjang di mobile */}
          <div className="relative w-full sm:w-auto">
            <SearchInput onSearch={handleSearch} onValue={searchQuery} />
            {isLoading && (
              <div className="absolute right-8 top-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          {/* Tombol filter tetap kecil */}
          <div className="shrink-0">
            <Button
              className="flex items-center rounded-xl"
              style={{
                backgroundColor: "var(--bg-Table)",
                color: "var(--sidebar-text)",
                border: "2px solid var(--sidebar-border)",
              }}
              onClick={() => setShowDateFilter(!showDateFilter)}
              disabled={isLoading}
            >
              <BiSolidFilterAlt size={20} />
              <span className="hidden sm:inline ml-1">Filter</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filter tanggal */}
      {showDateFilter && (
        <div
          className="mb-6 relative overflow-hidden rounded-2xl"
          style={{
            backgroundColor: "var(--sidebar-bg)",
            border: "1px solid var(--sidebar-border)",
            color: "var(--sidebar-text)",
          }}
        >
          {/* Gradient Background */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl"></div> */}

          {/* Main Content */}
          <div
            className="relative p-6 rounded-2xl shadow-lg"
            style={{
              backgroundColor: "var(--bg-Table)",
              color: "var(--sidebar-text)",
              border: "2px solid var(--sidebar-border)", // ⬅️ langsung pakai border
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-600 rounded-2xl">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Filter Tanggal</h3>
                <p className="text-sm">
                  Pilih rentang tanggal untuk memfilter data
                </p>
              </div>
            </div>

            {/* Filter Form */}
            <div className="space-y-6">
              {/* Date Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tanggal Mulai */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">
                    Tanggal Mulai
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full py-3 px-4 pr-12 border rounded-xl shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                             transition-all duration-200 text-[var(--text-icon)]"
                      disabled={isLoading}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Tanggal Akhir */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold ">
                    Tanggal Akhir
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full py-3 px-4 pr-12 border rounded-xl shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                             transition-all duration-200"
                      disabled={isLoading}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4  border-gray-200/50">
                <Button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 
                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-6 py-3 rounded-xl font-medium 
                         transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md 
                         disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-initial justify-center"
                  onClick={handleDateFilterChange}
                  disabled={!startDate || !endDate || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white -transparent"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span>Terapkan Filter</span>
                    </>
                  )}
                </Button>

                <Button
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 
                         focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 px-6 py-3 rounded-xl font-medium 
                         transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md 
                         disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-initial justify-center"
                  onClick={handleResetDateFilter}
                  disabled={isLoading}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Reset Filter</span>
                </Button>
              </div>

              {/* Status Indicator */}
              {(startDate || endDate) && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                  <svg
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <span className="text-sm text-blue-800">
                    {startDate && endDate
                      ? `Filter aktif: ${startDate} hingga ${endDate}`
                      : "Filter sebagian aktif"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={!isLoading ? handleCloseBulkDeleteModal : undefined}
          />

          {/* Modal Content */}
          <div
            style={{
              backgroundColor: "var(--modal-bg)",
              border: "3px solid var(--modal-border)",
            }}
            className="relative rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 fade-in duration-200"
          >
            {/* Header */}
            <div className="flex flex-col items-center gap-4 px-6 pt-8 pb-6 text-left">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-red-500 text-3xl" />
              </div>
              <div>
                <h3
                  style={{
                    color: "var(--modal-text-color)",
                  }}
                  className="text-xl font-semibold text-gray-900 mb-2"
                >
                  Konfirmasi Hapus Data
                </h3>
                <p
                  style={{
                    color: "var(--modal-text-color)",
                  }}
                  className="text-gray-600 text-sm"
                >
                  Pastikan Anda yakin dengan tindakan ini
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pb-6">
              <div className="space-y-5">
                {/* Data Count */}
                <div
                  style={{
                    backgroundColor: "var(--bg-bulk-delete)",
                    border: "3px solid var(--modal-border)",
                  }}
                  className="rounded-lg p-4 b"
                >
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        color: "var(--modal-text-color)",
                      }}
                      className="text-sm text-gray-600"
                    >
                      Jumlah data yang akan dihapus:
                    </span>
                    <span className="text-lg font-bold text-red-500">
                      {selectedIds.length} item
                    </span>
                  </div>
                </div>

                {/* Warning Box */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-red-700 mb-1">
                        Peringatan Penting
                      </h4>
                      <p className="text-sm text-red-700 leading-relaxed">
                        Tindakan ini <strong>tidak dapat dibatalkan</strong>.
                        Data yang sudah dihapus tidak dapat dikembalikan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 pb-6 pt-2  border-gray-100">
              {/* Tombol Batal */}
              <Button
                type="button"
                variant="outlined"
                color="gray"
                onClick={handleCloseBulkDeleteModal}
                disabled={isLoading}
                className="px-6 py-2.5 border-gray-300 hover:bg-[var(--modal-btn-hover)] transition-colors duration-200"
                style={{
                  color: "var(--modal-text-color)",
                }}
              >
                Batal
              </Button>

              {/* Tombol Hapus */}
              <Button
                onClick={handleConfirmBulkDelete}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm rounded-lg px-6 py-2.5 font-medium transition-all duration-200 hover:shadow-md "
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white -transparent"></div>
                    <span>Menghapus...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <BiTrash size={16} />
                    <span>Hapus Data</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        className="custom-scrollbar w-full overflow-x-auto rounded-2xl"
        style={{
          border: "2px solid var(--sidebar-border)", // ⬅️ langsung pakai border
        }}
      >
        {isLoading && !searchQuery && !isLoading && (
          <div className="flex justify-center items-center p-4">
            <div
              className="animate-spin rounded-full h-8 w-8 border-blue-500"
              style={{
                borderBottom: "2px solid var(--Border-Table)",
              }}
            ></div>
          </div>
        )}

        <table className="min-w-full">
          <thead
            style={{
              backgroundColor: "var(--bg-Table)",
              color: "var(--sidebar-text)",
            }}
          >
            <tr
              style={{
                // backgroundColor: "var(--sidebar-bg)",
                borderBottom: "1px solid var(--sidebar-border)",
                //   // color: "var(--sidebar-text)",
              }}
            >
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                <div className="flex items-center justify-center">
                  <Checkbox
                    color="blue"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    disabled={isLoading}
                  />
                </div>
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-bold  uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left whitespace-nowrap text-xs font-bold uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left whitespace-nowrap text-xs font-bold uppercase tracking-wider">
                Periode Laporan
              </th>
              <th className="px-6 py-3 text-left whitespace-nowrap text-xs font-bold uppercase tracking-wider">
                Tanggal
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-bold  uppercase tracking-wider">
                Jumlah Aset Terdaftar
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-bold  uppercase tracking-wider">
                Jumlah Dokumen Terkait Aset
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-bold  uppercase tracking-wider">
                Kendala dalam Inventarisasi
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-bold  uppercase tracking-wider">
                Action
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-bold  uppercase tracking-wider">
                Dibuat Oleh
              </th>
            </tr>
          </thead>
          <tbody
            style={{
              backgroundColor: "var(--bg-Table)",
              color: "var(--sidebar-text)",
            }}
            className={`my-divider  ${isLoading ? "opacity-50" : ""}`}
          >
            {currenDataPages.length > 0 ? (
              currenDataPages.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="hover-table transition-colors ease-in-out duration-150"
                >
                  <td className="px-6 text-left py-4 whitespace-nowrap">
                    <Checkbox
                      className="text-blue-500 checked:bg-blue-500 checked:border-blue-500"
                      checked={isSelected(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      disabled={isLoading}
                    />
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                    {firstIndex + index + 1}
                  </td>

                  <td className="px-6 py-4 text-left whitespace-nowrap text-sm">
                    {item.name || <span className="font-bold text-xl">-</span>}
                  </td>

                  <td className="px-6 py-4 text-left whitespace-nowrap text-sm">
                    {new Date(item.periode).toLocaleDateString("id-ID", {
                      month: "long",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-6 py-4 text-left whitespace-nowrap text-sm">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                    {item.jumlahAssetDinilai || (
                      <span className="font-bold text-xl">-</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                    {item.nilaiAssetWakaf || (
                      <span className="font-bold text-xl">-</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-left whitespace-nowrap text-sm">
                    {item.catatanPenilaianAsset || (
                      <span className="font-bold text-xl">-</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                    <div className="flex justify-center gap-2 items-center">
                      <ModalEdit item={item} checkFetchData={onFetchData} />
                      <ModalDelete id={item.id} checkFetchData={onFetchData} />
                    </div>
                  </td>

                  <td className="px-6 text-center py-4 whitespace-nowrap text-sm">
                    <span className="font-bold text-green-600 italic rounded-full">
                      {item.user?.role
                        ? item.user.role
                            .toLowerCase()
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        : "Tanpa Role"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {isLoading ? "Memuat data..." : "Data tidak ada"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* select data dan pagination */}
      <div className="flex md:flex-row justify-between items-center mt-5 gap-4">
        <ItemsOptionDashboardAdmin
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          handleItemsPerPage={handleItemsPerPage}
        />

        <div className="flex items-center">
          <Button
            size="sm"
            variant="outlined"
            disabled={currentPage === 1 || isLoading || isLoading}
            onClick={handlePrevPage}
            className="py-2 px-3 text-xs"
            style={{
              backgroundColor: "var(--bg-Table)",
              color: "var(--sidebar-text)",
              border: "2px solid var(--sidebar-border)", // ⬅️ langsung pakai border
            }}
          >
            <span className="text-lg">
              <BiChevronLeft />
            </span>
          </Button>

          <div className="flex space-x-1 mx-2">
            {getPaginationArray().map((page, index) => (
              <Button
                key={index}
                size="sm"
                className="py-2 px-3 text-xs"
                style={{
                  backgroundColor:
                    currentPage === page
                      ? "var(--btn-active-bg)"
                      : "var(--btn-bg)",
                  color:
                    currentPage === page
                      ? "var(--btn-active-text)"
                      : "var(--btn-text)",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page)
                    e.currentTarget.style.backgroundColor = "var(--btn-hover)";
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page)
                    e.currentTarget.style.backgroundColor = "var(--btn-bg)";
                }}
                onClick={() =>
                  typeof page === "number" && handleClickPage(page)
                }
                disabled={typeof page !== "number" || isLoading}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            size="sm"
            variant="outlined"
            disabled={currentPage === totalPages || isLoading}
            onClick={handleNextPage}
            className="py-2 px-3 text-xs"
            style={{
              backgroundColor: "var(--bg-Table)",
              color: "var(--sidebar-text)",
              border: "2px solid var(--sidebar-border)",
            }}
          >
            <span className="text-lg">
              <BiChevronRight />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
