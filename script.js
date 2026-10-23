const input = document.getElementById("wordInput");
const form = document.getElementById("addForm");
const tableBody = document.getElementById("tableBody");
const count = document.getElementById("count");
const clearBtn = document.getElementById("clearBtn");
const saveStatus = document.getElementById("saveStatus");

let words = [];

try {
  const saved = JSON.parse(localStorage.getItem("sortedWords") || "[]");

  if (Array.isArray(saved)) {
    words = saved.filter(word => typeof word === "string");
  }
} catch {
  words = [];
}

function saveData() {
  try {
    localStorage.setItem("sortedWords", JSON.stringify(words));
    saveStatus.textContent = "✓ All changes saved";
  } catch {
    saveStatus.textContent = "Unable to save data";
  }
}

function renderTable() {
  words.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  tableBody.replaceChildren();
  count.textContent = words.length + (words.length === 1 ? " item" : " items");

  if (words.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 3;
    cell.className = "empty";
    cell.textContent = "No items yet. Add your first item above.";

    row.appendChild(cell);
    tableBody.appendChild(row);
  }

  words.forEach((word, index) => {
    const row = document.createElement("tr");
    const numberCell = document.createElement("td");
    const wordCell = document.createElement("td");
    const actionCell = document.createElement("td");
    const deleteBtn = document.createElement("button");

    numberCell.className = "number";
    numberCell.textContent = index + 1;
    wordCell.textContent = word;

    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.type = "button";

    deleteBtn.addEventListener("click", () => {
      words.splice(index, 1);
      renderTable();
      saveData();
    });

    actionCell.appendChild(deleteBtn);
    row.append(numberCell, wordCell, actionCell);
    tableBody.appendChild(row);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const word = input.value.trim();

  if (!word) {
    input.focus();
    return;
  }

  words.push(word);
  input.value = "";
  renderTable();
  saveData();
  input.focus();
});

clearBtn.addEventListener("click", () => {
  if (words.length === 0) return;

  if (confirm("Are you sure you want to clear the entire table?")) {
    words = [];
    renderTable();
    saveData();
  }
});

renderTable();
