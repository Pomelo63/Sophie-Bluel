let categories = new Set();
let project = new Set();
let categoriesIdSet = new Set();
let categoryToReturn = '';
let adminOption = 'off';
let idToModify = '';
let allDbProject = new Set();
// Onload event call Uploadproject function
window.onload = uploadProject();
verifyUser()
// function to upload all projects in the database
function uploadProject() {
    project.clear();
    categories.clear();
    const response = fetch('http://localhost:5678/api/works', {
        method: 'get',
        headers: {
            'accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            const gallery = document.querySelector('.gallery');
            gallery.innerHTML = '';
            for (let d in data) {
                gallery.insertAdjacentHTML('beforeend', `
    <div class="gallery__item">
        <img src="${data[d].imageUrl}" alt="${data[d].title}" class="gallery__img">
        <div class="gallery__info">
            <p class="gallery__title">${data[d].title}</p>`)
                categories.add(data[d].category.name);
                project.add(data[d]);
            }
            const c = Array.from(categories);
            c.unshift('Tous');
            const cat = document.querySelector('.title-portfolio');
            cat.insertAdjacentHTML('afterend', `<div class="categories-list"></div>`)
            for (let i in c) {
                document.querySelector('.categories-list').insertAdjacentHTML('beforeend', `<div class="categories-button">${c[i]}</div>`)
                if (i == 0){
                    document.querySelector('.categories-button').classList.add('categories-button--active');
                }
            }
        })
}
// function to filter projects by category
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('categories-button')) {
        const activeButton = document.querySelector('.categories-button--active');
        activeButton.classList.remove('categories-button--active');
        e.target.classList.add('categories-button--active');
        const p = Array.from(project);
        const filterToReturn = p.filter(function (filterWork) {
            return filterWork.category.name === e.target.innerText;
        })
        document.querySelector('.gallery').innerHTML = '';
        if (filterToReturn.length !== 0) {
            for (let i in filterToReturn) {
                const gallery = document.querySelector('.gallery');
                gallery.insertAdjacentHTML('beforeend', `    <div class="gallery__item">
                    <img src="${filterToReturn[i].imageUrl}" alt="${filterToReturn[i].title}" class="gallery__img">
                    <div class="gallery__info">
                        <p class="gallery__title">${filterToReturn[i].title}</p>`)
            }

        }
        else {
            for (let i in p) {
                const gallery = document.querySelector('.gallery');
                gallery.insertAdjacentHTML('beforeend', `    <div class="gallery__item">
                    <img src="${p[i].imageUrl}" alt="${p[i].title}" class="gallery__img">
                    <div class="gallery__info">
                        <p class="gallery__title">${p[i].title}</p>`)
            }
        }
    }
})

