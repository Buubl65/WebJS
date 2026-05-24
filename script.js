const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');

const defaultTodos = [
  { id: 1, text: "Вивчити HTML", checked: true },
  { id: 2, text: "Вивчити CSS", checked: true },
  { id: 3, text: "Вивчити JavaScript", checked: false }
];

let todos = JSON.parse(localStorage.getItem('todos')) || defaultTodos;

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function newTodo() {
  const text = prompt('Введіть нове завдання:');
  
  if (text && text.trim() !== '') {
    const todo = {
      id: Date.now(), 
      text: text.trim(),
      checked: false
    };
    
    todos.push(todo);
    console.log("Нова справа додана:", todo); 
    
    saveTodos();
    render();
    updateCounter();
  }
}

function renderTodo(todo) {
  const textClass = todo.checked ? 'text-success text-decoration-line-through' : '';
  
  return `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${todo.checked ? 'checked' : ''} onchange="checkTodo(${todo.id})" />
      <label for="${todo.id}"><span class="${textClass}">${todo.text}</span></label>
      <button class="btn btn-danger btn-sm float-end" onclick="deleteTodo(${todo.id})">delete</button>
    </li>
  `;
}

function render() {
  list.innerHTML = todos.map(renderTodo).join('');
}

function updateCounter() {
  itemCountSpan.textContent = todos.length;
  
  uncheckedCountSpan.textContent = todos.filter(todo => !todo.checked).length;
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  
  saveTodos();
  render();
  updateCounter();
}

function checkTodo(id) {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.checked = !todo.checked;
    
    saveTodos();
    render();
    updateCounter();
  }
}

render();
updateCounter();