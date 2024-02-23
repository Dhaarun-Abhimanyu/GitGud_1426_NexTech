from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__, static_url_path='/static')

# Read the Excel file
rooms_data = pd.read_excel("Room_Booking\\rooms.xlsx")

@app.route("/")
def index():
    return render_template("index.html", floors=sorted(rooms_data["Floor"].unique()))

@app.route("/get_rooms", methods=["POST"])
def get_rooms():
    floor = int(request.json["floor"])
    floor_rooms = rooms_data[rooms_data["Floor"] == floor]["Room Number"].tolist()
    return jsonify({"rooms": floor_rooms})

@app.route("/check_availability", methods=["POST"])
def check_availability():
    floor = int(request.form["floor"])
    room = int(request.form["room"])

    # Check if the room is available
    room_data = rooms_data[(rooms_data["Floor"] == floor) & (rooms_data["Room Number"] == room)]
    if not room_data.empty:
        status = room_data["Occupancy Status"].values[0]
        time_from = room_data["time_from"].values[0]
        time_to = room_data["time_to"].values[0]

        if pd.isna(time_from) or pd.isna(time_to):
            time_from_str = "N/A"
            time_to_str = "N/A"
        else:
            time_from_str = str(time_from)
            time_to_str = str(time_to)

        return jsonify({"status": status, "time_from": time_from_str, "time_to": time_to_str})
    else:
        return jsonify({"status": "Room not found", "time_from": "N/A", "time_to": "N/A"})


@app.route("/book_room", methods=["POST"])
def book_room():
    floor = int(request.form["floor"])
    room = int(request.form["room"])
    time_from = request.form["time_from"]
    time_to = request.form["time_to"]

    # Update room status and time slots
    rooms_data.loc[(rooms_data["Floor"] == floor) & (rooms_data["Room Number"] == room), "Occupancy Status"] = "Occupied"
    rooms_data.loc[(rooms_data["Floor"] == floor) & (rooms_data["Room Number"] == room), "time_from"] = time_from
    rooms_data.loc[(rooms_data["Floor"] == floor) & (rooms_data["Room Number"] == room), "time_to"] = time_to

    # Save the updated data back to the Excel file
    rooms_data.to_excel("rooms.xlsx", index=False)

    return jsonify({"status": "Room booked", "time_from": time_from, "time_to": time_to})

if __name__ == "__main__":
    app.run(debug=True)
