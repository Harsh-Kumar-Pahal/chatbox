import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js';
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDB_ylrW7hartjCjSAqjjZjUoNSrSX7Et4",
            authDomain: "blogs-a7325.firebaseapp.com",
            databaseURL: "https://blogs-a7325-default-rtdb.firebaseio.com",
            projectId: "blogs-a7325",
            storageBucket: "blogs-a7325.appspot.com",
            messagingSenderId: "868013133674",
            appId: "1:868013133674:web:8ceaa7dfa63ee0d2a0df13",
            measurementId: "G-RJX09FKMMY"
};

let user = document.getElementById('user').innerText;

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to delete a note by its ID
function deleteNoteById(noteId) {
    remove(ref(db, `Userchats/${chatFolderName}/${noteId}`))
        .then(() => {
            console.log("Note successfully deleted!");
        })
        .catch((error) => {
            console.error("Error removing note: ", error);
        });
}

function decryptMessage(encryptedMessage, shift) {
    let decryptedMessage = "";
    for (let i = 0; i < encryptedMessage.length; i++) {
      let char = encryptedMessage[i];
      // Decrypt uppercase letters
      if (char.match(/[A-Z]/)) {
        let code = encryptedMessage.charCodeAt(i);
        code = (code - 65 - shift + 26) % 26 + 65;
        decryptedMessage += String.fromCharCode(code);
      }
      // Decrypt lowercase letters
      else if (char.match(/[a-z]/)) {
        let code = encryptedMessage.charCodeAt(i);
        code = (code - 97 - shift + 26) % 26 + 97;
        decryptedMessage += String.fromCharCode(code);
      }
      // Keep non-letter characters unchanged
      else {
        decryptedMessage += char;
      }
    }
    return decryptedMessage;
  }
  

// Function to display a note element with a delete button
function displayNoteElement(noteId, text) {
    const noteElement = document.createElement("div");

    // Check if the message order is even or odd to determine the background color
    let gradientColor;

    // Determine left margin dynamically based on screen width
    const screenWidth = window.innerWidth;
    let marginLeft;
    let fs;
    let wid;

    if (screenWidth <= 667) {
        marginLeft = "110px"; // Adjust this value for smaller screens
        fs = "15px";
        wid = "46%";
    }  
    
    if(screenWidth <=740){
        marginLeft = "175px"; // Adjust this value for smaller screens
        fs = "15px";
        wid = "46%";
    }   
    else {
        marginLeft = "453px"; // Adjust this value for larger screens
        fs = "18px";
        wid = "40%";
    }

    // Determine the background color based on whether the currentUser name is found in the message text
    let backgroundColor;
    if (decryptMessage(text, keySize).includes(document.getElementById('CurrentUser').innerText)) {
        backgroundColor = "rgb(10, 110, 255)"; // Blue color
        noteElement.style.marginLeft = marginLeft;
        noteElement.style.borderRadius = "20px";
        noteElement.style.marginBottom = "20px";
        noteElement.style.borderTopRightRadius = "0px";
    } else {
        backgroundColor = "rgb(46, 191, 50)"; // Green color
        noteElement.style.marginLeft = "-15px";
        noteElement.style.borderRadius = "20px";
        noteElement.style.borderBottomLeftRadius = "0px";
    }

    noteElement.classList.add(user);
    noteElement.innerHTML = decryptMessage(text, keySize);
    noteElement.style.padding = "10px";
    noteElement.style.width = wid;
    noteElement.style.fontSize = fs;
    noteElement.style.height = "auto";
    noteElement.style.backgroundColor = backgroundColor;
    noteElement.style.color = "white";
    noteElement.style.marginBottom = "10px";
    noteElement.style.fontFamily = "Arial, Helvetica, sans-serif"; // Example font family
    noteElement.style.position = "relative"; // Set position to relative

    // Create a delete button
    const deleteButton = document.createElement("span");
    deleteButton.textContent = "x";
    deleteButton.style.position = "absolute"; // Set position to absolute
    deleteButton.style.top = "5px"; // Adjust top position as needed
    deleteButton.style.right = "5px"; // Align to the right
    deleteButton.style.color = "white";

    deleteButton.style.cursor = "pointer";
    deleteButton.style.transform = "translateY(10%)";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", function () {
        deleteNoteById(noteId);
        noteElement.remove(); // Remove the note element from the DOM
        deleteButton.remove(); // Remove the delete button from the DOM
    });
    noteElement.appendChild(deleteButton);

    document.getElementById("output-container").appendChild(noteElement);
}

// Initialize note counter
let noteCounter = 1;

