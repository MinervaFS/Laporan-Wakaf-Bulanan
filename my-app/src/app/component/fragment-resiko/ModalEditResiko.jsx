"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "@material-tailwind/react";
import { BtnEditDoc } from "./Button";
import { Input } from "@material-tailwind/react";
import { BiX, BiSend } from "react-icons/bi";

export const ModalEditResiko = ({ item, checkFetchData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
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

  const openModalEdit = () => {
    setIsModalOpen(true);
  };

  const closeModalEdit = () => {
    setIsModalOpen(false);
    setLoading(false); // Reset loading state
  };

  const handleOnChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSaveData = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state

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
      closeModalEdit();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Something went wrong!");
      setLoading(false); // Reset loading state on error
    }
  };

  return (
    <div>
      <BtnEditDoc openModalEdit={openModalEdit} />
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white backdrop-blur-lg p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex mb-6 items-center justify-between">
              <h2 className="text-xl font-semibold">Edit Jenis Dokumen</h2>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-200"
                onClick={closeModalEdit}
                disabled={isLoading}
              >
                <BiX size={25} />
              </button>
            </div>

            <form onSubmit={handleSaveData}>
              <div className="mb-4">
                <label className="block text-left text-sm font-medium text-gray-700">
                  <span className="font-bold">1. </span> Jenis Dokumen
                </label>
                <Input
                  type="text"
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleOnChanges}
                  disabled={isLoading}
                  label="Masukan Jenis Dokumen Baru"
                  className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="submit"
                  className="p-3 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  ) : (
                    <BiSend size={25} />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
