const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');

const BASE = "https://lb7sherbak-default-rtdb.europe-west1.firebasedatabase.app";

let todos = [];
let isLoading = false;
let error = null;


// ===================== CREATE (POST) =====================
async function addTodo(todo) {
  const res = await fetch(`${BASE}/todos.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(todo)
  });

  const data = await res.json();
  return data.name; 
}


// ===================== READ (GET) =====================
async function fetchTodos() {
  isLoading = true;
  render();

  try {
    const res = await fetch(`${BASE}/todos.json`);
    const data = await res.json();

    if (!data) {
      todos = [];
    } else {
      todos = Object.entries(data).map(([id, value]) => ({
        id,
        ...value
      }));
    }

    error = null;
  } catch (e) {
    error = "Помилка завантаження даних";
  }

  isLoading = false;
  render();
  updateCounter();
}


// ===================== DELETE =====================
async function deleteTodo(id) {
  try {
    await fetch(`${BASE}/todos/${id}.json`, {
      method: "DELETE"
    });

    todos = todos.filter(todo => todo.id !== id);

    render();
    updateCounter();

  } catch (e) {
    error = "Помилка видалення";
    render();
  }
}


// ===================== UPDATE (PATCH) =====================
async function updateTodo(id, updates) {
  await fetch(`${BASE}/todos/${id}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updates)
  });
}


// ===================== CHECKBOX TOGGLE =====================
async function checkTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  todo.checked = !todo.checked;

  await updateTodo(id, {
    checked: todo.checked
  });

  render();
  updateCounter();
}


// ===================== ADD NEW TODO =====================
async function newTodo() {
  const text = prompt('Введіть нове завдання:');

  if (!text || text.trim() === '') return;

  const todo = {
    text: text.trim(),
    checked: false
  };

  try {
    const id = await addTodo(todo);

    todos.push({
      id,
      ...todo
    });

    render();
    updateCounter();

  } catch (e) {
    error = "Помилка додавання";
    render();
  }
}


// ===================== RENDER =====================
function renderTodo(todo) {
  const textClass = todo.checked
    ? 'text-success text-decoration-line-through'
    : '';

  return `
    <li class="list-group-item">
      <input type="checkbox"
        class="form-check-input me-2"
        id="${todo.id}"
        ${todo.checked ? 'checked' : ''}
        onchange="checkTodo('${todo.id}')"
      />

      <label for="${todo.id}">
        <span class="${textClass}">${todo.text}</span>
      </label>

      <button class="btn btn-danger btn-sm float-end"
        onclick="deleteTodo('${todo.id}')">
        delete
      </button>
    </li>
  `;
}


function render() {
  if (isLoading) {
    list.innerHTML = `<li class="list-group-item">Loading...</li>`;
    return;
  }

  if (error) {
    list.innerHTML = `<li class="list-group-item text-danger">${error}</li>`;
    return;
  }

  list.innerHTML = todos.map(renderTodo).join('');
}


// ===================== COUNTERS =====================
function updateCounter() {
  itemCountSpan.textContent = todos.length;
  uncheckedCountSpan.textContent = todos.filter(t => !t.checked).length;
}


// ===================== START =====================
fetchTodos();