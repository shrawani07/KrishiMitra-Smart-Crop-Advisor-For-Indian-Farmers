"""
Process the Kaggle Crop Recommendation Dataset
This script loads and analyzes the crop recommendation dataset for AgriBot
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json
import matplotlib.pyplot as plt
import seaborn as sns

def load_and_analyze_dataset():
    """
    Load and analyze the crop recommendation dataset
    """
    print("Loading Crop Recommendation Dataset...")
    
    # Load the dataset
    df = pd.read_csv('data/crop_recommendation.csv')
    
    print(f"Dataset shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    print(f"\nFirst few rows:")
    print(df.head())
    
    print(f"\nDataset info:")
    print(df.info())
    
    print(f"\nUnique crops in dataset:")
    crops = df['label'].unique()
    print(f"Total crops: {len(crops)}")
    print(crops)
    
    print(f"\nCrop distribution:")
    crop_counts = df['label'].value_counts()
    print(crop_counts)
    
    # Statistical summary
    print(f"\nStatistical Summary:")
    print(df.describe())
    
    return df

def create_crop_profiles(df):
    """
    Create crop profiles with optimal growing conditions
    """
    print("\nCreating crop profiles...")
    
    crop_profiles = {}
    
    for crop in df['label'].unique():
        crop_data = df[df['label'] == crop]
        
        profile = {
            'name': crop,
            'optimal_conditions': {
                'nitrogen': {
                    'min': float(crop_data['N'].min()),
                    'max': float(crop_data['N'].max()),
                    'avg': float(crop_data['N'].mean()),
                    'std': float(crop_data['N'].std())
                },
                'phosphorus': {
                    'min': float(crop_data['P'].min()),
                    'max': float(crop_data['P'].max()),
                    'avg': float(crop_data['P'].mean()),
                    'std': float(crop_data['P'].std())
                },
                'potassium': {
                    'min': float(crop_data['K'].min()),
                    'max': float(crop_data['K'].max()),
                    'avg': float(crop_data['K'].mean()),
                    'std': float(crop_data['K'].std())
                },
                'temperature': {
                    'min': float(crop_data['temperature'].min()),
                    'max': float(crop_data['temperature'].max()),
                    'avg': float(crop_data['temperature'].mean()),
                    'std': float(crop_data['temperature'].std())
                },
                'humidity': {
                    'min': float(crop_data['humidity'].min()),
                    'max': float(crop_data['humidity'].max()),
                    'avg': float(crop_data['humidity'].mean()),
                    'std': float(crop_data['humidity'].std())
                },
                'ph': {
                    'min': float(crop_data['ph'].min()),
                    'max': float(crop_data['ph'].max()),
                    'avg': float(crop_data['ph'].mean()),
                    'std': float(crop_data['ph'].std())
                },
                'rainfall': {
                    'min': float(crop_data['rainfall'].min()),
                    'max': float(crop_data['rainfall'].max()),
                    'avg': float(crop_data['rainfall'].mean()),
                    'std': float(crop_data['rainfall'].std())
                }
            },
            'sample_count': len(crop_data)
        }
        
        crop_profiles[crop] = profile
    
    # Save crop profiles
    with open('data/crop_profiles.json', 'w') as f:
        json.dump(crop_profiles, f, indent=2)
    
    print(f"Crop profiles saved to data/crop_profiles.json")
    return crop_profiles

def train_crop_model(df):
    """
    Train a Random Forest model for crop recommendation
    """
    print("\nTraining Crop Recommendation Model...")
    
    # Prepare features and target
    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']
    
    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    # Train Random Forest model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        min_samples_split=5,
        min_samples_leaf=2
    )
    
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.4f}")
    
    # Print classification report
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, 
                              target_names=label_encoder.classes_))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nFeature Importance:")
    print(feature_importance)
    
    # Plot feature importance
    plt.figure(figsize=(10, 6))
    sns.barplot(data=feature_importance, x='importance', y='feature')
    plt.title('Feature Importance for Crop Recommendation')
    plt.xlabel('Importance')
    plt.tight_layout()
    plt.savefig('data/feature_importance.png')
    plt.show()
    
    return model, label_encoder, accuracy, feature_importance

def save_model_and_metadata(model, label_encoder, accuracy, feature_importance):
    """
    Save the trained model and metadata
    """
    print("\nSaving model and metadata...")
    
    # Save model
    joblib.dump(model, 'data/crop_recommendation_model.pkl')
    joblib.dump(label_encoder, 'data/crop_label_encoder.pkl')
    
    # Save model metadata
    metadata = {
        'model_type': 'RandomForestClassifier',
        'accuracy': float(accuracy),
        'features': ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'],
        'target_classes': label_encoder.classes_.tolist(),
        'feature_importance': feature_importance.to_dict('records'),
        'training_date': pd.Timestamp.now().isoformat(),
        'model_params': {
            'n_estimators': 100,
            'max_depth': 10,
            'random_state': 42,
            'min_samples_split': 5,
            'min_samples_leaf': 2
        }
    }
    
    with open('data/crop_model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"Model saved successfully!")
    print(f"Files created:")
    print("- data/crop_recommendation_model.pkl")
    print("- data/crop_label_encoder.pkl") 
    print("- data/crop_model_metadata.json")
    print("- data/feature_importance.png")

def test_model_prediction(model, label_encoder):
    """
    Test the model with sample predictions
    """
    print("\n" + "="*50)
    print("Testing Model Predictions")
    print("="*50)
    
    # Test cases with different soil conditions
    test_cases = [
        {
            'name': 'Rice-suitable conditions',
            'params': [90, 42, 43, 20.8, 82, 6.5, 202.9]
        },
        {
            'name': 'Wheat-suitable conditions', 
            'params': [50, 30, 40, 15.5, 65, 7.0, 85.2]
        },
        {
            'name': 'Maize-suitable conditions',
            'params': [75, 45, 50, 25.2, 70, 6.8, 110.5]
        },
        {
            'name': 'Cotton-suitable conditions',
            'params': [60, 35, 55, 28.5, 60, 7.2, 95.3]
        }
    ]
    
    for test_case in test_cases:
        params = np.array(test_case['params']).reshape(1, -1)
        prediction = model.predict(params)[0]
        prediction_proba = model.predict_proba(params)[0]
        
        crop_name = label_encoder.inverse_transform([prediction])[0]
        confidence = max(prediction_proba) * 100
        
        print(f"\n{test_case['name']}:")
        print(f"Input: N={test_case['params'][0]}, P={test_case['params'][1]}, K={test_case['params'][2]}")
        print(f"       Temp={test_case['params'][3]}°C, Humidity={test_case['params'][4]}%")
        print(f"       pH={test_case['params'][5]}, Rainfall={test_case['params'][6]}mm")
        print(f"Predicted Crop: {crop_name}")
        print(f"Confidence: {confidence:.2f}%")

def create_crop_info_database():
    """
    Create additional crop information database
    """
    print("\nCreating crop information database...")
    
    crop_info = {
        'rice': {
            'scientific_name': 'Oryza sativa',
            'type': 'cereal',
            'season': 'kharif',
            'growth_period': '120-150 days',
            'expected_yield': '4-6 tons per hectare',
            'water_requirement': 'high',
            'tips': [
                'Maintain water levels at 2-5 cm during vegetative stage',
                'Apply nitrogen in split doses',
                'Monitor for blast disease during flowering',
                'Harvest when 80% of grains are golden yellow'
            ]
        },
        'wheat': {
            'scientific_name': 'Triticum aestivum',
            'type': 'cereal',
            'season': 'rabi',
            'growth_period': '120-140 days',
            'expected_yield': '3-5 tons per hectare',
            'water_requirement': 'medium',
            'tips': [
                'Sow during optimal temperature window (15-25°C)',
                'Apply phosphorus at sowing time',
                'Monitor for rust diseases',
                'Harvest when moisture content is 12-14%'
            ]
        },
        'maize': {
            'scientific_name': 'Zea mays',
            'type': 'cereal',
            'season': 'kharif',
            'growth_period': '90-120 days',
            'expected_yield': '5-8 tons per hectare',
            'water_requirement': 'medium',
            'tips': [
                'Apply nitrogen as top dressing during knee-high stage',
                'Ensure good drainage',
                'Monitor for stem borer and fall armyworm',
                'Harvest when kernels reach physiological maturity'
            ]
        },
        'cotton': {
            'scientific_name': 'Gossypium hirsutum',
            'type': 'fiber',
            'season': 'kharif',
            'growth_period': '180-200 days',
            'expected_yield': '15-20 quintals per hectare',
            'water_requirement': 'medium',
            'tips': [
                'Maintain soil moisture during flowering',
                'Apply potassium during boll development',
                'Regular monitoring for bollworm',
                'Pick cotton when bolls are fully opened'
            ]
        },
        'sugarcane': {
            'scientific_name': 'Saccharum officinarum',
            'type': 'sugar',
            'season': 'perennial',
            'growth_period': '12-18 months',
            'expected_yield': '80-100 tons per hectare',
            'water_requirement': 'high',
            'tips': [
                'Plant healthy seed cane',
                'Apply organic manure before planting',
                'Regular earthing up operations',
                'Harvest at proper maturity for maximum sugar content'
            ]
        }
    }
    
    # Add more crops based on the dataset
    additional_crops = [
        'chickpea', 'kidneybeans', 'pigeonpeas', 'mothbeans', 'mungbean', 
        'blackgram', 'lentil', 'pomegranate', 'banana', 'mango', 'grapes', 
        'watermelon', 'muskmelon', 'apple', 'orange', 'papaya', 'coconut', 
        'jute', 'coffee'
    ]
    
    for crop in additional_crops:
        if crop not in crop_info:
            crop_info[crop] = {
                'scientific_name': f'{crop.capitalize()} species',
                'type': 'various',
                'season': 'varies',
                'growth_period': 'varies',
                'expected_yield': 'varies by variety',
                'water_requirement': 'medium',
                'tips': [
                    f'Follow recommended practices for {crop}',
                    'Consult local agricultural extension officers',
                    'Use quality seeds or planting material',
                    'Monitor for pests and diseases regularly'
                ]
            }
    
    # Save crop information
    with open('data/crop_information.json', 'w') as f:
        json.dump(crop_info, f, indent=2)
    
    print(f"Crop information database saved to data/crop_information.json")
    return crop_info

if __name__ == "__main__":
    print("Processing Kaggle Crop Recommendation Dataset")
    print("=" * 50)
    
    # Create data directory
    import os
    os.makedirs('data', exist_ok=True)
    
    # Load and analyze dataset
    df = load_and_analyze_dataset()
    
    # Create crop profiles
    crop_profiles = create_crop_profiles(df)
    
    # Train model
    model, label_encoder, accuracy, feature_importance = train_crop_model(df)
    
    # Save model and metadata
    save_model_and_metadata(model, label_encoder, accuracy, feature_importance)
    
    # Test model predictions
    test_model_prediction(model, label_encoder)
    
    # Create crop information database
    crop_info = create_crop_info_database()
    
    print("\n" + "=" * 50)
    print("Dataset processing completed successfully!")
    print("=" * 50)
    
    print(f"\nFiles created:")
    print("- data/crop_profiles.json")
    print("- data/crop_recommendation_model.pkl")
    print("- data/crop_label_encoder.pkl")
    print("- data/crop_model_metadata.json")
    print("- data/crop_information.json")
    print("- data/feature_importance.png")
    
    print(f"\nModel Performance:")
    print(f"- Accuracy: {accuracy:.4f}")
    print(f"- Total crops supported: {len(label_encoder.classes_)}")
    print(f"- Dataset size: {len(df)} samples")
    
    print(f"\nSupported crops:")
    for i, crop in enumerate(label_encoder.classes_):
        print(f"{i+1:2d}. {crop}")
