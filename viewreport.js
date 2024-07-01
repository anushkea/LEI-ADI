
document.addEventListener('DOMContentLoaded', () => {
    const loadReportBtn = document.getElementById('load-report-btn');
    const reportDropdown = document.getElementById('report-dropdown');
    const reportContent = document.getElementById('report-content');
    const createReportTab = document.getElementById('create-report-tab');
    const viewReportTab = document.getElementById('view-report-tab');
    const createReportContent = document.getElementById('create-report');
    const viewReportContent = document.getElementById('view-report');

    loadReportBtn.addEventListener('click', () => {
        const selectedReport = reportDropdown.value;
        loadReport(selectedReport);
    });

    function loadReport(reportId) {
        // Clear existing content
        reportContent.innerHTML = '';

        // Example report data
        const reports = {
            'pp-01-test': {
                title: 'Report For pp-01-test',
                projectTitle: 'pp-01-test',
                teamLead: 'Anushka',
                description: 'test project',
                files: ['adobe.pdf', 'hello.txt', 'myfriend.form'],
                questions: [
                    {
                        qid: '1',
                        question: 'What is the invoiced amount?',
                        answer: 'The invoiced amount is $1,212.02',
                        reference: 'adobe_form.pdf'
                    },
                    {
                        qid: '2',
                        question: 'Is there any due date?',
                        answer: 'NA',
                        reference: 'adobe_form.pdf'
                    },
                    {
                        qid: '2.1',
                        question: 'If yes, when the amount is due to be paid?',
                        answer: 'The documents provided do not specify a due date for the payment. However, the payment terms mentioned are "2/10 Net 45 days," which suggests that the payment should be made within 45 days from the date of invoice to avoid late charges.',
                        reference: 'adobe_form.pdf'
                    },
                    {
                        qid: '3',
                        question: 'Are there any charges for late payment?',
                        answer: 'The text checks provided do not contain any information about charges for late payment.',
                        reference: 'adobe_form.pdf'
                    }
                ]
            }
            // Add more reports as needed
        };

        const report = reports[reportId];
        if (report) {
            const reportHTML = `
                <h2>${report.title}</h2>
                <p><strong>Project title:</strong> ${report.projectTitle}</p>
                <p><strong>Team Lead:</strong> ${report.teamLead}</p>
                <p><strong>Description:</strong> ${report.description}</p>
                <p class="report-files"><strong>Files included:</strong> ${report.files.map(file => `<a href="#">${file}</a>`).join(', ')}</p>
                <h3>Questionnaire Completion</h3>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>QID</th>
                            <th>Question</th>
                            <th>Answer</th>
                            <th>Reference</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${report.questions.map(q => `
                            <tr>
                                <td>${q.qid}</td>
                                <td>${q.question}</td>
                                <td>${q.answer}</td>
                                <td><a href="#">${q.reference}</a></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            reportContent.innerHTML = reportHTML;
        } else {
            reportContent.innerHTML = '<p>No report found.</p>';
        }
    }

    // Toggle between Create Report and View Reports
    createReportTab.addEventListener('click', () => {
        window.location.href = 'createreport.html';
    });

    viewReportTab.addEventListener('click', () => {
        viewReportTab.classList.add('active');
        createReportTab.classList.remove('active');
        viewReportContent.classList.add('active');
        createReportContent.classList.remove('active');
    });
});

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
