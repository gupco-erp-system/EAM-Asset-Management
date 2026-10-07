async function handleLogin(e) {
    if (e) e.preventDefault();
    
    const usernameInput = document.getElementById("usernameInput").value.trim();
    const passwordInput = document.getElementById("passwordInput").value.trim();
    const loginError = document.getElementById("loginError");

    if (!usernameInput || !passwordInput) {
        showError("Please fill in all fields.");
        return;
    }

    try {
        // Fetch the users.csv file (Make sure users.csv is in the same folder)
        const response = await fetch('users.csv');
        if (!response.ok) {
            throw new Error("Could not load users.csv file.");
        }
        
        const csvText = await response.text();

        // Parse CSV using Papa Parse
        Papa.parse(csvText, {
            header: true, // Assumes your CSV has a header row like: username,password
            skipEmptyLines: true,
            complete: function(results) {
                const users = results.data;
                
                // Check if any row matches the input username and password
                // Adjust 'username' and 'password' below if your CSV column names are different
                const matchedUser = users.find(user => 
                    user.username.trim() === usernameInput && 
                    user.password.trim() === passwordInput
                );

                if (matchedUser) {
                    loginError.style.display = "none";
                    alert("Login successful!");
                    // Redirect or load dashboard here
                } else {
                    showError("Invalid username or password.");
                }
            },
            error: function(error) {
                showError("Error parsing user data.");
                console.error(error);
            }
        });

    } catch (error) {
        showError("System error: Unable to verify credentials.");
        console.error(error);
    }
}

function showError(message) {
    const loginError = document.getElementById("loginError");
    loginError.textContent = message;
    loginError.style.display = "block";
}