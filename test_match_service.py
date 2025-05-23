# test_match_service.py
import requests
import json
import sys

# Configuration
MATCH_SERVICE_URL = "http://localhost:8000"  # Update this if your service runs on a different port

def test_add_profile():
    """Test adding a profile to the matching service"""
    url = f"{MATCH_SERVICE_URL}/add_profile"
    
    # Test data with valid personality
    data = {
        "email": "test@example.com",
        "name": "Test User",
        "technicalSkills": ["JavaScript", "Python"],
        "preferredRoles": ["Developer"],
        "projectInterests": ["Web Development"],
        "personality": "Balanced Team Player"
    }
    
    print(f"Testing add_profile with personality: {data['personality']}")
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        print("✅ Test successful\n")
    except Exception as e:
        print(f"❌ Error: {str(e)}\n")

def test_add_profile_empty_personality():
    """Test adding a profile with empty personality"""
    url = f"{MATCH_SERVICE_URL}/add_profile"
    
    # Test data with empty personality
    data = {
        "email": "test2@example.com",
        "name": "Test User 2",
        "technicalSkills": ["JavaScript", "Python"],
        "preferredRoles": ["Developer"],
        "projectInterests": ["Web Development"],
        "personality": ""  # Empty personality
    }
    
    print(f"Testing add_profile with empty personality")
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        print("✅ Test successful - should use default 'Unknown'\n")
    except Exception as e:
        print(f"❌ Error: {str(e)}\n")

def test_match():
    """Test the match functionality"""
    url = f"{MATCH_SERVICE_URL}/match"
    
    # Test data
    data = {
        "email": "testmatch@example.com",
        "technicalSkills": ["JavaScript", "Python"],
        "preferredRoles": ["Developer"],
        "projectInterests": ["Web Development"],
        "personality": "Balanced Team Player"
    }
    
    print(f"Testing match with personality: {data['personality']}")
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Show only the first part of the response
        print("✅ Test successful\n")
    except Exception as e:
        print(f"❌ Error: {str(e)}\n")

def check_service_status():
    """Check if the matching service is running"""
    url = f"{MATCH_SERVICE_URL}/status"
    
    print("Checking if the matching service is running...")
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("===== TESTING MATCH SERVICE =====")
    
    if not check_service_status():
        print("\n❌ Matching service is not running. Please start it before running tests.")
        sys.exit(1)
    
    print("\n===== RUNNING TESTS =====")
    test_add_profile()
    test_add_profile_empty_personality()
    test_match()
    
    print("===== ALL TESTS COMPLETED =====")
