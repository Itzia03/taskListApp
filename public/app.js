const tasksContainer = document.getElementById("tasksContainer");
const refreshBtn = document.getElementById("refreshBtn");
const taskForm = document.getElementById("taskForm");

function renderTasks(tasks) {
  tasksContainer.innerHTML = "";

  tasks.forEach((task) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4 mb-3";

    const completedClass = task.completed ? "task-completed" : "";
    const badge = task.completed
      ? `<span class="badge text-bg-success">Completed</span>`
      : `<span class="badge text-bg-warning">Pending</span>`;

    const buttonText = task.completed ? "Mark pending" : "Mark completed";

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <h5 class="card-title ${completedClass}">${task.title}</h5>
            ${badge}
          </div>

          <p class="text-muted small mb-3">
            Created at: ${new Date(task.created_at).toLocaleString()}
          </p>

          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary" onclick="toggleTask(${task.id})">
              ${buttonText}
            </button>

            <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})">
              Delete
            </button>
          </div>
        </div>
      </div>
    `;

    tasksContainer.appendChild(col);
  });
}

async function loadTasks() {
  const response = await fetch("/api/tasks");
  const tasks = await response.json();

  renderTasks(tasks);
}

async function toggleTask(id) {
  await fetch(`/api/tasks/${id}/toggle`, {
    method: "PUT"
  });

  loadTasks();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, {
    method: "DELETE"
  });

  loadTasks();
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    title: document.getElementById("title").value
  };

  await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  taskForm.reset();

  bootstrap.Modal.getInstance(document.getElementById("addTaskModal")).hide();

  loadTasks();
});

refreshBtn.addEventListener("click", loadTasks);

loadTasks();