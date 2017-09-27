/* global firebase moment */
// Steps to complete:
// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed
// 1. Initialize Firebase

  var config = {
    apiKey: "AIzaSyDyeqKySKk9Q4VQDlmCyxSVBiUktQnkSy8",
    authDomain: "my-train-schedule-3505d.firebaseapp.com",
    databaseURL: "https://my-train-schedule-3505d.firebaseio.com",
    projectId: "my-train-schedule-3505d",
    storageBucket: "my-train-schedule-3505d.appspot.com",
    messagingSenderId: "708288184239"
  };
  firebase.initializeApp(config);

var database = firebase.database();
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");
// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");
// When the client's connection state changes...
connectedRef.on("value", function(snap) {
  // If they are connected..
  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});
// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {
  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#connected-users").html(snap.numChildren());
});
// 2. Button for adding Employees
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();





  // Grabs user input
  var trName = $("#train-name-input").val().trim();
  var trDestination = $("#destination-input").val().trim();
  var trFirst = $("#first-input").val().trim();
  var trFrequency = $("#frequency-input").val().trim();
  // Creates local "temporary" object for holding employee data
  var newTr = {
    name: trName,
    destination: trDestination,
    first: trFirst,
    frequency: trFrequency
  };
  // Uploads employee data to the database
  database.ref('/train').push(newTr);
  // Logs everything to console
  console.log(newTr.name);
  console.log(newTr.destination);
  console.log(newTr.first);
  console.log(newTr.frequency);
  // Alert
  //alert("Employee successfully added");
  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-input").val("");
  $("#frequency-input").val("");
});
// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref('/train').on("child_added", function(childSnapshot) {
  // Store everything into a variable.
  var trName = childSnapshot.val().name;
  var trDestination = childSnapshot.val().destination;
  var trFirst = childSnapshot.val().first;
  var trFrequency = childSnapshot.val().frequency;
  // Employee Info
  console.log(trName);
  console.log(trDestination);
  console.log(trFirst);
  console.log(trFrequency);


  var startTime = moment(trFirst, 'hh:mm');
    console.log("initial time is: " + moment(startTime).format('hh:mm'));

    //current time to find out difference
    var currentTime = moment();
    console.log("current time is: " + moment(currentTime).format("hh:mm"));

    //difference between initial and current
    var difference = moment().diff(moment(startTime), "minutes");
    console.log("difference in initial time and current time: " + difference);

    //modular math to figure out time 
    var remainder = difference % trFrequency;
    console.log("the remainder is: " + remainder);

    //minutes away time calculation
    var minutesAway = trFrequency - remainder;
    console.log("minutes till train: " + minutesAway);

    //calculate the next train arrival time
    var nextTrain = moment().add(minutesAway, "minutes");
    console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));
  //console.log(==============================);

 //TABLE DATA=====================================================
 //APPEND TO DISPLAY IN TRAIN TABLE
$('#currentTime').text(currentTime);

  $("#train-table").append("<tr><td>" + trName + "</td><td>" + trDestination + "</td><td>" +
  trFrequency + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + minutesAway + "</td><td>");



});
// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016
// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use mets this test case