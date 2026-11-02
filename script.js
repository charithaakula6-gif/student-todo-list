const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const filterSelect = document.getElementById('filterSelect');
const emptyMessage = document.getElementById('emptyMessage');

let tasks = JSON.parse(localStorage.getItem('studentTodoTasks') || '[]');

function saveTasks() {
  localStorage.setItem('studentTodoTasks', JSON.stringify(tasks));
}

function updateStats() {
  const completed = tasks.filter(task => task.completed).length;
  document.getElementById('totalCount').textContent = tasks.length;
  document.getElementById('doneCount').textContent = completed;
  document.getElementById('leftCount').textContent = tasks.length - completed;
}

function renderTasks() {
  taskList.innerHTML = '';
  const filter = filterSelect.value;
  const visibleTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  emptyMessage.hidden = visibleTasks.length > 0;
  visibleTasks.forEach(task => {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark ${task.text} as completed`);
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete ${task.text}`);
    deleteButton.addEventListener('click', () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, text, deleteButton);
    taskList.appendChild(item);
  });
  updateStats();
}

taskForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.unshift({ id: Date.now(), text, completed: false });
  saveTasks();
  taskInput.value = '';
  taskInput.focus();
  renderTasks();
});

filterSelect.addEventListener('change', renderTasks);
renderTasks();
