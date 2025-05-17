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

export async function getMatchesFromSurvey(surveyData) {
  const res = await fetch(`${BASE_URL}/api/survey/match`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(surveyData),
  });
  if (!res.ok) throw new Error('Failed to get matches');
  return res.json();
}

// Project API
export async function getAllProjects() {
  const res = await fetch(`${BASE_URL}/api/projects/getall`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function createProject(projectData) {
  const token = getToken();
  console.log('DEBUG: JWT token before createProject:', token);
  const res = await fetch(`${BASE_URL}/api/projects/create/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

export async function updateProject(projectId, projectData) {
  const res = await fetch(`${BASE_URL}/api/projects/update/${projectId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

export async function deleteProject(projectId) {
  const res = await fetch(`${BASE_URL}/api/projects/delete/${projectId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete project');
}

export async function applyToProject(projectId, userId) {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}/apply/${userId}`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to apply to project');
  return res.text();
}

export async function getProjectsByUser(userId) {
  const res = await fetch(`${BASE_URL}/api/projects/user/${userId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch user projects');
  return res.json();
}
