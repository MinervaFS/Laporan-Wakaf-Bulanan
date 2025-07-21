"use client";
import React from "react";
import { Button, Checkbox } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { ItemsOptionDashboardAdmin } from "../ItemOptionTable";
import { SearchInput } from "../SearchInput";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

export const TableUser = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [addingData, setAddingData] = useState(false);

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
    setIsLoading(true);

    setTimeout(() => {
      applyAllFilters(searchValue);
      setIsLoading(false);
    }, 300);
  };

  // Fungsi untuk menerapkan semua filter sekaligus
  const applyAllFilters = (searchValue) => {
    let filtered = [...data];

    // Filter berdasarkan kata kunci pencarian
    if (searchValue && searchValue.trim() !== "") {
      filtered = filtered.filter(
        (item) =>
          (item.username &&
            item.username.toLowerCase().includes(searchValue.toLowerCase())) ||
          (item.email &&
            item.email.toLowerCase().includes(searchValue.toLowerCase())) ||
          (item.username &&
            item.username.toLowerCase().includes(searchValue.toLowerCase())) ||
          (item.role &&
            item.role.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }
    setFilteredData(filtered);
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

  return (
    <div className="w-full mb-10 bg-transparent max-w-full rounded-xl">
      <div className="flex justify-between items-center my-5">
        <div>{/* Optional: Tambah Button atau Title */}</div>
        <div className="relative w-full sm:w-72">
          <SearchInput onSearch={handleSearch} onValue={searchQuery} />
          {isLoading && (
            <div className="absolute right-8 top-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>

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
              <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-bold  uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-center whitespace-nowrap text-xs font-bold uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-center whitespace-nowrap text-xs font-bold uppercase tracking-wider">
                Email{" "}
              </th>
              <th className="px-6 py-3 text-center whitespace-nowrap text-xs font-bold uppercase tracking-wider">
                Role
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
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                    {firstIndex + index + 1}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                    {item.username || (
                      <span className="font-bold text-xl">-</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                    {item.email || <span className="font-bold text-xl">-</span>}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                    <span
                      className={`font-bold italic rounded-full ${
                        item.role?.toLowerCase() === "admin"
                          ? "text-green-500"
                          : item.role?.toLowerCase() === "director"
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      {item.role
                        ? item.role
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
              border: "2px solid var(--sidebar-border)",
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
