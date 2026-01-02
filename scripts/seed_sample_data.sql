-- Seed sample data for AgriBot application
-- This script inserts sample data for testing and demonstration

-- Insert sample users
INSERT INTO users (name, email, phone, location, farm_size) VALUES
('Rajesh Kumar', 'rajesh.kumar@email.com', '+91-9876543210', 'Punjab, India', 25.5),
('Priya Sharma', 'priya.sharma@email.com', '+91-9876543211', 'Haryana, India', 15.0),
('Amit Patel', 'amit.patel@email.com', '+91-9876543212', 'Gujarat, India', 30.0),
('Sunita Devi', 'sunita.devi@email.com', '+91-9876543213', 'Uttar Pradesh, India', 12.5),
('Ravi Reddy', 'ravi.reddy@email.com', '+91-9876543214', 'Andhra Pradesh, India', 40.0);

-- Insert sample soil data
INSERT INTO soil_data (user_id, field_name, nitrogen, phosphorus, potassium, ph_level, organic_matter, moisture_content, temperature, humidity, rainfall, test_date) VALUES
(1, 'Field A', 85.5, 42.3, 38.7, 6.8, 2.5, 45.2, 28.5, 65.0, 150.5, '2024-01-15'),
(1, 'Field B', 72.1, 38.9, 45.2, 6.2, 2.1, 42.8, 29.2, 68.5, 145.2, '2024-01-15'),
(2, 'Main Field', 90.2, 45.6, 41.3, 7.1, 3.2, 48.5, 26.8, 72.3, 165.8, '2024-01-20'),
(3, 'North Field', 78.9, 35.4, 52.1, 6.5, 2.8, 38.9, 31.2, 58.7, 95.3, '2024-01-18'),
(4, 'Small Plot', 65.3, 28.7, 33.9, 6.9, 1.9, 35.6, 27.9, 75.2, 180.4, '2024-01-22'),
(5, 'East Field', 95.7, 48.2, 46.8, 6.4, 3.5, 52.1, 32.5, 62.8, 125.7, '2024-01-25');

-- Insert sample crop recommendations
INSERT INTO crop_recommendations (user_id, soil_data_id, recommended_crop, confidence_score, expected_yield, growth_period, recommendation_date) VALUES
(1, 1, 'Rice', 92.5, '4-6 tons per hectare', '120-150 days', '2024-01-15 10:30:00'),
(1, 2, 'Wheat', 88.3, '3-5 tons per hectare', '120-140 days', '2024-01-15 10:35:00'),
(2, 3, 'Rice', 94.1, '5-7 tons per hectare', '120-150 days', '2024-01-20 14:20:00'),
(3, 4, 'Cotton', 85.7, '15-20 quintals per hectare', '180-200 days', '2024-01-18 16:45:00'),
(4, 5, 'Maize', 89.2, '5-8 tons per hectare', '90-120 days', '2024-01-22 09:15:00'),
(5, 6, 'Sugarcane', 91.8, '80-100 tons per hectare', '12-18 months', '2024-01-25 11:30:00');

-- Insert sample disease predictions
INSERT INTO disease_predictions (user_id, image_path, predicted_disease, confidence_score, severity_level, crop_type, prediction_date) VALUES
(1, '/uploads/disease_images/leaf_blight_001.jpg', 'Leaf Blight', 94.2, 'High', 'Rice', '2024-01-16 08:45:00'),
(2, '/uploads/disease_images/powdery_mildew_001.jpg', 'Powdery Mildew', 89.7, 'Medium', 'Wheat', '2024-01-21 15:20:00'),
(3, '/uploads/disease_images/bacterial_spot_001.jpg', 'Bacterial Spot', 87.3, 'Medium', 'Cotton', '2024-01-19 12:10:00'),
(4, '/uploads/disease_images/healthy_plant_001.jpg', 'Healthy Plant', 96.1, 'Low', 'Maize', '2024-01-23 10:30:00'),
(5, '/uploads/disease_images/rust_001.jpg', 'Rust', 91.5, 'High', 'Sugarcane', '2024-01-26 14:15:00');

