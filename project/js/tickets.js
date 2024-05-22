$(document).ready(function () {
    $("#add-ticket-btn").click(function () {
        $("#ticket-panel").slideToggle(); 

        var buttonText = $(this).text() === "Add new Ticket" ? "Cancel" : "Add new Ticket";
        $(this).text(buttonText);
    });

    $("#submit-ticket-btn").click(function () {
        var from = $("#from").val();
        var to = $("#to").val();
        var time = $("#time").val();
        var seats = $("#seats").val();
        var ticketClass = $("#class").val();
        var wifi = $("#wifi").prop("checked");
        var food = $("#food").prop("checked");

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

        $.ajax({
            type: 'POST',
            url: 'https://webproject-123-41fb57c20018.herokuapp.com/tickets',
            data: JSON.stringify(ticketData),
            contentType: 'application/json',
            success: function () {
                console.log('Ticket added successfully');
                getTickets();
            },
            error: function (error) {
                console.error('Error adding ticket:', error);
            }
        });

        $("#ticket-panel").slideUp();
        $("#add-ticket-btn").text("Add new Ticket");

        $("#ticket-panel input").val("");
        $("#ticket-panel select").val("");
        $("#ticket-panel input[type='checkbox']").prop("checked", false);
    });

    $("#search-btn").click(function () {
        searchTickets();
    });

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

    function searchTickets() {
        var fromCity = $("#search-from").val().toLowerCase();
        var toCity = $("#search-to").val().toLowerCase();

        $.ajax({
            type: 'GET',
            url: 'https://webproject-123-41fb57c20018.herokuapp.com/tickets',
            success: function (tickets) {
                var filteredTickets = tickets.filter(ticket => {
                    return (
                        (!fromCity || ticket.from.toLowerCase().includes(fromCity)) &&
                        (!toCity || ticket.to.toLowerCase().includes(toCity))
                    );
                });
                renderTickets(filteredTickets);
            },
            error: function (error) {
                console.error('Error searching tickets:', error);
            }
        });
    }

    function renderTickets(tickets) {
        $('#ticket-rows').empty(); 
        tickets.forEach(ticket => {
            $('#ticket-rows').append(`
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

        $('.table-row').on('click', function () {
            const ticketId = $(this).data('id');
            window.location.href = `seats.html?ticketId=${ticketId}`;
        });
    }

    getTickets();
});
