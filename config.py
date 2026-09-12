"""Flask configuration"""

import os
from datetime import timedelta


class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    JSON_SORT_KEYS = False
    JSONIFY_PRETTYPRINT_REGULAR = True
    
    # Caching
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = 600
    
    # API
    API_KEY = os.getenv('OPENWEATHER_API_KEY')
    API_TIMEOUT = 10
    
    # Features
    ENABLE_GEOLOCATION = os.getenv('ENABLE_GEOLOCATION', 'True') == 'True'
    ENABLE_CACHING = os.getenv('ENABLE_CACHING', 'True') == 'True'


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False


class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    CACHE_TYPE = 'null'


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
