"use client";
import { useEffect, useState } from "react";
import { BiMoon, BiSun } from "react-icons/bi";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.setAttribute("data-theme", savedTheme);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!theme) return;
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  if (!isMounted || !theme) return null; // ⬅️ Tahan render sampai localStorage ready

  return (
    <div className="flex items-center justify-center transition-colors duration-300">
      <button
        onClick={toggleTheme}
        className={`relative inline-flex items-center w-20 h-10 rounded-full 
          border-2 transition-colors duration-300  
        ${theme === "dark" ? "border-white" : "border-gray-500"}`}
      >
        <div
          className={`absolute w-8 h-8 rounded-full shadow-lg transform transition-transform duration-300 ${
            theme === "dark"
              ? "bg-gray-300 translate-x-[42px]"
              : "bg-gray-800 translate-x-[2px]"
          }`}
        />
        <span
          className={`absolute left-[10px] top-1/2 -translate-y-1/2 text-sm font-medium transition-colors duration-300 ${
            theme === "light" ? "text-white" : "text-gray-400"
          }`}
        >
          <BiSun />
        </span>
        <span
          className={`absolute right-[10px] top-1/2 -translate-y-1/2 text-sm font-medium transition-colors duration-300 ${
            theme === "dark" ? "text-gray-800" : "text-gray-400"
          }`}
        >
          <BiMoon />
        </span>
      </button>
    </div>
  );
}

// "use client";
// import { useEffect, useState } from "react";
// import { BiMoon, BiSun } from "react-icons/bi";

// export default function ThemeToggle() {
//   const [theme, setTheme] = useState("light");

//   // Ambil tema dari localStorage saat pertama kali komponen dimount
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") || "light";
//     setTheme(savedTheme);
//     document.body.setAttribute("data-theme", savedTheme);
//   }, []);

//   // Simpan dan update tema saat berubah
//   useEffect(() => {
//     localStorage.setItem("theme", theme);
//     document.body.setAttribute("data-theme", theme);
//   }, [theme]);

//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme); // cukup ini, karena useEffect akan handle setAttribute dan localStorage
//   };

//   return (
//     <div className="flex items-center justify-center transition-colors duration-300">
//       <button
//         onClick={toggleTheme}
//         className={`relative inline-flex items-center w-20 h-10 rounded-full
//           border-2 transition-colors duration-300
//         ${theme === "dark" ? "border-white" : "border-gray-500"}`}
//       >
//         {/* Toggle Circle */}
//         <div
//           className={`absolute w-8 h-8 rounded-full shadow-lg transform transition-transform duration-300 ${
//             theme === "dark"
//               ? "bg-gray-300 translate-x-[42px]"
//               : "bg-gray-800 translate-x-[2px]"
//           }`}
//         />
//         {/* Labels */}
//         <span
//           className={`absolute left-[10px] top-1/2 -translate-y-1/2 text-sm font-medium transition-colors duration-300 ${
//             theme === "light" ? "text-white" : "text-gray-400"
//           }`}
//         >
//           <BiSun />
//         </span>
//         <span
//           className={`absolute right-[10px] top-1/2 -translate-y-1/2 text-sm font-medium transition-colors duration-300 ${
//             theme === "dark" ? "text-gray-800" : "text-gray-400"
//           }`}
//         >
//           <BiMoon />
//         </span>
//       </button>
//     </div>
//   );
// }

// // "use client";
// // import { useEffect, useState } from "react";
// // import { BiMoon, BiSun } from "react-icons/bi";

// // export default function ThemeToggle() {
// //   const [theme, setTheme] = useState("light");

// //   useEffect(() => {
// //     document.body.setAttribute("data-theme", theme);
// //   }, [theme]);

// //   const toggleTheme = () => {
// //     const newTheme = theme === "light" ? "dark" : "light";
// //     setTheme(newTheme);
// //     document.body.setAttribute("data-theme", newTheme);
// //   };

// //   return (
// //     <div className="flex items-center justify-center transition-colors duration-300">
// //       <button
// //         onClick={toggleTheme}
// //         className={`relative  inline-flex items-center w-20 h-10 rounded-full
// //           border-2 transition-colors duration-300
// //         ${theme === "dark" ? "border-white" : "border-gray-500"}`}
// //       >
// //         {/* Toggle Circle */}
// //         <div
// //           className={`absolute w-8 h-8  rounded-full shadow-lg transform transition-transform duration-300 ${
// //             theme === "dark"
// //               ? "bg-gray-300 translate-x-[43px]"
// //               : "bg-gray-800 translate-x-[2px]"
// //           }`}
// //         />
// //         {/* Labels */}
// //         <span
// //           className={`absolute left-[11px] top-1/2 -translate-y-1/2 text-sm font-medium transition-colors duration-300 ${
// //             theme === "light" ? "text-white" : "text-gray-400"
// //           }`}
// //         >
// //           <BiSun />
// //         </span>
// //         <span
// //           className={`absolute right-[11px] top-1/2 -translate-y-1/2 text-sm font-medium transition-colors duration-300 ${
// //             theme === "dark" ? "text-gray-800" : "text-gray-400"
// //           }`}
// //         >
// //           <BiMoon />
// //         </span>
// //       </button>
// //     </div>
// //   );
// // }
