const API_BASE_URL = "http://localhost:5000/api";

export { API_BASE_URL };

// API functions
export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params);
  const res = await fetch(`${API_BASE_URL}/products?${query}`);
  return res.json();
};

export const fetchProduct = async (id) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`);
  return res.json();
};

export const createProduct = async (productData, token) => {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return res.json();
};

export const updateProduct = async (id, productData, token) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return res.json();
};

export const deleteProduct = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const fetchOrders = async (token) => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const createOrder = async (orderData, token) => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  return res.json();
};

export const getAiRecommendations = async (data) => {
  const res = await fetch(`${API_BASE_URL}/ai/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};