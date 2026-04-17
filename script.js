class TodoApp {
    constructor() {
        this.todos = [];
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.totalCount = document.getElementById('totalCount');
        this.completedCount = document.getElementById('completedCount');

        this.init();
    }

    init() {
        this.loadTodos();
        this.attachEventListeners();
        this.render();
    }

    attachEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    }

    addTodo() {
        const text = this.todoInput.value.trim();

        if (text === '') {
            alert('Please enter a todo!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false
        };

        this.todos.push(todo);
        this.saveTodos();
        this.todoInput.value = '';
        this.todoInput.focus();
        this.render();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
    }

    toggleComplete(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadTodos() {
        const saved = localStorage.getItem('todos');
        this.todos = saved ? JSON.parse(saved) : [];
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;

        this.totalCount.textContent = total;
        this.completedCount.textContent = completed;
    }

    render() {
        this.todoList.innerHTML = '';

        if (this.todos.length === 0) {
            this.todoList.innerHTML = '<div class="empty-message">No todos yet. Add one to get started!</div>';
        } else {
            this.todos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

                li.innerHTML = `
                    <input 
                        type="checkbox" 
                        class="todo-checkbox" 
                        ${todo.completed ? 'checked' : ''}
                    >
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <button class="delete-btn">Delete</button>
                `;

                const checkbox = li.querySelector('.todo-checkbox');
                const deleteBtn = li.querySelector('.delete-btn');

                checkbox.addEventListener('change', () => this.toggleComplete(todo.id));
                deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

                this.todoList.appendChild(li);
            });
        }

        this.updateStats();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
