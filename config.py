import os

class Config:
    SECRET_KEY = os.urandom(24)
    BASIC_AUTH_USERNAME = 'admin'
    BASIC_AUTH_PASSWORD = 'password'  # In a real-world scenario, use a strong, randomly generated password
