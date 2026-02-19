import sys
sys.path.insert(0, '.')
from src.calculator import add, subtract, multiply, divide, square_root

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0

def test_subtract():
    assert subtract(10, 4) == 6

def test_multiply():
    assert multiply(3, 4) == 12

def test_divide():
    assert divide(10, 2) == 5.0

def test_square_root():
    assert square_root(9) == 3.0
    assert square_root(0) == 0.0
