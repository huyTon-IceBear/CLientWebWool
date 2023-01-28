import { config } from '../config.js';
import { cookies } from '../cookies/index.js';
import { objectToFormData } from '../helpers/utils.js';
let condition = sessionStorage.cookies;
let token =
  condition == 'true'
    ? cookies.getCookies('authToken')
    : sessionStorage.authToken;

// JSON payload
function postJSON(url, data) {
  const api = config.baseUrl + config.port + url;
  return fetch(api, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// FormData
function postFormData(url, data) {
  const formData = objectToFormData(data);
  const api = config.baseUrl + config.port + url;
  return fetch(api, {
    method: 'POST',
    body: formData,
    headers: {
      'X-Auth-Token': token,
    },
  });
}

export { postJSON, postFormData };
