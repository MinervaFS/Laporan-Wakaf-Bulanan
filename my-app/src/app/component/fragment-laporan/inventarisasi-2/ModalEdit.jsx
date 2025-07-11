"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "@material-tailwind/react";
import { BiX, BiSend, BiLoader } from "react-icons/bi";
import { BtnEdit, BtnEditDoc } from "./Button";

export const ModalEdit = ({ item, checkFetchData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    documentType: item?.documentType || "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        documentType: item.documentType || "",
      });
    }
  }, [item]);

  const handleModalEditOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalEditClose = () => {
    if (!isLoading) {
      setIsModalOpen(false);
      setIsLoading(false);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!formData.documentType.trim()) {
      toast.error("Jenis dokumen tidak boleh kosong");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/master-data/new-document/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newDocumentType: formData }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Gagal mengupdate data");
      }

      toast.success("Data dokumen baru berhasil diperbarui");

      if (checkFetchData && typeof checkFetchData === "function") {
        await checkFetchData();
      }
      handleModalEditClose();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click outside modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleModalEditClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isModalOpen && !isLoading) {
        handleModalEditClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, isLoading]);

  return (
    <div>
      <BtnEdit openModalEdit={handleModalEditOpen} />

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Modal Content */}
          <div
            className="custom-scrollbar rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-scroll"
            style={{
              backgroundColor: "var(--modal-bg)",
              border: "3px solid var(--modal-border)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                borderBottom: "1px solid var(--modal-border-bottom)",
              }}
              className="flex items-center justify-between p-6 border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-full">
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h2
                  id="modal-title"
                  style={{
                    color: "var(--modal-text-color)",
                  }}
                  className="text-xl font-semibold text-gray-800 flex items-center gap-2"
                >
                  Edit Inverntarisasi
                </h2>
              </div>
              {/* <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleModalEditClose}
                disabled={isLoading}
                aria-label="Tutup modal"
              >
                <BiX size={24} className="text-gray-500" />
              </button> */}
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="mt-4">
                    <label
                      htmlFor="documentType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      <span
                        style={{
                          color: "var(--modal-text-color)",
                        }}
                        className="inline-flex items-center gap-1 mb-2"
                      >
                        <span
                          style={{
                            color: "var(--modal-text-color)",
                          }}
                          className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                        >
                          1
                        </span>
                        Edit Nama Pelapor
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="documentType"
                        type="text"
                        name="documentType"
                        placeholder="Masukan dokumen terdigitalisasi"
                        value={formData.documentType}
                        onChange={handleOnChange}
                        disabled={isLoading}
                        className="w-full rounded-xl px-4 py-3 text-base border-2 border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                        style={{
                          color: "var(--modal-text-color)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col md:flex-row gap-2">
                    {/* Periode Laporan */}
                    <div className="w-full md:w-1/2">
                      <label
                        htmlFor="periode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        <span
                          style={{
                            color: "var(--modal-text-color)",
                          }}
                          className="inline-flex items-center gap-1 mb-2"
                        >
                          <span
                            style={{
                              color: "var(--modal-text-color)",
                            }}
                            className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                          >
                            2
                          </span>
                          Edit Periode Laporan
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          id="periode"
                          type="date"
                          name="periode"
                          value={formData.periode}
                          onChange={handleOnChange}
                          disabled={isLoading}
                          className="w-full rounded-xl px-4 py-3 text-base border-2 border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                          style={{
                            color: "var(--modal-text-color)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Tanggal Pengisian */}
                    <div className="w-full mt-4 md:mt-0 md:w-1/2">
                      <label
                        htmlFor="tanggalPengisian"
                        className="block text-sm font-medium text-gray-700"
                      >
                        <span
                          style={{
                            color: "var(--modal-text-color)",
                          }}
                          className="inline-flex items-center gap-1 mb-2"
                        >
                          <span
                            style={{
                              color: "var(--modal-text-color)",
                            }}
                            className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                          >
                            3
                          </span>
                          Edit Tanggal Pengisian
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          id="tanggalPengisian"
                          type="date"
                          name="tanggalPengisian"
                          value={formData.tanggalPengisian}
                          onChange={handleOnChange}
                          disabled={isLoading}
                          className="w-full rounded-xl px-4 py-3 text-base border-2 border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                          style={{
                            color: "var(--modal-text-color)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="documentType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      <span
                        style={{
                          color: "var(--modal-text-color)",
                        }}
                        className="inline-flex items-center gap-1 mb-2"
                      >
                        <span
                          style={{
                            color: "var(--modal-text-color)",
                          }}
                          className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                        >
                          4
                        </span>
                        Edit Jumlah Aset Terdaftar
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="documentType"
                        type="text"
                        name="documentType"
                        placeholder="Masukan total dokumen digital"
                        value={formData.documentType}
                        onChange={handleOnChange}
                        disabled={isLoading}
                        className="w-full rounded-xl px-4 py-3 text-base border-2 border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                        style={{
                          color: "var(--modal-text-color)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="documentType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      <span
                        style={{
                          color: "var(--modal-text-color)",
                        }}
                        className="inline-flex items-center gap-1 mb-2"
                      >
                        <span
                          style={{
                            color: "var(--modal-text-color)",
                          }}
                          className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                        >
                          5
                        </span>
                        Edit Jumlah Dokumen Terkait Aset
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="documentType"
                        type="text"
                        name="documentType"
                        placeholder="Masukan total dokumen digital"
                        value={formData.documentType}
                        onChange={handleOnChange}
                        disabled={isLoading}
                        className="w-full rounded-xl px-4 py-3 text-base border-2 border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                        style={{
                          color: "var(--modal-text-color)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="documentType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      <span
                        style={{
                          color: "var(--modal-text-color)",
                        }}
                        className="inline-flex items-center gap-1 mb-2"
                      >
                        <span
                          style={{
                            color: "var(--modal-text-color)",
                          }}
                          className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                        >
                          6
                        </span>
                        Edit Kendala dalam Inventarisasi
                      </span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="documentType"
                        name="documentType"
                        placeholder="Masukan total dokumen digital"
                        value={formData.documentType}
                        onChange={handleOnChange}
                        disabled={isLoading}
                        rows={4}
                        className="w-full rounded-xl px-4 py-3 text-base border-2 border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400 resize-none"
                        style={{
                          color: "var(--modal-text-color)",
                        }}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outlined"
                    color="gray"
                    onClick={handleModalEditClose}
                    disabled={isLoading}
                    className="px-6 py-2.5 border-gray-300 hover:bg-[var(--modal-btn-hover)] transition-colors duration-200"
                    style={{
                      color: "var(--modal-text-color)",
                    }}
                  >
                    Batal
                  </Button>

                  <Button
                    type="submit"
                    className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                    disabled={isLoading || !formData.documentType.trim()}
                  >
                    {isLoading ? (
                      <>
                        <BiLoader className="animate-spin" size={18} />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <BiSend size={18} />
                        <span>Simpan</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
