import api from "./api";

// PRODUCTS
export const getVendorProducts = () =>
  api.get("vendor/products/");

export const createVendorProduct = (data) =>
  api.post("vendor/products/add/", data);

export const updateVendorProduct = (id, data) =>
  api.patch(`vendor/products/${id}/`, data);

export const deleteVendorProduct = (id) =>
  api.delete(`vendor/products/${id}/`);

// DASHBOARD
export const getVendorDashboard = () =>
  api.get("shops/vendor/dashboard/");

