const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const parseJson = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};

export const apiRequest = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  const payload = await parseJson(response);
  if (!response.ok) {
    const message = payload?.error || "Request failed.";
    throw new Error(message);
  }

  return payload;
};

export const authHeader = (token) => {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};
