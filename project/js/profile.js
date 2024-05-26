$(document).ready(function() {
    const profileDataUrl = './json/data.json';
    let jsonData; // Variable to store the JSON data

    function fetchProfileData() {
        $.ajax({
            type: 'GET',
            url: profileDataUrl,
            success: function(data) {
                jsonData = data; // Store the JSON data in a variable
                const user = data.admin[0];
                $('#profile-job').text(user["Job Specification"]);
                $('#profile-name').text(user.Name);
                $('#profile-gender').text(user.Gender);
                $('#profile-cnic').text(user.CNIC);
                $('#profile-country').text(user.Country);
                $('#profile-email').text(user.email);
                $('#profile-password').text(user.password);
                $('#profile-phone').text(user.Phone);
                $('#profile-address').text(user.Address);
                $('#profile-picture').attr('src', user.profilePicture);
            },
            error: function(error) {
                console.error('Error fetching profile data:', error);
            }
        });
    }

    async function updateProfileDataLocally(updatedData) {
        try {
            // Modify the JSON data
            jsonData.admin[0]["Job Specification"] = updatedData["Job Specification"];
            jsonData.admin[0]["Name"] = updatedData["Name"];
            jsonData.admin[0]["Gender"] = updatedData["Gender"];
            jsonData.admin[0]["CNIC"] = updatedData["CNIC"];
            jsonData.admin[0]["Country"] = updatedData["Country"];
            jsonData.admin[0]["email"] = updatedData["email"];
            jsonData.admin[0]["password"] = updatedData["password"];
            jsonData.admin[0]["Phone"] = updatedData["Phone"];
            jsonData.admin[0]["Address"] = updatedData["Address"];

            // Write the modified JSON data back to the file
            const response = await fetch(profileDataUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile data');
            }

            console.log('Profile data updated locally.');
        } catch (error) {
            console.error('Error updating profile data:', error);
        }
    }

    $('#upload-picture').change(function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#profile-picture').attr('src', e.target.result);
        }
        reader.readAsDataURL(file);
    });

    $('#edit-profile').click(function() {
        // Functionality for editing profile data
        const newProfileData = {}; // Object to store updated profile data
        
        // Prompt user for new profile data
        newProfileData["Job Specification"] = prompt("Enter new job specification:") || "";
        newProfileData["Name"] = prompt("Enter new name:") || "";
        newProfileData["Gender"] = prompt("Enter new gender:") || "";
        newProfileData["CNIC"] = prompt("Enter new CNIC:") || "";
        newProfileData["Country"] = prompt("Enter new country:") || "";
        newProfileData["email"] = prompt("Enter new email:") || "";
        newProfileData["password"] = prompt("Enter new password:") || "";
        newProfileData["Phone"] = prompt("Enter new phone:") || "";
        newProfileData["Address"] = prompt("Enter new address:") || "";

        // Update profile data displayed on the page
        $('#profile-job').text(newProfileData["Job Specification"]);
        $('#profile-name').text(newProfileData.Name);
        $('#profile-gender').text(newProfileData.Gender);
        $('#profile-cnic').text(newProfileData.CNIC);
        $('#profile-country').text(newProfileData.Country);
        $('#profile-email').text(newProfileData.email);
        $('#profile-password').text(newProfileData.password);
        $('#profile-phone').text(newProfileData.Phone);
        $('#profile-address').text(newProfileData.Address);
        
        // Update profile data in JSON file
        updateProfileDataLocally(newProfileData);
    });

    fetchProfileData();
});
