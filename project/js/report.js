$(document).ready(function () {
    function fetchData() {
        $.ajax({
            type: 'GET',
            url: 'https://webproject-123-41fb57c20018.herokuapp.com/tickets',
            success: function (tickets) {
                console.log('Tickets:', tickets);
                renderSalesChart(tickets);
                renderMostBoughtTickets(tickets);
                renderMostBoughtDestinations(tickets);
                renderMostBoughtTimes(tickets);
                renderMostBoughtClasses(tickets);
            },
            error: function (error) {
                console.error('Error getting tickets:', error);
            }
        });
    }

    function renderSalesChart(tickets) {
        // Get the 2D context of the canvas element with id 'salesChart'
        const ctx = document.getElementById('salesChart').getContext('2d');
        
        // Prepare the data for the chart
        const salesData = {
            labels: tickets.map(ticket => ticket.time), // X-axis labels will be the times of the tickets
            datasets: [{
                label: 'Sales', // Label for the dataset
                data: tickets.map(ticket => ticket.seats - ticket.remainingSeats),
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Background color of the bars
                borderColor: 'rgba(75, 192, 192, 1)', // Border color of the bars
                borderWidth: 1 // Border width of the bars
            }]
        };
        
        // Create a new bar chart using Chart.js
        new Chart(ctx, {
            type: 'bar', // Chart type is bar
            data: salesData, // Data for the chart
            options: {
                scales: {
                    y: {
                        beginAtZero: true // Y-axis should start at zero
                    }
                }
            }
        });
    }
    

    function renderMostBoughtTickets(tickets) {
        const mostBoughtTickets = tickets.sort((a, b) => b.seats - a.seats).slice(0, 5);
        mostBoughtTickets.forEach(ticket => {
            $('#mostBoughtTickets').append(`<li>${ticket.from} to ${ticket.to}</li>`);
        });
    }

    function renderMostBoughtDestinations(tickets) {
        const destinations = tickets.reduce((acc, ticket) => {
            acc[ticket.to] = (acc[ticket.to] || 0) + ticket.seats;
            return acc;
        }, {});
        const sortedDestinations = Object.entries(destinations).sort((a, b) => b[1] - a[1]).slice(0, 5);
        sortedDestinations.forEach(destination => {
            $('#mostBoughtDestinations').append(`<li>${destination[0]}</li>`);
        });
    }

    function renderMostBoughtTimes(tickets) {
        const times = tickets.reduce((acc, ticket) => {
            acc[ticket.time] = (acc[ticket.time] || 0) + ticket.seats;
            return acc;
        }, {});
        const sortedTimes = Object.entries(times).sort((a, b) => b[1] - a[1]).slice(0, 5);
        sortedTimes.forEach(time => {
            $('#mostBoughtTimes').append(`<li>${time[0]}</li>`);
        });
    }

    function renderMostBoughtClasses(tickets) {
        const classes = tickets.reduce((acc, ticket) => {
            acc[ticket.ticketClass] = (acc[ticket.ticketClass] || 0) + ticket.seats;
            return acc;
        }, {});
        const sortedClasses = Object.entries(classes).sort((a, b) => b[1] - a[1]).slice(0, 5);
        sortedClasses.forEach(ticketClass => {
            $('#mostBoughtClasses').append(`<li>${ticketClass[0]}</li>`);
        });
    }

    fetchData();
});
