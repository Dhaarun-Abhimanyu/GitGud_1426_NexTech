document.addEventListener("DOMContentLoaded", () => {
    loadFoundItems();
});

function reportLostItem() {
    const itemName = document.getElementById("itemName").value;
    const description = document.getElementById("description").value;

    const listItem = document.createElement("li");
    listItem.innerHTML = `<span class="status">Pending</span>${itemName} - ${description}
                          <button class="found" onclick="markAsFound(this)">Found</button>`;

    document.getElementById("foundList").appendChild(listItem);

    document.getElementById("itemName").value = "";
    document.getElementById("description").value = "";

    saveItemToServer(itemName, description, 'Pending');
}

function markAsFound(button) {
    const statusElement = button.parentNode.querySelector('.status');
    statusElement.innerText = 'Found';
    button.disabled = true;
    button.style.backgroundColor = '#95a5a6';
    
    // Update the status on the server (replace this with actual API call)
    updateStatusOnServer(statusElement.dataset.itemId, 'Found');
}

function loadFoundItems() {
    // Simulate loading data from the server (replace this with actual API calls)
    const foundItems = []
       

    const foundList = document.getElementById("foundList");

    foundItems.forEach(item => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<span class="status" data-item-id="${item.id}">${item.status}</span>${item.itemName} - ${item.description}
                              <button class="found" onclick="markAsFound(this)">Found</button>`;
        foundList.appendChild(listItem);
    });
}

function saveItemToServer(itemName, description, status) {
    // Simulate saving data to the server (replace this with actual API calls)
    // In a real-world scenario, you would send a POST request to your server to save the data.
    const itemId = Date.now(); // Generate a unique ID (replace this with a proper ID generation)
    console.log(`Item '${itemName}' reported as lost. Description: ${description}`);

    // Add the new item to the server
    updateStatusOnServer(itemId, status);
}

function updateStatusOnServer(itemId, status) {
    // Simulate updating status on the server (replace this with actual API calls)
    console.log(`Item with ID ${itemId} marked as ${status}`);
}

