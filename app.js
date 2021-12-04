// =====================================
// CONSTS
// =====================================

const mainContainer = document.querySelector('.main-container')
const burgerBtnContainer = document.querySelector('.burger-btn-div')
const sidebarContainer = document.querySelector('.sidebar')

const mainSection = document.querySelector('.main-section')
const formContainer = document.querySelector('.bg-effect')
const input = document.querySelector('.input')
const submitBtn = document.querySelector('.submit-btn')
const itemsContainer = document.querySelector('.items')
const itemsContainerChildren = itemsContainer.children

const notificationPar = document.querySelector('.notification')
const notificationDiv = document.getElementById('notification-container')

const clearBtnContainer = document.querySelector('.clear-all')
const clearAllBtn = document.querySelector('.clear-all-btn')

const footer = document.getElementById('footer-par')
// =====================================
// MAIN CONTAINER / SIDEBAR TRANSFORM
// =====================================
window.addEventListener('DOMContentLoaded', notification('Welcome to my app : )'))
window.addEventListener('DOMContentLoaded', getLocalStorageItems)
let burgerToggle = 0;

burgerBtnContainer.addEventListener('click', showSidebar)

function showSidebar(){
  footer.classList.toggle('move-main-container')
  if(burgerToggle === 0){
  sidebarContainer.classList.add('show-sidebar')
  mainContainer.classList.add('move-main-container')
  burgerToggle++;
}else{
  sidebarContainer.classList.remove('show-sidebar')
  mainContainer.classList.remove('move-main-container')
  burgerToggle--
  }
}

// ===========================================
// EventListeners
// ===========================================
let deletingItem = false;
let editElement;
let editValue =''
let ifEdit = false
let objects;
// let currentElement

itemsContainer.addEventListener('click', completeItem)

submitBtn.addEventListener('click', submit)

formContainer.addEventListener('click', editDelete)

clearAllBtn.addEventListener('click', function(){
    const confirm = window.confirm('Are you sure, you want to delete all the item?')
    if(confirm){
    clearItems()
    localStorage.clear()
    objects = []
  }else{
    setToDefault()
  }

})
// ===========================================
// LOCAL STORAGE
// ===========================================
  window.addEventListener('DOMContentLoaded', getLocalStorageItems)

// ===========================================
// FUNCTIONS
// ===========================================
function editDelete(e){
  let targetBtn = e.target.parentElement
    if (targetBtn.classList.contains('edit-btn')) {
      setToDefault()
      notification('Please edit the item')
      submitBtn.innerHTML = 'Edit item'
      ifEdit = true
      let id = e.target.parentElement.parentElement.parentElement.dataset.id
      let triggeredTextElement = e.target.parentElement.parentElement.previousElementSibling
      const editingText = triggeredTextElement.innerHTML
      input.value = editingText
      editElement = id
      editValue = triggeredTextElement
      input.select()

    }else if (targetBtn.classList.contains('delete-btn')) {
      deletingItem = true;
      let deleteId = e.target.parentElement.parentElement.parentElement.dataset.id
      let deletingElement = e.target.parentElement.parentElement.parentElement
      editElement = deletingElement
      deletingItemBorder(editElement)
      setTimeout(confirmDeleting, 300)
    }
}

function submit(event){
  {
    event.preventDefault();
    if (!ifEdit && input.value.length > 0 && !deletingItem) {
      addItem()
    }else if (ifEdit && input.value.length > 0 && !deletingItem) {
      editItem(editElement)
      notification('The item has been edited')
      setToDefault()
    }
    else{
      notification('Empty input. Please enter the value')
    }
  }
}

function completeItem(event){
  item = event.target
  if(item.classList.contains('item')){
    item.classList.toggle('complete')

    const index = objects.findIndex(obj => obj.id == item.dataset.id)

    if(objects[index].class != 'complete'){
        objects[index].class = 'complete'
        localStorage.setItem('list', JSON.stringify(objects))
    }else{
      delete objects[index].class
      localStorage.setItem('list', JSON.stringify(objects))
    }


  }
}

function confirmDeleting(){
  let confirm = window.confirm('Are you sure you want to delete this item?')
  if(confirm){
    console.log(editElement);
    removeItemFromLocalStorage(`${editElement.dataset.id}`)
    console.log(editElement.dataset.id);
    deleteItem(editElement)

  }else{
    setToDefault()
  }
}

