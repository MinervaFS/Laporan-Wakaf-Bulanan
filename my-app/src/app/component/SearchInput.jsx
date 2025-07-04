"use client";
import { BiSearch, BiX } from "react-icons/bi";
import { useState } from "react";

export const SearchInput = ({ onSearch }) => {
  const [value, setValue] = useState("");
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch(e);
  };

  const handleClear = () => {
    setValue("");
    onSearch({ target: { value: "" } });
  };

  return (
    <div
      className="relative w-full max-w-sm"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <BiSearch
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
      />

      {value && (hovered || focused) && (
        <BiX
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-red-500 transition"
          onClick={handleClear}
        />
      )}

      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Cari sesuatu..."
        className="search-input w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-md text-sm outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-300 hover:border-amber-400"
      />
    </div>
  );
};
