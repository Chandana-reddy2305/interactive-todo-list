document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const todoList = document.getElementById('todoList');
    const messageBox = document.getElementById('messageBox');

    // Load tasks from local storage when the page loads
    loadTasks();

    // Event listener for adding a task
    addTaskBtn.addEventListener('click', addTask);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Event listener for task actions (toggle, edit, delete)
    todoList.addEventListener('click', (e) => {
        const target = e.target;
        const listItem = target.closest('li'); // Get the closest li ancestor

        if (!listItem) return; // If no li is found, exit

        if (target.classList.contains('task-text')) {
            // Toggle completion status
            toggleTaskCompletion(listItem);
        } else if (target.classList.contains('edit-btn')) {
            // Edit task
            editTask(listItem);
        } else if (target.classList.contains('delete-btn')) {
            // Delete task
            deleteTask(listItem);
        }
    });

    /**
     * Adds a new task to the list.
     */
    function addTask() {
        const taskText = todoInput.value.trim();

        if (taskText === '') {
            showMessage('Task cannot be empty!', 'error');
            return;
        }

        createTaskElement(taskText, false); // Create task, not completed initially
        saveTasks(); // Save tasks to local storage
        todoInput.value = ''; // Clear input field
        showMessage('Task added successfully!', 'success');
    }

    /**
     * Creates and appends a new task list item.
     * @param {string} text - The text content of the task.
     * @param {boolean} completed - Whether the task is completed.
     */
    function createTaskElement(text, completed) {
        const listItem = document.createElement('li');
        listItem.className = 'flex items-center justify-between p-3 mb-2 bg-gray-50 rounded-lg shadow-sm';

        // Add 'completed' class if the task is already completed
        if (completed) {
            listItem.classList.add('completed');
        }

        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text flex-grow cursor-pointer';
        taskTextSpan.textContent = text;
        listItem.appendChild(taskTextSpan);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions flex gap-2';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn text-yellow-500 hover:bg-gray-200 p-1 rounded-md';
        editBtn.innerHTML = '&#9998;'; // Pencil icon
        actionsDiv.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn text-red-500 hover:bg-gray-200 p-1 rounded-md';
        deleteBtn.innerHTML = '&#10006;'; // Cross icon
        actionsDiv.appendChild(deleteBtn);

        listItem.appendChild(actionsDiv);
        todoList.appendChild(listItem);
    }

    /**
     * Toggles the completion status of a task.
     * @param {HTMLElement} listItem - The list item element.
     */
    function toggleTaskCompletion(listItem) {
        listItem.classList.toggle('completed');
        saveTasks(); // Save updated tasks
        showMessage('Task status updated!', 'info');
    }

    /**
     * Edits an existing task.
     * @param {HTMLElement} listItem - The list item element.
     */
    function editTask(listItem) {
        const taskTextSpan = listItem.querySelector('.task-text');
        const currentText = taskTextSpan.textContent;

        // Use a prompt for simplicity, in a real app, use a modal
        const newText = prompt('Edit task:', currentText);

        if (newText !== null && newText.trim() !== '') {
            taskTextSpan.textContent = newText.trim();
            saveTasks(); // Save updated tasks
            showMessage('Task edited successfully!', 'success');
        } else if (newText !== null && newText.trim() === '') {
            showMessage('Task cannot be empty after editing!', 'error');
        } else {
            showMessage('Task edit cancelled.', 'info');
        }
    }

    /**
     * Deletes a task from the list.
     * @param {HTMLElement} listItem - The list item element.
     */
    function deleteTask(listItem) {
        if (confirm('Are you sure you want to delete this task?')) {
            listItem.remove();
            saveTasks(); // Save updated tasks
            showMessage('Task deleted!', 'warning');
        } else {
            showMessage('Task deletion cancelled.', 'info');
        }
    }

    /**
     * Saves the current tasks to local storage.
     */
    function saveTasks() {
        const tasks = [];
        todoList.querySelectorAll('li').forEach(listItem => {
            tasks.push({
                text: listItem.querySelector('.task-text').textContent,
                completed: listItem.classList.contains('completed')
            });
        });
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }

    /**
     * Loads tasks from local storage and displays them.
     */
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
        tasks.forEach(task => {
            createTaskElement(task.text, task.completed);
        });
    }

    /**
     * Displays a temporary message to the user.
     * @param {string} message - The message to display.
     * @param {string} type - Type of message (e.g., 'success', 'error', 'info', 'warning').
     */
    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = 'message-box show'; // Reset classes
        // Add type-specific styling
        switch (type) {
            case 'success':
                messageBox.style.backgroundColor = '#28a745'; // Green
                break;
            case 'error':
                messageBox.style.backgroundColor = '#dc3545'; // Red
                break;
            case 'info':
                messageBox.style.backgroundColor = '#17a2b8'; // Blue
                break;
            case 'warning':
                messageBox.style.backgroundColor = '#ffc107'; // Yellow
                break;
            default:
                messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }

        // Hide message after 3 seconds
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 3000);
    }
});