function deletingItemBorder(item){
  if(!item.classList.contains('deleting-item')){
    item.classList.add('deleting-item')
  }

}

function clearItems(){
  while (itemsContainer.firstChild) {
    itemsContainer.removeChild(itemsContainer.firstChild)
    notification('All items have been deleted')
  }
  showClearBtn()
  setToDefault()
}

function deleteItem(id){
  itemsContainer.removeChild(id)
  showClearBtn()
  setToDefault()
}

function showClearBtn(){
  if (itemsContainer.children.length>0){
    if(!clearBtnContainer.classList.contains('show-element')){
      clearBtnContainer.classList.add('show-element')
    }
  }else{
    clearBtnContainer.classList.remove('show-element')
  }
}

function editItem(id, EditValue){
  submitBtn.innerHTML = 'Edit item'
  const elements = document.querySelectorAll('.item')
  array = Array.from(elements)
  array.forEach((item) => {
    if(item.dataset.id = id){
      editValue.innerHTML = input.value
    }
  });
  editLocalStorageItem(id)
  showClearBtn()
}

function editLocalStorageItem(id){

  let object
  object = objects.findIndex(obj =>obj.id == id)
  objects[object].value = input.value
  localStorage.setItem('list', JSON.stringify(objects))
}

function addItem(){
  let elementId = new Date().getTime()
  let inputValue = input.value
  var newElement = document.createElement('div')
  newElement.innerHTML= `
        <h4>${inputValue}</h4>
        <div class="btn-container">
          <button type="button" class="edit-btn btn">
            <i class="far fa-edit"></i>
          </button>
          <button type="button" class="delete-btn btn">
            <i class="far fa-trash-alt"></i>
          </button>
  </div>`
  newElement.classList.add('item')
  newElement.dataset.id= `${elementId}`
  itemsContainer.appendChild(newElement)

  addItemToLocalStorage(elementId, inputValue)
  input.value=''
  notification('An item has been added to the list!')
  showClearBtn();

}

function setToDefault(){
  submitBtn.innerHTML = 'Add item'
  editFlag = ''
  ifEdit = false
  input.value = ''
  deletingItem = false;

const array = Array.from(itemsContainerChildren)
array.forEach((item) => {
  if(item.classList.contains('deleting-item')){
    item.classList.remove('deleting-item')
  }
});
}

function notification (par){
    mainContainer.children[0].classList.contains('notification-container')
    mainContainer.removeChild(notificationDiv)
    notificationPar.innerHTML = `${par} <span class="notification-icon"><i class="fas fa-exclamation-circle "></i></span>`
    mainContainer.prepend(notificationDiv)
    notificationDiv.classList.add('animateOpen')
}

// ===========================================
//      LOCAL STORAGE
// ===========================================
function addItemToLocalStorage(id, value){
  let object = {id: id, value:value}
  objects.push(object)
  localStorage.setItem('list', JSON.stringify(objects))

}

function getLocalStorageItems(){
  objects = JSON.parse(localStorage.getItem('list')) || []
  objects.map(function(item, i){
    var newElement = document.createElement('div')
    newElement.innerHTML= `
          <h4>${item.value}</h4>
          <div class="btn-container">
            <button type="button" class="edit-btn btn">
              <i class="far fa-edit"></i>
            </button>
            <button type="button" class="delete-btn btn">
              <i class="far fa-trash-alt"></i>
            </button>
    </div>`
    newElement.classList.add('item')
    newElement.dataset.id= `${item.id}`
    itemsContainer.appendChild(newElement)

  })
  // ==================
  // FOR COMPLETE ITEMS
  // ==================
  let completeItemsArray = []
  arr = Array.from(objects)
  arr.forEach((item, i) => {
    if(item.class ==='complete'){
      completeItemsArray.push(i)
    }
  });
  completeItemsArray.forEach((item) => {
    itemsContainer.children[item].classList.add('complete')
  });

  showClearBtn()
}

function removeItemFromLocalStorage(id){
  id = parseInt(id)
  objects = objects.filter(function(item){
    if(item.id !== id){
      return item
    }
  })
  localStorage.setItem('list', JSON.stringify(objects))
}


// ===========================================
// FOOTER
// ===========================================
let year = new Date().getFullYear();
footer.innerHTML = `Copyright &copy ${year} Vladyslav Dorokhov. All Rights Reserved`
