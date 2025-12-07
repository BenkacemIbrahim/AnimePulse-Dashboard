const API_BASE = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token') || '';
}

function setToken(token) {
  localStorage.setItem('token', token);
}

async function apiRequest(path, options = {}) {
  const headers = options.headers || {};
  const authToken = getToken();
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  const body = isJson ? await res.json() : await res.text();
  if (!res.ok) throw new Error(body?.error || body || 'Request failed');
  return body;
}

function apiGet(path) { return apiRequest(path, { method: 'GET' }); }
function apiPost(path, data) { return apiRequest(path, { method: 'POST', body: JSON.stringify(data) }); }
function apiPut(path, data) { return apiRequest(path, { method: 'PUT', body: JSON.stringify(data) }); }
function apiDelete(path) { return apiRequest(path, { method: 'DELETE' }); }

window.API = { apiGet, apiPost, apiPut, apiDelete, setToken, getToken };
