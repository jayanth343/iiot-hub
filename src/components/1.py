import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import sys
import ast
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
svm_model_path = os.path.join(script_dir, 'P1_svm_model.pkl')
scaler_path = os.path.join(script_dir, 'P1_scaler.pkl')

def predict_anomaly(feature_group_name,ip):
    # Load the saved model and scaler
    ii = eval(ip)
    input_data = np.array(ii)
    svm_model = joblib.load(svm_model_path)
    scaler = joblib.load(scaler_path)

    # Preprocess the input data
    input_data_scaled = scaler.transform([input_data])

    # Make a prediction
    prediction = svm_model.predict(input_data_scaled)
    while True:
        if prediction == 1:
            print("anomaly")
            sys.stdout.flush()
            break
        else:
            print("not-anomaly")    
            sys.stdout.flush()
            break


# Example usage of predict_anomaly function
# Replace with actual feature group name and input data
feature_group_name = 'P1'
#id =sys.argv[1]
i = input("Enter the input data: ")
predict_anomaly(feature_group_name, i)
