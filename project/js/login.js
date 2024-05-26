function login() {
  const emailField = document.getElementById('email');
  const passwordField = document.getElementById('password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const email = emailField.value;
  const password = passwordField.value;

  // Clear previous error messages
  emailError.textContent = '';
  passwordError.textContent = '';

  if (!email && !password) {
      alert('Enter Email and Password to Login');
      emailField.focus();
      return;
  }

  if (!email) {
      emailError.textContent = '*Please enter your email.';
      emailField.focus();
      return;
  }

  if (!password) {
      passwordError.textContent = '*Please enter your password.';
      passwordField.focus();
      return;
  }

  // Fetch user data from profile.json
  fetch('./json/data.json')
      .then(response => response.json())
      .then(data => {
          const admin = data.admin; // Assuming admin is an array of users
          const user = admin.find(user => user.email === email && user.password === password);

          if (!user) {
              const emailExists = admin.some(user => user.email === email);
              const passwordExists = admin.some(user => user.password === password);

              if (!emailExists) {
                  emailError.textContent = '*The email you entered is wrong.';
                  emailField.focus();
              }

              if (!passwordExists) {
                  passwordError.textContent = '*The password you entered is wrong.';
                  passwordField.focus();
              }

              return;
          }

          sessionStorage.setItem('loggedIn', true);
          window.location.href = 'buses.html'; // Redirect to buses page
      })
      .catch(error => console.error('Error fetching user data:', error));
}
