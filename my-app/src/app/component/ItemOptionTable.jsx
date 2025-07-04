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
      >
        <option className="text-black" value={5}>
          5
        </option>
        <option className="text-black" value={10}>
          10
        </option>
        <option className="text-black" value={15}>
          15
        </option>
        <option className="text-black" value={20}>
          20
        </option>
      </select>
    </div>
  );
};
