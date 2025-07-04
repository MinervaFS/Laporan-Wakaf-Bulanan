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
import { ItemsOptionDashboardAdmin } from "./ItemOptionTable";
import { SearchInput } from "./SearchInput";
import { BiTrash } from "react-icons/bi";
import {
  FaCalendarAlt,
  FaFilePdf,
  FaExclamationTriangle,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
// import { ModalEditDoc } from "./ModalEditDoc";
// import { ModalDeleteDoc } from "./ModalDeleteDoc";
// import { ModalDoc } from "./ModalDoc";

export const TableDashboardAdmin = ({ data, onFetchData }) => {
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
      <div className="flex flex-wrap md:flex-row md:justify-between items-center my-5 gap-3">
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button
              className="flex items-center bg-red-500  hover:bg-red-600"
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
            className="flex items-center bg-blue-600  hover:bg-blue-700"
            onClick={generatePDF}
            disabled={isLoading}
          >
            <FaFilePdf className="mr-1" />
            <span className="hidden sm:inline">PDF</span>
          </Button>

          {/* Tombol Filter Tanggal */}
          <Button
            className={`flex items-center ${
              showDateFilter ? "bg-gray-600" : "bg-gray-500"
            }  hover:bg-gray-700`}
            onClick={() => setShowDateFilter(!showDateFilter)}
            disabled={isLoading}
          >
            <FaCalendarAlt className="mr-1" />
            <span className="hidden sm:inline">Tanggal</span>
          </Button>
        </div>

        {/* Search and ModalCreate */}
        <div className="flex space-x-3 items-center">
          <div className="relative">
            <SearchInput onSearch={handleSearch} onValue={searchQuery} />
            {isLoading && (
              <div className="absolute right-10 top-3">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          {/* <ModalDoc checkFetchData={handleFetchData} /> */}
        </div>
      </div>

      {/* Filter tanggal */}
      {showDateFilter && (
        <div className="mb-5 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex flex-wrap md:flex-row items-center gap-4">
            <div>
              <label className="block text-sm font-medium  mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium  mb-1">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                className="bg-blue-500  hover:bg-blue-600 flex items-center"
                onClick={handleDateFilterChange}
                disabled={!startDate || !endDate || isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-700 mr-2"></div>
                ) : null}
                Terapkan Filter
              </Button>
              <Button
                className="bg-gray-500  hover:bg-gray-600"
                onClick={handleResetDateFilter}
                disabled={isLoading}
              >
                Reset
              </Button>
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
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
            className="!bg-red-600 hover:!bg-red-700  rounded-full px-6 py-2 normal-case"
          >
            {isLoading ? (
              <div className="flex flex-row items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-700"></div>
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
      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg">
        {isLoading && !searchQuery && !isLoading && (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead
            style={{
              backgroundColor: "var(--sidebar-bg)",
              borderRight: "1px solid var(--sidebar-border)",
              color: "var(--sidebar-text)",
            }}
          >
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium  uppercase tracking-wider">
                <div className="flex items-center justify-center">
                  {/* <Checkbox
                    color="blue"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    disabled={isLoading}
                  /> */}
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
              backgroundColor: "var(--sidebar-bg)",
              borderRight: "1px solid var(--sidebar-border)",
              color: "var(--sidebar-text)",
            }}
            className={` divide-y divide-gray-200 ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            <tr
              className="text-center"
              style={{
                backgroundColor: "var(--sidebar-bg)",
                borderRight: "1px solid var(--sidebar-border)",
                color: "var(--sidebar-text)",
              }}
            >
              <td>
                <Checkbox />{" "}
              </td>
              <td>test</td>
              <td>test</td>
              <td>test</td>
              <td>test</td>
              <td>test</td>
            </tr>
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
            className="py-2 px-3 text-xs border border-gray-300 hover:bg-gray-100"
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
                    ? "bg-black  py-2 px-3 text-xs"
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
            className="py-2 px-3 text-xs border border-gray-300 hover:bg-gray-100"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
