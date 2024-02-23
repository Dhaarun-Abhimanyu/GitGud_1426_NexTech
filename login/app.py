from flask import Flask, render_template, request, redirect, url_for
import pandas as pd

app = Flask(__name__, static_folder='static')

# Path to the Excel file
excel_file_path = "excel\\testdata.xlsx"

# Load the Excel file into a Pandas DataFrame
df = pd.read_excel(excel_file_path)

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    global df
    email = request.form.get('email')
    password = request.form.get('password')

    user_data = df[df['email'] == email]

    if user_data.empty or user_data.iloc[0]['password'] != password:
        return render_template('login.html', message='Invalid email or password. Please try again.')

    return redirect(url_for('homepage'))  # Redirect to homepage after successful login

@app.route('/signup')
def signup():
    return render_template('signup.html', message='')

@app.route('/signup_process', methods=['POST'])
def signup_process():
    global df
    email = request.form.get('email')
    password = request.form.get('password')
    username = request.form.get('username')

    # Check if email or username already exists
    if (df['email'] == email).any() or (df['Name'] == username).any():
        return render_template('signup.html', message='Email or username already exists. Please choose a different one.')

    # Add new user to the DataFrame
    new_user = pd.DataFrame({'Name': [username], 'email': [email], 'password': [password]})
    df = pd.concat([df, new_user], ignore_index=True)

    # Update the Excel file
    df.to_excel(excel_file_path, index=False)

    return redirect(url_for('homepage'))  # Redirect to homepage after successful signup

@app.route('/homepage')
def homepage():
    return render_template('homepage.html')

if __name__ == '__main__':
    # Run the Flask app on port 5001
    app.run(debug=True, port=5001)
