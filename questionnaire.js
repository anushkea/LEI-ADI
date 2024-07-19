let savedQuestionnaires = [];

  document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadSavedQuestionnaires();
    
    // Add the event listener to the dropdown
    document.getElementById('saved-questionnaires').addEventListener('change', loadSelectedQuestionnaire);
  });
  
  function addQuestion() {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td><input type="text" class="blue-textbox-input1" placeholder="Enter question ID"></td>
      <td><input type="text" class="blue-textbox-input1" placeholder="Enter question"><button class="delete-question-button" onclick="deleteQuestion(this)">x</button></td>
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


    // Show success message
    const saveSuccess = document.getElementById('save-success');
    saveSuccess.style.display = 'block';
    setTimeout(() => {
      saveSuccess.style.display = 'none';
    }, 3000);

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
      localStorage.setItem('questionnaireSaved', new Date().toISOString());

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
  
  function loadSelectedQuestionnaire() {
    const selectedQuestionnaireName = document.getElementById('saved-questionnaires').value;
    if (selectedQuestionnaireName) {
      const selectedQuestionnaire = savedQuestionnaires.find(q => q.questionnaireName === selectedQuestionnaireName);
      if (selectedQuestionnaire) {
        document.getElementById('questionnaire-name').value = selectedQuestionnaire.questionnaireName;
        document.getElementById('description').value = selectedQuestionnaire.description;
        document.getElementById('category').value = selectedQuestionnaire.category;
  
        // Clear existing questions
        clearQuestions();
  
        // Populate form with selected questionnaire's questions
        selectedQuestionnaire.questions.forEach(question => {
          const newRow = document.createElement('tr');
          newRow.innerHTML = `
            <td><input type="text" class="blue-textbox-input1" value="${question.qid}" placeholder="Enter question ID"></td>
            <td><input type="text" class="blue-textbox-input1" value="${question.question}" placeholder="Enter question"><button class="delete-question-button" onclick="deleteQuestion(this)">x</button></td>
          `;
          const addRow = document.querySelector('.add-question-row');
          addRow.parentNode.insertBefore(newRow, addRow);
        });
      }
    }
  }
  
  function clearQuestions() {
    const questionTableBody = document.getElementById('question-table-body');
    const rows = questionTableBody.querySelectorAll('tr:not(.add-question-row)');
    rows.forEach(row => row.remove());
  }
  
  function clearForm() {
    document.getElementById('questionnaire-name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = 'Category 1';
  
    clearQuestions();
  }
  
  function cancelQuestionnaire() {
    clearForm();
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
        clearForm();
  
        // Populate form with uploaded questions
        jsonData.forEach(row => {
          const newRow = document.createElement('tr');
          newRow.innerHTML = `
            <td><input type="text" class="blue-textbox-input1" value="${row[0] || ''}" placeholder="Enter question ID"></td>
            <td><input type="text" class="blue-textbox-input1" value="${row[1] || ''}" placeholder="Enter question"><button class="delete-question-button" onclick="deleteQuestion(this)">x</button></td>
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
