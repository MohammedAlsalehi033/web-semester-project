$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('ticketId');

    function fetchTicketDetails() {
        $.ajax({
            type: 'GET',
            url: `https://webproject-123-41fb57c20018.herokuapp.com/tickets/${ticketId}`,
            success: function(ticket) {
                renderSeats(ticket);
            },
            error: function(error) {
                console.error('Error fetching ticket details:', error);
            }
        });
    }

    function renderSeats(ticket) {
        const seatLayout = $('#seat-layout');
        seatLayout.empty(); 

        for (let i = 1; i <= ticket.seats; i++) {
            const seatClass = ticket.bookedSeats.includes(i) ? 'booked' : 'available';
            seatLayout.append(`<div class="seat ${seatClass}" data-seat="${i}">${i}</div>`);
        }

        $('.seat.available').click(function() {
            const seatNumber = $(this).data('seat');
            bookSeat(ticket.id, seatNumber);
        });
    }

    function bookSeat(ticketId, seatNumber) {
        $.ajax({
            type: 'POST',
            url: 'https://webproject-123-41fb57c20018.herokuapp.com/book-seat',
            contentType: 'application/json',
            data: JSON.stringify({ id: ticketId, seatNumber: seatNumber }),
            success: function(response) {
                alert('Seat booked successfully');
                fetchTicketDetails(); 
            },
            error: function(error) {
                alert('Error booking seat: ' + error.responseJSON.error);
            }
        });
    }

    fetchTicketDetails();
});