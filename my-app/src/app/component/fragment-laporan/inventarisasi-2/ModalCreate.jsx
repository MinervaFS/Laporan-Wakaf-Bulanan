"use client";

import { useState, useEffect } from "react";
import { BiSend, BiX, BiLoader } from "react-icons/bi";
import { toast } from "react-toastify";
import { BtnCreate, BtnCreateDoc } from "./Button";
import { Button } from "@material-tailwind/react";

export const ModalCreate = ({ checkFetchData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    periode: "",
    jumlahAssetTerdaftar: null || 0,
    jumlahDokTerkait: null || 0,
    catatanInventarisasi: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModalCreateOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalCreateClose = () => {
    if (!isLoading) {
      setIsModalOpen(false);
      setFormData({
        name: "",
        periode: "",
        jumlahAssetTerdaftar: 0,
        jumlahDokTerkait: 0,
        catatanInventarisasi: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    // if (!formData.jumlahAssetTerdaftar.trim()) {
    //   toast.error("Jenis dokumen tidak boleh kosong");
    //   return;
    // }

    setIsLoading(true);

    try {
      const res = await fetch("/api/laporan/inventarisasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan data");

      toast.success("Berhasil Menambah Data");
      handleModalCreateClose();

      if (checkFetchData && typeof checkFetchData === "function") {
        checkFetchData();
      }
    } catch (error) {
      console.error("SUBMIT ERROR:", error);
      toast.error(error.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click outside modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleModalCreateClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isModalOpen && !isLoading) {
        handleModalCreateClose();
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
      <BtnCreate onOpen={handleModalCreateOpen} />

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
              className="flex items-center justify-between p-6 "
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-600 rounded-full">
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
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-gray-800 flex items-center gap-2"
                  style={{
                    color: "var(--modal-text-color)",
                  }}
                >
                  Buat Inventarisasi
                </h2>
              </div>{" "}
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="mt-4">
                    <label
                      htmlFor="name"
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
                        Nama
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Masukan nama"
                        value={formData.name}
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
                        Periode bulanan ( bulan & tahun )
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="periode"
                        type="month" // 👈 Ganti dari "date" ke "month"
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

                  <div className="mt-4">
                    <label
                      htmlFor="jumlahAssetTerdaftar"
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
                        Jumlah Aset Terdaftar
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="jumlahAssetTerdaftar"
                        type="number"
                        name="jumlahAssetTerdaftar"
                        placeholder="Masukan jumlah asset terdaftar"
                        value={formData.jumlahAssetTerdaftar}
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
                      htmlFor="jumlahDokTerkait"
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
                        Jumlah Dokumen Terkait Asset
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="jumlahDokTerkait"
                        type="number"
                        name="jumlahDokTerkait"
                        placeholder="Masukan jumlah dokumen terkait asset"
                        value={formData.jumlahDokTerkait}
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
                      htmlFor="catatanInventarisasi"
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
                        Kendala dalam Inventarisasi
                      </span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="catatanInventarisasi"
                        name="catatanInventarisasi"
                        placeholder="Masukan Kendala dalam Inventarisasi"
                        value={formData.catatanInventarisasi}
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
                    onClick={handleModalCreateClose}
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
                    disabled={
                      isLoading ||
                      !formData.name.trim() ||
                      !formData.periode ||
                      formData.jumlahAssetTerdaftar === "" ||
                      formData.jumlahDokTerkait === ""
                    }
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
