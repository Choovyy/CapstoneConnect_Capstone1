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
  try {
    const res = await fetch(`${BASE_URL}/api/survey/save/${userId}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(surveyData),
    });
    
    if (!res.ok) {
      // Try to get more detailed error message from response
      try {
        const errorData = await res.json();
        throw new Error(errorData.message || `Survey save failed with status: ${res.status}`);
      } catch (parseError) {
        // If we couldn't parse the error response
        throw new Error(`Survey save failed with status: ${res.status}`);
      }
    }
    
    return res.json();
  } catch (error) {
    console.error('API error in saveSurvey:', error);
    throw error; // Re-throw for component handling
  }
}

export async function getSurvey(profileId) {
  const res = await fetch(`${BASE_URL}/api/survey/${profileId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Survey not found');
  return res.json();
}

export async function getMatchesFromSurvey(surveyData) {
  try {
    // Validate survey data
    if (!surveyData) {
      throw new Error('Survey data is required to find matches');
    }
    
    // Log the request for debugging
    console.log('Requesting matches with survey data:', surveyData);
    
    const res = await fetch(`${BASE_URL}/api/survey/match`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(surveyData),
    });
    
    if (!res.ok) {
      // Try to get more detailed error message from response
      try {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to get matches with status: ${res.status}`);
      } catch (parseError) {
        // If we couldn't parse the error response
        throw new Error(`Failed to get matches with status: ${res.status}`);
      }
    }
    
    const matchesData = await res.json();
    console.log('Received matches:', matchesData);
    return matchesData;
  } catch (error) {
    console.error('Error in getMatchesFromSurvey:', error);
    throw error; // Re-throw for component handling
  }
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
  if (res.status === 204) return []; // No Content
  if (!res.ok) throw new Error('Failed to fetch user projects');
  const text = await res.text();
  if (!text) return [];
  return JSON.parse(text);
}

export async function getPendingApplicants(projectId) {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}/applicants`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch pending applicants');
  return res.json();
}

export async function acceptApplicant(projectId, userId) {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}/applicants/${userId}/accept`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to accept applicant');
  return res.text();
}

export async function rejectApplicant(projectId, userId) {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}/applicants/${userId}/reject`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to reject applicant');
  return res.text();
}

export async function getProjectTeam(projectId) {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}/team`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch project team');
  return res.json();
}

export async function makeLeader(projectId, userId) {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}/team/${userId}/make-leader`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to make leader');
  return res.text();
}

export async function kickMember(projectId, userId) {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}/team/${userId}/kick`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to kick member');
  return res.text();
}

// Add this function to fetch a project by ID
export async function getProjectById(projectId) {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
}

// Personality Quiz API functions
export async function initializeQuiz() {
  const res = await fetch(`${BASE_URL}/api/personality-quiz/initialize`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to initialize quiz');
  return res.text();
}

export async function getQuizQuestions() {
  const res = await fetch(`${BASE_URL}/api/personality-quiz/questions`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch quiz questions');
  return res.json();
}

export async function submitQuizAnswers(userId, answers) {
  try {
    // Input validation
    if (!userId) {
      throw new Error('User ID is required for quiz submission');
    }
    if (!answers || Object.keys(answers).length === 0) {
      throw new Error('No answers provided for quiz submission');
    }
    
    console.log('Submitting quiz answers:', {userId, answerCount: Object.keys(answers).length});
    
    const res = await fetch(`${BASE_URL}/api/personality-quiz/submit`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        userId: userId,
        answers: answers
      }),
    });
    
    if (!res.ok) {
      // Try to get more detailed error message from response
      const errorText = await res.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || `Failed to submit quiz answers with status: ${res.status}`);
      } catch (parseError) {
        // If we couldn't parse the error response
        throw new Error(`Failed to submit quiz answers with status: ${res.status}. Response: ${errorText.substring(0, 100)}`);
      }
    }
      // The response should be a plain text personality type
    const result = await res.text();
    console.log('Quiz submission result:', result);
    
    // Ensure we're returning a valid string value
    return result && result.trim().length > 0 ? result.trim() : "Unknown";
  } catch (error) {
    console.error('API error in submitQuizAnswers:', error);
    throw error; // Re-throw for component handling
  }
}

// Sent Requests API
export async function sendRequest(senderId, receiverName, matchScore) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/api/requests/send?senderId=${senderId}&receiverName=${encodeURIComponent(receiverName)}&matchScore=${matchScore}`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to send request');
  return res.json();
}

export async function getSentRequestsDTO(senderId) {
  const res = await fetch(`${BASE_URL}/api/requests/sent-dto/${senderId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch sent requests');
  return res.json();
}

export async function cancelRequest(requestId, senderId) {
  const res = await fetch(`${BASE_URL}/api/requests/cancel/${requestId}?senderId=${senderId}`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to cancel request');
  return res.text();
}
