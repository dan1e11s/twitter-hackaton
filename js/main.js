let regSpan = document.querySelector('#reg-span');
let logSpan = document.querySelector('#log-span');

let regPanel = document.querySelector('.reg');
let logPanel = document.querySelector('.log');


regSpan.addEventListener('click', () => {
    regPanel.setAttribute('style', 'display: block;');
    logPanel.setAttribute('style', 'display: none;');
    regSpan.setAttribute('style', 'border-bottom: 3px solid black;')
    logSpan.setAttribute('style', 'border-bottom: none;')
});
logSpan.addEventListener('click', () => {
    regPanel.setAttribute('style', 'display: none');
    logPanel.setAttribute('style', 'display: block');
    regSpan.setAttribute('style', 'border-bottom: none;')
    logSpan.setAttribute('style', 'border-bottom: 3px solid black')
});

//! registration
let nameInp = document.querySelector('#reg-name-inp');
let passwordInp = document.querySelector('#reg-password-inp');
let repeatPasswordInp = document.querySelector('#reg-password-repeat-inp');

let regBtn = document.querySelector('#reg-btn');

const USERS_API = 'http://localhost:8000/users';

async function checkUniqueName(Name) {
    let response = await fetch(USERS_API);
    let users = await response.json();
    return users.some(item => item.name === Name);
}

async function registerUser() {
    if (
        !nameInp.value.trim() ||
        !passwordInp.value.trim() ||
        !repeatPasswordInp.value.trim()
        ) {
            alert('Some inputs are empty!')
            return;
        };
        
        let uniqueName = await checkUniqueName(nameInp.value);
        
        if (uniqueName) {
            alert('Username is taken!');
            return;
        };
        
        if (passwordInp.value !== repeatPasswordInp.value) {
            alert('Passwords don\'t match!');
            return;
        };
        
        let userObj = {
            name: nameInp.value,
            password: passwordInp.value
        };
        
        fetch(USERS_API, {
            method: 'POST',
            body: JSON.stringify(userObj),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        })
        
        alert('Register successfully!');
        
        usernameInp.value = '';
        passwordInp.value = '';
        repeatPasswordInp.value = '';
    }
    
    regBtn.addEventListener('click', registerUser);
    
    //! login
    
    let logNameInp = document.querySelector('#log-name-inp');
    let logPasswordInp = document.querySelector('#log-password-inp');
    
    let logBtn = document.querySelector('#log-btn');
    let navUsername = document.querySelector('.username');
    let regLogPanel = document.querySelector('.reg-log-panel');
    let plusBtn = document.querySelector('.plus-png');
    let allPosts = document.querySelector('.active');
    let ownPosts = document.querySelector('#own-btn');
    let logout = document.querySelector('#logout');
    let container = document.querySelector('.container');
    
    async function getAllPosts() {
        
        container.innerHTML = '';
        
        let res = await fetch(POST_API);
        let data = await res.json();
        
        data.forEach(item => {
            container.innerHTML += `
            <div class="card" style="width: 18rem">
            <img src="${item.image}" class="card-img-top" alt="..." height="220px" />
            <div class="card-body">
            <p class="card-text">
            ${item.desc}
            </p>
            <div class="card-footer">
            <span class="likes">
            <span id="countLikes">0</span>
            <img src="./image/heart.png" alt="" width="25px" height="25px" />
            </span>
            <a href="#" class="btn btn-danger btn-delete" id="${item.id}">DELETE</a>
            <a href="#" class="btn btn-success btn-edit" data-bs-toggle="modal"
            data-bs-target="#staticBackdrop" id="${item.id}">EDIT</a>
            </div>
            </div>
            </div>
            `
            
        });
        
        if(data.length === 0) {
            return;
        }

        addLike();
    }
    
allPosts.addEventListener('click', getAllPosts);
ownPosts.addEventListener('click', render);

function checkUserInUsers(name, users) {
    return users.some(item => item.name === name);
};

function checkUserPassword(user, password) {
    return user.password === password;
};

function initStorage() {
    if(!localStorage.getItem('user')){
        localStorage.setItem('user', '{}');
    };
}

function setUserTostorage(name) {
    localStorage.setItem('user', JSON.stringify({
        user: name
    }))
};

async function loginUser() {
    let res = await fetch(USERS_API);
    let users = await res.json();

    if(!logNameInp.value.trim() || !logPasswordInp.value.trim()) {
        alert('Some inputs are empty');
        return;
    };

    if(!checkUserInUsers(logNameInp.value, users)) {
        alert('User not found!');
        return;
    };

    let userObj = users.find(item => item.name === logNameInp.value);

    if(!checkUserPassword(userObj, logPasswordInp.value)){
        alert('Wrong password!')
        return;
    };

    initStorage();

    setUserTostorage(userObj.name);

    logNameInp.value = '';
    logPasswordInp.value = '';

    regLogPanel.setAttribute('style', 'display: none');
    container.setAttribute('style', 'display: block; display: flex; justify-content: space-around; flex-wrap: wrap;')
    allPosts.setAttribute('style', 'display: block');
    logout.setAttribute('style', 'display: block');
    navUsername.setAttribute('style', 'display: block; color: #fff');
    plusBtn.setAttribute('style', 'display: block');
    ownPosts.setAttribute('style', 'display: block');
    navUsername.innerText = `${userObj.name}`;


    render();
}

