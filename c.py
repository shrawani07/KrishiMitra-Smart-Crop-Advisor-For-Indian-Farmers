import pandas as pd
import json
import os

# Define the full path to your input CSV file.
# This assumes 'crop_yeild.csv' is directly in your project's root directory.
input_csv_path = r'C:\Users\My Lappy\Desktop\agribot-project-final-working\agribot-project-final-working\crop_yeild.csv'

# Load your CSV file
df = pd.read_csv(input_csv_path)

# --- THIS IS THE CRUCIAL LINE THAT WAS LIKELY MISSING OR MISPLACED ---
# Convert DataFrame to a list of dictionaries (JSON format)
data_json = df.to_dict(orient='records')
# --- END OF CRUCIAL LINE ---

# Define the path for the output 'data' folder within the project root
output_data_folder = r'C:\Users\My Lappy\Desktop\agribot-project-final-working\agribot-project-final-working\data'
# Create the 'data' folder if it doesn't exist.
# If it already exists, this line will do nothing (because exist_ok=True).
os.makedirs(output_data_folder, exist_ok=True)

# Define the full path for the output JSON file
json_file_name = 'crop_yield_data.json'
json_file_path = os.path.join(output_data_folder, json_file_name)

# Save to a JSON file
with open(json_file_path, 'w') as f:
    json.dump(data_json, f, indent=2)

print(f"'{json_file_path}' created successfully.")