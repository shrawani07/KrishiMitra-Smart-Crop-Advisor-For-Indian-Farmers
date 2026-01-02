"""
XGBoost Crop Recommendation Model Training Script
This script demonstrates how to train an XGBoost model for crop recommendation
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import xgboost as xgb
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

def load_and_prepare_data():
    """
    Load and prepare the crop recommendation dataset
    Expected columns: N, P, K, temperature, humidity, ph, rainfall, label
    """
    # Sample data structure - replace with your actual dataset
    np.random.seed(42)
    n_samples = 2200
    
    # Generate synthetic data similar to crop recommendation dataset
    data = {
        'N': np.random.normal(50, 20, n_samples),
        'P': np.random.normal(53, 15, n_samples),
        'K': np.random.normal(48, 18, n_samples),
        'temperature': np.random.normal(25, 5, n_samples),
        'humidity': np.random.normal(71, 15, n_samples),
        'ph': np.random.normal(6.5, 0.8, n_samples),
        'rainfall': np.random.normal(103, 50, n_samples)
    }
    
    # Create labels based on conditions (simplified logic)
    labels = []
    for i in range(n_samples):
        if data['N'][i] > 80 and data['rainfall'][i] > 150:
            labels.append('rice')
        elif data['temperature'][i] < 25 and data['rainfall'][i] < 100:
            labels.append('wheat')
        elif data['K'][i] > 60 and data['temperature'][i] > 25:
            labels.append('maize')
        elif data['ph'][i] > 6.5:
            labels.append('cotton')
        elif data['P'][i] > 60:
            labels.append('sugarcane')
        elif data['humidity'][i] > 80:
            labels.append('jute')
        elif data['N'][i] < 30:
            labels.append('coconut')
        elif data['temperature'][i] > 30:
            labels.append('papaya')
        elif data['rainfall'][i] > 200:
            labels.append('banana')
        else:
            labels.append(np.random.choice(['kidneybeans', 'blackgram', 'mungbean', 
                                         'mothbeans', 'pigeonpeas', 'chickpea', 
                                         'lentil', 'pomegranate', 'grapes', 'apple']))
    
    data['label'] = labels
    df = pd.DataFrame(data)
    
    return df

def train_xgboost_model(df):
    """
    Train XGBoost model for crop recommendation
    """
    print("Training XGBoost Crop Recommendation Model...")
    
    # Prepare features and target
    X = df.drop('label', axis=1)
    y = df['label']
    
    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    # Create and train XGBoost model
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
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
    plt.show()
    
    return model, label_encoder, accuracy

def save_model(model, label_encoder, accuracy):
    """
    Save the trained model and label encoder
    """
    # Save model
    joblib.dump(model, 'crop_recommendation_xgboost.pkl')
    joblib.dump(label_encoder, 'crop_label_encoder.pkl')
    
    # Save model metadata
    metadata = {
        'model_type': 'XGBoost',
        'accuracy': accuracy,
        'features': ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'],
        'target_classes': label_encoder.classes_.tolist()
    }
    
    import json
    with open('crop_model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\nModel saved successfully!")
    print(f"Files created:")
    print("- crop_recommendation_xgboost.pkl")
    print("- crop_label_encoder.pkl") 
    print("- crop_model_metadata.json")

def predict_crop(model, label_encoder, soil_params):
    """
    Make crop prediction for given soil parameters
    """
    # Convert input to DataFrame
    input_df = pd.DataFrame([soil_params])
    
    # Make prediction
    prediction = model.predict(input_df)[0]
    prediction_proba = model.predict_proba(input_df)[0]
    
    # Get crop name
    crop_name = label_encoder.inverse_transform([prediction])[0]
    confidence = max(prediction_proba) * 100
    
    return crop_name, confidence

if __name__ == "__main__":
    # Load and prepare data
    print("Loading and preparing data...")
    df = load_and_prepare_data()
    print(f"Dataset shape: {df.shape}")
    print(f"Crops in dataset: {df['label'].unique()}")
    
    # Train model
    model, label_encoder, accuracy = train_xgboost_model(df)
    
    # Save model
    save_model(model, label_encoder, accuracy)
    
    # Test prediction
    print("\n" + "="*50)
    print("Testing Model Prediction")
    print("="*50)
    
    test_params = {
        'N': 90,
        'P': 42,
        'K': 43,
        'temperature': 20.8,
        'humidity': 82,
        'ph': 6.5,
        'rainfall': 202.9
    }
    
    crop, confidence = predict_crop(model, label_encoder, test_params)
    print(f"Recommended Crop: {crop}")
    print(f"Confidence: {confidence:.2f}%")
    print(f"Input Parameters: {test_params}")
