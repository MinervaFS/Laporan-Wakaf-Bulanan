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
import { ItemsOptionDashboardAdmin } from "../ItemOptionTable";
import { BiSolidFilterAlt, BiTrash } from "react-icons/bi";
import {
  FaCalendarAlt,
  FaFilePdf,
  FaExclamationTriangle,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { SearchInput } from "../SearchInput";
import { ModalEditAsset } from "./ModalEditAsset";
import { ModalDeleteAsset } from "./ModalDeleteAsset";
import { ModalCreateAsset } from "./ModalCreateAsset";

export const TableAsset = ({ data, onFetchData }) => {
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
          item.documentType &&
          item.documentType.toLowerCase().includes(searchValue.toLowerCase())
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
        .map((item) => item._id)
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
    filteredData.every((item) => selectedIds.includes(item._id));

  // Function to generate compact pagination array
  const getPaginationArray = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let pages = [1];
    const leftSide = Math.max(2, currentPage - 1);
    const rightSide = Math.min(totalPages - 1, currentPage + 1);

    if (leftSide > 2) {
      pages.push("...");
    }

    for (let i = leftSide; i <= rightSide; i++) {
      pages.push(i);
    }

    if (rightSide < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
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
      // Updated API endpoint to match asset data
      const res = await fetch("/api/master-data/new-document/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

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
        toast.success(`${deletedIds.length} data berhasil dihapus!`);
      } catch (fetchError) {
        console.error("Error fetching data after delete:", fetchError);
        toast.error(
          "Data berhasil dihapus, tetapi gagal memperbarui tampilan."
        );
        // Fallback - update filteredData secara manual
        setFilteredData((prevData) =>
          prevData.filter((item) => !deletedIds.includes(item._id))
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
      doc.text("Data Laporan Dokumen", 14, 15);
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
        item.documentType || "-",
        item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : "-",
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
          ["No", "Jenis Pemanfaatan Asset", "Dibuat Oleh", "Tanggal Dibuat"],
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

  return (
    <div className="w-full mb-10 bg-transparent max-w-full rounded-xl">
      <div className="flex justify-end">
        <ModalCreateAsset checkFetchData={handleFetchData} />
      </div>
      <div className="flex flex-wrap md:flex-row md:justify-between items-center my-5 gap-3">
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button
              className="flex items-center bg-red-500 text-white hover:bg-red-600"
              onClick={handleBulkDeleteClick}
              disabled={isLoading}
            >
              <BiTrash size={20} />
              <span className="hidden sm:inline ml-1">
                Hapus Terpilih ({selectedIds.length})
              </span>
            </Button>
          )}

          {/* Tombol PDF */}
          <Button
            className="flex items-center bg-amber-600"
            onClick={generatePDF}
            disabled={isLoading}
          >
            <FaFilePdf className="mr-1" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
        </div>

        <div className="flex space-x-3 items-center">
          <div className="flex justify-end items-end space-x-2.5">
            {/* <Search onSearch={handleSearch} onValue={searchQuery} /> */}
            <div className="relative">
              {/* <Search onSearch={handleSearch} onValue={searchQuery} /> */}
              <SearchInput onSearch={handleSearch} onValue={searchQuery} />
              {isLoading && (
                <div className="absolute right-8 top-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>

            {/* Tombol Filter Tanggal */}
            <Button
              className={"flex items-center"}
              style={{
                backgroundColor: "var(--bg-Table)",
                color: "var(--sidebar-text)",
                border: "2px solid var(--sidebar-border)", // ⬅️ langsung pakai border
              }}
              onClick={() => setShowDateFilter(!showDateFilter)}
              disabled={isLoading}
            >
              <BiSolidFilterAlt
                size={20}
                style={{
                  color: "var(--sidebar-text)",
                }}
              />
              <span className="hidden sm:inline"></span>
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
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200/50">
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
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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
      <Dialog
        open={showBulkDeleteModal}
        handler={handleCloseBulkDeleteModal}
        size="md"
      >
        <DialogHeader className="flex items-center gap-3">
          <FaExclamationTriangle className="text-red-500 text-xl" />
          <span>Konfirmasi Hapus Data</span>
        </DialogHeader>
        <DialogBody className="">
          <div className="space-y-3">
            <p>
              Anda yakin ingin menghapus <strong>{selectedIds.length}</strong>{" "}
              data yang dipilih?
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3">
              <p className="text-sm text-yellow-800">
                <strong>Peringatan:</strong> Tindakan ini tidak dapat
                dibatalkan. Data yang sudah dihapus tidak dapat dikembalikan.
              </p>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            onClick={handleCloseBulkDeleteModal}
            disabled={isLoading}
            variant="outlined"
            className="!border-gray-300 ! hover:!bg-gray-100 rounded-full px-5 py-2 normal-case"
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirmBulkDelete}
            disabled={isLoading}
            variant="contained"
            className="!bg-red-600 hover:!bg-red-700 text-white rounded-full px-6 py-2 normal-case"
          >
            {isLoading ? (
              <div className="flex flex-row items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                Menghapus
              </div>
            ) : (
              <div className="flex items-center">
                <BiTrash className="mr-2" size={16} />
                Hapus Data
              </div>
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Table */}
      <div
        className="w-full overflow-x-auto rounded-2xl"
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
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
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
              <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-bold  uppercase tracking-wider">
                Tanggal Dibuat
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-bold  uppercase tracking-wider">
                Jenis Pemanfaatan Asset
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
            className={` divide-y divide-gray-200 ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            {currenDataPages.length > 0 ? (
              currenDataPages.map((item, index) => (
                <tr
                  key={item._id || index}
                  className="hover:bg-gray-100 transition-colors ease-in-out duration-150"
                >
                  <td className="px-6 text-center py-4 whitespace-nowrap">
                    <Checkbox
                      color="blue"
                      checked={isSelected(item._id)}
                      onChange={() => handleSelectItem(item._id)}
                      disabled={isLoading}
                    />
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm ">
                    {firstIndex + index + 1}
                  </td>
                  <td className="px-6 text-center py-4 whitespace-nowrap text-sm ">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-800">
                    {item.documentType ? (
                      item.documentType
                    ) : (
                      <span className="font-bold text-xl">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                    <div className="flex justify-center gap-2 items-center">
                      <ModalEditAsset
                        item={item}
                        checkFetchData={onFetchData}
                      />
                      <ModalDeleteAsset
                        id={item._id}
                        checkFetchData={onFetchData}
                      />
                    </div>
                  </td>
                  <td className="px-6 text-center py-4 whitespace-nowrap text-sm">
                    <span className="font-bold text-green-600 px-4 py-2 bg-green-100 border border-green-500 rounded-full">
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
                  colSpan="6"
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
            Prev
          </Button>

          <div className="flex space-x-1 mx-2">
            {getPaginationArray().map((page, index) => (
              <Button
                key={index}
                size="sm"
                className={
                  currentPage === page
                    ? "bg-black text-white py-2 px-3 text-xs"
                    : "bg-gray-200 text-black py-2 px-3 text-xs hover:bg-gray-300"
                }
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
              border: "2px solid var(--sidebar-border)", // ⬅️ langsung pakai border
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
