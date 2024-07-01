document.addEventListener('DOMContentLoaded', () => {
    loadUploadedFiles();
    loadCategories();

    window.addEventListener('filesUploaded', loadUploadedFiles);

    // Highlight the selected row
    document.querySelector('#documentsTable').addEventListener('click', (event) => {
        if (event.target.tagName === 'INPUT' && event.target.type === 'radio') {
            const rows = document.querySelectorAll('#documentsTable tbody tr');
            rows.forEach(row => row.classList.remove('highlighted-row'));
            event.target.closest('tr').classList.add('highlighted-row');
        }
    });
});

function loadUploadedFiles() {
const documentsTableBody = document.querySelector('#documentsTable tbody');
const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];

documentsTableBody.innerHTML = ''; // Clear existing rows

uploadedFiles.forEach((fileName, index) => {
const row = document.createElement('tr');

row.innerHTML = `
    <td><input type="radio" name="file" value="${fileName}"></td>
    <td>${index + 1}</td>
    <td>${fileName.split('.')[0]}</td>
    <td></td>
    <td>
        <select class="category-select">
            <option>Choose a category</option>
        </select>
    </td>
    <td></td>
    <td></td>
`;

documentsTableBody.appendChild(row);
});

populateCategoryDropdowns(); // Populate category dropdowns after adding rows
}


function loadCategories() {
    return JSON.parse(localStorage.getItem('categories')) || [];
}

function populateCategoryDropdowns() {
const categories = loadCategories();
const categorySelects = document.querySelectorAll('.category-select');

categorySelects.forEach(select => {
select.innerHTML = ''; // Clear existing options
categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
});
});
}


function saveChanges() {
    const selectedFileElements = document.querySelectorAll('#documentsTable tbody tr');
    let selectedDocuments = [];

    selectedFileElements.forEach(row => {
        const fileName = row.querySelector('input[name="file"]').value;
        selectedDocuments.push(fileName);
    });

    localStorage.setItem('selectedDocuments', JSON.stringify(selectedDocuments));
    alert('Changes saved successfully');
}

function confirmDelete() {
    const selectedFile = document.querySelector('input[name="file"]:checked');
    if (selectedFile) {
        const confirmDelete = confirm('Are you sure you want to delete this file?');
        if (confirmDelete) {
            deleteFile(selectedFile);
        }
    } else {
        alert('Please select a file to delete.');
    }
}

function deleteFile(fileInput) {
    const row = fileInput.closest('tr');
    row.remove();
    alert('File deleted successfully');

    // Remove file from local storage
    let uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    uploadedFiles = uploadedFiles.filter(fileName => fileName !== fileInput.value);
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));

    // Also remove from selected documents if present
    let selectedDocuments = JSON.parse(localStorage.getItem('selectedDocuments')) || [];
    selectedDocuments = selectedDocuments.filter(fileName => fileName !== fileInput.value);
    localStorage.setItem('selectedDocuments', JSON.stringify(selectedDocuments));
}

function showTabContent(event, tabId) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    event.currentTarget.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

//load
window.addEventListener('load', () => {
const storedSelectedProject = JSON.parse(localStorage.getItem('selectedProject'));
if (storedSelectedProject) {
    const selectedProjectDetails = `
        <strong>Project:</strong> ${storedSelectedProject.title}<br>
        <strong>Description:</strong> ${storedSelectedProject.description}<br>
        <strong>Created by:</strong> ${storedSelectedProject.createdBy}<br>
        <strong>Team Lead:</strong> ${storedSelectedProject.teamLead}<br>
        <strong>Date:</strong> ${storedSelectedProject.date}
    `;
    document.getElementById('selected-project-details').innerHTML = selectedProjectDetails;
} else {
    document.getElementById('selected-project-details').innerHTML = 'No project selected';
}
});
