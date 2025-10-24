const API_URL = "https://personal-expense-tracker-api-066w.onrender.com";

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const fetchApi = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || "Something went wrong");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const loginUser = (credentials) => {
  return fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const registerUser = (userData) => {
  return fetchApi("/auth/reg", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const getUserProfile = () => {
  return fetchApi("/profile");
};

export const getExpenses = (params) => {
  const query = new URLSearchParams(params).toString();
  return fetchApi(`/expenses?${query}`);
};

export const createExpense = (expenseData) => {
  return fetchApi("/expenses", {
    method: "POST",
    body: JSON.stringify(expenseData),
  });
};

export const updateExpense = (id, expenseData) => {
  return fetchApi(`/expenses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(expenseData),
  });
};

export const deleteExpense = (id) => {
  return fetchApi(`/expenses/${id}`, {
    method: "DELETE",
  });
};

export const getExpenseSummary = () => {
  const summary = fetchApi("/expenses/summary");
  return summary;
};
