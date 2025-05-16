// Centralized API utility for backend communication
const BASE_URL = 'http://localhost:8080';

function getToken() {
  // You should store the JWT in sessionStorage after login
  return sessionStorage.getItem('jwtToken');
}

function authHeaders() {
  const token = getToken();
  return token
    ? { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

export async function getCurrentUser() {
  const res = await fetch(`${BASE_URL}/api/auth/user`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export async function getUserId() {
  const res = await fetch(`${BASE_URL}/api/auth/userId`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('User ID not found');
  return res.json();
}

export async function getProfile(userId) {
  const res = await fetch(`${BASE_URL}/api/profile/${userId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Profile not found');
  return res.json();
}

export async function updateProfile(userId, profileData) {
  const res = await fetch(`${BASE_URL}/api/profile/update/${userId}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(profileData),
  });
  if (!res.ok) throw new Error('Profile update failed');
  return res.json();
}

export async function saveSurvey(userId, surveyData) {
  const res = await fetch(`${BASE_URL}/api/survey/save/${userId}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(surveyData),
  });
  if (!res.ok) throw new Error('Survey save failed');
  return res.json();
}

export async function getSurvey(profileId) {
  const res = await fetch(`${BASE_URL}/api/survey/${profileId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Survey not found');
  return res.json();
}
