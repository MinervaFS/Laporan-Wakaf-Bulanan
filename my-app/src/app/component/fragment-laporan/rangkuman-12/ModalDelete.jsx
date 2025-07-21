"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "@material-tailwind/react";
import { BtnDelete, BtnDeleteDoc } from "./Button";
import { BiX, BiTrash, BiLoader } from "react-icons/bi";

export const ModalDelete = ({ id, checkFetchData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleModalDeleteOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalDeleteClose = () => {
    if (!isLoading) {
      setIsModalOpen(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/laporan/rangkuman?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus data");
      }

      toast.success("Data berhasil dihapus!");

      if (checkFetchData && typeof checkFetchData === "function") {
        checkFetchData();
      }
      handleModalDeleteClose();
    } catch (error) {
      console.error("DELETE ERROR:", error);
      toast.error(error.message || "Terjadi kesalahan saat menghapus");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click outside modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleModalDeleteClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isModalOpen && !isLoading) {
        handleModalDeleteClose();
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
      <BtnDelete openModalDelete={handleModalDeleteOpen} />
      {/* <ToastContainer position="top-right" autoClose={1000} /> */}

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
            className="rounded-xl shadow-2xl w-full max-w-md"
            style={{
              backgroundColor: "var(--modal-bg)",
              border: "3px solid var(--modal-border)",
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 border-b border-gray-100"
              style={{
                borderBottom: "1px solid var(--modal-border-bottom)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600 rounded-full">
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h2
                  id="modal-title"
                  style={{
                    color: "var(--modal-text-color)",
                  }}
                  className="text-xl font-semibold flex items-center gap-2"
                >
                  Hapus Data?
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Warning Message */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>

                  <div className="flex flex-wrap items-start text-left max-w-md w-full">
                    <h3
                      className="text-lg font-medium mb-2"
                      style={{
                        color: "var(--modal-text-color)",
                      }}
                    >
                      Konfirmasi Penghapusan
                    </h3>
                    <div>
                      <p
                        className="text-sm flex-wrap"
                        style={{ color: "var(--modal-text-color)" }}
                      >
                        menghapus rangkuman & rekomendasi
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outlined"
                    color="gray"
                    onClick={handleModalDeleteClose}
                    disabled={isLoading}
                    className="px-6 py-2.5 border-gray-300 hover:bg-[var(--modal-btn-hover)] transition-colors duration-200"
                    style={{
                      color: "var(--modal-text-color)",
                    }}
                  >
                    Batal
                  </Button>

                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <BiLoader className="animate-spin" size={18} />
                        <span>Menghapus...</span>
                      </>
                    ) : (
                      <>
                        <BiTrash size={18} />
                        <span>Hapus</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