-- Insert sample chat conversations
INSERT INTO chat_conversations (user_id, session_id, message_type, message_content, timestamp) VALUES
(1, 'session_001', 'user', 'What is the best time to plant rice?', '2024-01-16 09:00:00'),
(1, 'session_001', 'assistant', 'The best time to plant rice depends on your region and the type of rice. For Kharif rice, planting is typically done from June to July during the monsoon season. For Rabi rice in some regions, planting can be done from November to December. In your area (Punjab), I recommend planting Kharif rice in mid-June to early July when monsoon rains begin.', '2024-01-16 09:00:15'),
(2, 'session_002', 'user', 'My wheat crop has yellow spots on leaves. What could be the problem?', '2024-01-21 16:30:00'),
(2, 'session_002', 'assistant', 'Yellow spots on wheat leaves could indicate several issues: 1) Leaf rust (orange-yellow pustules), 2) Stripe rust (yellow stripes), 3) Nutrient deficiency (nitrogen or iron), or 4) Water stress. I recommend uploading a clear image of the affected leaves using our disease prediction feature for accurate diagnosis and treatment recommendations.', '2024-01-21 16:30:20'),
(3, 'session_003', 'user', 'How much fertilizer should I apply for cotton crop?', '2024-01-19 13:45:00'),
(3, 'session_003', 'assistant', 'For cotton, the general fertilizer recommendation is: NPK 120:60:60 kg per hectare. Apply 25% nitrogen and full phosphorus and potassium at sowing. Apply remaining nitrogen in 3 splits: 25% at square formation, 25% at flowering, and 25% at boll development. However, I recommend getting a soil test done for precise fertilizer recommendations based on your soil conditions.', '2024-01-19 13:45:25');

-- Insert sample farming activities
INSERT INTO farming_activities (user_id, activity_type, crop_name, field_name, activity_description, activity_date, cost, notes) VALUES
(1, 'planting', 'Rice', 'Field A', 'Transplanted rice seedlings', '2024-06-15', 5000.00, 'Used improved variety PR-126'),
(1, 'fertilizing', 'Rice', 'Field A', 'Applied basal fertilizer NPK', '2024-06-20', 3500.00, 'Applied 120:60:60 kg/ha'),
(2, 'irrigation', 'Wheat', 'Main Field', 'First irrigation after sowing', '2024-11-25', 800.00, 'Crown root irrigation'),
(3, 'pest_control', 'Cotton', 'North Field', 'Sprayed for bollworm control', '2024-08-10', 2200.00, 'Used biological pesticide'),
(4, 'harvesting', 'Maize', 'Small Plot', 'Harvested mature maize crop', '2024-03-15', 4000.00, 'Yield: 6.5 tons/ha'),
(5, 'planting', 'Sugarcane', 'East Field', 'Planted sugarcane sets', '2024-02-20', 8000.00, 'Variety: Co-0238');

-- Insert sample weather data
INSERT INTO weather_data (location, date, temperature_min, temperature_max, humidity, rainfall, wind_speed, weather_condition) VALUES
('Punjab, India', '2024-01-26', 8.5, 22.3, 68.5, 0.0, 12.5, 'Clear'),
('Punjab, India', '2024-01-25', 9.2, 21.8, 72.1, 2.5, 8.3, 'Partly Cloudy'),
('Haryana, India', '2024-01-26', 7.8, 23.1, 65.2, 0.0, 15.2, 'Clear'),
('Gujarat, India', '2024-01-26', 12.5, 28.7, 58.9, 0.0, 18.7, 'Sunny'),
('Uttar Pradesh, India', '2024-01-26', 6.3, 20.5, 78.3, 1.2, 6.8, 'Foggy'),
('Andhra Pradesh, India', '2024-01-26', 18.2, 32.4, 62.7, 0.0, 22.1, 'Hot');

-- Insert sample fertilizer recommendations
INSERT INTO fertilizer_recommendations (user_id, crop_name, soil_data_id, fertilizer_type, quantity_per_acre, application_method, application_timing, cost_estimate) VALUES
(1, 'Rice', 1, 'NPK 20:10:10', 50.0, 'Broadcasting', 'At transplanting', 2500.00),
(1, 'Rice', 1, 'Urea', 25.0, 'Top dressing', 'Tillering stage', 800.00),
(2, 'Wheat', 3, 'DAP', 40.0, 'Drilling with seed', 'At sowing', 2200.00),
(3, 'Cotton', 4, 'NPK 12:32:16', 60.0, 'Band placement', 'At sowing', 3200.00),
(4, 'Maize', 5, 'NPK 10:26:26', 45.0, 'Broadcasting', 'At sowing', 2800.00),
(5, 'Sugarcane', 6, 'NPK 15:15:15', 80.0, 'Ring method', 'At planting', 4500.00);

COMMIT;

SELECT 'Sample data inserted successfully!' as message;
SELECT 'Total users:', COUNT(*) FROM users;
SELECT 'Total soil tests:', COUNT(*) FROM soil_data;
SELECT 'Total crop recommendations:', COUNT(*) FROM crop_recommendations;
SELECT 'Total disease predictions:', COUNT(*) FROM disease_predictions;
SELECT 'Total chat messages:', COUNT(*) FROM chat_conversations;
SELECT 'Total farming activities:', COUNT(*) FROM farming_activities;
