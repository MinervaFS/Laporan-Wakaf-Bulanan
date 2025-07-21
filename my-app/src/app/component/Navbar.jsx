"use client";
import { Button, Spinner } from "@material-tailwind/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BiMenu,
  BiX,
  BiCategoryAlt,
  BiSolidUser,
  BiSolidBarChartAlt2,
  BiGroup,
  BiLogOut,
  BiChevronDown,
  BiChevronUp,
  BiFolder,
  BiFile,
  BiShield,
} from "react-icons/bi";
import { toast } from "react-toastify";
import ThemeToggle from "./ThemeButton";

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    setIsLogout(true);
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout Failed");
      } else {
        toast.success("Logout Success");
        closeModal(); // Tutup modal setelah logout
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLogout(false);
    }
  };

  const handleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
    setIsDropdownOpen(false); // Reset dropdown saat navbar ditutup
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      id: 1,
      title: "Dashboard",
      path: "/dashboard/admin",
      icon: <BiSolidBarChartAlt2 />,
    },
    {
      id: 3,
      title: "Buat Laporan",
      path: "/dashboard/laporan",
      icon: <BiCategoryAlt />,
    },
    {
      id: 4,
      title: "Users",
      path: "/dashboard/users",
      icon: <BiGroup />,
    },
    {
      id: 5,
      title: "Profile",
      path: "/dashboard/profile",
      icon: <BiSolidUser />,
    },
  ];

  // const dropdownItems = [
  //   // {
  //   //   id: 1,
  //   //   title: "Buat Jenis Asset",
  //   //   path: "/dashboard/dropdown-data/jenis-asset",
  //   //   icon: <BiFolder />,
  //   // },
  //   // {
  //   //   id: 2,
  //   //   title: "Buat Dokumen Baru",
  //   //   path: "/dashboard/dropdown-data/dokumen",
  //   //   icon: <BiFile />,
  //   // },
  //   // {
  //   //   id: 3,
  //   //   title: "Buat Jenis Resiko",
  //   //   path: "/dashboard/dropdown-data/jenis-resiko",
  //   //   icon: <BiShield />,
  //   // },
  // ];

  return (
    <main>
      {isNavOpen && (
        <div className="fixed inset-0  z-40" onClick={closeNav}></div>
      )}

      <nav
        style={
          isScrolled
            ? {
                backgroundColor: "var( --sidebar-bg)",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }
            : {
                backgroundColor: "var( --sidebar-bg)",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }
        }
        className="flex fixed top-0  justify-between items-center w-full h-[80px] z-50 mx-auto px-5 duration-300"
        // className={`flex fixed top-0  justify-between items-center w-full h-[80px] z-50 mx-auto px-5 duration-300
        //    ${
        //      isScrolled
        //        ? "bg-[#1a1a1a]  shadow-md"
        //        : "bg-white md:bg-[#1a1a1a] "
        //    }`}
      >
        <div className="p-5 flex items-center">
          <div className="cursor-pointer flex flex-col items-center">
            <img
              src="/logo-img/logo-navbar.png"
              alt="Logo Navbar"
              className="w-[150px] mb-2"
            />
            <h1
              className="text-2xl md:text-3xl font-bold text-gray-800 md:text-white"
              style={{ color: "var(--sidebar-text)" }}
            ></h1>
          </div>
        </div>

        <div className="p-4 hidden xl:flex items-center space-x-4">
          <div>
            <ThemeToggle />
          </div>
          <Link href="/dashboard/profile">
            <div
              style={{
                color: "var(--text-icon)",
                border: "1px solid var(--border-icon)",
              }}
              className="w-10 h-10 rounded-full duration-200 flex items-center justify-center transition-all"
            >
              <BiSolidUser
                size={20}
                className=" hover:text-amber-400"
                style={{ color: "1px solid var(--border-icon)" }}
              />
            </div>
          </Link>
        </div>

        <div
          onClick={handleNav}
          className="block xl:hidden p-2 rounded-md hover:bg-gray-100 md:hover:bg-gray-500 transition-colors nav-toggle"
        >
          {isNavOpen ? (
            <BiX
              size={24}
              style={{
                color: "var(--text-table)",
              }}
              className=" md:text-white"
            />
          ) : (
            <BiMenu
              size={24}
              style={{
                color: "var(--text-table)",
              }}
              className=" md:text-white"
            />
          )}
        </div>

        <ul
          style={{
            backgroundColor: "var(--bg-Table)",
            color: "var(--sidebar-text)",
          }}
          className={`mobile-nav ${
            isNavOpen
              ? "fixed xl:hidden left-0 top-0 w-[60%] h-full shadow-lg ease-in-out duration-500 z-50 flex flex-col"
              : "fixed w-[60%] top-0 bottom-0 left-[-100%] ease-in-out duration-500 z-50 flex flex-col"
          }`}
        >
          {/* Header - Fixed */}
          <li className="p-4 flex-shrink-0">
            <img
              src="/logo-img/logo-navbar.png"
              alt="Logo Navbar"
              className="w-[135px] mb-2"
            />
          </li>

          <div className="px-6 pt-4 flex justify-start ">
            <ThemeToggle />
          </div>

          {/* Profile Section - Fixed */}
          <li className="p-4 flex-shrink-0">
            <Link href="/dashboard/profile" onClick={closeNav}>
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <BiSolidUser className="" />
                </div>
                <span className="font-medium ">Profile</span>
              </div>
            </Link>
          </li>

          {/* Scrollable Menu Items */}
          <div className="flex-1 overflow-y-auto">
            {/* Dashboard */}
            <Link
              href={navItems[0].path}
              key={navItems[0].id}
              onClick={closeNav}
            >
              <li className="p-5  border-gray-300 hover:bg-gray-50 cursor-pointer duration-300">
                <div className="flex items-center space-x-3">
                  <span className="">{navItems[0].icon}</span>
                  <span className="">{navItems[0].title}</span>
                </div>
              </li>
            </Link>

            {/* Dropdown Menu Item - Buat Kategori */}
            {/* <li className=" border-gray-300">
              <div
                onClick={toggleDropdown}
                className="p-5 hover:bg-gray-50 cursor-pointer duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="">
                      <BiCategoryAlt />
                    </span>
                    <span className="">Buat Kategori</span>
                  </div>
                  <span className="">
                    {isDropdownOpen ? <BiChevronUp /> : <BiChevronDown />}
                  </span>
                </div>
              </div>

              {/* Dropdown Items //
              {isDropdownOpen && (
                <div className="bg-gray-50 border-t ">
                  {dropdownItems.map((item) => (
                    <Link href={item.path} key={item.id} onClick={closeNav}>
                      <div className="pl-12 pr-5 py-3 hover:bg-gray-100 cursor-pointer duration-300">
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-500 text-sm">
                            {item.icon}
                          </span>
                          <span className=" text-sm">{item.title}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </li> */}

            {/* Rest of nav items (excluding Dashboard) */}
            {navItems.slice(1).map((item) => (
              <Link href={item.path} key={item.id} onClick={closeNav}>
                <li className="p-5  border-gray-300 hover:bg-gray-50 cursor-pointer duration-300">
                  <div className="flex items-center space-x-3">
                    <span className="">{item.icon}</span>
                    <span className="">{item.title}</span>
                  </div>
                </li>
              </Link>
            ))}
          </div>

          {/* Logout Button - Fixed at Bottom */}
          <li className="p-5 border-t  flex-shrink-0 mt-auto">
            <Button color="red" onClick={openModal} className="w-full">
              <div className="flex items-center justify-center space-x-3">
                <span>
                  <BiLogOut />
                </span>
                <span>Logout</span>
              </div>
            </Button>
          </li>
        </ul>

        {/* Modal Logout - Dark Theme */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl p-6 w-[90%] max-w-sm">
              <h2 className="text-lg font-semibold mb-4 text-white">
                Konfirmasi Logout
              </h2>
              <p className="mb-6 text-sm text-gray-400">
                Apakah Anda yakin ingin keluar?
              </p>
              <div className="flex justify-end space-x-4">
                <Button
                  onClick={closeModal}
                  variant="outlined"
                  className="!border-gray-600 font-normal !text-gray-300 hover:!bg-gray-800 hover:!border-gray-500 rounded-lg px-5 py-2 normal-case"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  disabled={isLogout}
                  className="!bg-red-600 hover:!bg-red-700 text-white rounded-lg px-6 py-2 normal-case"
                >
                  {isLogout ? (
                    <div>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white -transparent"></div>
                    </div>
                  ) : (
                    "Logout ..."
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </main>
  );
}
