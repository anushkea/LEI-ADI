let savedQuestionnaires = [];

 document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadSavedQuestionnaires();
  
  // Add the event listener here
  document.getElementById('saved-questionnaires').addEventListener('change', editQuestionnaire);
});


function addQuestion() {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="text" class="blue-textbox-input" placeholder="Enter question ID"></td>
    <td><input type="text" class="blue-textbox-input" placeholder="Enter question"><button class="delete-question-button" onclick="deleteQuestion(this)">x</button></td>
  `;
  const addRow = document.querySelector('.add-question-row');
  addRow.parentNode.insertBefore(newRow, addRow);
}

function deleteQuestion(button) {
  const row = button.closest('tr');
  row.parentNode.removeChild(row);
}

function saveQuestionnaire() {
  const questionnaireName = document.getElementById('questionnaire-name').value.trim();
  const description = document.getElementById('description').value.trim();
  const category = document.getElementById('category').value.trim();

  const questionRows = document.querySelectorAll('#question-table-body tr:not(.add-question-row)');
  const questions = [];
  questionRows.forEach(row => {
    const qid = row.querySelector('input:nth-child(1)').value.trim();
    const question = row.querySelector('input:nth-child(2)').value.trim();
    if (qid !== '' && question !== '') {
      questions.push({ qid, question });
    }
  });

  if (questionnaireName && description && category && questions.length > 0) {
    const questionnaire = { questionnaireName, description, category, questions };
    let questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];
    const existingIndex = questionnaires.findIndex(q => q.questionnaireName === questionnaireName);
    if (existingIndex !== -1) {
      questionnaires[existingIndex] = questionnaire;
    } else {
      questionnaires.push(questionnaire);
    }
    localStorage.setItem('questionnaires', JSON.stringify(questionnaires));

    // Update the savedQuestionnaires array
    savedQuestionnaires = questionnaires;
    
    function saveQuestionnaire() {
  const questionnaireName = document.getElementById('questionnaire-name').value.trim();
  const description = document.getElementById('description').value.trim();
  const category = document.getElementById('category').value.trim();

  const questionRows = document.querySelectorAll('#question-table-body tr:not(.add-question-row)');
  const questions = [];
  questionRows.forEach(row => {
    const qid = row.querySelector('input:nth-child(1)').value.trim();
    const question = row.querySelector('input:nth-child(2)').value.trim();
    if (qid !== '' && question !== '') {
      questions.push({ qid, question });
    }
  });

  if (questionnaireName && description && category && questions.length > 0) {
    const questionnaire = { questionnaireName, description, category, questions };
    let questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];
    const existingIndex = questionnaires.findIndex(q => q.questionnaireName === questionnaireName);
    if (existingIndex !== -1) {
      questionnaires[existingIndex] = questionnaire;
    } else {
      questionnaires.push(questionnaire);
    }
    localStorage.setItem('questionnaires', JSON.stringify(questionnaires));

    // Update the savedQuestionnaires array
    savedQuestionnaires = questionnaires;

    // Update dropdown with new questionnaire
    updateSavedQuestionnairesDropdown();

    // Redirect to createreport.html with query parameter
    const queryString = `?questionnaire=${encodeURIComponent(questionnaireName)}`;
    window.location.href = `createreport.html${queryString}`;
    alert('Questionnaire saved successfully!');

    clearForm();
  } else {
    alert('Please fill in all fields and add at least one question.');
  }
}

    // Update dropdown with new questionnaire
    updateSavedQuestionnairesDropdown();

    // Show success message
    const uploadSuccess = document.getElementById('upload-success');
    uploadSuccess.textContent = 'Questionnaire saved successfully!';
    uploadSuccess.style.display = 'block';
    setTimeout(() => {
      uploadSuccess.style.display = 'none';
    }, 3000);

    clearForm();
  } else {
    alert('Please fill in all fields and add at least one question.');
  }
}

function loadSavedQuestionnaires() {
  const questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];
  savedQuestionnaires = questionnaires;
  updateSavedQuestionnairesDropdown();
}

function updateSavedQuestionnairesDropdown() {
  const select = document.getElementById('saved-questionnaires');
  select.innerHTML = '<option value="">Select a saved questionnaire</option>';
  savedQuestionnaires.forEach(questionnaire => {
    const option = document.createElement('option');
    option.value = questionnaire.questionnaireName;
    option.textContent = `${questionnaire.questionnaireName} - ${questionnaire.description}`;
    select.appendChild(option);
  });
}


function editQuestionnaire() {
  const selectedOption = document.getElementById('saved-questionnaires').value;
  if (!selectedOption) {
    alert('Please select a questionnaire to edit.');
    return;
  }

  const questionnaire = savedQuestionnaires.find(q => q.questionnaireName === selectedOption);
  if (questionnaire) {
    document.getElementById('questionnaire-name').value = questionnaire.questionnaireName;
    document.getElementById('description').value = questionnaire.description;
    document.getElementById('category').value = questionnaire.category;

    const questionTableBody = document.getElementById('question-table-body');
    const rows = questionTableBody.querySelectorAll('tr:not(.add-question-row)');
    rows.forEach(row => row.remove());

    questionnaire.questions.forEach(q => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><input type="text" class="blue-textbox-input" value="${q.qid}" placeholder="Enter question ID"></td>
        <td><input type="text" class="blue-textbox-input" value="${q.question}" placeholder="Enter question"><button class="delete-question-button" onclick="deleteQuestion(this)">x</button></td>
      `;
      const addRow = document.querySelector('.add-question-row');
      addRow.parentNode.insertBefore(newRow, addRow);
    });
  }
}