logBtn.addEventListener('click', loginUser);

// logout
logout.addEventListener('click', () => {
    regLogPanel.setAttribute('style', 'display: block');
    container.setAttribute('style', 'display: none; display: flex; justify-content: space-around; flex-wrap: wrap;')
    container.removeAttribute('style', 'display: none; display: flex; justify-content: space-around; flex-wrap: wrap;')
    allPosts.setAttribute('style', 'display: none');
    logout.setAttribute('style', 'display: none');
    navUsername.setAttribute('style', 'display: none; color: #fff');
    plusBtn.setAttribute('style', 'display: none');
    ownPosts.setAttribute('style', 'display: none');
});

// create posts
const POST_API = 'http://localhost:8000/posts';

let addBtn = document.querySelector('#add-btn')

let imgInp = document.querySelector('#img-inp');
let descInp = document.querySelector('#desc-inp');

async function createPost(e) {
    e.preventDefault();
    if (
        !imgInp.value.trim() ||
        !descInp.value.trim()
    ) {
        alert('Some inputs are empty!');
        return;
    };

    const {user} = JSON.parse(localStorage.getItem('user')); 

    let postObj = {
        image: imgInp.value,
        desc: descInp.value,
        userId: user
    };

    await fetch(POST_API, {
        method: 'POST',
        body: JSON.stringify(postObj),
        headers: {
            "Content-Type": "application/json; charset=utf-8" 
        }
    });

    imgInp.value = '';
    descInp.value = '';

    render();
}

addBtn.addEventListener('click', createPost);

async function render() {
    const {user} = JSON.parse(localStorage.getItem("user"))
    container.innerHTML = '';
    let res = await fetch(POST_API);
    let posts = await res.json();

    posts.forEach(item => {
        if (item.userId === user) {
            container.innerHTML += `
            <div class="card" style="width: 18rem">
            <img src="${item.image}" class="card-img-top" alt="..." height="220px" />
            <div class="card-body">
            <p class="card-text">
            ${item.desc}
            </p>
            <div class="card-footer">
            <span class="likes">
            <span class="${item.id}" id="countLikes">0</span>
            <img src="./image/heart.png" alt="" width="25px" height="25px" class="likes-img"/>
            </span>
            <a href="#" class="btn btn-danger btn-delete" id="${item.id}">DELETE</a>
            <a href="#" class="btn btn-success btn-edit" data-bs-toggle="modal"
            data-bs-target="#staticBackdrop" id="${item.id}">EDIT</a>
            </div>
            </div>
            </div>
            `
        }
        // addLikeBtn.addEventListener("click", (e)=>{
        //     console.log(e.target)
        // })
    });


    if(posts.length === 0) {
        return;
    }

    addDeleteEvent();
    addEditEvent();
    // addLikeEvent()
}

render();


// delete
async function deleteProduct(e) {
    let postId = e.target.id;

    await fetch(`${POST_API}/${postId}`, {
        method: 'DELETE'
    });

    render();
}

function addDeleteEvent() {
    let deleteProductBtn = document.querySelectorAll('.btn-delete');
    deleteProductBtn.forEach(item => {
        item.addEventListener('click', deleteProduct);
    })
};

// edit

let saveChangesBtn = document.querySelector('.save-changes-btn');

function showAddAndEdit() {
    if(saveChangesBtn.id) {
        addBtn.setAttribute('style', 'display: none;');
        saveChangesBtn.setAttribute('style', 'display: block;');
    } else {
        addBtn.setAttribute('style', 'display: block;');
        saveChangesBtn.setAttribute('style', 'display: none;');
    }
}

showAddAndEdit();

async function addPostToForm(e) {
    let postId = e.target.id;
    let res = await fetch(`${POST_API}/${postId}`);
    let postObj = await res.json();
    
    imgInp.value = postObj.image;
    descInp.value = postObj.desc;

    saveChangesBtn.setAttribute('id', postObj.id);

    showAddAndEdit();
}

function addEditEvent() {
    let btnEditProduct = document.querySelectorAll('.btn-edit');
    btnEditProduct.forEach(item => {
        item.addEventListener('click', addPostToForm);
    })
};

async function saveChanges(e) {
    let updatedPostObj = {
        id: e.target.id,
        image: imgInp.value,
        desc: descInp.value
    };

    await fetch(`${POST_API}/${e.target.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedPostObj),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    imgInp.value = '';
    descInp.value = '';

    saveChangesBtn.removeAttribute('id');

    showAddAndEdit();

    render();
}


saveChangesBtn.addEventListener('click', saveChanges);



// async function addLike(e){
//     let postId = e.target.className
//     console.log(productId);
//     let res = await fetch(`${POST_API}/${postId}`);
//     let productObj = await res.json();
//     console.log(productObj)

//    await fetch(`${POST_API}/${postId}`, {
//     method: 'PATCH',
//     body: JSON.stringify({ likes: productObj.likes + 1}),
//     headers: {
//         "Content-Type": "application/json;charset=utf-8"
//     }
//    });

//    render();
// }
// like
// function addLikeEvent(){
//     let addLikeBtn = document.querySelectorAll(".likes-img")
//     addLikeBtn.forEach((item)=>{
//         item.addEventListener("click", addLike)
//     })
// }