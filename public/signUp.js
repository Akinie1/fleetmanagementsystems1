const togglePassword = document.querySelector('#toggle-password');
const password = document.querySelector('#password');
const form = document.querySelector('#myForm'); // Ensure the correct selector is used
const emailError = document.querySelector('.email.error');
const passwordError = document.querySelector('.password.error');
const telephoneError = document.querySelector('.telephone.error');
// A Function to take values from the form
form.addEventListener('submit',  async (e) => {
    e.preventDefault(); // Prevents the page from refreshing

console.log("Button has been clicked");


// reset errors everytime we press the submit button.
emailError.textContent = " "; 
passwordError.textContent = " ";
telephoneError.textContent = " ";


    // Get the values from the form
    const email = form.email.value;
    const Password = form.Password.value;
    const confirmPassword = form.confirmPassword.value;
    const telephone = form.telephone.value;
    const pageType = 'Sign Up'; 

    let values = {email,Password,confirmPassword,telephone,pageType};



//   check if the email is a correct email address.
// Check if the email contains '@'
if (values.email.includes('@')) {

    // Check if the phone number is 10 digits and only contains numbers
    if (values.telephone.length === 10 && /^\d+$/.test(values.telephone)) {
        
        try {
            // Use fetch API to send the data
            const res = await fetch('/login', {
                method: 'POST',
                // Stringify the values object to send it as JSON
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json' // Specify that we are sending JSON data
                }
            });

            // Await the response and parse it as JSON
            const data = await res.json();

            // Check if there are any errors in the response
            if (data.errors) {
                // Display errors to the user
                emailError.textContent = data.errors.email; 
                passwordError.textContent = data.errors.password;
                telephoneError.textContent = data.errors.highSchool;
            } else {
                // Redirect to the home page on success
                location.assign('/');
            }

        } catch (err) {
            // Handle errors related to the fetch request or server endpoint
            console.error("Fetch request failed:", err);
        }

    } else {
        // Display an error message for an invalid phone number
        telephoneError.textContent = "Please enter a valid 10-digit phone number.";
    }

} else {
    // Display an error message for an invalid email
    emailError.textContent = "Please enter a valid email address.";
}

   











});






// Function to make password hidden or visible
togglePassword.addEventListener('click', (event) => {
    const inputType = password.getAttribute('type') === 'password' ? 'text' : 'password';

    password.setAttribute('type', inputType);
    togglePassword.classList.toggle('bxs-hide');
})

function validateForm() {
    var checkbox = document.getElementById("checkbox");
    
    // Check if the checkbox is checked
    if (!checkbox.checked) {
        alert("Please read the 'User Consent Statement' and check the checkbox.");
      return false; // Prevent form submission
    }
    
    // Form is valid, allow submission
    return true;
}





