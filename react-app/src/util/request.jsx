import axios from 'axios';
import config from './Config';

const requestClient = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function getErrorMessage(error, fallbackMessage) {
  return (
    error.response?.data?.message ??
    error.response?.data?.error ??
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
    throw new Error(getErrorMessage(error, 'POST request failed.'));
  }
}
