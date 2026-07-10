const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");
const emptyText = document.getElementById("emptyText");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const activeCount = document.getElementById("activeCount");

const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = [];
let currentFilter = "all";

loadTasks();
renderTasks();

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

filterButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    filterButtons.forEach(function(btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

function addTask() {
  const title = taskInput.value.trim();
  const subject = subjectInput.value;
  const dueDate = dateInput.value;

  if (title === "") {
    showMessage("과제 이름을 입력하세요.");
    return;
  }

  const newTask = {
    id: Date.now(),
    title: title,
    subject: subject,
    dueDate: dueDate,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dateInput.value = "";
  message.textContent = "";
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    emptyText.style.display = "block";
  } else {
    emptyText.style.display = "none";
  }

  filteredTasks.forEach(function(task) {
    const li = document.createElement("li");
    li.className = "task-item";

    const leftDiv = document.createElement("div");
    leftDiv.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", function() {
      toggleTask(task.id);
    });

    const infoDiv = document.createElement("div");
    infoDiv.className = "task-info";

    const titleSpan = document.createElement("span");
    titleSpan.className = "task-title";

    if (task.completed) {
      titleSpan.classList.add("completed");
    }

    titleSpan.textContent = task.title;

    const metaSpan = document.createElement("span");
    metaSpan.className = "task-meta";

    let dueDateText = "마감일 없음";

    if (task.dueDate) {
      dueDateText = task.dueDate;
    }

    metaSpan.textContent = `${task.subject} · ${dueDateText}`;

    infoDiv.appendChild(titleSpan);
    infoDiv.appendChild(metaSpan);

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(infoDiv);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "삭제";

    deleteBtn.addEventListener("click", function() {
      deleteTask(task.id);
    });

    li.appendChild(leftDiv);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  updateStats();
}

function getFilteredTasks() {
  if (currentFilter === "completed") {
    return tasks.filter(function(task) {
      return task.completed === true;
    });
  }

  if (currentFilter === "active") {
    return tasks.filter(function(task) {
      return task.completed === false;
    });
  }

  return tasks;
}

function toggleTask(id) {
  tasks = tasks.map(function(task) {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  const confirmDelete = confirm("이 과제를 삭제하시겠습니까?");

  if (!confirmDelete) {
    return;
  }

  tasks = tasks.filter(function(task) {
    return task.id !== id;
  });

  saveTasks();
  renderTasks();
}

function updateStats() {
  const total = tasks.length;

  const completed = tasks.filter(function(task) {
    return task.completed === true;
  }).length;

  const active = total - completed;

  totalCount.textContent = total;
  completedCount.textContent = completed;
  activeCount.textContent = active;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
}

function showMessage(text) {
  message.textContent = text;

  setTimeout(function() {
    message.textContent = "";
  }, 2000);
}