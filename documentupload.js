// Load selected project details from localStorage
window.addEventListener('DOMContentLoaded', () => {
    const selectedProject = JSON.parse(localStorage.getItem('selectedProject'));
    if (selectedProject) {
        const selectedProjectElement = document.getElementById('selected-project');
        selectedProjectElement.innerHTML = `
            <strong>Project:</strong> ${selectedProject.title}<br>
            <strong>Description:</strong> ${selectedProject.description}<br>
            <strong>Created by:</strong> ${selectedProject.createdBy}<br>
            <strong>Team Lead:</strong> ${selectedProject.teamLead}<br>
            <strong>Date:</strong> ${selectedProject.date}
        `;
    }
});

const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const uploadProgress = document.getElementById('uploadProgress');
let filesData = [];

fileInput.addEventListener('change', handleFiles);
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragging');
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragging');
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragging');
    handleFiles(e);
});

function handleFiles(e) {
    const files = e.target.files || e.dataTransfer.files;
    Array.from(files).forEach(file => {
        filesData.push(file);
        simulateUpload(file);
    });
}

function simulateUpload(file) {
    const uploadItem = document.createElement('div');
    uploadItem.className = 'upload-item';

    const fileName = document.createElement('p');
    fileName.textContent = file.name;

    const progress = document.createElement('div');
    progress.className = 'progress';

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';

    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'x';
    deleteBtn.addEventListener('click', () => deleteFile(file.name, uploadItem));

    progress.appendChild(progressBar);
    uploadItem.appendChild(fileName);
    uploadItem.appendChild(progress);
    uploadItem.appendChild(deleteBtn);
    uploadProgress.appendChild(uploadItem);

    let progressPercentage = 0;
    const interval = setInterval(() => {
        progressPercentage += 10;
        progressBar.style.width = `${progressPercentage}%`;
        if (progressPercentage === 100) {
            clearInterval(interval);
            progressBar.classList.add('complete');
        }
    }, 100);
}

function deleteFile(fileName, uploadItem) {
    filesData = filesData.filter(file => file.name !== fileName);
    uploadProgress.removeChild(uploadItem);
}

function resetFileInput() {
    fileInput.value = '';
}

function triggerFileInput() {
    fileInput.click();
}

function saveFiles() {
    localStorage.setItem('uploadedFiles', JSON.stringify(filesData.map(file => file.name)));
    alert('Files saved successfully!');
    triggerUpdateEvent();
}

function triggerUpdateEvent() {
    const event = new Event('filesUploaded');
    window.dispatchEvent(event);
}

// Function to handle row selection
function selectRow(radio) {
    const row = radio.parentNode.parentNode;
    highlightRow(row);
    showSelectedProject(row);
}

function showSelectedProject(row) {
    const selectedProject = {
        title: row.cells[1].innerText,
        description: row.cells[2].innerText,
        createdBy: row.cells[3].innerText,
        teamLead: row.cells[4].innerText,
        date: row.cells[5].innerText
    };
    localStorage.setItem('selectedProject', JSON.stringify(selectedProject));
    document.getElementById('selected-project').innerHTML = `
        <strong>Project:</strong> ${selectedProject.title}<br>
        <strong>Description:</strong> ${selectedProject.description}<br>
        <strong>Created by:</strong> ${selectedProject.createdBy}<br>
        <strong>Team Lead:</strong> ${selectedProject.teamLead}<br>
        <strong>Date:</strong> ${selectedProject.date}
    `;
}