//Verify if the user is logged in or not
function verifyUser() {
    //If user is logged in
    if (sessionStorage.getItem('token')) {
        const body = document.querySelector('body');
        body.insertAdjacentHTML('afterbegin', `<div class="admin-panel">
        <div class="admin-panel__button panel-btn">
        <img src="./assets/icons/Group.svg" alt="logo de modification" class="admin-panel__logo panel-btn">
        <p class="admin-button__text panel-btn">Mode édition</p>
        </div>
        <div class="admin-panel__publy">Publier les changements</div>`);
        const logBtn = document.querySelector('#login-link');
        logBtn.innerText = 'logout';
    }
}
// function to logout the user
document.querySelector('#login-link').addEventListener('click', function (e) {
    if (sessionStorage.getItem('token')) {
        e.preventDefault();
        sessionStorage.removeItem('token');
        const logBtn = document.querySelector('#ogin-link');
        logBtn.innerText = 'login';
        const adminPanel = document.querySelector('.admin-panel');
        adminPanel.remove();
    } //Else do nothing
})
// Display parts modification button
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('panel-btn')) {
        if (adminOption === 'off') {
            const profilPicture = document.querySelector('.profil-picture');
            profilPicture.insertAdjacentHTML('beforeend', `<div class="profil-picture__button">
    <img src="./assets/icons/Rewrite_black.svg" alt="logo de modification" class="rewrite__logo">
    <p class="rewrite-profil__text">Modifier</p>
    </div>`);
            const portfolioTitle = document.querySelector('.title-portfolio');
            portfolioTitle.insertAdjacentHTML('beforeend', `<div class="title-portfolio__button modal-open">
    <img src="./assets/icons/Rewrite_black.svg" alt="logo de modification" class="rewrite__logo modal-open">
    <p class="rewrite__text modal-open">Modifier</p>
    </div>`);
            adminOption = 'on';
        }
        else {
            const profilPicture = document.querySelector('.profil-picture__button');
            profilPicture.remove();
            const portfolioTitle = document.querySelector('.title-portfolio__button');
            portfolioTitle.remove();
            adminOption = 'off';
        }
    }
}
)
// function onclick to call the open modal function
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-open')) {
        const body = document.querySelector('body');
        body.insertAdjacentHTML('afterbegin', `<div class="rewrite-modal__bg modal-close"></div>`)
        openModal();
    }
})
// function to open the modal
function openModal() {
    const body = document.querySelector('body');
    body.insertAdjacentHTML('afterbegin', `<div class="rewrite-modal">
    <img src="./assets/icons/Close.svg" alt="logo de modification" class="cross__logo modal-close">
    <p class="modal__title">Galerie photo</p>
    <div class="modal-project__box">
    </div>
    <input type="submit" class="swap-modal" id="add-picture__button" value="Ajouter une photo">
    <input type="submit" class="delete-all" id="delete-all__button" value="supprimer la galerie">
    </div>`)
    modalUploadProjects();
}
// function to upload the projects in the modal
function modalUploadProjects() {
    const response = fetch('http://localhost:5678/api/works', {
        method: 'get',
        headers: {
            'accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            for (let d in data) {
                allDbProject.add(data[d]);
                const modalProjectBox = document.querySelector('.modal-project__box');
                modalProjectBox.insertAdjacentHTML('beforeend', `
    <div class="modal__item">
        <img src="./assets/icons/Trash.svg" alt="icône de poubelle" class="delete__icon" id="${data[d].id}">
        <img src="${data[d].imageUrl}" alt="${data[d].title}" class="modal__img">
        <p class="modal__text" id="${data[d].id}">éditer</p>`)
            }
        })
}

// function to close the modal
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-close')) {
        const modalBg = document.querySelector('.rewrite-modal__bg');
        modalBg.remove();
        const modal = document.querySelector('.rewrite-modal');
        modal.remove();
    }
}
)
// function to delete the projects in the modal

