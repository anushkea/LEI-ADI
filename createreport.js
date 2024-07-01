// Function to toggle dropdown visibility
function toggleDropdown(id) {
    var dropdown = document.getElementById(id);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Function to update dropdown text based on selected options
function updateDropdownText(dropdownId, defaultText) {
    var dropdown = document.getElementById(dropdownId);
    var button = dropdown.previousElementSibling;
    var selectedOptions = dropdown.querySelectorAll('input:checked');
    if (selectedOptions.length > 0) {
        var selectedText = Array.from(selectedOptions).map(option => option.value).join(', ');
        button.textContent = selectedText + ' ▼';
    } else {
        button.textContent = defaultText + ' ▼';
    }
    dropdown.style.display = 'none';
}

// Function to submit the form
function submitForm() {
    var reportName = document.getElementById('report-name').value;
    var questionnaire = document.querySelector('input[name="questionnaire"]:checked');
    var documents = document.querySelectorAll('input[name="document"]:checked');

    var reportNameRequired = document.getElementById('report-name-required');
    var questionnaireRequired = document.getElementById('questionnaire-required');
    var documentsRequired = document.getElementById('documents-required');

    var messageDiv = document.getElementById('message');
    var isValid = true;

    if (reportName === '') {
        reportNameRequired.style.display = 'block';
        isValid = false;
    } else {
        reportNameRequired.style.display = 'none';
    }

    if (!questionnaire) {
        questionnaireRequired.style.display = 'block';
        isValid = false;
    } else {
        questionnaireRequired.style.display = 'none';
    }

    if (documents.length === 0) {
        documentsRequired.style.display = 'block';
        isValid = false;
    } else {
        documentsRequired.style.display = 'none';
    }

    if (!isValid) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Action not completed';
    } else {
        messageDiv.className = 'message success';
        messageDiv.textContent = 'Generating report on Azure AI... This may take a while';
        setTimeout(() => {
            messageDiv.textContent = 'Report successfully generated! Click here to view the report.';
        }, 3000);
    }
}

// Function to switch between tabs
function showTab(tabId) {
    var tabContent = document.querySelectorAll('.tab-content');
    tabContent.forEach(function(content) {
        content.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';

    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function(tab) {
        tab.classList.remove('active');
    });
    document.querySelector('.tab[onclick="showTab(\'' + tabId + '\')"]').classList.add('active');
}

// Event listener to update documents dropdown when selected in documentselect.html
window.addEventListener('storage', function(event) {
    if (event.key === 'selectedDocuments') {
        updateDocumentsDropdown(JSON.parse(event.newValue));
    }
});
// Function to update questionnaire dropdown based on saved data
function updateQuestionnaireDropdown(savedQuestionnaires) {
var questionnaireDropdown = document.getElementById('questionnaire-dropdown');
questionnaireDropdown.innerHTML = ''; // Clear existing options

savedQuestionnaires.forEach(function(questionnaire) {
var label = document.createElement('label');
var input = document.createElement('input');
input.type = 'radio'; // Assuming it's a radio button for selection
input.name = 'questionnaire';
input.value = questionnaire.id; // Assuming each questionnaire has an ID
input.addEventListener('change', function() {
    // Handle selection logic if needed
});
label.appendChild(input);
label.appendChild(document.createTextNode(questionnaire.name)); // Display questionnaire name
questionnaireDropdown.appendChild(label);
});

updateDropdownText('questionnaire-dropdown', 'Available questionnaires');
}

// Function to fetch saved questionnaires from localStorage
function getSavedQuestionnaires() {
return JSON.parse(localStorage.getItem('savedQuestionnaires')) || [];
}

// Initialize the dropdown with saved questionnaires on page load
document.addEventListener('DOMContentLoaded', function() {
showTab('create-report');

// Fetch saved questionnaires
var savedQuestionnaires = getSavedQuestionnaires();

// Update dropdown with saved questionnaires
updateQuestionnaireDropdown(savedQuestionnaires);
});


// Function to update documents dropdown based on selected files in documentselect.html
function updateDocumentsDropdown(selectedDocuments) {
var documentsDropdown = document.getElementById('documents-dropdown');
documentsDropdown.innerHTML = ''; // Clear existing options

selectedDocuments.forEach(function(fileName) {
var label = document.createElement('label');
var input = document.createElement('input');
input.type = 'checkbox';
input.name = 'document';
input.value = fileName;
input.addEventListener('change', function() {
    if (this.checked) {
        addSelectedItem('selected-documents', fileName, 'document');
    } else {
        removeSelectedItem('selected-documents', fileName);
    }
});
label.appendChild(input);
label.appendChild(document.createTextNode(fileName));
documentsDropdown.appendChild(label);
});

updateDropdownText('documents-dropdown', 'Available documents');
}


// Function to add selected item to the display list
function addSelectedItem(containerId, itemName, itemType) {
    var container = document.getElementById(containerId);
    var selectedItem = document.createElement('div');
    selectedItem.className = 'selected-item';
    selectedItem.innerHTML = itemName + ' <span onclick="removeSelectedItem(\'' + containerId + '\', \'' + itemName + '\', \'' + itemType + '\')">&times;</span>';
    container.appendChild(selectedItem);
}

// Function to remove selected item from the display list
function removeSelectedItem(containerId, itemName, itemType) {
    var container = document.getElementById(containerId);
    var selectedItems = container.getElementsByClassName('selected-item');
    for (var i = 0; i < selectedItems.length; i++) {
        if (selectedItems[i].innerText.includes(itemName)) {
            container.removeChild(selectedItems[i]);
            break;
        }
    }
    if (itemType) {
        var checkbox = document.querySelector('input[name="' + itemType + '"][value="' + itemName + '"]');
        if (checkbox) {
            checkbox.checked = false;
        }
    }
}

// Initialize the tab view on page load and populate dropdown with existing selected documents
document.addEventListener('DOMContentLoaded', function() {
    showTab('create-report');

    // Populate documents dropdown with selected documents in documentselect.html
    var selectedDocuments = JSON.parse(localStorage.getItem('selectedDocuments')) || [];
    updateDocumentsDropdown(selectedDocuments);
});
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