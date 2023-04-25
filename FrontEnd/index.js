//Déclaration des variables globales
let categories = new Set();
let project = new Set();
let categoriesIdSet = new Set();
let categoryToReturn = '';
let adminOption = 'off';
let idToModify = '';
let allDbProject = new Set();
let imageUploaded = false;
var snackbar = document.querySelector('.snackbar');

// Fonction à jouer au lancement de la page index
this.uploadProject();
this.uploadCategories();
this.verifyUser()

// fonction pour uploader tous les projet de la database
function uploadProject() {
    //rénitialisation des variables categories et project
    project.clear();
    categories.clear();
    // appel à la API method GET
    const response = fetch('http://localhost:5678/api/works', {
        method: 'get',
        headers: {
            'accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            //Action à réaliser en retour de réponse positive
            const gallery = document.querySelector('.gallery');
            gallery.innerHTML = ''; //vide de la gallery
            //Boucle for sur tous les projets obtenu dans l'appel API
            for (let d in data) {
                gallery.insertAdjacentHTML('beforeend', `<div class="gallery__item">
                <img src="${data[d].imageUrl}" alt="${data[d].title}" class="gallery__img">
                <div class="gallery__info">
                <p class="gallery__title">${data[d].title}</p>`)
                categories.add(data[d].category.name); //Remplissage de l'objet set pour le réutiliser dans le chargement des catégories
                project.add(data[d]);//remplissage de la variable project pour les réutiliser dans la fonction de filtre
            }
        })
}

//fonction pour remplir la listbox des catégories
function uploadCategories() {
    const categories = document.querySelector('#categories-list');
    //Appel à l'API catégories
    const data = fetch('http://localhost:5678/api/categories', {
        method: 'get',
        headers: {
            'accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(datas => {
        document.querySelector('.categories-list').insertAdjacentHTML('beforeend', `<div class="categories-button categories-button--active">tous</div>`) 
            for (let data in datas) {
                document.querySelector('.categories-list').insertAdjacentHTML('beforeend', `<div class="categories-button">${datas[data].name}</div>`)
            }
        })
}

// fonction pour filtrer par catégories
document.addEventListener('click', function (e) {
    //Récupération de l'objet cliqué en fonction de la classe css
    if (e.target.classList.contains('categories-button')) {
        //retire la classe css active de l'ancien bouton
        const activeButton = document.querySelector('.categories-button--active');
        activeButton.classList.remove('categories-button--active');
        //place la classe css sur le target actuel
        e.target.classList.add('categories-button--active');
        // Créer un tableau avec les data de l'objet set project
        const projectArray = Array.from(project);
        //filtrer les projets grâce à la fonction filterWork qui récupère l'innertext du bouton cliqué
        const filterToReturn = projectArray.filter(function (filterWork) {
            return filterWork.category.name === e.target.innerText;
        })
        //vide de la section gallery
        document.querySelector('.gallery').innerHTML = '';
        //Condition Si il y a des projets à filtrer
        if (filterToReturn.length !== 0) {
            //Boucle for pour parcourir tous les objets à uploader
            for (let i in filterToReturn) {
                //je remplie la gallery avec les projets
                const gallery = document.querySelector('.gallery');
                gallery.insertAdjacentHTML('beforeend', `    <div class="gallery__item">
                    <img src="${filterToReturn[i].imageUrl}" alt="${filterToReturn[i].title}" class="gallery__img">
                    <div class="gallery__info">
                        <p class="gallery__title">${filterToReturn[i].title}</p>`)
            }

        }
        // si il y 0 projet dans mes filtres alors je raffiche tous les projets (valable au click sur le bouton tous)
        else {
            for (let i in projectArray) {
                const gallery = document.querySelector('.gallery');
                gallery.insertAdjacentHTML('beforeend', `    <div class="gallery__item">
                    <img src="${projectArray[i].imageUrl}" alt="${projectArray[i].title}" class="gallery__img">
                    <div class="gallery__info">
                        <p class="gallery__title">${projectArray[i].title}</p>`)
            }
        }
    }
})

//Fonction pour vérifier si l'utilisateur est connecté
function verifyUser() {
    //Si il y a un token dans le sessionStorage
    if (sessionStorage.getItem('token')) {
        const body = document.querySelector('body');
        body.insertAdjacentHTML('afterbegin', `<div class="admin-panel">
        <div class="admin-panel__button panel-btn" onclick="openAdminPanel()">
        <img src="./assets/icons/Group.svg" alt="logo de modification" class="admin-panel__logo panel-btn" />
        <p class="admin-button__text panel-btn">Mode édition</p>
        </div>
        <div class="admin-panel__publy">Publier les changements</div>`);//j'affiche le panel Admin
        const logBtn = document.querySelector('#login-link');
        document.getElementById("categories-list").style.display = 'none'; //Je masque les boutons de filtre
        logBtn.innerText = 'logout'; //j'affiche logout au lieu de login
    }
}
// Fonction de déconnection de l'ulisateur 
document.querySelector('#login-link').addEventListener('click', function (e) {
    //si token dans sessionStorage
    if (sessionStorage.getItem('token')) {
        e.preventDefault(); //j'annule le lien avec la page login
        if (adminOption === 'on') {
            document.querySelector('.panel-btn').click();
        } //Je vérifie si mes boutons de modification de session sont affiché si oui je simule un clique pour les masquer
        sessionStorage.removeItem('token'); //j'enlève le storage
        const logBtn = document.querySelector('#login-link');
        logBtn.innerText = 'login'; //je re affiche login
        const adminPanel = document.querySelector('.admin-panel');
        adminPanel.remove(); //je supprime le panel administrateur
        document.getElementById("categories-list").style.display = 'flex'; //je re affiche les boutons des filtres
    } //autrement je ne fais que ce que fais le lien initialement
})

// Affichage des boutons de modification de section
function openAdminPanel() {
    //si adminOption off alors affichage les boutons de modification de section
    if (adminOption === 'off') {
        const profilPicture = document.querySelector('.profil-picture');
        profilPicture.insertAdjacentHTML('beforeend', `<div class="profil-picture__button">
    <img src="./assets/icons/Rewrite_black.svg" alt="logo de modification" class="rewrite__logo">
    <p class="rewrite-profil__text">modifier</p>
    </div>`);
    const profilArticle = document.querySelector('.profil-desc');
    profilArticle.insertAdjacentHTML('beforeend', `<div class="profil-desc__button">
<img src="./assets/icons/Rewrite_black.svg" alt="logo de modification" class="rewrite__logo">
<p class="rewrite-profil__text">modifier</p>
</div>`);
        const portfolioTitle = document.querySelector('.title-portfolio');
        portfolioTitle.insertAdjacentHTML('beforeend', `<div class="title-portfolio__button modal-open" onclick="openModal()">
    <img src="./assets/icons/Rewrite_black.svg" alt="logo de modification" class="rewrite__logo modal-open">
    <p class="rewrite__text modal-open">modifier</p>
    </div>`);
        adminOption = 'on'; //changement de la valeur de la var
    }
    //sinon suppression des boutons
    else {
        const profilPicture = document.querySelector('.profil-picture__button');
        profilPicture.remove();
        const profilArticle = document.querySelector('.profil-desc__button');
        profilArticle.remove();
        const portfolioTitle = document.querySelector('.title-portfolio__button');
        portfolioTitle.remove();
        adminOption = 'off';//changement de la valeur
    }
}

// fonction d'ouverture de la modal
function openModal() {
    const body = document.querySelector('body');
    body.insertAdjacentHTML('afterbegin', `<div class="rewrite-modal">
    <img src="./assets/icons/Close.svg" alt="logo de modification" class="cross__logo modal-close" onclick="closeModal()">
    <p class="modal__title">Galerie photo</p>
    <div class="modal-project__box">
    </div>
    <input type="submit" class="swap-modal green-btn" id="add-picture__button" value="Ajouter une photo" onclick="swapModal()">
    <input type="submit" class="delete-all" id="delete-all__button" value="supprimer la galerie">
    </div>
    <div class="rewrite-modal__bg modal-close" onclick="closeModal()"></div>`)
    modalUploadProjects(); //Appel de la fonction de récupération des projets
}
// fonction de récupération des projets dans la modal
function modalUploadProjects() {
    const response = fetch('http://localhost:5678/api/works', {
        method: 'get',
        headers: {
            'accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(datas => {
            // En cas de réussite je charge tous les élements
            for (let data in datas) {
                allDbProject.add(datas[data]); //Ajout des projets dans l'objet qui sert à la supression de tous les projets
                const modalProjectBox = document.querySelector('.modal-project__box');
                modalProjectBox.insertAdjacentHTML('beforeend', `<div class="modal__item">
        <img src="./assets/icons/Trash.svg" alt="icône de poubelle" class="delete__icon" id="${datas[data].id}">
        <img src="${datas[data].imageUrl}" alt="${datas[data].title}" class="modal__img">
        <p class="modal__text" id="${datas[data].id}">éditer</p>`)//id utilisé par la suppresion unitaire des projets
            }
        })
}

// Fonction pour fermer la modal
function closeModal() {
    const modalBg = document.querySelector('.rewrite-modal__bg');
    modalBg.remove(); //suppression du background
    const modal = document.querySelector('.rewrite-modal');
    modal.remove(); //suppresion de la modal
}

// Ouverture de la modal pour ajouter une image
function swapModal() {
    const modal = document.querySelector('.rewrite-modal');
    modal.innerHTML = "";//reset de la modal
    modal.insertAdjacentHTML('beforeend', `
    <img src="./assets/icons/Arrow_Back.svg" alt="logo de modification" class="arrow__icon" onclick="backToBasicModal()">
    <img src="./assets/icons/Close.svg" alt="logo de modification" class="cross__logo modal-close" onclick="closeModal()">
    <p class="modal__title">Ajout photo</p>
    <div id="add-response"></div>
    <form class="add-picture__form" id="new-project__upload">
    <div class="add-picture__box">
    <img src="./assets/icons/pictureicon.svg" alt="logo de modification" class="add-picture__icon">
    <label class="add-picture__label" for="add-picture__input">+ Ajouter photo</label>
    <input type="file" class="add-picture__input i" id="add-picture__input" accept="image/png, image/jpeg" name="image" onchange="changeFile()">
    <div class="picture-type__txt">jpg, png : 4mo max</div>
    </div>
    <label class="modal-label__txt" for="add-picture__text">Titre</label>
    <input type="text" class="add-picture__user i" id="add-picture__text" name="title">
    <label class="modal-label__txt" for="add-picture__list">Catégorie</label>
    <input list="categories-list" class="add-picture__user list i" id="add-picture__list" name="categoryId">
    <datalist id="categories-list">
    </datalist>
    <span class="span__border"></span>
    <input type="submit" class="add-picture__button grey-btn" id="add-btn" value="Valider">
    `)
    getCategories(); // appel la fonction getCategories pour remplir la list des catégories disponnibles
}

// Si l'utilisateur appuie sur la fèche alors retour à la modal d'éditon et supression initiale
function backToBasicModal() {
    const modalBg = document.querySelector('.rewrite-modal__bg');
    modalBg.remove(); //suppression du background
    const modal = document.querySelector('.rewrite-modal');
    modal.remove();
    openModal(); //rejoue la fonction openModal
}
// Lors du changement de l'input type file
function changeFile() {
    const inputFile = document.querySelector('.add-picture__input')
    //appel de la fonction pour vérifier si le fichier est sous un format valide
    //Condition Si il n'y a pas de fichier
    if (validFileType(inputFile.files[0] === '')) { //ne rien faire
    }
    //sinon
    else {
        //si le fichier est sous le bon format alors
        if (inputFile.files[0].type === 'image/png' || inputFile.files[0].type === 'image/jpeg') {
            //vérification de la taille du fichier
            //si fichier trop volumineux
            if (inputFile.files[0].size > 4000000) { alert('Photo trop volumineuse') } //alerte
            //sinon
            else {
                const imgUploaded = document.createElement('img');
                imgUploaded.src = URL.createObjectURL(inputFile.files[0]);
                imgUploaded.className = 'img-uploaded';
                document.querySelector('.add-picture__box').appendChild(imgUploaded); //je créer la visualisation de l'image
                imageUploaded = true;
            }
        } else { alert('Format non accepté') } //sinon format non accepté
    }
}

//Listes des fichier accepté par l'input file
const fileTypes = [
    "image/jpeg",
    "image/png"
];
//fonction de vérification si fichier correcte
function validFileType(file) {
    return fileTypes.includes(file.type);
}

//fonction pour remplir la listbox des catégories
function getCategories() {
    const categories = document.querySelector('#categories-list');
    //Appel à l'API catégories
    const data = fetch('http://localhost:5678/api/categories', {
        method: 'get',
        headers: {
            'accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(datas => {
            for (let data in datas) {
                //en retour je créer des options de sélection pour ma listbox
                categoriesIdSet.add(datas[data]); //Objet Set qui sert à récupérer les catégories avec leurs ID utiliser pour ajouter un projet
                categories.innerHTML += `<option value="${datas[data].name}"/>`;
            }
        })
}
// Si l'utilisateur appuie sur le bouton de la validation du formulaire d'ajout de projet
document.addEventListener('submit', function (e) {
    if (e.target.classList.contains('add-picture__form')) {
        e.preventDefault(); //j'annule le réfraichissement de la page
        //Const pour selectioner les élément du form
        const userFile = document.getElementById('add-picture__input');
        const userTitle = document.getElementById('add-picture__text');
        const userCategory = document.getElementById('add-picture__list');
        //vérification si tous les champs sont rempli
        //si non
        if (imageUploaded === false || userTitle.value === '' || userCategory.value === '') {
            snackbar.innerHTML = 'Veuillez remplir tous les champs du formulaire'
            snackbarShow();
        }
        //si oui
        else {
            //Création d'un array depuis mon objet set pour transformer l'input string de l'utilisateur en id integer
            const cat = Array.from(categoriesIdSet)
            //boucle for pour annalyser toutes les catégories
            for (let c in cat) {
                //lorsque que le champs de la list box match avec une catégories
                if (document.querySelector('.list').value === cat[c].name) {
                    categoryToReturn = cat[c].id; //modification de la valeur de l'id de la catégorie à retourner
                }
            }
            //si pas de catégorie trouvée alors message d'alerte pour sélectionner une catégories existante.
            //******************A MODIFIER QUAND API BACKEND DE CREATION DE CATEGORIE OK*****************************/
            if (categoryToReturn === '') {
                snackbar.innerHTML = 'Veuillez choisir une catégorie existante'
                snackbarShow();
            }
            //si un id à la catégorie entrée dans le champs liste a été trouvé alors
            else {
                const form = document.querySelector('.add-picture__form');
                const formData = new FormData() //Création du form data + remplissage des infos
                formData.append('image', userFile.files[0], userFile.files[0].name)
                formData.append('title', document.getElementById('add-picture__text').value)
                formData.append('category', categoryToReturn)
                //Appel à l'API méthode POST
                fetch('http://localhost:5678/api/works', {
                    method: 'POST',
                    headers: {
                        "Authorization": 'Bearer ' + sessionStorage.token
                    },
                    body: formData
                }).then(response => response.json())
                    .then(data => {
                        //Si le projet est créer
                        snackbar.innerHTML = 'Projet correctement ajouté'
                        snackbarShow();
                        uploadProject() //simulation réactualisation de la page 
                    }
                    )
                    .catch(error => {
                        snackbar.innerHTML = "Projet n'a pas pu être ajouté";
                        snackbarShow();
                    })
                //Reset du formulaire
                categoryToReturn = null;
                const imgUploaded = document.querySelector('.img-uploaded');
                imgUploaded.remove();
                userFile.value = '';
                userTitle.value = '';
                userCategory.value = '';
            }
        }
    }
})
//si l'utilisateur appuie sur une icone de supression
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete__icon')) {
        //récupération de l'id du target
        id = e.target.id;
        //Appel de l'API works avec l'id à supprimer en method DELETE
        const r = fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": 'Bearer ' + sessionStorage.token
            }
        }).then(response => {
            snackbar.innerHTML = 'Le projet a été supprimé'
            snackbarShow();
            e.target.parentElement.remove(); //suppression du target
            uploadProject(); //simulation réactualisation de la page 
        }
        )
        .catch(error => {
            snackbar.innerHTML = "Projet n'a pas pu être supprimé";
            snackbarShow();
        })
        
    }
})
//si l'utilisateur appuie sur supprimer la galerie
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-all')) {
        e.preventDefault; //supprimer le rafraichissement de la page
        //Création d'un tableau pour récupérer tous les projets présents dans l'API
        const projectsID = Array.from(allDbProject);
        //Boucle for pour supprimer tous les projets 1 par 1
        for (let project in projectsID) {
            const r = fetch(`http://localhost:5678/api/works/${projectsID[project].id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": 'Bearer ' + sessionStorage.token
                }
            }).then(response => {
                const modalProjectBox = document.querySelector('.modal-project__box');
                modalProjectBox.innerHTML = "";
                uploadProject();//on réactualise la page
                allDbProject.delete(projectsID[project]);//on enlève le projet de l'objet Set
            })
            snackbar.innerHTML = 'Tous les projets ont été supprimés'
            snackbarShow();
        }
    }
})

function snackbarShow() {
    snackbar.classList.add("show")
    setTimeout(function () { snackbar.classList.remove("show"); }, 3000);
}

document.addEventListener('change', function (e) {
    if (e.target.classList.contains('i')) {
        const btnAdd = document.getElementById('add-btn');
        const userFile = document.getElementById('add-picture__input');
        const userTitle = document.getElementById('add-picture__text');
        const userCategory = document.getElementById('add-picture__list');
        if (imageUploaded === false || userTitle.value === '' || userCategory.value === '') {
            btnAdd.classList.add('grey-btn');
            btnAdd.classList.remove('green-btn')
        } else {
            btnAdd.classList.add('green-btn');
        }
    }
})