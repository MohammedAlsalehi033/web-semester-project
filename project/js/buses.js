$(document).ready(function () {
    const cities = ["Abbottabad", "Attock", "Awaran", "Bahawalpur", "Badin", "Bannu", "Batgram", "Bhakker", "Campbellpur", "Chakwal", "Charsadda", "Chiniot", "Daska", "Dadu", "Dera Ghazi Khan", "Faisalabad", "Ghotki", "Gwadar", "Gujranwala", "Gujjar Khan", "Gujrat", "Hafizabad", "Haripur", "Hyderabad", "Islamabad", "Islamabad Capital Territory", "Jacobabad", "Jamshoro", "Jhang", "Jhelum", "Kasur", "Kech", "Khanewal", "Khairpur", "Kohat", "Khuzdar", "Lahore", "Lasbela", "Layyah", "Leiah", "Larkana", "Lower Dir", "Malakand", "Mandi Bahauddin", "Mansehra", "Mardan", "Matiari", "Mianwali", "Mirpur Khas", "Multan", "Muzaffargarh", "Murree", "Nowshera", "Nowshero Feroz", "Okara", "Panjgur", "Peshawar", "Quetta", "Rahim Yar Khan", "Rawalpindi", "Sadiqabad", "Sanghar", "Sahiwal", " Sargodha", "Shangla", "Sheikhupura", "Shikarpur", "Sialkot", "Sialkot Cantonment", "Sukkur", "Swabi", "Talagang", "Tando Adam", "Tando Allahyar", "Tharparkar", "Toba Tek Singh", "Upper Dir", "Vehari", "Wah Cantt"];

    function populateCities() {
        cities.forEach(city => {
            $('#from').append(new Option(city, city));
            $('#to').append(new Option(city, city));
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

    // Toggle add bus panel
    $("#add-ticket-btn").click(function () {
        $("#ticket-panel").slideToggle();
        const buttonText = $(this).text() === "Add new Bus" ? "Cancel" : "Add new Bus";
        $(this).text(buttonText);
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

    $("#search-btn").click(function () {
        searchTickets();
    });

    function getBuses() {
        $.ajax({
            type: 'GET',
            url: 'https://webproject-123-41fb57c20018.herokuapp.com/tickets',
            success: function (buses) {
                console.log('Buses received:', buses);
                renderBuses(buses);
            },
            error: function (error) {
                console.error('Error getting buses:', error);
            }
        });
    }

    function searchTickets() {
        const fromCity = $("#search-from").val().toLowerCase();
        const toCity = $("#search-to").val().toLowerCase();

        $.ajax({
            type: 'GET',
            url: 'https://webproject-123-41fb57c20018.herokuapp.com/tickets',
            success: function (buses) {
                const filteredBuses = buses.filter(bus => {
                    return (
                        (!fromCity || bus.from.toLowerCase().includes(fromCity)) &&
                        (!toCity || bus.to.toLowerCase().includes(toCity))
                    );
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

    getBuses();
});
