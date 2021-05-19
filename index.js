const alert = document.querySelector('.alert')
const form = document.querySelector('.todo-form')
const todo = document.getElementById('todo')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.todo-container')
const list = document.querySelector('.todo-list')
const clearBtn = document.querySelector('.clear-btn')

let editElement
let editFlag = false
let editID = ''

form.addEventListener('submit', addItem) 

clearBtn.addEventListener('click', clearItems)

window.addEventListener('DOMContentLoaded', setupItems)

function addItem(e) {
    e.preventDefault()

    const value = todo.value
    const id = new Date().getTime().toString()
    
    if (value && !editFlag) {
        createListItem(id, value)
        displayAlert('Todo added to the list', 'success')
        container.classList.add('show-container')
        
        addToLocalStorage(id, value)
        setBackToDefault()
    } else if (value && editFlag) {
        editElement.innerHTML = value
        displayAlert('Todo edited', 'success')
        editLocalStorage(editID, value)
        setBackToDefault()
    } else {
        displayAlert('Please enter value','danger')
    }
}

function displayAlert(text, color) {
    alert.textContent = text
    alert.classList.add(`alert-${color}`)

    setTimeout(() => {
        alert.textContent = ''
        alert.classList.remove(`alert-${color}`)
    }, 1000)
}

function deleteTodo(e) {
    const element = e.currentTarget.parentElement.parentElement
    const id = element.dataset.id
    list.removeChild(element)
    if (list.children.length === 0) {
        container.classList.remove('show-container')
    }
    displayAlert('Todo deleted', 'danger')
    setBackToDefault()
    removeFromLocalStorage(id)
}

function editTodo(e) {
    const element = e.currentTarget.parentElement.parentElement
    editElement = e.currentTarget.parentElement.previousElementSibling
    todo.value = editElement.innerHTML
    editFlag = true
    editID = element.dataset.id
    submitBtn.textContent = 'edit'
}

function getLocalStorage(){
    return localStorage.getItem('list') 
    ? JSON.parse(localStorage.getItem('list'))
    : []
}

function addToLocalStorage(id, value) {
    const _todo = {id, value}
    let items = getLocalStorage()
    items.push(_todo)
    localStorage.setItem('list', JSON.stringify(items)) 
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage()
    items = items.filter(function(item){
        if(item.id !== id) {
            return item
        }
    })
    localStorage.setItem('list', JSON.stringify(items))
}

function editLocalStorage(id, value) {
    let items = getLocalStorage()
    items = items.map(function(item){
        if (item.id === id) {
            item.value = value
        }
        return item
    })
    localStorage.setItem('list', JSON.stringify(items))
}

function setBackToDefault() {
    todo.value = ''
    editFlag = false
    editID = ''
    submitBtn.textContent = 'Submit'
}

function clearItems() {
    const todos = document.querySelectorAll('.todo-item')
    if (todos.length > 0){
        todos.forEach(todo => {
            list.removeChild(todo)
        })
    }
    container.classList.remove('show-container')
    displayAlert('List deleted', 'danger')
    setBackToDefault()
    localStorage.removeItem('list')
}

function setupItems(){
    let items = getLocalStorage()
    if (items.length > 0) {
        items.forEach(function(item){
            createListItem(item.id, item.value)
        })
        container.classList.add('show-container')
    }
}

function createListItem(id, value) {
    const element = document.createElement('article')
        element.classList.add('todo-item')
        const attr = document.createAttribute('data-id')
        attr.value = id
        element.setAttributeNode(attr)
        element.innerHTML = `
            <p class="title">${value}</p>
            <div class="btn-container">
                <button type='button' class='edit-btn'>
                    <i class='fas fa-edit'></i>
                </button>
                <button type='button' class='delete-btn'>
                    <i class='fas fa-trash'></i>
                </button>
            </div>
        `
        const deleteBtn = element.querySelector('.delete-btn')
        const editBtn = element.querySelector('.edit-btn')
        deleteBtn.addEventListener('click', deleteTodo)
        editBtn.addEventListener('click', editTodo)
        list.appendChild(element)
}