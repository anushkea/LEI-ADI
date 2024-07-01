
document.addEventListener('DOMContentLoaded', () => {
const categoryInput = document.getElementById('new-category-name');
const addCategoryButton = document.getElementById('add-category');
const categoryList = document.getElementById('category-list');

// Load existing categories from localStorage
loadCategories();

addCategoryButton.addEventListener('click', () => {
const newCategory = categoryInput.value.trim();
if (newCategory) {
  addCategory(newCategory);
  categoryInput.value = '';
} else {
  alert('Please enter a category name.');
}
});

function loadCategories() {
const categories = JSON.parse(localStorage.getItem('categories')) || [];
categories.forEach(category => addCategoryToList(category));
}

function saveCategories(categories) {
localStorage.setItem('categories', JSON.stringify(categories));
// Save categories to documentselect.html
localStorage.setItem('categoriesForDocumentSelect', JSON.stringify(categories));
}

function addCategory(category) {
const categories = JSON.parse(localStorage.getItem('categories')) || [];
if (!categories.includes(category)) {
  categories.push(category);
  saveCategories(categories);
  addCategoryToList(category);
} else {
  alert('Category already exists.');
}
}

function addCategoryToList(category) {
const listItem = document.createElement('li');

const span = document.createElement('span');
span.textContent = category;

const deleteButton = document.createElement('button');
deleteButton.textContent = '-';
deleteButton.className = 'delete-button';

listItem.appendChild(span);
listItem.appendChild(deleteButton);

attachEventListeners(listItem, deleteButton);
categoryList.appendChild(listItem);
}

function attachEventListeners(listItem, deleteButton) {
listItem.addEventListener('click', () => {
  // Deselect all other items
  const listItems = categoryList.querySelectorAll('li');
  listItems.forEach(item => {
    item.classList.remove('selected');
    item.querySelector('.delete-button').style.display = 'none';
  });
  listItem.classList.add('selected');
  deleteButton.style.display = 'block';
});

deleteButton.addEventListener('click', (e) => {
  e.stopPropagation();
  if (confirm('Are you sure you want to delete this category?')) {
    listItem.remove();
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const index = categories.indexOf(listItem.querySelector('span').textContent);
    if (index > -1) {
      categories.splice(index, 1);
      saveCategories(categories);
    }
  }
});
}
});
