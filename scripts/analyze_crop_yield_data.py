"""
Analyze the real crop yield dataset for AgriBot
This script fetches and analyzes the crop yield data from the provided URL
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import requests
from io import StringIO
import json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import warnings
warnings.filterwarnings('ignore')

def fetch_and_load_data():
    """
    Fetch the crop yield data from the provided URL
    """
    print("Fetching crop yield data from URL...")
    
    url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crop_yield-j9pleVehS6SfAHMsn9MTQYpVDACYN1.csv"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Load data into DataFrame
        df = pd.read_csv(StringIO(response.text))
        
        print(f"Data loaded successfully!")
        print(f"Dataset shape: {df.shape}")
        print(f"Columns: {list(df.columns)}")
        
        return df
    
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def analyze_dataset(df):
    """
    Perform comprehensive analysis of the crop yield dataset
    """
    print("\n" + "="*60)
    print("CROP YIELD DATASET ANALYSIS")
    print("="*60)
    
    # Basic info
    print(f"\nDataset Overview:")
    print(f"Shape: {df.shape}")
    print(f"Memory usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
    
    print(f"\nColumn Information:")
    print(df.info())
    
    print(f"\nFirst 5 rows:")
    print(df.head())
    
    print(f"\nData types:")
    print(df.dtypes)
    
    # Check for missing values
    print(f"\nMissing values:")
    missing_values = df.isnull().sum()
    print(missing_values[missing_values > 0])
    
    # Convert data types
    print(f"\nConverting data types...")
    df['Area'] = pd.to_numeric(df['Area'], errors='coerce')
    df['Production'] = pd.to_numeric(df['Production'], errors='coerce')
    df['Annual_Rainfall'] = pd.to_numeric(df['Annual_Rainfall'], errors='coerce')
    df['Fertilizer'] = pd.to_numeric(df['Fertilizer'], errors='coerce')
    df['Pesticide'] = pd.to_numeric(df['Pesticide'], errors='coerce')
    df['Yield'] = pd.to_numeric(df['Yield'], errors='coerce')
    df['Crop_Year'] = pd.to_numeric(df['Crop_Year'], errors='coerce')
    
    # Statistical summary
    print(f"\nStatistical Summary:")
    print(df.describe())
    
    # Unique values analysis
    print(f"\nUnique Values Analysis:")
    print(f"Unique Crops: {df['Crop'].nunique()}")
    print(f"Crops: {sorted(df['Crop'].unique())}")
    print(f"\nUnique States: {df['State'].nunique()}")
    print(f"States: {sorted(df['State'].unique())}")
    print(f"\nUnique Seasons: {df['Season'].nunique()}")
    print(f"Seasons: {sorted(df['Season'].unique())}")
    print(f"\nYear range: {df['Crop_Year'].min()} - {df['Crop_Year'].max()}")
    
    return df

def create_visualizations(df):
    """
    Create visualizations for the crop yield data
    """
    print(f"\nCreating visualizations...")
    
    # Set up the plotting style
    plt.style.use('default')
    sns.set_palette("husl")
    
    # Create figure with subplots
    fig, axes = plt.subplots(2, 3, figsize=(20, 12))
    fig.suptitle('Crop Yield Dataset Analysis', fontsize=16, fontweight='bold')
    
    # 1. Top crops by average yield
    crop_yield = df.groupby('Crop')['Yield'].mean().sort_values(ascending=False).head(10)
    axes[0, 0].bar(range(len(crop_yield)), crop_yield.values)
    axes[0, 0].set_title('Top 10 Crops by Average Yield')
    axes[0, 0].set_xlabel('Crops')
    axes[0, 0].set_ylabel('Average Yield')
    axes[0, 0].set_xticks(range(len(crop_yield)))
    axes[0, 0].set_xticklabels(crop_yield.index, rotation=45, ha='right')
    
    # 2. Yield distribution by season
    df.boxplot(column='Yield', by='Season', ax=axes[0, 1])
    axes[0, 1].set_title('Yield Distribution by Season')
    axes[0, 1].set_xlabel('Season')
    axes[0, 1].set_ylabel('Yield')
    
    # 3. Top states by production
    state_production = df.groupby('State')['Production'].sum().sort_values(ascending=False).head(10)
    axes[0, 2].barh(range(len(state_production)), state_production.values)
    axes[0, 2].set_title('Top 10 States by Total Production')
    axes[0, 2].set_xlabel('Total Production')
    axes[0, 2].set_ylabel('States')
    axes[0, 2].set_yticks(range(len(state_production)))
    axes[0, 2].set_yticklabels(state_production.index)
    
    # 4. Yield vs Rainfall correlation
    axes[1, 0].scatter(df['Annual_Rainfall'], df['Yield'], alpha=0.5)
    axes[1, 0].set_title('Yield vs Annual Rainfall')
    axes[1, 0].set_xlabel('Annual Rainfall (mm)')
    axes[1, 0].set_ylabel('Yield')
    
    # 5. Yield vs Fertilizer correlation
    axes[1, 1].scatter(df['Fertilizer'], df['Yield'], alpha=0.5)
    axes[1, 1].set_title('Yield vs Fertilizer Usage')
    axes[1, 1].set_xlabel('Fertilizer')
    axes[1, 1].set_ylabel('Yield')
    
    # 6. Yield trend over years
    yearly_yield = df.groupby('Crop_Year')['Yield'].mean()
    axes[1, 2].plot(yearly_yield.index, yearly_yield.values, marker='o')
    axes[1, 2].set_title('Average Yield Trend Over Years')
    axes[1, 2].set_xlabel('Year')
    axes[1, 2].set_ylabel('Average Yield')
    
    plt.tight_layout()
    plt.savefig('data/crop_yield_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    print(f"Visualizations saved to data/crop_yield_analysis.png")

def create_crop_profiles(df):
    """
    Create detailed crop profiles from the dataset
    """
    print(f"\nCreating crop profiles...")
    
    crop_profiles = {}
    
    for crop in df['Crop'].unique():
        crop_data = df[df['Crop'] == crop]
        
        # Calculate statistics for each crop
        profile = {
            'name': crop,
            'total_records': len(crop_data),
            'states_grown': sorted(crop_data['State'].unique().tolist()),
            'seasons': sorted(crop_data['Season'].unique().tolist()),
            'year_range': {
                'start': int(crop_data['Crop_Year'].min()),
                'end': int(crop_data['Crop_Year'].max())
            },
            'yield_stats': {
                'mean': float(crop_data['Yield'].mean()),
                'median': float(crop_data['Yield'].median()),
                'std': float(crop_data['Yield'].std()),
                'min': float(crop_data['Yield'].min()),
                'max': float(crop_data['Yield'].max())
            },
            'area_stats': {
                'mean': float(crop_data['Area'].mean()),
                'total': float(crop_data['Area'].sum())
            },
            'production_stats': {
                'mean': float(crop_data['Production'].mean()),
                'total': float(crop_data['Production'].sum())
            },
            'rainfall_stats': {
                'mean': float(crop_data['Annual_Rainfall'].mean()),
                'std': float(crop_data['Annual_Rainfall'].std()),
                'min': float(crop_data['Annual_Rainfall'].min()),
                'max': float(crop_data['Annual_Rainfall'].max())
            },
            'fertilizer_stats': {
                'mean': float(crop_data['Fertilizer'].mean()),
                'std': float(crop_data['Fertilizer'].std())
            },
            'pesticide_stats': {
                'mean': float(crop_data['Pesticide'].mean()),
                'std': float(crop_data['Pesticide'].std())
            },
            'top_producing_states': crop_data.groupby('State')['Production'].sum().sort_values(ascending=False).head(5).to_dict()
        }
        
        crop_profiles[crop] = profile
    
    # Save crop profiles
    with open('data/crop_profiles_real.json', 'w') as f:
        json.dump(crop_profiles, f, indent=2, default=str)
    
    print(f"Crop profiles saved to data/crop_profiles_real.json")
    return crop_profiles

def train_yield_prediction_model(df):
    """
    Train a machine learning model to predict crop yield
    """
    print(f"\nTraining yield prediction model...")
    
    # Prepare the data
    df_model = df.dropna()
    
    # Encode categorical variables
    le_crop = LabelEncoder()
    le_season = LabelEncoder()
    le_state = LabelEncoder()
    
    df_model['Crop_encoded'] = le_crop.fit_transform(df_model['Crop'])
    df_model['Season_encoded'] = le_season.fit_transform(df_model['Season'])
    df_model['State_encoded'] = le_state.fit_transform(df_model['State'])
    
    # Features and target
    features = ['Crop_encoded', 'Season_encoded', 'State_encoded', 'Crop_Year', 
                'Area', 'Annual_Rainfall', 'Fertilizer', 'Pesticide']
    X = df_model[features]
    y = df_model['Yield']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Random Forest model
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=15,
        random_state=42,
        min_samples_split=5,
        min_samples_leaf=2
    )
    
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Calculate metrics
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Model Performance:")
    print(f"RMSE: {rmse:.4f}")
    print(f"R² Score: {r2:.4f}")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': features,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print(f"\nFeature Importance:")
    print(feature_importance)
    
    # Save model and encoders
    joblib.dump(model, 'data/yield_prediction_model.pkl')
    joblib.dump(le_crop, 'data/crop_encoder.pkl')
    joblib.dump(le_season, 'data/season_encoder.pkl')
    joblib.dump(le_state, 'data/state_encoder.pkl')
    
    # Save model metadata
    metadata = {
        'model_type': 'RandomForestRegressor',
        'rmse': float(rmse),
        'r2_score': float(r2),
        'features': features,
        'crops': le_crop.classes_.tolist(),
        'seasons': le_season.classes_.tolist(),
        'states': le_state.classes_.tolist(),
        'training_samples': len(X_train),
        'test_samples': len(X_test)
    }
    
    with open('data/yield_model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\nModel and encoders saved successfully!")
    return model, le_crop, le_season, le_state, metadata

def create_state_wise_recommendations(df):
    """
    Create state-wise crop recommendations
    """
    print(f"\nCreating state-wise recommendations...")
    
    state_recommendations = {}
    
    for state in df['State'].unique():
        state_data = df[df['State'] == state]
        
        # Get top crops by yield for this state
        top_crops = state_data.groupby('Crop')['Yield'].mean().sort_values(ascending=False).head(10)
        
        # Get seasonal information
        seasonal_crops = {}
        for season in state_data['Season'].unique():
            season_data = state_data[state_data['Season'] == season]
            seasonal_crops[season] = season_data.groupby('Crop')['Yield'].mean().sort_values(ascending=False).head(5).to_dict()
        
        state_recommendations[state] = {
            'top_crops': top_crops.to_dict(),
            'seasonal_recommendations': seasonal_crops,
            'avg_rainfall': float(state_data['Annual_Rainfall'].mean()),
            'total_area': float(state_data['Area'].sum()),
            'total_production': float(state_data['Production'].sum()),
            'crops_grown': sorted(state_data['Crop'].unique().tolist())
        }
    
    # Save state recommendations
    with open('data/state_wise_recommendations.json', 'w') as f:
        json.dump(state_recommendations, f, indent=2, default=str)
    
    print(f"State-wise recommendations saved to data/state_wise_recommendations.json")
    return state_recommendations

if __name__ == "__main__":
    print("AGRIBOT - REAL CROP YIELD DATA ANALYSIS")
    print("="*50)
    
    # Create data directory
    import os
    os.makedirs('data', exist_ok=True)
    
    # Fetch and load data
    df = fetch_and_load_data()
    
    if df is not None:
        # Analyze dataset
        df = analyze_dataset(df)
        
        # Create visualizations
        create_visualizations(df)
        
        # Create crop profiles
        crop_profiles = create_crop_profiles(df)
        
        # Train yield prediction model
        model, le_crop, le_season, le_state, metadata = train_yield_prediction_model(df)
        
        # Create state-wise recommendations
        state_recommendations = create_state_wise_recommendations(df)
        
        print(f"\n" + "="*50)
        print("ANALYSIS COMPLETED SUCCESSFULLY!")
        print("="*50)
        
        print(f"\nFiles created:")
        print("- data/crop_yield_analysis.png")
        print("- data/crop_profiles_real.json")
        print("- data/yield_prediction_model.pkl")
        print("- data/crop_encoder.pkl")
        print("- data/season_encoder.pkl")
        print("- data/state_encoder.pkl")
        print("- data/yield_model_metadata.json")
        print("- data/state_wise_recommendations.json")
        
        print(f"\nDataset Summary:")
        print(f"- Total records: {len(df):,}")
        print(f"- Unique crops: {df['Crop'].nunique()}")
        print(f"- Unique states: {df['State'].nunique()}")
        print(f"- Year range: {df['Crop_Year'].min()}-{df['Crop_Year'].max()}")
        print(f"- Model R² Score: {metadata['r2_score']:.4f}")
        
        # Save the processed dataset
        df.to_csv('data/processed_crop_yield.csv', index=False)
        print("- data/processed_crop_yield.csv")
        
    else:
        print("Failed to load data. Please check the URL and try again.")
