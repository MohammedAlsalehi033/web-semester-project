$(document).ready(function () {
  $("#add-ticket-btn").click(function () {
      $("#ticket-panel").slideToggle(); // Toggle the visibility of the ticket panel

      // Change button text between "Add new Ticket" and "Cancel"
      var buttonText = $(this).text() == "Add new Ticket" ? "Cancel" : "Add new Ticket";
      $(this).text(buttonText);
  });

  // Add event listener to the "Submit" button inside the ticket panel
  $("#submit-ticket-btn").click(function () {
      // Retrieve values from input fields
      var from = $("#ticket-panel input[placeholder='From']").val();
      var to = $("#ticket-panel input[placeholder='To']").val();
      var time = $("#ticket-panel select").val();
      var seats = $("#ticket-panel input[placeholder='Seats']").val();
      var ticketClass = $("#ticket-panel input[placeholder='Class']").val();
      var wifi = $("#ticket-panel input[type='checkbox'][placeholder='Wifi']").prop("checked");
      var food = $("#ticket-panel input[type='checkbox'][placeholder='Food']").prop("checked");

      // Create a new table row with the captured information
      var newRow = $("<section class='table-row'></section>");
      newRow.append("<h6>" + from + "</h6>");
      newRow.append("<h6>" + to + "</h6>");
      newRow.append("<h6>" + time + "</h6>");
      newRow.append("<h6>" + seats + "</h6>");
      newRow.append("<h6>" + ticketClass + "</h6>");
      newRow.append("<h6>" + wifi + "</h6>");
      newRow.append("<h6>" + food + "</h6>");

      // Append the new row to the table
      $("#table-header").after(newRow);

      // Slide up the ticket panel
      $("#ticket-panel").slideUp();
      // Change button text back to "Add new Ticket"
      $("#add-ticket-btn").text("Add new Ticket");
      
      // Clear input fields
      $("#ticket-panel input").val("");
      $("#ticket-panel select").val("");
      $("#ticket-panel input[type='checkbox']").prop("checked", false);
  });
});



$(document).ready(function () {
  $("#submit-ticket-btn").click(function () {
    // Retrieve values from input fields
    var from = $("#from").val();
    var to = $("#to").val();
    var time = $("#time").val();
    var seats = $("#seats").val();
    var ticketClass = $("#class").val();
    var wifi = $("#wifi").prop("checked");
    var food = $("#food").prop("checked");

    // Create ticket data object
    var ticketData = {
        from: from,
        to: to,
        time: time,
        seats: seats,
        ticketClass: ticketClass,
        wifi: wifi,
        food: food
    };

    console.log(ticketData)

    // Add ticket via AJAX POST request
    $.ajax({
        type: 'POST',
        url: 'https://webproject-123-41fb57c20018.herokuapp.com/tickets',
        data: JSON.stringify(ticketData),
        contentType: 'application/json',
        success: function () {
            console.log('Ticket added successfully');
            // Refresh tickets list
            getTickets();
        },
        error: function (error) {
            console.error('Error adding ticket:', error);
        }
    });

    // Slide up the ticket panel
    $("#ticket-panel").slideUp();
    // Change button text back to "Add new Ticket"
    $("#add-ticket-btn").text("Add new Ticket");

    // Clear input fields
    $("#ticket-panel input").val("");
    $("#ticket-panel select").val("");
    $("#ticket-panel input[type='checkbox']").prop("checked", false);
});

  // Function to retrieve all tickets
  function getTickets() {
    $.ajax({
      type: 'GET',
      url: 'https://webproject-123-41fb57c20018.herokuapp.com/tickets',
      success: function (tickets) {
        console.log('Tickets:', tickets);
        renderTickets(tickets);
      },
      error: function (error) {
        console.error('Error getting tickets:', error);
      }
    });
  }

  // Function to render tickets in the table
  function renderTickets(tickets) {
    $('#table-header').siblings().remove();
    tickets.forEach(ticket => {
      console.log(ticket.from_location)
      $('#table-header').after(`
        <section class="table-row">
          <h6>${ticket.from}</h6>
          <h6>${ticket.to}</h6>
          <h6>${ticket.time}</h6>
          <h6>${ticket.seats}</h6>
          <h6>${ticket.ticketClass}</h6>
          <h6>${ticket.wifi}</h6>
          <h6>${ticket.food}</h6>
        </section>
      `);
    });
  } 
  
  $('#ticket-form').submit(function (event) {
    event.preventDefault();
    const ticketData = {
      from: $('#from').val(),
      to: $('#to').val(),
      time: $('#time').val(),
      seats: $('#seats').val(),
      ticketClass: $('#class').val(),
      wifi: $('#wifi').prop('checked'),
      food: $('#food').prop('checked')
    };
    addTicket(ticketData);
  });

  // Initial load of tickets
  getTickets();
});