function deleteQuestionnaire() {
  const selectElement = document.getElementById('saved-questionnaires');
  const selectedOption = selectElement.value;
  if (!selectedOption) {
    alert('Please select a questionnaire to delete.');
    return;
  }

  let questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];
  questionnaires = questionnaires.filter(q => q.questionnaireName !== selectedOption);
  localStorage.setItem('questionnaires', JSON.stringify(questionnaires));

  // Update the savedQuestionnaires array
  savedQuestionnaires = questionnaires;

  const optionElement = selectElement.querySelector(`option[value="${selectedOption}"]`);
  selectElement.removeChild(optionElement);
  console.log('Deleted questionnaire:', selectedOption);
}

function clearForm() {
  document.getElementById('questionnaire-name').value = '';
  document.getElementById('description').value = '';
  document.getElementById('category').value = 'Category 1';

  const questionTableBody = document.getElementById('question-table-body');
  const rows = questionTableBody.querySelectorAll('tr:not(.add-question-row)');
  rows.forEach(row => row.remove());
}

function cancelQuestionnaire() {
  document.getElementById('questionnaire-name').value = '';
  document.getElementById('description').value = '';
  document.getElementById('category').value = 'Category 1';

  const questionTableBody = document.getElementById('question-table-body');
  const rows = questionTableBody.querySelectorAll('tr:not(.add-question-row)');
  rows.forEach(row => row.remove());
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Clear existing questions
      cancelQuestionnaire();

      // Populate form with uploaded questions
      jsonData.forEach(row => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td><input type="text" class="blue-textbox-input" value="${row[0] || ''}" placeholder="Enter question ID"></td>
          <td><input type="text" class="blue-textbox-input" value="${row[1] || ''}" placeholder="Enter question"><button class="delete-question-button" onclick="deleteQuestion(this)">x</button></td>
        `;
        const addRow = document.querySelector('.add-question-row');
        addRow.parentNode.insertBefore(newRow, addRow);
      });

      document.getElementById('upload-success').style.display = 'block';
      setTimeout(() => {
        document.getElementById('upload-success').style.display = 'none';
      }, 3000);
    };
    reader.readAsArrayBuffer(file);
  }
}

function loadCategories() {
  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  const categorySelect = document.getElementById('category');
  categorySelect.innerHTML = '';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

