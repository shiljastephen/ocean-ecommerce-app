export const isVendor = () => {
  const role = localStorage.getItem("role");
  return role && role.toLowerCase() === "vendor";
};
