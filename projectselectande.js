// Function to highlight the selected row
function highlightRow(row) {
    document.querySelectorAll('tbody tr').forEach(r => r.classList.remove('selected'));
    row.classList.add('selected');
}

// Function to delete a row
function deleteRow(button) {
    if (confirm('Are you sure you want to delete this row?')) {
        const row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);
        saveProjects();
    }
}

// Function to cancel the edit and restore the original values
function cancelEdit(button) {
    const row = button.parentNode.parentNode;
    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
    row.cells[1].innerText = originalValues[rowIndex].title;
    row.cells[2].innerText = originalValues[rowIndex].description;
    row.cells[3].innerText = originalValues[rowIndex].createdBy;
    row.cells[4].innerText = originalValues[rowIndex].teamLead;
    row.cells[5].innerText = originalValues[rowIndex].date;
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

// Store selected project in localStorage
localStorage.setItem('selectedProject', JSON.stringify(selectedProject));

// Update the sidebar display
updateSidebar(selectedProject);
}
function updateSidebar(selectedProject) {
const sidebarSelectedProject = `
<strong>Project:</strong> ${selectedProject.title}<br>
<strong>Description:</strong> ${selectedProject.description}<br>
<strong>Created by:</strong> ${selectedProject.createdBy}<br>
<strong>Team Lead:</strong> ${selectedProject.teamLead}<br>
<strong>Date:</strong> ${selectedProject.date}
`;
document.getElementById('selected-project').innerHTML = sidebarSelectedProject;
}

// Function to submit the changes
function submitChanges() {
    if (!validateProjects()) {
        alert('Projects with the same name are not allowed.');
        return;
    }
    saveProjects();
    document.getElementById('success-message').innerText = 'Submitted successfully';
    setTimeout(() => {
        document.getElementById('success-message').innerText = '';
    }, 3000);
}

// Function to validate projects for duplicate names
function validateProjects() {
    const projectNames = [];
    const rows = document.querySelectorAll('#projects-tbody tr');
    for (let row of rows) {
        const projectName = row.cells[1].innerText.trim();
        if (projectNames.includes(projectName)) {
            return false;
        }
        projectNames.push(projectName);
    }
    return true;
}

// Function to save projects to localStorage
function saveProjects() {
    const projects = [];
    document.querySelectorAll('#projects-tbody tr').forEach(row => {
        projects.push({
            title: row.cells[1].innerText,
            description: row.cells[2].innerText,
            createdBy: row.cells[3].innerText,
            teamLead: row.cells[4].innerText,
            date: row.cells[5].innerText
        });
    });
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Load projects from localStorage
window.addEventListener('load', () => {
    const projectsTableBody = document.getElementById('projects-tbody');
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');

    storedProjects.forEach(project => {
        const row = projectsTableBody.insertRow();
        row.innerHTML = `
            <td><input type="radio" name="select-project" onclick="selectRow(this)"></td>
            <td contenteditable="true">${project.title}</td>
            <td contenteditable="true">${project.description}</td>
            <td>${project.createdBy}</td>
            <td contenteditable="true">${project.teamLead}</td>
            <td contenteditable="true">${project.date}</td>
            <td>
                <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
                <button class="cancel-btn" onclick="cancelEdit(this)">Cancel</button>
            </td>
        `;
    });

    initializeOriginalValues();
});

// Initialize the original values for the cancel edit functionality
const originalValues = {};
function initializeOriginalValues() {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        originalValues[index] = {
            title: row.cells[1].innerText,
            description: row.cells[2].innerText,
            createdBy: row.cells[3].innerText,
            teamLead: row.cells[4].innerText,
            date: row.cells[5].innerText
        };

        // Add click event listener to each row
        row.addEventListener('click', () => {
            highlightRow(row);
        });

        // Prevent the event from bubbling up to the row when a button is clicked
        const buttons = row.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', event => {
                event.stopPropagation();
            });
        });
    });
}
