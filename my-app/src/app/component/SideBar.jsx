"use client";
import { useEffect, useState } from "react";
import {
  BiCategoryAlt,
  BiLogOut,
  BiSolidUser,
  BiSolidBarChartAlt2,
  BiChevronsLeft,
  BiDuplicate,
  BiSolidUserAccount,
  BiChevronDown,
  BiChevronUp,
  BiFolder,
  BiFile,
  BiShield,
} from "react-icons/bi";
import Link from "next/link";
import { Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("/Dashboard");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();

  const handleChanges = (path) => {
    setActive(path);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsLogoutModalOpen(true);
  };

  const closeModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogout = async () => {
    setIsLogout(true);
    try {
      // localStorage.removeItem("user"); // atau item lain yang memang perlu

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
        closeModal();
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLogout(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLogout) {
      setIsLogoutModalOpen(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isLogoutModalOpen && !isLogout) {
        setIsLogoutModalOpen(false);
      }
    };

    if (isLogoutModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    }
  }, [isLogoutModalOpen, isLogout]);

  const dropdownItems = [
    // {
    //   id: 1,
    //   title: "Buat Jenis Asset",
    //   path: "/dashboard/dropdown-data/jenis-asset",
    //   icon: <BiFolder />,
    // },
    // {
    //   id: 2,
    //   title: "Buat Dokumen Baru",
    //   path: "/dashboard/dropdown-data/dokumen",
    //   icon: <BiFile />,
    // },
    // {
    //   id: 3,
    //   title: "Buat Jenis Resiko",
    //   path: "/dashboard/dropdown-data/jenis-resiko",
    //   icon: <BiShield />,
    // },
  ];

  return (
    <div>
      <div
        style={{
          backgroundColor: "var(--sidebar-bg)",
          borderRight: "1px solid var(--sidebar-border)",
          color: "var(--sidebar-text)",
        }}
        className={`fixed left-0 max-w-[720px] min-h-screen ${
          isOpen ? "w-[80px]" : "w-[330px]"
        }`}
      >
        <div className="mt-[80px] flex flex-col h-[calc(100vh-80px)]">
          <div className="px-5 pt-[24px] space-y-1 flex flex-col flex-grow overflow-y-auto pb-4">
            {/* Dashboard Button */}
            <Link href={Datasbtn[0].path}>
              <button
                onClick={() => handleChanges(Datasbtn[0].path)}
                style={{
                  backgroundColor:
                    active === Datasbtn[0].path
                      ? "var(--sidebar-active-bg)"
                      : "transparent",
                  color:
                    active === Datasbtn[0].path
                      ? "var(--sidebar-active-text)"
                      : "var(--sidebar-text)",
                  borderLeftColor:
                    active === Datasbtn[0].path
                      ? "var(--sidebar-active-text)"
                      : "transparent",
                }}
                className={`flex justify-start p-3 items-center rounded-lg transition-all duration-300 group ${
                  active === Datasbtn[0].path ? "border-l-4" : ""
                } ${
                  isOpen ? "justify-center" : "w-full"
                } hover:bg-[var(--sidebar-hover)]`}
                onMouseEnter={(e) => {
                  if (active !== Datasbtn[0].path) {
                    e.target.style.backgroundColor = "var(--sidebar-hover)";
                    const icon = e.target.querySelector(".menu-icon");
                    const text = e.target.querySelector(".menu-text");
                    if (icon) icon.style.color = "var(--sidebar-hover-icon)";
                    if (text) text.style.color = "var(--sidebar-hover-icon)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (active !== Datasbtn[0].path) {
                    e.target.style.backgroundColor = "transparent";
                    const icon = e.target.querySelector(".menu-icon");
                    const text = e.target.querySelector(".menu-text");
                    if (icon) icon.style.color = "var(--sidebar-icon)";
                    if (text) text.style.color = "var(--sidebar-text)";
                  }
                }}
              >
                <span
                  className="text-xl menu-icon"
                  style={{
                    color:
                      active === Datasbtn[0].path
                        ? "var(--sidebar-active-text)"
                        : "var(--sidebar-icon)",
                  }}
                >
                  {Datasbtn[0].icon}
                </span>
                {!isOpen && (
                  <span
                    className="ml-4 text-[14px] font-medium  tracking-wide menu-text"
                    style={{
                      color:
                        active === Datasbtn[0].path
                          ? "var(--sidebar-active-text)"
                          : "var(--sidebar-text)",
                    }}
                  >
                    {Datasbtn[0].title}
                  </span>
                )}
              </button>
            </Link>

            {/* Master Data Dropdown */}
            {/* <div className="relative">
              <button
                onClick={toggleDropdown}
                className={`flex justify-between w-full p-3 items-center rounded-lg transition-all duration-300 group ${
                  dropdownItems.some((item) => active === item.path)
                    ? "border-l-4"
                    : ""
                }`}
                style={{
                  backgroundColor: dropdownItems.some(
                    (item) => active === item.path
                  )
                    ? "var(--sidebar-active-bg)"
                    : "transparent",
                  color: dropdownItems.some((item) => active === item.path)
                    ? "var(--sidebar-active-text)"
                    : "var(--sidebar-text)",
                  borderLeftColor: dropdownItems.some(
                    (item) => active === item.path
                  )
                    ? "var(--sidebar-active-text)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!dropdownItems.some((item) => active === item.path)) {
                    e.target.style.backgroundColor = "var(--sidebar-hover)";
                    const icon = e.target.querySelector(".dropdown-icon");
                    const text = e.target.querySelector(".dropdown-text");
                    const chevron = e.target.querySelector(".dropdown-chevron");
                    if (icon) icon.style.color = "var(--sidebar-hover-icon)";
                    if (text) text.style.color = "var(--sidebar-hover-icon)";
                    if (chevron)
                      chevron.style.color = "var(--sidebar-hover-icon)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!dropdownItems.some((item) => active === item.path)) {
                    e.target.style.backgroundColor = "transparent";
                    const icon = e.target.querySelector(".dropdown-icon");
                    const text = e.target.querySelector(".dropdown-text");
                    const chevron = e.target.querySelector(".dropdown-chevron");
                    if (icon) icon.style.color = "var(--sidebar-icon)";
                    if (text) text.style.color = "var(--sidebar-text)";
                    if (chevron) chevron.style.color = "var(--sidebar-icon)";
                  }
                }}
              >
                <div className="flex items-center">
                  <span
                    className="text-xl dropdown-icon"
                    style={{
                      color: dropdownItems.some((item) => active === item.path)
                        ? "var(--sidebar-active-text)"
                        : "var(--sidebar-icon)",
                    }}
                  >
                    <BiCategoryAlt />
                  </span>
                  {!isOpen && (
                    <span
                      className="ml-4 text-[14px] font-medium uppercase tracking-wide dropdown-text"
                      style={{
                        color: dropdownItems.some(
                          (item) => active === item.path
                        )
                          ? "var(--sidebar-active-text)"
                          : "var(--sidebar-text)",
                      }}
                    >
                      Buat Kategori
                    </span>
                  )}
                </div>
                {!isOpen && (
                  <span
                    className="text-[14px] dropdown-chevron"
                    style={{
                      color: dropdownItems.some((item) => active === item.path)
                        ? "var(--sidebar-active-text)"
                        : "var(--sidebar-icon)",
                    }}
                  >
                    {isDropdownOpen ? <BiChevronUp /> : <BiChevronDown />}
                  </span>
                )}
              </button>

              {isDropdownOpen && !isOpen && (
                <div
                  className="mt-1 space-y-1 ml-6 border-l pl-4"
                  style={{ borderColor: "var(--sidebar-border)" }}
                >
                  {dropdownItems.map((item) => (
                    <Link key={item.id} href={item.path}>
                      <button
                        onClick={() => handleChanges(item.path)}
                        className="flex justify-start w-full p-2 items-center rounded-md transition-all duration-300 group"
                        style={{
                          backgroundColor:
                            active === item.path
                              ? "var(--sidebar-active-bg)"
                              : "transparent",
                          color:
                            active === item.path
                              ? "var(--sidebar-active-text)"
                              : "var(--sidebar-text)",
                        }}
                        onMouseEnter={(e) => {
                          if (active !== item.path) {
                            e.target.style.backgroundColor =
                              "var(--sidebar-hover)";
                            const icon = e.target.querySelector(
                              ".dropdown-item-icon"
                            );
                            const text = e.target.querySelector(
                              ".dropdown-item-text"
                            );
                            if (icon)
                              icon.style.color = "var(--sidebar-hover-icon)";
                            if (text)
                              text.style.color = "var(--sidebar-hover-icon)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (active !== item.path) {
                            e.target.style.backgroundColor = "transparent";
                            const icon = e.target.querySelector(
                              ".dropdown-item-icon"
                            );
                            const text = e.target.querySelector(
                              ".dropdown-item-text"
                            );
                            if (icon) icon.style.color = "var(--sidebar-icon)";
                            if (text) text.style.color = "var(--sidebar-text)";
                          }
                        }}
                      >
                        <span
                          className="text-[14px] font-medium  mr-3 dropdown-item-icon"
                          style={{
                            color:
                              active === item.path
                                ? "var(--sidebar-active-text)"
                                : "var(--sidebar-icon)",
                          }}
                        >
                          {item.icon}
                        </span>
                        <span
                          className="text-xs font-medium uppercase dropdown-item-text"
                          style={{
                            color:
                              active === item.path
                                ? "var(--sidebar-active-text)"
                                : "var(--sidebar-text)",
                          }}
                        >
                          {item.title}
                        </span>
                      </button>
                    </Link>
                  ))}
                </div>
              )}
            </div> */}

            {/* Other Menu Items */}
            {Datasbtn.slice(1, -1).map((item) => (
              <Link key={item.id} href={item.path}>
                <button
                  onClick={() => handleChanges(item.path)}
                  className={`flex justify-start p-3 items-center rounded-lg transition-all duration-300 group ${
                    active === item.path ? "border-l-4" : ""
                  } ${isOpen ? "w-full justify-center" : "w-full"}`}
                  style={{
                    backgroundColor:
                      active === item.path
                        ? "var(--sidebar-active-bg)"
                        : "transparent",
                    color:
                      active === item.path
                        ? "var(--sidebar-active-text)"
                        : "var(--sidebar-text)",
                    borderLeftColor:
                      active === item.path
                        ? "var(--sidebar-active-text)"
                        : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (active !== item.path) {
                      e.target.style.backgroundColor = "var(--sidebar-hover)";
                      const icon = e.target.querySelector(".menu-icon");
                      const text = e.target.querySelector(".menu-text");
                      if (icon) icon.style.color = "var(--sidebar-hover-icon)";
                      if (text) text.style.color = "var(--sidebar-hover-icon)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (active !== item.path) {
                      e.target.style.backgroundColor = "transparent";
                      const icon = e.target.querySelector(".menu-icon");
                      const text = e.target.querySelector(".menu-text");
                      if (icon) icon.style.color = "var(--sidebar-icon)";
                      if (text) text.style.color = "var(--sidebar-text)";
                    }
                  }}
                >
                  <span
                    className="text-xl menu-icon"
                    style={{
                      color:
                        active === item.path
                          ? "var(--sidebar-active-text)"
                          : "var(--sidebar-icon)",
                    }}
                  >
                    {item.icon}
                  </span>
                  {!isOpen && (
                    <span
                      className="ml-4 text-[14px] font-medium uppercase tracking-wide menu-text"
                      style={{
                        color:
                          active === item.path
                            ? "var(--sidebar-active-text)"
                            : "var(--sidebar-text)",
                      }}
                    >
                      {item.title}
                    </span>
                  )}
                </button>
              </Link>
            ))}
          </div>

          {/* Logout button - fixed at bottom */}
          <div
            className="px-5 pb-6 mt-[20px] border-t pt-4"
            style={{ borderColor: "var(--sidebar-border)" }}
          >
            <button
              onClick={handleLogoutClick}
              className={`flex justify-start w-full p-3 items-center rounded-lg transition-all duration-300 group ${
                isOpen ? "justify-center" : ""
              }`}
              style={{
                color:
                  active === Datasbtn[Datasbtn.length - 1].path
                    ? "var(--sidebar-active-text)"
                    : "var(--sidebar-text)",
                backgroundColor:
                  active === Datasbtn[Datasbtn.length - 1].path
                    ? "var(--sidebar-active-bg)"
                    : "transparent",
              }}
              onMouseEnter={(e) => {
                if (active !== Datasbtn[Datasbtn.length - 1].path) {
                  e.target.style.backgroundColor = "var(--sidebar-hover)";
                  const icon = e.target.querySelector(".logout-icon");
                  const text = e.target.querySelector(".logout-text");
                  if (icon) icon.style.color = "#ef4444"; // red-500 for logout hover
                  if (text) text.style.color = "#ef4444";
                }
              }}
              onMouseLeave={(e) => {
                if (active !== Datasbtn[Datasbtn.length - 1].path) {
                  e.target.style.backgroundColor = "transparent";
                  const icon = e.target.querySelector(".logout-icon");
                  const text = e.target.querySelector(".logout-text");
                  if (icon) icon.style.color = "var(--sidebar-icon)";
                  if (text) text.style.color = "var(--sidebar-text)";
                }
              }}
            >
              <span
                className="text-[14px] logout-icon"
                style={{
                  color:
                    active === Datasbtn[Datasbtn.length - 1].path
                      ? "var(--sidebar-active-text)"
                      : "var(--sidebar-icon)",
                }}
              >
                {Datasbtn[Datasbtn.length - 1].icon}
              </span>
              {!isOpen && (
                <span
                  className="ml-4 text-[14px]  tracking-wide logout-text"
                  style={{
                    color:
                      active === Datasbtn[Datasbtn.length - 1].path
                        ? "var(--sidebar-active-text)"
                        : "var(--sidebar-text)",
                  }}
                >
                  {Datasbtn[Datasbtn.length - 1].title}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Toggle button (hidden) */}
        <div
          className="hidden absolute top-[65%] -right-5 w-10 h-10 rounded-full justify-center items-center transition-all duration-300 cursor-pointer"
          style={{
            backgroundColor: "var(--sidebar-hover)",
            border: "1px solid var(--sidebar-border)",
          }}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "var(--sidebar-active-bg)";
            const icon = e.target.querySelector(".toggle-icon");
            if (icon) icon.style.color = "var(--sidebar-hover-icon)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "var(--sidebar-hover)";
            const icon = e.target.querySelector(".toggle-icon");
            if (icon) icon.style.color = "var(--sidebar-icon)";
          }}
        >
          <BiChevronsLeft
            className={`${
              isOpen ? "rotate-180" : ""
            } text-xl transition-all duration-300 toggle-icon`}
            style={{ color: "var(--sidebar-icon)" }}
          />
        </div>
      </div>

      {/* Logout Modal - Dynamic Theme */}
      {isLogoutModalOpen && (
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div
            className="border rounded-lg shadow-2xl p-6 w-[90%] max-w-sm"
            style={{
              backgroundColor: "var(--sidebar-bg)",
              borderColor: "var(--sidebar-border)",
            }}
          >
            <h2
              className="text-[14px] font-bold mb-4"
              style={{ color: "var(--sidebar-text)" }}
            >
              Konfirmasi Logout
            </h2>
            <p
              className="mb-6 text-[14px]"
              style={{ color: "var(--sidebar-icon)" }}
            >
              Apakah Anda yakin ingin keluar?
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={closeModal}
                variant="outlined"
                className="font-normal rounded-lg px-5 py-2 normal-case"
                style={{
                  borderColor: "var(--sidebar-border)",
                  color: "var(--sidebar-text)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "var(--sidebar-hover)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleLogout}
                disabled={isLogout}
                className="text-white rounded-lg px-6 py-2 normal-case"
                style={{
                  backgroundColor: "#dc2626", // red-600
                }}
                onMouseEnter={(e) => {
                  if (!isLogout) {
                    e.target.style.backgroundColor = "#b91c1c"; // red-700
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLogout) {
                    e.target.style.backgroundColor = "#dc2626"; // red-600
                  }
                }}
              >
                {isLogout ? (
                  <div>
                    <Spinner /> Logging out...
                  </div>
                ) : (
                  "Logout"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Datasbtn = [
  {
    id: 1,
    title: "Dashboard",
    path: "/dashboard/admin",
    icon: <BiSolidBarChartAlt2 />,
  },
  {
    id: 2,
    title: "Buat Lapooran",
    path: "/dashboard/laporan",
    icon: <BiDuplicate />,
  },
  {
    id: 3,
    title: "Users",
    path: "/dashboard/users",
    icon: <BiSolidUserAccount />,
  },
  // {
  //   id: 4,
  //   title: "Profile",
  //   path: "/dashboard/profile",
  //   icon: <BiSolidUser />,
  // },
  {
    id: 4,
    title: "Logout",
    path: "/",
    icon: <BiLogOut />,
  },
];
