import axios from 'axios';
import config from './Config';

const requestClient = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function getErrorMessage(error, fallbackMessage) {
  if (error.code === 'ERR_NETWORK') {
    return `API server is not reachable at ${config.API_BASE_URL}. Start the backend server or update VITE_API_BASE_URL.`;
  }

  if (error.response?.status === 401) {
    return 'Invalid credentials';
  }

  return (
    error.response?.data?.message ??
    error.response?.data?.error ??
    error.message ??
    fallbackMessage
  );
}

export async function get(url, config = {}) {
  try {
    const response = await requestClient.get(url, config);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'GET request failed.'));
  }
}

export async function post(url, data = {}, config = {}) {
  try {
    const response = await requestClient.post(url, data, config);
    return response.data;
  } catch (error) {
    const requestError = new Error(getErrorMessage(error, 'POST request failed.'));
    requestError.code = error.code;
    requestError.status = error.response?.status;
    throw requestError;
  }
}
