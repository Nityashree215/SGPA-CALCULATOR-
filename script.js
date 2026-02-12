const subjectsDiv = document.getElementById("subjects");

// Check login
const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  window.location.href = "login.html";
}

// Show welcome text if exists
const welcomeEl = document.getElementById("welcome");
if (welcomeEl) {
  welcomeEl.innerText = "Welcome, " + currentUser;
}

function addSubject() {
  const div = document.createElement("div");
  div.className = "subject-row";
  div.innerHTML = `
    <input type="text" placeholder="Subject Name" class="subName" />
    <input type="number" placeholder="Credits" class="credits" min="0" />
    <input type="number" placeholder="Marks" class="marks" min="0" max="100" oninput="updateGrade(this)" />
    <input type="text" class="grade" placeholder="Grade" readonly />
    <button onclick="removeSubject(this)">❌</button>
  `;
  subjectsDiv.appendChild(div);
}

function removeSubject(btn) {
  btn.parentElement.remove();
}

function getGradePoint(marks) {
  if (marks >= 90) return 10;
  if (marks >= 80) return 9;
  if (marks >= 70) return 8;
  if (marks >= 60) return 7;
  if (marks >= 50) return 6;
  if (marks >= 45) return 5;
  if (marks >= 40) return 4;
  if (marks >= 35) return 3;
  return 0;
}

function getGradeLetter(marks) {
  if (marks >= 90) return "O";
  if (marks >= 80) return "A+";
  if (marks >= 70) return "A";
  if (marks >= 60) return "B+";
  if (marks >= 50) return "B";
  if (marks >= 45) return "C";
  if (marks >= 40) return "P";
  if (marks >= 35) return "F*";
  return "F";
}

function updateGrade(input) {
  const marks = Number(input.value);
  const gradeInput = input.parentElement.querySelector(".grade");
  gradeInput.value = getGradeLetter(marks);
}

function calculateSGPA() {
  const name = document.getElementById("studentName").value || currentUser;

  const rows = document.querySelectorAll(".subject-row");

  let totalCredits = 0;
  let totalPoints = 0;

  let subjects = [];

  rows.forEach(row => {
    const subName = row.querySelector(".subName").value;
    const credits = Number(row.querySelector(".credits").value);
    const marks = Number(row.querySelector(".marks").value);

    if (!credits || marks === "") return;

    const gp = getGradePoint(marks);

    totalCredits += credits;
    totalPoints += credits * gp;

    subjects.push({ subName, credits, marks, gp });
  });

  if (totalCredits === 0) {
    alert("Please add at least one valid subject.");
    return;
  }

  const sgpa = (totalPoints / totalCredits).toFixed(2);

  // Save per-user history
  const key = "sgpaRecords_" + currentUser;
  const records = JSON.parse(localStorage.getItem(key) || "[]");

  records.push({
    studentName: name,
    subjects,
    sgpa,
    date: new Date().toLocaleString()
  });

  localStorage.setItem(key, JSON.stringify(records));

  document.getElementById("result").innerText = `SGPA of ${name} is: ${sgpa}`;
}

function resetAll() {
  if (!confirm("Clear all data?")) return;
  subjectsDiv.innerHTML = "";
  document.getElementById("studentName").value = "";
  document.getElementById("result").innerText = "";
}