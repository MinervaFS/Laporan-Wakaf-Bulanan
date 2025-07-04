"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Spinner } from "@material-tailwind/react";
import { BtnDeleteDoc } from "./Button";
export const ModalDeleteDoc = ({ id, checkFetchData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteData = async () => {
    setLoading(true);
    try {
      const deleteData = await fetch(`/api/master-data/new-document?id=${id}`, {
        method: "DELETE",
      });

      if (!deleteData.ok) {
        throw new Error("Failed to delete data");
      }

      toast.success("Data deleted successfully!");
      checkFetchData();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete data");
    } finally {
      setLoading(false);
    }
  };

  const openModalDelete = () => setIsModalOpen(true);
  const closeModalDelete = () => setIsModalOpen(false);

  return (
    <div>
      <BtnDeleteDoc openModalDelete={openModalDelete} />
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Hapus Laporan{" "}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Kamu yakin menghapus data ini?{" "}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={closeModalDelete}
                variant="outlined"
                className="!border-gray-300 !text-gray-700 hover:!bg-gray-100 rounded-full px-5 py-2 normal-case"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteData}
                disabled={loading}
                variant="contained"
                className="!bg-red-600 hover:!bg-red-700 text-white rounded-full px-6 py-2 normal-case"
              >
                {loading ? <Spinner size={20} color="inherit" /> : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
