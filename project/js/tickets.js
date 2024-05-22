$(document).ready(function () {
    // Toggle ticket panel
    $("#add-ticket-btn").click(function () {
        $("#ticket-panel").slideToggle(); // Toggle the visibility of the ticket panel

        // Change button text between "Add new Ticket" and "Cancel"
        var buttonText = $(this).text() === "Add new Ticket" ? "Cancel" : "Add new Ticket";
        $(this).text(buttonText);
    });

    // Add event listener to the "Submit" button inside the ticket panel
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

        console.log(ticketData);

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
        $('#table-header').siblings('.table-row').remove(); // Remove only .table-row elements
        tickets.forEach(ticket => {
            $('#table-header').after(`
                <section class="table-row" data-id="${ticket.id}">
                    <h6>${ticket.from}</h6>
                    <h6>${ticket.to}</h6>
                    <h6>${ticket.time}</h6>
                    <h6>${ticket.seats - ticket.remainingSeats}/${ticket.seats}</h6>
                    <h6>${ticket.ticketClass}</h6>
                    <h6>${ticket.wifi ? 'Yes' : 'No'}</h6>
                    <h6>${ticket.food ? 'Yes' : 'No'}</h6>
                </section>
            `);
        });

        // Add click event to each row
        $('.table-row').on('click', function () {
            const ticketId = $(this).data('id');
            window.location.href = `seats.html?ticketId=${ticketId}`;
        });
    }

    // Initial load of tickets
    getTickets();
});
