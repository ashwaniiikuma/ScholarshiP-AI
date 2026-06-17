import config from './Config';

const baseUrl = config.API_BASE_URL;

export const URL = {
  LogInApi: `${baseUrl}/user/login`,
  Register: `${baseUrl}/user/register`,
};
