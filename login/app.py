from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import pandas as pd
import subprocess
import platform

app = Flask(__name__, static_url_path='')

# Path to the Excel file
excel_file_path = "NexTech\\login\\testdata.xlsx"

# Load the Excel file into a Pandas DataFrame
df = pd.read_excel(excel_file_path)
setup_done = False

def run_command_in_directory(command, directory):
    """
    Function to run a command in a specified directory using subprocess.
    """
    try:
        if platform.system() == 'Windows':
            # On Windows, use 'start' command to run in a new command prompt
            subprocess.run(f'start cmd /c "{command}"', cwd=directory, shell=True, check=True)
        else:
            # On other platforms, run normally
            subprocess.run(command, cwd=directory, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        # Handle error if needed

def setup():
    """
    Function to be run before the first request.
    """
    global setup_done
    if not setup_done:
        # List of commands and directories
        commands_directories = [
            ('node app.js', 'NexTech\\IT_nonIT_support'),
            ('node server.js', 'NexTech\\library_acces'),
            ('node server.js', 'NexTech\\lost_and_found'),
            ('py app.py', 'NexTech\\Room_Booking')# Example command and directory 1
        ]
        
        # Execute commands in specified directories
        for command, directory in commands_directories:
            run_command_in_directory(command, directory)
        
        # Set the flag to True to indicate setup is done
        setup_done = True

@app.before_request
def before_request():
    """
    Function to run before each request.
    """
    setup()

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
    return send_from_directory('static', 'homepage.html')

if __name__ == '__main__':
    # Run the setup function
    setup()
    
    # Run the Flask app on port 5001
    app.run(debug=True, port=5001)
