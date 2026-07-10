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
    return 'Something went wrong. Please try again later.';
  }

  if (error.response?.status === 401) {
    return 'Invalid email or password.';
  }

  if (error.response?.status === 403) {
    return 'You are not authorized to perform this action.';
  }

  if (error.response?.status === 404) {
    return 'The requested resource was not found.';
  }

  return fallbackMessage;
}

export async function get(url, config = {}) {
  try {
    const response = await requestClient.get(url, config);
    return response.data;
  } catch (error) {
    const requestError = new Error(getErrorMessage(error, 'Unable to load data right now.'));
    requestError.code = error.code;
    requestError.status = error.response?.status;
    throw requestError;
  }
}

export async function post(url, data = {}, config = {}) {
  try {
    const response = await requestClient.post(url, data, config);
    return response.data;
  } catch (error) {
    const requestError = new Error(
      getErrorMessage(error, 'Unable to complete your request right now.')
    );
    requestError.code = error.code;
    requestError.status = error.response?.status;
    throw requestError;
  }
}

export async function put(url, data = {}, config = {}) {
  try {
    const response = await requestClient.put(url, data, config);
    return response.data;
  } catch (error) {
    const requestError = new Error(
      getErrorMessage(error, 'Unable to update the record right now.')
    );
    requestError.code = error.code;
    requestError.status = error.response?.status;
    throw requestError;
  }
}