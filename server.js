
const http = require("http");

const PORT = process.env.PORT || 3000;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#f8fafc">
  <title>TaskFlow | Task Manager</title>
  <style>
    :root {
      --primary: #4f46e5;
      --primary-light: #eef2ff;
      --bg: #f8fafc;
      --surface: #ffffff;
      --text: #172033;
      --muted: #788397;
      --border: #e8edf4;
      --green: #15803d;
      --red: #dc2626;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system,
        BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    button, input, select { font: inherit; }
    button { cursor: pointer; }

    .layout {
      max-width: 1240px;
      margin: auto;
      padding: 32px 24px 48px;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 36px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: var(--primary);
      color: white;
      font-size: 23px;
      font-weight: 800;
    }

    .brand h1 { font-size: 21px; margin: 0; letter-spacing: -0.7px; }
    .brand p { color: var(--muted); font-size: 12px; margin: 4px 0 0; }

    .today {
      font-size: 13px;
      color: var(--muted);
      text-align: right;
    }

    .welcome {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 20px;
      margin-bottom: 26px;
    }

    .welcome h2 {
      font-size: clamp(25px, 4vw, 34px);
      letter-spacing: -1.2px;
      margin: 0 0 9px;
    }

    .welcome p { margin: 0; color: var(--muted); line-height: 1.6; }

    .button {
      border: 0;
      border-radius: 10px;
      padding: 12px 17px;
      font-weight: 650;
      transition: transform .15s, opacity .15s;
    }

    .button:hover { opacity: .9; }
    .button:active { transform: scale(.98); }
    .button-primary { background: var(--primary); color: white; }
    .button-light { background: #f1f5f9; color: #334155; }
    .button-danger { background: #fef2f2; color: var(--red); }

    .stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 21px;
      min-width: 0;
    }

    .stat-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      color: var(--muted);
      font-size: 13px;
    }

    .stat-icon {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: var(--primary-light);
      color: var(--primary);
      font-weight: 800;
    }

    .stat-number {
      font-size: 31px;
      font-weight: 750;
      letter-spacing: -1px;
      margin-top: 13px;
    }

    .stat-note { color: var(--muted); font-size: 12px; margin-top: 5px; }

    .progress-card, .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
    }

    .progress-card {
      padding: 21px 24px;
      margin-bottom: 24px;
    }

    .progress-heading {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
      font-size: 14px;
      font-weight: 650;
    }

    .progress-heading span:last-child { color: var(--primary); }

    .progress-track {
      height: 9px;
      border-radius: 99px;
      background: #eef2f7;
      overflow: hidden;
    }

    .progress-fill {
      width: 0;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #4f46e5, #818cf8);
      transition: width .25s;
    }

    .panel { padding: 24px; }

    .panel-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 22px;
    }

    .panel-heading h3 { margin: 0; font-size: 19px; }
    .panel-heading p { margin: 5px 0 0; color: var(--muted); font-size: 13px; }

    .task-form {
      display: grid;
      grid-template-columns: minmax(180px, 2fr) repeat(3, minmax(115px, 1fr)) auto;
      gap: 10px;
      margin-bottom: 25px;
    }

    .field {
      width: 100%;
      min-width: 0;
      padding: 12px 13px;
      border: 1px solid #dce3ed;
      background: #fff;
      color: var(--text);
      border-radius: 10px;
      outline: none;
    }

    .field:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px #4f46e51a;
    }

    .filters {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    .search { flex: 1 1 200px; }

    .filter-button {
      padding: 10px 13px;
      border: 1px solid var(--border);
      border-radius: 9px;
      color: #64748b;
      background: white;
      font-size: 13px;
    }

    .filter-button.active {
      color: var(--primary);
      background: var(--primary-light);
      border-color: #c7d2fe;
      font-weight: 700;
    }

    .task-list { display: grid; gap: 10px; }

    .task {
      display: flex;
      align-items: flex-start;
      gap: 13px;
      padding: 17px;
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: border-color .15s;
    }

    .task:hover { border-color: #c7d2fe; }

    .task-checkbox {
      appearance: none;
      flex: 0 0 19px;
      width: 19px;
      height: 19px;
      margin: 2px 0 0;
      border: 1.5px solid #cbd5e1;
      border-radius: 6px;
      cursor: pointer;
    }

    .task-checkbox:checked {
      background: var(--primary);
      border-color: var(--primary);
    }

    .task-checkbox:checked::after {
      content: "✓";
      display: block;
      color: white;
      font-size: 13px;
      text-align: center;
      line-height: 17px;
    }

    .task-content { flex: 1; min-width: 0; }

    .task-title {
      font-size: 14px;
      font-weight: 650;
      overflow-wrap: anywhere;
      line-height: 1.5;
    }

    .task.done .task-title {
      color: #94a3b8;
      text-decoration: line-through;
    }

    .task-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 9px;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      border-radius: 6px;
      padding: 5px 8px;
      font-size: 11px;
      font-weight: 700;
      background: #f1f5f9;
      color: #64748b;
    }

    .priority-High { background: #fef2f2; color: #dc2626; }
    .priority-Medium { background: #fff7ed; color: #c2410c; }
    .priority-Low { background: #f0fdf4; color: #15803d; }
    .due-overdue { color: #dc2626; }
    .due-today { color: #b45309; }

    .task-actions { display: flex; gap: 5px; }

    .icon-button {
      border: 0;
      background: transparent;
      color: #94a3b8;
      border-radius: 7px;
      padding: 7px 9px;
      font-size: 12px;
    }

    .icon-button:hover { background: #f1f5f9; color: var(--primary); }
    .icon-button.delete:hover { background: #fef2f2; color: var(--red); }

    .empty {
      padding: 40px 15px;
      text-align: center;
      color: var(--muted);
    }

    .empty-icon { font-size: 33px; margin-bottom: 10px; }
    .empty strong { display: block; color: var(--text); margin-bottom: 7px; }

    .footer {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      color: var(--muted);
      font-size: 12px;
      margin-top: 22px;
    }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      max-width: calc(100vw - 32px);
      background: #172033;
      color: white;
      padding: 13px 18px;
      border-radius: 10px;
      box-shadow: 0 10px 30px #0002;
      opacity: 0;
      transform: translateY(10px);
      pointer-events: none;
      transition: .2s;
      z-index: 10;
    }

    .toast.show { opacity: 1; transform: translateY(0); }

    @media (max-width: 900px) {
      .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .task-form { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .task-form .task-name { grid-column: 1 / -1; }
    }

    @media (max-width: 560px) {
      .layout { padding: 20px 13px 30px; }
      .topbar { margin-bottom: 28px; }
      .today { display: none; }
      .welcome { align-items: flex-start; flex-direction: column; }
      .stats { gap: 10px; }
      .stat { padding: 15px; }
      .stat-number { font-size: 26px; }
      .panel { padding: 16px; }
      .task-form { grid-template-columns: 1fr; }
      .task-form .task-name { grid-column: auto; }
      .task { padding: 13px 10px; }
      .task-actions { flex-direction: column; }
      .footer { flex-direction: column; }
    }
  </style>
</head>
<body>
  <main class="layout">
    <header class="topbar">
      <div class="brand">
        <div class="brand-icon">✓</div>
        <div>
          <h1>TaskFlow</h1>
          <p>YOUR PERSONAL WORKSPACE</p>
        </div>
      </div>
      <div class="today" id="today"></div>
    </header>

    <section class="welcome">
      <div>
        <h2>Make today count.-CI/CD Updated</h2>
        <p>Plan your work, track your progress, and get things done.</p>
      </div>
      <button class="button button-light" id="clearCompleted" type="button">
        Clear completed
      </button>
    </section>

    <section class="stats" aria-label="Task statistics">
      <article class="stat">
        <div class="stat-top"><span>Total tasks</span><span class="stat-icon">▤</span></div>
        <div class="stat-number" id="totalCount">0</div>
        <div class="stat-note">All your tasks</div>
      </article>
      <article class="stat">
        <div class="stat-top"><span>In progress</span><span class="stat-icon">◷</span></div>
        <div class="stat-number" id="pendingCount">0</div>
        <div class="stat-note">Still to be done</div>
      </article>
      <article class="stat">
        <div class="stat-top"><span>Completed</span><span class="stat-icon">✓</span></div>
        <div class="stat-number" id="completedCount">0</div>
        <div class="stat-note">Tasks finished</div>
      </article>
      <article class="stat">
        <div class="stat-top"><span>Overdue</span><span class="stat-icon">!</span></div>
        <div class="stat-number" id="overdueCount">0</div>
        <div class="stat-note">Past their due date</div>
      </article>
    </section>

    <section class="progress-card">
      <div class="progress-heading">
        <span>Overall progress</span>
        <span id="progressText">0% completed</span>
      </div>
      <div
        class="progress-track"
        id="progressTrack"
        role="progressbar"
        aria-label="Task completion"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="0"
      >
        <div class="progress-fill" id="progressFill"></div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-heading">
        <div>
          <h3>My tasks</h3>
          <p>Add tasks, set priorities, and stay organized.</p>
        </div>
      </div>

      <form class="task-form" id="taskForm">
        <input class="field task-name" id="taskInput" maxlength="200"
          placeholder="What needs to get done?" aria-label="Task name" required>
        <select class="field" id="categoryInput" aria-label="Category">
          <option>Personal</option>
          <option>Work</option>
          <option>Study</option>
          <option>Health</option>
          <option>Other</option>
        </select>
        <select class="field" id="priorityInput" aria-label="Priority">
          <option>Medium</option>
          <option>High</option>
          <option>Low</option>
        </select>
        <input class="field" type="date" id="dueInput" aria-label="Due date">
        <button class="button button-primary" type="submit" id="submitButton">+ Add task</button>
      </form>

      <div class="filters">
        <input class="field search" id="searchInput" placeholder="Search tasks..."
          aria-label="Search tasks">
        <button class="filter-button active" data-filter="all" type="button">All</button>
        <button class="filter-button" data-filter="pending" type="button">Pending</button>
        <button class="filter-button" data-filter="completed" type="button">Completed</button>
        <button class="filter-button" data-filter="overdue" type="button">Overdue</button>
      </div>

      <div class="task-list" id="taskList" aria-live="polite"></div>

      <div class="footer">
        <span id="listSummary">No tasks yet</span>
        <span>Changes are saved in this browser</span>
      </div>
    </section>
  </main>

  <div class="toast" id="toast" role="status"></div>

  <script>
    const $ = (id) => document.getElementById(id);

    const STORAGE_KEY = "taskflow-tasks-v1";
    const form = $("taskForm");
    const input = $("taskInput");
    const categoryInput = $("categoryInput");
    const priorityInput = $("priorityInput");
    const dueInput = $("dueInput");
    const list = $("taskList");
    const searchInput = $("searchInput");
    const submitButton = $("submitButton");

    let tasks = loadTasks();
    let activeFilter = "all";
    let editingId = null;
    let toastTimer;

    function loadTasks() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        if (!Array.isArray(saved)) return [];
        return saved.filter(task =>
          task &&
          typeof task.id === "string" &&
          typeof task.text === "string" &&
          typeof task.done === "boolean"
        );
      } catch {
        return [];
      }
    }

    function saveTasks() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch {
        showToast("Could not save data in this browser.");
      }
    }

    function dateKey(date = new Date()) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return year + "-" + month + "-" + day;
    }

    function formatDate(value) {
      if (!value) return "No due date";
      const parts = value.split("-").map(Number);
      if (parts.length !== 3 || parts.some(Number.isNaN)) return "No due date";
      return new Date(parts[0], parts[1] - 1, parts[2])
        .toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    }

    function isOverdue(task) {
      return !task.done && task.dueDate && task.dueDate < dateKey();
    }

    function isDueToday(task) {
      return !task.done && task.dueDate === dateKey();
    }

    function showToast(message) {
      $("toast").textContent = message;
      $("toast").classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2400);
    }

    function updateStats() {
      const total = tasks.length;
      const completed = tasks.filter(task => task.done).length;
      const pending = total - completed;
      const overdue = tasks.filter(isOverdue).length;
      const percentage = total ? Math.round(completed / total * 100) : 0;

      $("totalCount").textContent = total;
      $("pendingCount").textContent = pending;
      $("completedCount").textContent = completed;
      $("overdueCount").textContent = overdue;
      $("progressText").textContent = percentage + "% completed";
      $("progressFill").style.width = percentage + "%";
      $("progressTrack").setAttribute("aria-valuenow", percentage);
    }

    function makeTag(text, className = "") {
      const tag = document.createElement("span");
      tag.className = "tag " + className;
      tag.textContent = text;
      return tag;
    }

    function createTaskElement(task) {
      const item = document.createElement("article");
      item.className = "task" + (task.done ? " done" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      checkbox.checked = task.done;
      checkbox.setAttribute("aria-label", "Mark " + task.text + " as completed");
      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        saveTasks();
        render();
        showToast(task.done ? "Task completed!" : "Task marked pending.");
      });

      const content = document.createElement("div");
      content.className = "task-content";

      const title = document.createElement("div");
      title.className = "task-title";
      title.textContent = task.text;

      const meta = document.createElement("div");
      meta.className = "task-meta";
      meta.appendChild(makeTag(task.category || "Personal"));
      meta.appendChild(makeTag(task.priority || "Medium", "priority-" + (task.priority || "Medium")));

      const due = makeTag("Due: " + formatDate(task.dueDate));
      if (isOverdue(task)) {
        due.classList.add("due-overdue");
        due.textContent = "Overdue · " + formatDate(task.dueDate);
      } else if (isDueToday(task)) {
        due.classList.add("due-today");
        due.textContent = "Due today";
      }
      meta.appendChild(due);

      content.append(title, meta);

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "icon-button";
      edit.textContent = "Edit";
      edit.setAttribute("aria-label", "Edit " + task.text);
      edit.addEventListener("click", () => startEdit(task.id));

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "icon-button delete";
      remove.textContent = "Delete";
      remove.setAttribute("aria-label", "Delete " + task.text);
      remove.addEventListener("click", () => deleteTask(task.id));

      actions.append(edit, remove);
      item.append(checkbox, content, actions);
      return item;
    }

    function render() {
      updateStats();
      list.replaceChildren();

      const query = searchInput.value.trim().toLowerCase();

      const visibleTasks = tasks.filter(task => {
        const matchesSearch =
          task.text.toLowerCase().includes(query) ||
          (task.category || "").toLowerCase().includes(query) ||
          (task.priority || "").toLowerCase().includes(query);

        const matchesFilter =
          activeFilter === "all" ||
          (activeFilter === "pending" && !task.done) ||
          (activeFilter === "completed" && task.done) ||
          (activeFilter === "overdue" && isOverdue(task));

        return matchesSearch && matchesFilter;
      });

      visibleTasks.sort((a, b) => {
        if (a.done !== b.done) return Number(a.done) - Number(b.done);
        const priority = { High: 0, Medium: 1, Low: 2 };
        const priorityDiff = (priority[a.priority] ?? 1) - (priority[b.priority] ?? 1);
        if (priorityDiff !== 0) return priorityDiff;
        return (a.dueDate || "9999-12-31").localeCompare(b.dueDate || "9999-12-31");
      });

      if (visibleTasks.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty";
        const icon = document.createElement("div");
        icon.className = "empty-icon";
        icon.textContent = tasks.length ? "🔎" : "✦";
        const heading = document.createElement("strong");
        heading.textContent = tasks.length ? "No matching tasks" : "Your day starts here";
        const description = document.createElement("span");
        description.textContent = tasks.length
          ? "Try another search or filter."
          : "Add your first task using the form above.";
        empty.append(icon, heading, description);
        list.appendChild(empty);
      } else {
        visibleTasks.forEach(task => list.appendChild(createTaskElement(task)));
      }

      $("listSummary").textContent =
        "Showing " + visibleTasks.length + " of " + tasks.length + " task(s)";
    }

    function resetForm() {
      form.reset();
      editingId = null;
      submitButton.textContent = "+ Add task";
    }

    function startEdit(id) {
      const task = tasks.find(item => item.id === id);
      if (!task) return;

      editingId = id;
      input.value = task.text;
      categoryInput.value = task.category || "Personal";
      priorityInput.value = task.priority || "Medium";
      dueInput.value = task.dueDate || "";
      submitButton.textContent = "Save changes";
      input.focus();
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function deleteTask(id) {
      const task = tasks.find(item => item.id === id);
      if (!task) return;

      tasks = tasks.filter(item => item.id !== id);
      if (editingId === id) resetForm();
      saveTasks();
      render();
      showToast("Task deleted.");
    }

    form.addEventListener("submit", event => {
      event.preventDefault();

      const text = input.value.trim();
      if (!text) {
        showToast("Please enter a task name.");
        input.focus();
        return;
      }

      if (editingId) {
        const task = tasks.find(item => item.id === editingId);
        if (task) {
          task.text = text;
          task.category = categoryInput.value;
          task.priority = priorityInput.value;
          task.dueDate = dueInput.value;
          showToast("Task updated.");
        }
      } else {
        tasks.push({
          id: (window.crypto && crypto.randomUUID)
            ? crypto.randomUUID()
            : Date.now().toString(36) + Math.random().toString(36).slice(2),
          text,
          category: categoryInput.value,
          priority: priorityInput.value,
          dueDate: dueInput.value,
          done: false,
          createdAt: new Date().toISOString()
        });
        showToast("Task added successfully!");
      }

      saveTasks();
      resetForm();
      render();
    });

    searchInput.addEventListener("input", render);

    document.querySelectorAll("[data-filter]").forEach(button => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach(item => {
          const selected = item === button;
          item.classList.toggle("active", selected);
          item.setAttribute("aria-pressed", String(selected));
        });
        render();
      });
    });

    $("clearCompleted").addEventListener("click", () => {
      const completed = tasks.filter(task => task.done).length;
      if (!completed) {
        showToast("There are no completed tasks to clear.");
        return;
      }

      tasks = tasks.filter(task => !task.done);
      if (editingId && !tasks.some(task => task.id === editingId)) resetForm();
      saveTasks();
      render();
      showToast(completed + " completed task(s) cleared.");
    });

    $("today").textContent = new Date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    render();
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      status: "ok",
      app: "TaskFlow",
      timestamp: new Date().toISOString()
    }));
    return;
  }

  if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    });
    res.end(html);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("TaskFlow running on port " + PORT);
});
