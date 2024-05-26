$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('busId');

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

        // Render the driver's seat on the right side
        seatLayout.append('<div class="seat driver" data-seat="driver">Driver</div>');

        // Calculate the number of rows
        const rows = Math.ceil((ticket.seats - 5) / 4) + 1; // +1 to include the last row
        let seatCount = 1;

        for (let row = 1; row < rows; row++) {
            // Render seats in pairs with an aisle
            for (let col = 1; col <= 4; col++) {
                const seatPosition = (col <= 2) ? col : col + 1; // Skip the middle column for the aisle
                const seatClass = ticket.bookedSeats.includes(seatCount) ? 'booked' : 'available';

                seatLayout.append(`<div class="seat ${seatClass}" data-seat="${seatCount}" style="grid-column: ${seatPosition}">${seatCount}</div>`);
                seatCount++;
            }
        }

        // Render the last row with five seats
        for (let col = 1; col <= 5; col++) {
            const seatClass = ticket.bookedSeats.includes(seatCount) ? 'booked' : 'available';
            seatLayout.append(`<div class="seat ${seatClass} last-row" data-seat="${seatCount}" style="grid-column: ${col}">${seatCount}</div>`);
            seatCount++;
        }

        // Attach click event to available seats
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

    function handleSignOut(event) {
        event.preventDefault(); // Prevent the default link behavior
        sessionStorage.clear(); // Clear session storage
    
        // Replace the current state and redirect to the login page
        history.replaceState(null, null, './LoginPage.html');
        window.location.replace('./LoginPage.html');
    
        // Push a dummy state to the history
        history.pushState(null, null, './LoginPage.html');
    
        // Add a popstate event listener to prevent back and forward navigation
        window.addEventListener('popstate', function(event) {
            history.pushState(null, null, './LoginPage.html');
            window.location.replace('./LoginPage.html');
        });
    }
    
    document.getElementById('sign-out').addEventListener('click', handleSignOut);

    fetchTicketDetails();
});
