# CapstoneConnect Testing Guide

This guide outlines the steps to test the critical flow for completing and submitting the survey and personality quiz in the CapstoneConnect application.

## Prerequisites

1. Ensure all three services are running:
   - Backend Spring Boot service
   - Frontend React application
   - Match_connect Python service

## Test Scripts

Two test scripts are included to help with testing:
- `testFlow.js` - A simulation of the survey flow with expected HTTP requests
- `test_match_service.py` - A Python script to directly test the matching service

## Manual Testing Steps

### 1. Start All Services

**Backend (Spring Boot):**
```
cd Backend_Capstone1
./mvnw spring-boot:run
```

**Frontend (React):**
```
cd Frontend_Capstone1/capstoneconnect
npm run dev
```

**Match Service (Python):**
```
cd Match_connect
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload
```

### 2. Test the Python Matching Service Independently

Run the test script:
```
python test_match_service.py
```

This script tests:
- Adding a profile with a valid personality
- Adding a profile with an empty personality (should use default)
- Matching functionality

### 3. Full End-to-End Flow Testing

1. **Login to the Application**
   - Go to http://localhost:5173/
   - Login with a test account

2. **Complete the Survey**
   - Step 1: Select a preferred role
   - Step 2: Select technical skills
   - Step 3: Select project interests

3. **Complete the Personality Quiz**
   - Answer all questions in the personality quiz
   - Verify the personality type result is displayed
   - Click "Continue" to submit the full survey

4. **Check Backend Logs**
   - Watch the Spring Boot logs for any errors
   - Verify the personality type is properly included in the survey
   - Confirm the data is successfully sent to the matching service

5. **Check Matching Service Logs**
   - Watch the FastAPI logs for incoming requests
   - Verify that the personality data is correctly processed

6. **Verify Successful Navigation**
   - After submission, you should be redirected to the home page

## Common Issues and Fixes

1. **Empty Personality**
   - If personality is empty, the application now defaults to "Unknown"
   - Check logs for warnings about empty personality values

2. **Connection Issues**
   - If the matching service is not running, detailed error messages should appear
   - Verify all services are running on the expected ports

3. **Data Format Issues**
   - Ensure the survey data structure matches the expected format
   - Check browser console for any warnings/errors in the data

## Reporting Issues

If you encounter any issues during testing:
1. Note the step where the issue occurred
2. Capture any error messages from the console or logs
3. Document the expected vs. actual behavior
