# CapstoneConnect

CapstoneConnect is an application designed to help students connect with teammates for capstone projects based on their skills, preferences, and personality traits.

## Components

The application consists of three main parts:
1. **Backend_Capstone1** - Java Spring Boot backend API
2. **Frontend_Capstone1** - React-based frontend application
3. **Match_connect** - Python FastAPI service for personality and skills matching

## Recent Updates (May 23, 2025)

### Fixed Survey and Personality Quiz Flow
- Enhanced error handling for the personality quiz submission
- Improved data validation throughout the application flow
- Added safeguards to prevent null or empty personality values
- Strengthened error logging and debugging information
- Added test scripts to validate the survey and personality quiz flow

### New Test Scripts
- Added `testFlow.js` to simulate and validate the survey flow
- Added `test_match_service.py` to test the matching service directly
- Created comprehensive testing guide in `TESTING.md`

## Getting Started

See the `TESTING.md` file for detailed instructions on how to start all services and test the application.