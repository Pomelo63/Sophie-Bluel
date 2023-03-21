const loginButton = document.getElementById('login-form');
loginButton.addEventListener('submit', function (e) {
    e.preventDefault();
    let userEmail = document.querySelector('#email').value;
    let userPassword = document.querySelector('#password').value;
    if (userEmail === '' || userPassword === '') { alert('Please enter your email and password'); }
    else {
        const log = fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userEmail,
                password: userPassword
            })
        })
        log.then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                alert('Invalid email or password');
            }
        }).then((r) => {
            try {
                if (r.token) {
                    sessionStorage.setItem("token", r.token);
                    alert("Logged in successfully", "success");
                    window.location.href = "index.html";
                }
            }
            catch (err) {
            }
        })
    }
})
