export const ItemsOptionDashboardAdmin = ({
  itemsPerPage,
  handleItemsPerPage,
}) => {
  return (
    <div className="flex">
      <label htmlFor="itemsPerPage">
        <p className="hidden md:block p-2">Items / Page:</p>{" "}
      </label>
      <select
        name="itemsPerPage"
        id="itemsPerPage"
        value={itemsPerPage}
        onChange={handleItemsPerPage}
        className="px-2 py-1 border border-gray-300 rounded-md cursor-pointer"
        style={{
          backgroundColor: "var(--bg-Table)",
          color: "var(--sidebar-text)",
          border: "2px solid var(--sidebar-border)", // ⬅️ langsung pakai border
        }}
      >
        <option
          className="text-black"
          value={5}
          style={{
            color: "var(--sidebar-text)",
          }}
        >
          5
        </option>
        <option
          className="text-black"
          value={10}
          style={{
            color: "var(--sidebar-text)",
          }}
        >
          10
        </option>
        <option
          className="text-black"
          value={15}
          style={{
            color: "var(--sidebar-text)",
          }}
        >
          15
        </option>
        <option
          className="text-black"
          value={20}
          style={{
            color: "var(--sidebar-text)",
          }}
        >
          20
        </option>
      </select>
    </div>
  );
};
