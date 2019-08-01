document.addEventListener("DOMContentLoaded", ()=>{
const BOOKS_URL = `http://localhost:3000/books`;
const bookTitlesUL = document.getElementById("list");
const showBooksPanel = document.getElementById("show-panel");
document.addEventListener('click', eventHandler);

fetch(BOOKS_URL)
.then(res => res.json())
.then(books =>{
    books.forEach(renderBooks)
})

function renderBooks(book){
    bookTitlesUL.innerHTML += `<li class="book-item" data-id="${book.id}">${book.title}</li>`
}

function eventHandler(e){
    if(e.target.className === "book-item"){
        getBookInfo(e.target)
    } else if(e.target.tagName === "BUTTON"){
        likeBook(e.target)
    }
}

function getBookInfo(book){
    let id = book.dataset.id;
    fetch(`${BOOKS_URL}/${id}`)
    .then(res => res.json())
    .then(showBooksInfo)
}

function showBooksInfo(book){
    showBooksPanel.innerHTML = 
    `<h1>${book.title}</h1>
    <img src=${book.img_url}></img>
    <p>${book.description}</p>
    <h2>Users:</h2>
    <ul id="likers">
    ${book.users.map(u =>{
        return `<li>${u.username}</li>`
    }).join("")}
    </ul>
    <button class="like" data-id="${book.id}">Like<button>`
}

function likeBook(book){
    let id =  book.dataset.id
    fetch(`${BOOKS_URL}/${id}`)
    .then(res => res.json())
    .then(book =>{
        let userArray = book.users

    userArray.push({
        "id": 1,
        "username": "pouros"})

    fetch(`${BOOKS_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({users:userArray}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(liker=>{
        const likers = document.getElementById("likers")
        let lastLiker = userArray[liker.users.length-1]
        likers.innerHTML += `<li>${lastLiker.username}</li>`
    })
})
}

});
