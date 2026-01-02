-- AgriBot Database Schema
-- This script creates the necessary tables for the AgriBot application

-- Create database (uncomment if needed)
-- CREATE DATABASE agribot_db;
-- USE agribot_db;

-- Users table to store farmer information
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255),
    farm_size DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Soil data table to store soil test results
CREATE TABLE IF NOT EXISTS soil_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    field_name VARCHAR(255),
    nitrogen DECIMAL(8,2),
    phosphorus DECIMAL(8,2),
    potassium DECIMAL(8,2),
    ph_level DECIMAL(4,2),
    organic_matter DECIMAL(5,2),
    moisture_content DECIMAL(5,2),
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    rainfall DECIMAL(8,2),
    test_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Crop recommendations table
CREATE TABLE IF NOT EXISTS crop_recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    soil_data_id INT,
    recommended_crop VARCHAR(255),
    confidence_score DECIMAL(5,2),
    expected_yield VARCHAR(255),
    growth_period VARCHAR(255),
    recommendation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (soil_data_id) REFERENCES soil_data(id) ON DELETE CASCADE
);

-- Disease predictions table
CREATE TABLE IF NOT EXISTS disease_predictions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    image_path VARCHAR(500),
    predicted_disease VARCHAR(255),
    confidence_score DECIMAL(5,2),
    severity_level ENUM('Low', 'Medium', 'High'),
    crop_type VARCHAR(255),
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_id VARCHAR(255),
    message_type ENUM('user', 'assistant'),
    message_content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Farming activities log
CREATE TABLE IF NOT EXISTS farming_activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    activity_type ENUM('planting', 'harvesting', 'fertilizing', 'irrigation', 'pest_control', 'other'),
    crop_name VARCHAR(255),
    field_name VARCHAR(255),
    activity_description TEXT,
    activity_date DATE,
    cost DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Weather data table
CREATE TABLE IF NOT EXISTS weather_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    location VARCHAR(255),
    date DATE,
    temperature_min DECIMAL(5,2),
    temperature_max DECIMAL(5,2),
    humidity DECIMAL(5,2),
    rainfall DECIMAL(8,2),
    wind_speed DECIMAL(5,2),
    weather_condition VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crop information master table
CREATE TABLE IF NOT EXISTS crop_master (
    id INT PRIMARY KEY AUTO_INCREMENT,
    crop_name VARCHAR(255) UNIQUE NOT NULL,
    scientific_name VARCHAR(255),
    crop_type ENUM('cereal', 'pulse', 'oilseed', 'fiber', 'sugar', 'spice', 'fruit', 'vegetable', 'other'),
    growing_season ENUM('kharif', 'rabi', 'zaid', 'perennial'),
    min_temperature DECIMAL(5,2),
    max_temperature DECIMAL(5,2),
    min_rainfall DECIMAL(8,2),
    max_rainfall DECIMAL(8,2),
    soil_ph_min DECIMAL(4,2),
    soil_ph_max DECIMAL(4,2),
    growth_period_days INT,
    water_requirement ENUM('low', 'medium', 'high'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disease information master table
CREATE TABLE IF NOT EXISTS disease_master (
    id INT PRIMARY KEY AUTO_INCREMENT,
    disease_name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255),
    affected_crops TEXT, -- JSON array of crop names
    disease_type ENUM('fungal', 'bacterial', 'viral', 'pest', 'nutritional', 'other'),
    symptoms TEXT,
    causes TEXT,
    treatment TEXT,
    prevention TEXT,
    severity_factors TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fertilizer recommendations table
CREATE TABLE IF NOT EXISTS fertilizer_recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    crop_name VARCHAR(255),
    soil_data_id INT,
    fertilizer_type VARCHAR(255),
    quantity_per_acre DECIMAL(8,2),
    application_method VARCHAR(255),
    application_timing VARCHAR(255),
    cost_estimate DECIMAL(10,2),
    recommendation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (soil_data_id) REFERENCES soil_data(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_soil_data_user_id ON soil_data(user_id);
CREATE INDEX idx_crop_recommendations_user_id ON crop_recommendations(user_id);
CREATE INDEX idx_disease_predictions_user_id ON disease_predictions(user_id);
CREATE INDEX idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX idx_chat_conversations_session ON chat_conversations(session_id);
CREATE INDEX idx_farming_activities_user_id ON farming_activities(user_id);
CREATE INDEX idx_weather_data_location_date ON weather_data(location, date);

-- Insert sample data
INSERT INTO crop_master (crop_name, scientific_name, crop_type, growing_season, min_temperature, max_temperature, min_rainfall, max_rainfall, soil_ph_min, soil_ph_max, growth_period_days, water_requirement) VALUES
('Rice', 'Oryza sativa', 'cereal', 'kharif', 20, 35, 150, 300, 5.5, 7.0, 120, 'high'),
('Wheat', 'Triticum aestivum', 'cereal', 'rabi', 15, 25, 75, 150, 6.0, 7.5, 120, 'medium'),
('Maize', 'Zea mays', 'cereal', 'kharif', 18, 32, 60, 120, 5.8, 7.8, 90, 'medium'),
('Cotton', 'Gossypium hirsutum', 'fiber', 'kharif', 21, 35, 50, 100, 5.8, 8.0, 180, 'medium'),
('Sugarcane', 'Saccharum officinarum', 'sugar', 'perennial', 20, 35, 75, 150, 6.0, 7.5, 365, 'high'),
('Soybean', 'Glycine max', 'oilseed', 'kharif', 20, 30, 45, 100, 6.0, 7.0, 100, 'medium'),
('Chickpea', 'Cicer arietinum', 'pulse', 'rabi', 15, 25, 30, 60, 6.2, 7.8, 120, 'low'),
('Lentil', 'Lens culinaris', 'pulse', 'rabi', 15, 25, 25, 50, 6.0, 7.5, 110, 'low');

INSERT INTO disease_master (disease_name, scientific_name, affected_crops, disease_type, symptoms, causes, treatment, prevention) VALUES
('Leaf Blight', 'Helminthosporium oryzae', '["rice", "wheat", "maize"]', 'fungal', 'Brown spots on leaves, lesions with dark borders, yellowing', 'High humidity, poor air circulation', 'Copper-based fungicide, remove infected debris', 'Use resistant varieties, proper spacing'),
('Powdery Mildew', 'Erysiphe graminis', '["wheat", "barley", "pea"]', 'fungal', 'White powdery coating on leaves, stunted growth', 'High humidity, moderate temperature', 'Sulfur-based fungicide, improve ventilation', 'Avoid overcrowding, water at soil level'),
('Bacterial Spot', 'Xanthomonas campestris', '["tomato", "pepper", "cotton"]', 'bacterial', 'Dark spots with yellow halos, fruit lesions', 'Warm humid conditions, water splash', 'Copper bactericide, avoid overhead irrigation', 'Use certified seeds, crop rotation'),
('Rust', 'Puccinia graminis', '["wheat", "barley", "oats"]', 'fungal', 'Orange-red pustules on leaves and stems', 'Moderate temperature, high humidity', 'Fungicide application, resistant varieties', 'Early planting, balanced nutrition');

COMMIT;

SELECT 'Database schema created successfully!' as message;
