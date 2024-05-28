$(document).ready(function () {
    const cities = ["Abbottabad", "Attock", "Awaran", "Bahawalpur", "Badin", "Bannu", "Batgram", "Bhakker", "Campbellpur", "Chakwal", "Charsadda", "Chiniot", "Daska", "Dadu", "Dera Ghazi Khan", "Faisalabad", "Ghotki", "Gwadar", "Gujranwala", "Gujjar Khan", "Gujrat", "Hafizabad", "Haripur", "Hyderabad", "Islamabad", "Jacobabad", "Jamshoro", "Jhang", "Jhelum", "Kasur", "Kech", "Khanewal", "Khairpur", "Kohat", "Khuzdar", "Lahore", "Lasbela", "Layyah", "Leiah", "Larkana", "Lower Dir", "Malakand", "Mandi Bahauddin", "Mansehra", "Mardan", "Matiari", "Mianwali", "Mirpur Khas", "Multan", "Muzaffargarh", "Murree", "Nowshera", "Nowshero Feroz", "Okara", "Panjgur", "Peshawar", "Quetta", "Rahim Yar Khan", "Rawalpindi", "Sadiqabad", "Sanghar", "Sahiwal", "Sargodha", "Shangla", "Sheikhupura", "Shikarpur", "Sialkot", "Sialkot Cantonment", "Sukkur", "Swabi", "Talagang", "Tando Adam", "Tando Allahyar", "Tharparkar", "Toba Tek Singh", "Upper Dir", "Vehari", "Wah Cantt"];

    function populateCities() {
        cities.forEach(city => {
            $('#from').append(new Option(city, city));
            $('#to').append(new Option(city, city));
            $('#search-from').append(new Option(city, city));
            $('#search-to').append(new Option(city, city));
        });
    }

    function updateToCities() {
        const selectedFrom = $('#from').val();
        $('#to').empty().append(new Option("To", "", true, true)).prop('disabled', false);
        cities.forEach(city => {
            if (city !== selectedFrom) {
                $('#to').append(new Option(city, city));
            }
        });
    }

    populateCities();

    // Ensure 'To' is not the same as 'From'
    $('#from').change(updateToCities);

    // Ensure 'Search To' is not the same as 'Search From'
    $('#search-from').change(function () {
        const selectedFrom = $(this).val();
        $('#search-to').empty().append(new Option("To City", "", true, true));
        cities.forEach(city => {
            if (city !== selectedFrom) {
                $('#search-to').append(new Option(city, city));
            }
        });
    });


    // Toggle add bus panel
    $("#add-ticket-btn").click(function () {
        $("#ticket-panel").slideToggle();
        const buttonText = $(this).text() === "Add new Bus" ? "Cancel" : "Add new Bus";
        $(this).text(buttonText);
    });

    // Ensure only one checkbox (Full or Vacant) is selected
    $('#status-full').change(function () {
        if (this.checked) {
            $('#status-vacant').prop('checked', false);
        }
    });

    $('#status-vacant').change(function () {
        if (this.checked) {
            $('#status-full').prop('checked', false);
        }
    });

    // Update 'To' cities when 'From' city changes
    $('#from').change(updateToCities);

    // Validate date to be not before today
    function isDateValid(date) {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignore time part
        return selectedDate >= today;
    }

    // Validate time if date is today
    function isTimeValid(date, time) {
        const selectedDate = new Date(date);
        const today = new Date();
        if (selectedDate.toDateString() === today.toDateString()) {
            const selectedTime = new Date(today.toDateString() + ' ' + time);
            return selectedTime >= today;
        }
        return true;
    }

    // Submit new bus
    $("#submit-ticket-btn").click(function () {
        const from = $("#from").val();
        const to = $("#to").val();
        const data = $("#date").val();
        const time = $("#time").val();
        const fare = $("#fare").val();
        const seats = $("#seats").val();
        const ticketClass = $("#busClass").val();
        const wifi = $("#wifi").prop("checked");
        const food = $("#food").prop("checked");

        if (!from || !to || !data || !time || !fare || !seats || !ticketClass) {
            alert("Please fill in all required fields.");
            return;
        }

        if (!isDateValid(data)) {
            alert("The date selected cannot be before today's date.");
            return;
        }

        if (!isTimeValid(data, time)) {
            alert("The time selected cannot be before the current time for today's date.");
            return;
        }

        if (isNaN(fare) || fare <= 0) {
            alert("Fare must be a number greater than zero.");
            return;
        }

        const busData = {
            from,
            to,
            data,
            time,
            fare,
            seats,
            remainingSeats: seats,
            ticketClass,
            wifi,
            food,
            bookedSeats: []
        };

        $.ajax({
            type: 'POST',
            url: 'https://webproject-123-41fb57c20018.herokuapp.com/tickets',
            data: JSON.stringify(busData),
            contentType: 'application/json',
            success: function () {
                getBuses();
            },
            error: function (error) {
                console.error('Error adding bus:', error);
            }
        });

        $("#ticket-panel").slideUp();
        $("#add-ticket-btn").text("Add new Bus");

        $("#ticket-panel input").val("");
        $("#ticket-panel select").val("");
        $("#ticket-panel input[type='checkbox']").prop("checked", false);
    });

    // Search buses based on criteria
    $("#search-btn").click(function () {
        searchTickets();
    });

    // Reset search criteria
    $("#reset-btn").click(function () {
        $("#search-from").val("");
        $("#search-to").val("");
        $("#search-date").val("");
        $("#search-time").val("");
        $("#search-class").val("");
        $("#status-full").prop("checked", false);
        $("#status-vacant").prop("checked", false);
        getBuses();
    });

    function getBuses() {
        $.ajax({
            type: 'GET',
            url: 'https://webproject-123-41fb57c20018.herokuapp.com/tickets',
            success: function (buses) {
                console.log('Buses received:', buses);
                const filteredBuses = buses.filter(bus => {
                    const busDateTime = new Date(bus.data + ' ' + bus.time);
                    return busDateTime >= new Date();
                });
                renderBuses(filteredBuses);
            },
            error: function (error) {
                console.error('Error getting buses:', error);
            }
        });
    }

    function searchTickets() {
        const fromCity = $("#search-from").val();
        const toCity = $("#search-to").val();
        const date = $("#search-date").val();
        const time = $("#search-time").val();
        const ticketClass = $("#search-class").val();
        const isFullChecked = $("#status-full").prop("checked");
        const isVacantChecked = $("#status-vacant").prop("checked");

        $.ajax({
            type: 'GET',
            url: 'https://webproject-123-41fb57c20018.herokuapp.com/tickets',
            success: function (buses) {
                const filteredBuses = buses.filter(bus => {
                    const matchesFrom = !fromCity || bus.from === fromCity;
                    const matchesTo = !toCity || bus.to === toCity;
                    const matchesDate = !date || bus.data === date;
                    const matchesTime = !time || bus.time === time;
                    const matchesClass = !ticketClass || bus.ticketClass === ticketClass;
                    const matchesStatus = (!isFullChecked && !isVacantChecked) || (isFullChecked && (bus.remainingSeats == 0)) || (isVacantChecked && (bus.remainingSeats > 0));
                    const busDateTime = new Date(bus.data + ' ' + bus.time);
                    const isFutureBus = busDateTime >= new Date();
                    return matchesFrom && matchesTo && matchesDate && matchesTime && matchesClass && matchesStatus && isFutureBus;
                });
                renderBuses(filteredBuses);
            },
            error: function (error) {
                console.error('Error searching tickets:', error);
            }
        });
    }

    function renderBuses(buses) {
        $('#ticket-rows').empty();
        buses.forEach(bus => {
            const dropButton = `<button class="drop-bus-btn" data-id="${bus.id}">Drop Bus</button>`;
            $('#ticket-rows').append(`
                <section class="table-row" data-id="${bus.id}">
                    <h6>${bus.from}</h6>
                    <h6>${bus.to}</h6>
                    <h6>${bus.data}</h6>
                    <h6>${bus.time}</h6>
                    <h6>${bus.seats - bus.remainingSeats}/${bus.seats}</h6>
                    <h6>${bus.ticketClass}</h6>
                    <h6>${bus.fare}</h6>
                    <h6>${bus.wifi ? 'Yes' : 'No'}</h6>
                    <h6>${bus.food ? 'Yes' : 'No'}</h6>
                </section>
            `);
        });

        $('.table-row').on('click', function () {
            const busId = $(this).data('id');
            window.location.href = `seats.html?busId=${busId}`;
        });
    }

    function handleSignOut(event) {
        event.preventDefault(); // Prevent the default link behavior
        sessionStorage.clear(); // Clear session storage

        // Clear the session storage and replace the current state in history
        history.replaceState(null, null, './LoginPage.html');
        window.location.replace('./LoginPage.html');
        
        // Add an empty state to history so that back and forward buttons are disabled
        history.pushState(null, null, './LoginPage.html');
        history.pushState(null, null, './LoginPage.html');

        // Prevent navigation when back or forward button is used
        window.addEventListener('popstate', function(event) {
            history.pushState(null, null, './LoginPage.html');
        });
    }

    document.getElementById('sign-out').addEventListener('click', handleSignOut);
    

    getBuses();
});
