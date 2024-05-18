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
        const ctx = document.getElementById('salesChart').getContext('2d');
        const salesData = {
          labels: tickets.map(ticket => ticket.time),
          datasets: [{
            label: 'Sales',
            data: tickets.map(ticket => ticket.seats - ticket.remainingSeats), // Calculate sold seats
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        };
        new Chart(ctx, {
          type: 'bar',
          data: salesData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
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
