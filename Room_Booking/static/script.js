document.addEventListener("DOMContentLoaded", function () {
    const floorSelect = document.getElementById("floor");
    const roomSelect = document.getElementById("room");
    const timeFromInput = document.getElementById("time_from");
    const timeToInput = document.getElementById("time_to");
    const checkAvailabilityBtn = document.getElementById("checkAvailability");
    const bookRoomBtn = document.getElementById("bookRoom");
    const statusMessage = document.getElementById("statusMessage");

    // Populate room options based on selected floor
    floorSelect.addEventListener("change", function () {
        const floor = floorSelect.value;
        fetchRooms(floor);
    });

    // Fetch rooms based on selected floor
    function fetchRooms(floor) {
        fetch("/get_rooms", {
            method: "POST",
            body: JSON.stringify({ floor: floor }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                roomSelect.innerHTML = "";
                data.rooms.forEach((room) => {
                    const option = document.createElement("option");
                    option.value = room;
                    option.text = "Room " + room;
                    roomSelect.appendChild(option);
                });
            });
    }

    // Check availability button click event
    checkAvailabilityBtn.addEventListener("click", function () {
        const floor = floorSelect.value;
        const room = roomSelect.value;
        checkAvailability(floor, room);
    });

    // Book room button click event
    bookRoomBtn.addEventListener("click", function () {
        const floor = floorSelect.value;
        const room = roomSelect.value;
        const time_from = timeFromInput.value;
        const time_to = timeToInput.value;
        bookRoom(floor, room, time_from, time_to);
    });

    // Function to check room availability
    function checkAvailability(floor, room) {
        fetch("/check_availability", {
            method: "POST",
            body: new URLSearchParams({ floor: floor, room: room }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                statusMessage.textContent = data.status;
                if (data.status === "Occupied") {
                    statusMessage.textContent += " (Booked from " + data.time_from + " to " + data.time_to + ")";
                }
            });
    }

    // Function to book a room
    function bookRoom(floor, room, time_from, time_to) {
        fetch("/book_room", {
            method: "POST",
            body: new URLSearchParams({ floor: floor, room: room, time_from: time_from, time_to: time_to }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                statusMessage.textContent = data.status + " (Booked from " + data.time_from + " to " + data.time_to + ")";
            });
    }
});