// Function to create a new note element
function createNewNoteElement(noteText) {
    const noteElement = document.createElement("div");
    const newNoteRef = push(ref(db, user)); // Push a new entry to Realtime Database

    noteElement.id = newNoteRef.key; // Use the key generated by Realtime Database as note ID

    // Check if the message order is even or odd to determine the background color
    let gradientColor;

    if (noteCounter % 2 === 0) {
        gradientColor = "rgb(10, 96, 204)"; // Blue gradient
        noteElement.style.marginLeft = "205px";
        noteElement.style.borderRadius = "10px";
        noteElement.style.borderBottomRightRadius = "0px";

    } else {
        gradientColor = "rgb(46, 191, 71)"; // Gray gradient
        noteElement.style.borderRadius = "10px";
        noteElement.style.borderTopLeftRadius = "0px";
    }

    noteElement.innerHTML = noteText;
    noteElement.style.padding = "10px";
    noteElement.style.width = "50%";
    noteElement.style.backgroundColor = gradientColor;
    noteElement.style.color = "white";
    noteElement.style.fontWeight = "bold";
    noteElement.style.marginBottom = "10px";

    // Create a delete button
    const deleteButton = document.createElement("span");
    deleteButton.textContent = "x";
    deleteButton.style.float = "right";
    deleteButton.style.textAlign = "right";
    deleteButton.style.display = "none";
    deleteButton.style.width = "20px"
    deleteButton.style.color = "white";
    deleteButton.style.fontWeight = "bold";
    deleteButton.style.background = "none";
    deleteButton.style.borderRadius = "6px";
    deleteButton.style.translateY = "300%";
    deleteButton.style.cursor = "pointer";
    deleteButton.style.display = "inline-block";
    deleteButton.style.transform = "translateY(10%)";
    deleteButton.style.marginLeft = "20px";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", function () {
        deleteNoteById(newNoteRef.key); // Pass the generated key to delete function
        noteElement.remove(); // Remove the note element from the DOM
        deleteButton.remove(); // Remove the delete button from the DOM
        window.location.reload();
    });
    noteElement.appendChild(deleteButton);

    document.getElementById("output-container").appendChild(noteElement);
    noteCounter++;
}

let UserFolder = localStorage.getItem('username'); 
let UserFriend = localStorage.getItem('current');

let keySize = (UserFolder+UserFriend).length;

// Concatenate the usernames after sorting them alphabetically
let chatFolderName = [UserFolder, UserFriend].sort().join("_");

// Now chatFolderName will always be consistent, regardless of the order of the usernames
console.log(chatFolderName); // Output will be something like "alice_john" or "john_alice"

function encryptMessage(message, shift) {
    let encryptedMessage = "";
    for (let i = 0; i < message.length; i++) {
      let char = message[i];
      // Encrypt uppercase letters
      if (char.match(/[A-Z]/)) {
        let code = message.charCodeAt(i);
        code = (code - 65 + shift) % 26 + 65;
        encryptedMessage += String.fromCharCode(code);
      }
      // Encrypt lowercase letters
      else if (char.match(/[a-z]/)) {
        let code = message.charCodeAt(i);
        code = (code - 97 + shift) % 26 + 97;
        encryptedMessage += String.fromCharCode(code);
      }
      // Keep non-letter characters unchanged
      else {
        encryptedMessage += char;
      }
    }
    return encryptedMessage;
  }
  

// Function to save text to Realtime Database
function saveTextToRealtimeDatabase(text) {
    const order = new Date().getTime(); // Get a numeric value representing the current time
    
    // Get the current user name and time
    const currentUser = document.getElementById("CurrentUser").innerHTML;
    const currentTime = getCurrentTime();
    
    // Combine text, user name, and time with appropriate formatting
    const newText = encryptMessage((`${text}<br><div style="text-align: right; font-size: 12px; color: #fff;">${currentUser}, ${currentTime}</div>`), keySize);

    // Push the formatted text to the database
    push(ref(db, `Userchats/${chatFolderName}`), {
        text: newText,
        order: order // Add the order field to the document
    })
    .then((docRef) => {
        console.log("Note added with ID: ", docRef.key);
    })
    .catch((error) => {
        console.error("Error adding note: ", error);
    });
}

// Function to get current time in HH:MM AM/PM format
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}


// Event listener for sending message
document.getElementById('send').addEventListener("click", function (event){
    if(document.getElementById("message-input").value.trim() !== ""){
        createNewNoteElement(document.getElementById("message-input").value.trim());
        saveTextToRealtimeDatabase(document.getElementById("message-input").value.trim());
        document.getElementById("message-input").value = ""; // Clear the input after submitting the message
        var scrollableDiv = document.getElementById("chatBox");
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }
});

// Event listener for typing message
document.getElementById("message-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.target.value.trim() !== "") {
        createNewNoteElement(event.target.value.trim());
        saveTextToRealtimeDatabase(event.target.value.trim());
        event.target.value = ""; // Clear the input after submitting the message
    }
});

// Listen for changes in Realtime Database and display notes
onValue(ref(db, `Userchats/${chatFolderName}`), (snapshot) => {
    const data = snapshot.val();
    document.getElementById("output-container").innerHTML = ""; // Clear previous notes
    if (data) {
        Object.keys(data).forEach(key => {
            displayNoteElement(key, data[key].text);
        });
    }
});

// localStorage.clear()


