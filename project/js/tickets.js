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
