document.addEventListener('DOMContentLoaded', loadCases);

// Function to open the form popup
function openPopup() {
  document.getElementById("popupForm").style.display = "flex";
}

// Function to close the form popup
function closePopup() {
  document.getElementById("popupForm").style.display = "none";
}

// Function to close the case details popup
function closeCaseDetailPopup() {
  document.getElementById("caseDetailPopup").style.display = "none";
}

// Function to display cases in their respective sections (Pending/Solved)
function displayCases(cases) {
  const pendingCasesList = document.getElementById('pending-cases-list');
  const solvedCasesList = document.getElementById('solved-cases-list');
  
  pendingCasesList.innerHTML = '';
  solvedCasesList.innerHTML = '';

  // Loop through each case and append to the correct section
  cases.forEach(caseData => {
    const caseElement = document.createElement('div');
    caseElement.className = 'case';
    caseElement.innerHTML = `
      <p><strong>Case Number:</strong> ${caseData.caseName}</p>
      <p><strong>Description:</strong> ${caseData.caseDescription}</p>
    `;

    caseElement.onclick = function() {
      openCaseDetailPopup(caseData);
    };

    if (caseData.caseStatus === 'pending') {
      pendingCasesList.appendChild(caseElement);
    } else if (caseData.caseStatus === 'solved') {
      solvedCasesList.appendChild(caseElement);
    }
  });

  updateEmptyMessages();
}

// Function to load cases from the server
function loadCases() {
  fetch('/cases')
    .then(response => response.json())
    .then(cases => {
      console.log('Fetched cases:', cases); // Log fetched cases to check if they are received
      displayCases(cases);
    })
    .catch(error => console.error('Error fetching cases:', error));
}

// Handle form submission to add a new case
const caseForm = document.getElementById('caseForm');
if (caseForm) {
  caseForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(caseForm);

    fetch('/add-case', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Case added successfully!');
        closePopup(); // Close the popup after submission
        displayCases(data.cases); // Display updated cases
      } else {
        alert('Failed to add case.');
      }
    })
    .catch(error => console.error('Error:', error));
  });
}

// Function to open the case detail popup with case data
function openCaseDetailPopup(caseData) {
  const caseDetailContent = `
    <p><strong>Case Number:</strong> ${caseData.caseName}</p>
    <p><strong>Description:</strong> ${caseData.caseDescription}</p>
    ${caseData.caseFile ? `<a href="/uploads/documents/${caseData.caseFile}" target="_blank">View Document</a>` : ''}
    ${caseData.caseImage ? `<img src="/uploads/images/${caseData.caseImage}" width="100" />` : ''}
    <button onclick="markAsSolved('${caseData._id}')">Mark as Solved</button>
    <button onclick="deleteCase('${caseData._id}')">Delete</button>
  `;

  document.getElementById('case-detail-content').innerHTML = caseDetailContent;
  document.getElementById('caseDetailPopup').style.display = 'flex';
}

// Function to mark a case as solved
function markAsSolved(caseId) {
  fetch(`/mark-as-solved/${caseId}`, {
    method: 'PUT',
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    loadCases(); // Reload the case list
    closeCaseDetailPopup(); // Close the popup after updating
  })
  .catch(error => console.error('Error:', error));
}

// Function to delete a case
function deleteCase(caseId) {
  fetch(`/delete-case/${caseId}`, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    loadCases(); // Reload the case list
    closeCaseDetailPopup(); // Close the popup after deletion
  })
  .catch(error => console.error('Error:', error));
}

// Function to update "empty" messages based on whether lists are populated
function updateEmptyMessages() {
  const pendingEmptyMsg = document.getElementById('pending-empty-msg');
  const solvedEmptyMsg = document.getElementById('solved-empty-msg');
  
  const pendingCases = document.getElementById('pending-cases-list').children.length;
  const solvedCases = document.getElementById('solved-cases-list').children.length;
  
  pendingEmptyMsg.style.display = pendingCases === 0 ? 'block' : 'none';
  solvedEmptyMsg.style.display = solvedCases === 0 ? 'block' : 'none';
}
