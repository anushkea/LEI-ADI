// JavaScript to handle thicker underline on textbox click
const textInputs = document.querySelectorAll('.blue-textbox-input');
textInputs.forEach(input => {
  input.addEventListener('focus', () => {
    input.style.borderBottomWidth = '2px';
  });
  input.addEventListener('blur', () => {
    input.style.borderBottomWidth = '1px';
  });
});

// JavaScript to handle label position change
textInputs.forEach(input => {
  input.addEventListener('input', () => {
    if (input.value.trim() !== '') {
      input.nextElementSibling.style.display = 'none'; // Hide the "* Required" message
      input.style.borderBottomColor = '#ccc'; // Reset border color
    }
  });
});

// JavaScript to handle form validation and clearing input fields
const createButton = document.querySelector('.create-button');
const cancelButton = document.querySelector('.cancel-button');

createButton.addEventListener('click', () => {
  const titleInput = document.getElementById('title');
  const teamLeadInput = document.getElementById('team-lead');
  const descriptionInput = document.getElementById('description');
  let valid = true;

  if (titleInput.value.trim() === '') {
    titleInput.nextElementSibling.style.display = 'block';
    titleInput.style.borderBottomColor = 'red';
    valid = false;
  }

  if (teamLeadInput.value.trim() === '') {
    teamLeadInput.nextElementSibling.style.display = 'block';
    teamLeadInput.style.borderBottomColor = 'red';
    valid = false;
  }

  if (descriptionInput.value.trim() === '') {
    descriptionInput.nextElementSibling.style.display = 'block';
    descriptionInput.style.borderBottomColor = 'red';
    valid = false;
  }

  const messageDiv = document.getElementById('message');
  if (valid) {
    // Retrieve existing projects from localStorage
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const existingProject = projects.find(project => project.title.toLowerCase() === titleInput.value.trim().toLowerCase());
    
    if (existingProject) {
      alert('A project with this title already exists.');
    } else {
      // Store project data in localStorage
      const projectData = {
        title: titleInput.value.trim(),
        teamLead: teamLeadInput.value.trim(),
        description: descriptionInput.value.trim(),
        createdBy: 'Current User', // Assuming a placeholder value for createdBy
        date: new Date().toLocaleDateString() // Capture current date
      };
      
      // Add new project to the list
      projects.push(projectData);
      // Store updated projects back in localStorage
      localStorage.setItem('projects', JSON.stringify(projects));

      // Show success alert
      alert('Project saved successfully.');
      
      // Clear input fields
      titleInput.value = '';
      teamLeadInput.value = '';
      descriptionInput.value = '';
    }
  } else {
    alert('Please fill out all required fields.');
  }
});

cancelButton.addEventListener('click', () => {
  textInputs.forEach(input => {
    input.value = '';
    input.nextElementSibling.style.display = 'none'; // Hide the "* Required" message
    input.style.borderBottomColor = '#ccc'; // Reset border color
  });

  const messageDiv = document.getElementById('message');
  messageDiv.textContent = '';
  messageDiv.className = 'message';
});

// JavaScript to handle tooltip display on hover or click
const titleInput = document.getElementById('title');
const titleTooltip = titleInput.nextElementSibling;

titleInput.addEventListener('mouseover', () => {
  titleTooltip.style.display = 'block';
});

titleInput.addEventListener('mouseout', () => {
  titleTooltip.style.display = 'none';
});