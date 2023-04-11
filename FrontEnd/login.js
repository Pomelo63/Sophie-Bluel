const loginButton = document.getElementById('login-form');
const loginResponse = document.getElementById('login-response');
var snackbar = document.querySelector('.snackbar');

//Quand l'utilisateur appuie sur le bouton de validation
loginButton.addEventListener('submit', function (e) {
    e.preventDefault();//annulation de l'exécution initiale
    let userEmail = document.querySelector('#email').value;
    let userPassword = document.querySelector('#password').value;
    //si les login utilisateur vident
    if (userEmail === '' || userPassword === '') {
        snackbar.innerHTML = "Veuillez remplir tous les champs"
        snackbarShow();
    }
    //si tous les champs différents de ""
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
            //si identifiants ok
            if (response.status === 200) {
                return response.json();
            } else { //Si identifiant incorrect
                snackbar.innerHTML = "Identifiants incorrects"
                snackbarShow();
            }
        }).then((r) => {
            try {
                if (r.token) {
                    sessionStorage.setItem("token", r.token); //Remplit le token dans la session storage
                    snackbar.innerHTML = "Connection réussie"
                    snackbarShow();
                    setTimeout(function () { window.location.href = "index.html"; }, 2000)//change de fen^tre après 200ms
                }
            }
            catch (err) {
            }
        })
    }
})

function snackbarShow() {
    snackbar.classList.add("show")
    setTimeout(function () { snackbar.classList.remove("show"); }, 3000);
}