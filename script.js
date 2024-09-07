let subjects = [];

function addSubject() {
    const container = document.getElementById('subjectContainer');
    const subjectDiv = document.createElement('div');
    subjectDiv.classList.add('subject-entry');
    subjectDiv.innerHTML = `
        <input type="text" class="subjectName" placeholder="Subject Name" required>
        <input type="number" class="subjectCredits" placeholder="Credits" min="1" required>
        <input type="number" class="subjectScore" placeholder="Score" min="0" max="100" required>
        <button class="delete-btn" onclick="removeSubject(this)">Delete</button>
    `;
    container.appendChild(subjectDiv);
}

function removeSubject(button) {
    button.parentElement.remove();
}

function calculateCGPA() {
    const studentName = document.getElementById('studentName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    
    if (!studentName || !studentId) {
        showModal("Please enter your name and ID.");
        return;
    }

    const subjectNames = document.getElementsByClassName('subjectName');
    const subjectCredits = document.getElementsByClassName('subjectCredits');
    const subjectScores = document.getElementsByClassName('subjectScore');

    let totalGradePoints = 0;
    let totalCredits = 0;
    subjects = [];  // Clear the subject list for new calculations
    let invalidEntries = [];

    for (let i = 0; i < subjectNames.length; i++) {
        const name = subjectNames[i].value.trim();
        const credits = parseFloat(subjectCredits[i].value);
        const score = parseFloat(subjectScores[i].value);

        if (name === '' || isNaN(credits) || isNaN(score) || credits <= 0 || score < 0 || score > 100) {
            invalidEntries.push(`Subject ${i + 1}: Invalid input.`);
            continue;
        }

        const gradePoint = calculateGradePoint(score);
        totalGradePoints += gradePoint * credits;
        totalCredits += credits;

        subjects.push({ name, credits, score, gradePoint });
    }

    if (invalidEntries.length > 0) {
        showModal(`Invalid entries found:\n${invalidEntries.join('\n')}\nPlease correct them and try again.`);
        return;
    }

    const CGPA = totalGradePoints / totalCredits;
    displayResults(studentName, studentId, CGPA, totalCredits, totalGradePoints);
}

function calculateGradePoint(score) {
    if (score >= 90) return 4.00;
    if (score >= 85) return 3.75;
    if (score >= 80) return 3.50;
    if (score >= 75) return 3.25;
    if (score >= 70) return 3.00;
    if (score >= 65) return 2.75;
    if (score >= 60) return 2.50;
    if (score >= 50) return 2.25;
    return 0.0;
}

function displayResults(name, id, CGPA, totalCredits, totalGradePoints) {
    const resultContainer = document.getElementById('resultContainer');
    let gradeMessage = "";

    if (CGPA >= 3.75) {
        gradeMessage = `Excellent performance, ${name}! Keep up the great work.`;
    } else if (CGPA >= 3.00) {
        gradeMessage = `Good job, ${name}. You're doing well.`;
    } else if (CGPA >= 2.25) {
        gradeMessage = `${name}, you passed, but there's room for improvement.`;
    } else {
        gradeMessage = `${name}, you need to improve your performance. Better luck next time!`;
    }

    resultContainer.innerHTML = `
        <h2>Grade Sheet for ${name} (${id})</h2>
        <table>
            <tr>
                <th>Subject</th>
                <th>Credits</th>
                <th>Score</th>
                <th>Grade Points</th>
            </tr>
            ${subjects.map(subject => `
                <tr>
                    <td>${subject.name}</td>
                    <td>${subject.credits}</td>
                    <td>${subject.score}</td>
                    <td>${subject.gradePoint}</td>
                </tr>
            `).join('')}
        </table>
        <p><strong>Total Credits:</strong> ${totalCredits}</p>
        <p><strong>Total Grade Points:</strong> ${totalGradePoints.toFixed(2)}</p>
        <p><strong>Your CGPA:</strong> ${CGPA.toFixed(2)}</p>
        <p>${gradeMessage}</p>
    `;
}

function showModal(message) {
    const modal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('errorModal');
    modal.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('errorModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
