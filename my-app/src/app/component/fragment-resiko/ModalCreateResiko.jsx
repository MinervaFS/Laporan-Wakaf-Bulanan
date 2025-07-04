"use client";

import { useState } from "react";
import { BiSend, BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import { BtnCreateDoc } from "./Button";
import { Input } from "@material-tailwind/react";

export const ModalCreateResiko = ({ checkFetchData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    documentType: "",
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
    setIsModalOpen(false);
    setFormData({ documentType: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/master-data/new-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan data");

      toast.success("Data berhasil disimpan!");
      handleModalCreateClose();
      checkFetchData();
    } catch (error) {
      console.error("SUBMIT ERROR:", error);
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <BtnCreateDoc onOpen={handleModalCreateOpen} />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Buat Dokumen Baru</h2>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-200"
                onClick={handleModalCreateClose}
                disabled={isLoading}
              >
                <BiX size={25} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="font-bold">1. </span>Jenis Pemanfaatan Asset
                </label>
                <Input
                  type="text"
                  name="documentType"
                  label="Masukan Jenis Asset"
                  value={formData.documentType}
                  onChange={handleOnChange}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`p-3 rounded-full text-white font-semibold transition flex items-center justify-center ${
                    isLoading
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <BiSend size={25} />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
