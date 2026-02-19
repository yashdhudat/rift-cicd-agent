import sys
sys.path.insert(0, '.')
from src.user_manager import create_user, get_user_email

def test_create_user():
    user = create_user("Alice", 25, "alice@example.com")
    assert user["name"] == "Alice"
    assert user["age"] == 25
    assert user["email"] == "alice@example.com"

def test_invalid_age():
    user = create_user("Bob", -1, "bob@example.com")
    assert user is None

def test_get_email():
    user = {"name": "Alice", "age": 25, "email": "alice@example.com"}
    assert get_user_email(user) == "alice@example.com"

def test_get_email_none():
    assert get_user_email(None) is None 

def test_create_user_email():
    user = create_user("Charlie", 30, "charlie@example.com")
    assert user["email"] == "charlie@example.com"