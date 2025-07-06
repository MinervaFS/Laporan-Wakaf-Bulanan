// "use client";
// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { Button } from "@material-tailwind/react";
// import { BtnEditDoc } from "./Button";
// import { Input } from "@material-tailwind/react";
// import { BiX, BiSend, BiLoader } from "react-icons/bi";

// export const ModalEditDoc = ({ item, checkFetchData }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     documentType: item?.documentType || "",
//   });

//   useEffect(() => {
//     if (item) {
//       setFormData({
//         documentType: item.documentType || "",
//       });
//     }
//   }, [item]);

//   const openModalEdit = () => {
//     setIsModalOpen(true);
//   };

//   const closeModalEdit = () => {
//     setIsModalOpen(false);
//     setLoading(false);
//   };

//   const handleOnChanges = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };

//   const handleSaveData = async (e) => {
//     e.preventDefault();

//     // Validasi input
//     if (!formData.documentType.trim()) {
//       toast.error("Jenis dokumen tidak boleh kosong");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(`/api/master-data/new-document/${item._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ newDocumentType: formData }),
//       });

//       const responseData = await res.json();

//       if (!res.ok) {
//         throw new Error(responseData.message || "Gagal mengupdate data");
//       }

//       toast.success("Data dokumen baru berhasil diperbarui");

//       if (checkFetchData && typeof checkFetchData === "function") {
//         await checkFetchData();
//       }
//       closeModalEdit();
//     } catch (error) {
//       console.error("Update error:", error);
//       toast.error(error.message || "Something went wrong!");
//       setLoading(false);
//     }
//   };

//   // Handle click outside modal
//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget && !isLoading) {
//       closeModalEdit();
//     }
//   };

//   // Handle escape key
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === "Escape" && isModalOpen && !isLoading) {
//         closeModalEdit();
//       }
//     };

//     if (isModalOpen) {
//       document.addEventListener("keydown", handleEscape);
//       document.body.style.overflow = "hidden"; // Prevent background scroll
//     }

//     return () => {
//       document.removeEventListener("keydown", handleEscape);
//       document.body.style.overflow = "unset";
//     };
//   }, [isModalOpen, isLoading]);

//   return (
//     <div>
//       <BtnEditDoc openModalEdit={openModalEdit} />

//       {/* Modal Overlay */}
//       {isModalOpen && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
//           onClick={handleBackdropClick}
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="modal-title"
//         >
//           {/* Modal Content */}
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-100">
//               <h2
//                 id="modal-title"
//                 className="text-xl font-semibold text-gray-800 flex items-center gap-2"
//               >
//                 <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                 Edit Jenis Dokumen
//               </h2>
//               <button
//                 type="button"
//                 className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={closeModalEdit}
//                 disabled={isLoading}
//                 aria-label="Tutup modal"
//               >
//                 <BiX size={24} className="text-gray-500" />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6">
//               <form onSubmit={handleSaveData} className="space-y-6">
//                 {/* Form Field */}
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="documentType"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     <span className="inline-flex items-center gap-1">
//                       <span className="flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
//                         1
//                       </span>
//                       Jenis Dokumen
//                     </span>
//                   </label>

//                   <div className="relative">
//                     <Input
//                       id="documentType"
//                       type="text"
//                       name="documentType"
//                       value={formData.documentType}
//                       onChange={handleOnChanges}
//                       disabled={isLoading}
//                       label="Masukan Jenis Dokumen Baru"
//                       className="!border-gray-300 focus:!border-blue-500 focus:!ring-blue-500"
//                       containerProps={{
//                         className: "min-w-0",
//                       }}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-end gap-3 pt-4">
//                   <Button
//                     type="button"
//                     variant="outlined"
//                     color="gray"
//                     onClick={closeModalEdit}
//                     disabled={isLoading}
//                     className="px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
//                   >
//                     Batal
//                   </Button>

//                   <Button
//                     type="submit"
//                     className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
//                     disabled={isLoading || !formData.documentType.trim()}
//                   >
//                     {isLoading ? (
//                       <>
//                         <BiLoader className="animate-spin" size={18} />
//                         <span>Menyimpan...</span>
//                       </>
//                     ) : (
//                       <>
//                         <BiSend size={18} />
//                         <span>Simpan</span>
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