// Creat the Add picture modal
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('swap-modal')) {
        e.preventDefault();
        const modal = document.querySelector('.rewrite-modal');
        modal.innerHTML = "";
        modal.insertAdjacentHTML('beforeend', `
    <img src="./assets/icons/Arrow_Back.svg" alt="logo de modification" class="arrow__icon">
    <img src="./assets/icons/Close.svg" alt="logo de modification" class="cross__logo modal-close">
    <p class="modal__title">Ajout photo</p>
    <form class="add-picture__form" id="new-project__upload">
    <div class="add-picture__box">
    <img src="./assets/icons/pictureicon.svg" alt="logo de modification" class="add-picture__icon">
    <label class="add-picture__label" for="add-picture__input">+ Ajouter photo</label>
    <input type="file" class="add-picture__input" id="add-picture__input" accept="image/png, image/jpeg" name="image">
    <div class="picture-type__txt">jpg, png : 4mo max</div>
    </div>
    <label class="modal-label__txt" for="add-picture__text">Titre</label>
    <input type="text" class="add-picture__user" id="add-picture__text" name="title">
    <label class="modal-label__txt" for="add-picture__list">Catégorie</label>
    <input list="categories-list" class="add-picture__user list" id="add-picture__list" name="categoryId">
    <datalist id="categories-list">
    </datalist>
    <span class="span__border"></span>
    <input type="submit" class="add-picture__button" id="add-picture__button" value="Valider">
    `)
        getCategories();
    }
})
// function return to the basic modal
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('arrow__icon')) {
        const modal = document.querySelector('.rewrite-modal');
        modal.remove();
        openModal();
    }
})
// function to get user file input
document.addEventListener('change', function (e) {
    if (e.target.classList.contains('add-picture__input')) {
        if (validFileType(e.target.files[0] === '')) { }
        else {
            if (e.target.files[0].type === 'image/png' || e.target.files[0].type === 'image/jpeg') {
                if (e.target.files[0].size > 4000000) { alert('Photo trop volumineuse') }
                else {
                    const imgUploaded = document.createElement('img');
                    imgUploaded.src = URL.createObjectURL(e.target.files[0]);
                    imgUploaded.className = 'img-uploaded';
                    document.querySelector('.add-picture__box').appendChild(imgUploaded);
                }
            } else { alert('Format non accepté') }
        }
    }
})
//List of Valid File Types
const fileTypes = [
    "image/jpeg",
    "image/png"
];
//check if the file type is valid
function validFileType(file) {
    return fileTypes.includes(file.type);
}
//function get categories name for input list
function getCategories() {
    const categories = document.querySelector('#categories-list');
    const data = fetch('http://localhost:5678/api/categories', {
        method: 'get',
        headers: {
            'accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            for (let d in data) {
                categoriesIdSet.add(data[d]);
                categories.innerHTML += `<option value="${data[d].name}"/>`;
            }
        })
}
// function to creat a new project
document.addEventListener('submit', function (e) {
    if (e.target.classList.contains('add-picture__form')) {
        e.preventDefault();
        const userFile = document.getElementById('add-picture__input');
        const userTitle = document.getElementById('add-picture__text');
        const userCategory = document.getElementById('add-picture__list');
        if (userFile.files.length === 0 || userTitle === '' || userCategory === '') { alert('Veuiller remplir tous les champs du formulaire') }
        else {
            const cat = Array.from(categoriesIdSet)
            for (let c in cat) {
                if (document.querySelector('.list').value === cat[c].name) {
                    categoryToReturn = cat[c].id;
                }
            }
            if (categoryToReturn === '') { alert('Veuillez choisir une catégorie existante') }
            else {
                const form = document.querySelector('.add-picture__form');
                const formData = new FormData()
                formData.append('image', userFile.files[0], userFile.files[0].name)
                formData.append('title', document.getElementById('add-picture__text').value)
                formData.append('category', categoryToReturn)
                fetch('http://localhost:5678/api/works', {
                    method: 'POST',
                    headers: {
                        "Authorization": 'Bearer ' + sessionStorage.token
                    },
                    body: formData
                }).then(response => response.json())
                    .then(data => {
                        const listToDelete = document.querySelector('.categories-list');
                        listToDelete.remove();
                        uploadProject()
                    }
                    )
                    .catch(error => console.log("impossible d'ajouter ce projet"))
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
// function to delete the projects in the modal
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete__icon')) {
        id = e.target.id;
        const r = fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                "Accept": "*/*",
                "Authorization": 'Bearer ' + sessionStorage.token
            }
        })
        e.target.parentElement.remove();
        const listToDelete = document.querySelector('.categories-list');
        listToDelete.remove();
        uploadProject();
    }
})
//Function to delete all the project
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-all')) {
    e.preventDefault;
    const projectsID = Array.from(allDbProject);
    for (let p in projectsID) {
        console.log(projectsID[p].id);
        const r = fetch(`http://localhost:5678/api/works/${projectsID[p].id}`, {
            method: 'DELETE',
            headers: {
                "Accept": "*/*",
                "Authorization": 'Bearer ' + sessionStorage.token
            }
        }).then(response => {
            const modalProjectBox = document.querySelector('.modal-project__box');
            modalProjectBox.innerHTML = "";
            const listToDelete = document.querySelector('.categories-list');
            listToDelete.remove();
            uploadProject();
            allDbProject.delete(projectsID[p]);
        })
    }
    }
})