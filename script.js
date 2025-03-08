document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskForm = document.getElementById('taskForm');
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const tasksList = document.getElementById('tasks');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const expandDetails = document.getElementById('expandDetails');
    const detailsGroup = document.getElementById('detailsGroup');
    const motivationalQuote = document.getElementById('motivational-quote');
    
    // Quote controls
    const prevQuoteBtn = document.getElementById('prev-quote');
    const pauseQuoteBtn = document.getElementById('pause-quote');
    const nextQuoteBtn = document.getElementById('next-quote');
    const saveQuoteBtn = document.getElementById('save-quote');
    const savedQuotesContainer = document.getElementById('saved-quotes-container');
    const savedQuotesList = document.getElementById('saved-quotes-list');
    
    // Current filter
    let currentFilter = 'all';
    
    // Quotes functionality
    const quotes = [
      "The journey of a thousand miles begins with a single step. - Lao Tzu",
      "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
      "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
      "Believe you can and you're halfway there. - Theodore Roosevelt",
      "Your only limit is your mind. - Buddha",
      "The harder you work for something, the greater you'll feel when you achieve it. - Anonymous",
      "Dreams don't work unless you do. - John C. Maxwell",
      "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
      "The key to success is to focus on goals, not obstacles. - Anonymous",
      "Small progress is still progress. - Anonymous",
      "The best way to predict the future is to create it. - Abraham Lincoln",
      "It does not matter how slowly you go as long as you do not stop. - Confucius",
      "Everything you've ever wanted is on the other side of fear. - George Addair",
      "Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer",
      "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
      "What you get by achieving your goals is not as important as what you become by achieving your goals. - Zig Ziglar",
      "The only way to do great work is to love what you do. - Steve Jobs",
      "It always seems impossible until it's done. - Nelson Mandela",
      "Don't let yesterday take up too much of today. - Will Rogers",
      "Success is liking yourself, liking what you do, and liking how you do it. - Maya Angelou",
      "I have not failed. I've just found 10,000 ways that won't work. - Thomas Edison",
      "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
      "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
      "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
      "When one door of happiness closes, another opens. - Helen Keller",
      "Life is 10% what happens to us and 90% how we react to it. - Charles R. Swindoll",
      "Do what you can, with what you have, where you are. - Theodore Roosevelt",
      "Strive not to be a success, but rather to be of value. - Albert Einstein"
    ];
    
    let currentQuoteIndex = 0;
    let quoteInterval;
    let isPaused = false;
    let savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
    
    // localStorage functions for tasks
    function getTasks() {
      return JSON.parse(localStorage.getItem('tasks') || '[]');
    }
    
    function saveTasks(tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Fetch all tasks (from localStorage instead of API)
    const fetchTasks = () => {
      const tasks = getTasks();
      renderTasks(tasks);
    };
    
    // Add a new task
    const addTask = (e) => {
      e.preventDefault();
      
      if (!taskTitle.value.trim()) {
        alert('Please enter a task title');
        return;
      }
      
      const tasks = getTasks();
      
      // Create new task object
      const newTask = {
        id: Date.now(), // use timestamp as ID
        title: taskTitle.value.trim(),
        description: taskDescription.value.trim(),
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      // Add to tasks array
      tasks.push(newTask);
      
      // Save to localStorage
      saveTasks(tasks);
      
      // Reset form
      taskTitle.value = '';
      taskDescription.value = '';
      expandDetails.checked = false;
      detailsGroup.style.display = 'none';
      
      // Refresh tasks
      fetchTasks();
    };
    
    // Delete a task
    const deleteTask = (id) => {
      if (confirm('Are you sure you want to remove this?')) {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== id);
        saveTasks(tasks);
        fetchTasks();
      }
    };
    
    // Toggle task status
    const toggleTaskStatus = (id) => {
      let tasks = getTasks();
      const taskIndex = tasks.findIndex(task => task.id === id);
      
      if (taskIndex !== -1) {
        tasks[taskIndex].status = tasks[taskIndex].status === 'completed' ? 'pending' : 'completed';
        saveTasks(tasks);
        fetchTasks();
      }
    };
    
    // Render tasks in the UI
    const renderTasks = (tasks) => {
      // Clear existing tasks
      tasksList.innerHTML = '';
      
      console.log('Rendering tasks with filter:', currentFilter);
      
      // Filter tasks if needed
      if (currentFilter !== 'all') {
        console.log('Filtering tasks by status:', currentFilter);
        tasks = tasks.filter(task => task.status === currentFilter);
        console.log('Filtered tasks:', tasks);
      }
      
      if (!tasks || tasks.length === 0) {
        tasksList.innerHTML = '<li class="no-tasks">No tasks found</li>';
        return;
      }
      
      // Create task elements
      tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.status}`;
        
        // Display different messages based on status
        const actionText = task.status === 'completed' ? 'Achieved! 🎉' : 'Working on it 💪';
        const actionButton = task.status === 'completed' ? 'Reopen' : 'Mark as Victory';
        
        taskItem.innerHTML = `
          <div class="task-content ${task.status === 'completed' ? 'task-completed' : ''}">
            <h3>${task.title}</h3>
            <p>${task.description || actionText}</p>
          </div>
          <div class="task-actions">
            <button class="btn btn-complete" data-id="${task.id}">
              ${actionButton}
            </button>
            <button class="btn btn-delete" data-id="${task.id}">Remove</button>
          </div>
        `;
        
        // Add task to list
        tasksList.appendChild(taskItem);
      });
      
      // Add event listeners to buttons
      document.querySelectorAll('.btn-complete').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.target.dataset.id);
          toggleTaskStatus(id);
        });
      });
      
      document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.target.dataset.id);
          deleteTask(id);
        });
      });
    };
    
    // Toggle details section when checkbox is clicked
    expandDetails.addEventListener('change', () => {
      detailsGroup.style.display = expandDetails.checked ? 'block' : 'none';
    });
    
    // Display a specific quote by index
    function displayQuote(index) {
      currentQuoteIndex = index;
      motivationalQuote.textContent = quotes[currentQuoteIndex];
    }
    
    // Display random motivational quote
    function displayRandomQuote() {
      currentQuoteIndex = Math.floor(Math.random() * quotes.length);
      displayQuote(currentQuoteIndex);
    }
    
    // Move to next quote
    function nextQuote() {
      currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
      displayQuote(currentQuoteIndex);
    }
    
    // Move to previous quote
    function prevQuote() {
      currentQuoteIndex = (currentQuoteIndex - 1 + quotes.length) % quotes.length;
      displayQuote(currentQuoteIndex);
    }
    
    // Toggle pause/resume
    function togglePause() {
      isPaused = !isPaused;
      
      if (isPaused) {
        clearInterval(quoteInterval);
        pauseQuoteBtn.textContent = '▶️';
        pauseQuoteBtn.title = 'Resume';
      } else {
        startQuoteRotation();
        pauseQuoteBtn.textContent = '⏸️';
        pauseQuoteBtn.title = 'Pause';
      }
    }
    
    // Save current quote
    function saveQuote() {
      const currentQuote = quotes[currentQuoteIndex];
      
      if (!savedQuotes.includes(currentQuote)) {
        savedQuotes.push(currentQuote);
        localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
        updateSavedQuotesList();
        
        // Show the saved quotes container if it's hidden
        if (savedQuotesContainer.style.display === 'none') {
          savedQuotesContainer.style.display = 'block';
        }
        
        // Animate the save button
        saveQuoteBtn.textContent = '✅';
        setTimeout(() => {
          saveQuoteBtn.textContent = '❤️';
        }, 1000);
      } else {
        // Already saved - indicate this
        saveQuoteBtn.textContent = '✓';
        setTimeout(() => {
          saveQuoteBtn.textContent = '❤️';
        }, 1000);
      }
    }
    
    // Update the saved quotes list
    function updateSavedQuotesList() {
      savedQuotesList.innerHTML = '';
      
      if (savedQuotes.length === 0) {
        savedQuotesContainer.style.display = 'none';
        return;
      }
      
      savedQuotesContainer.style.display = 'block';
      
      savedQuotes.forEach((quote, index) => {
        const li = document.createElement('li');
        
        const quoteText = document.createElement('span');
        quoteText.textContent = quote;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.title = 'Remove from saved';
        removeBtn.addEventListener('click', () => {
          savedQuotes.splice(index, 1);
          localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
          updateSavedQuotesList();
        });
        
        li.appendChild(quoteText);
        li.appendChild(removeBtn);
        savedQuotesList.appendChild(li);
      });
    }
    
    // Start the automatic quote rotation
    function startQuoteRotation() {
      // Clear any existing interval
      if (quoteInterval) {
        clearInterval(quoteInterval);
      }
      
      // Set a new interval - changed from 10 to 20 seconds for better readability
      quoteInterval = setInterval(() => {
        if (!isPaused) {
          nextQuote();
        }
      }, 20000); // 20 seconds
    }
    
    // Add event listeners for quote controls
    prevQuoteBtn.addEventListener('click', () => {
      prevQuote();
      // Pause rotation when manually navigating
      if (!isPaused) togglePause();
    });
    
    pauseQuoteBtn.addEventListener('click', togglePause);
    
    nextQuoteBtn.addEventListener('click', () => {
      nextQuote();
      // Pause rotation when manually navigating
      if (!isPaused) togglePause();
    });
    
    saveQuoteBtn.addEventListener('click', saveQuote);
    
    // Set up filter buttons
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        console.log('Filter clicked:', btn.dataset.status);
        
        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update filter
        currentFilter = btn.dataset.status;
        console.log('Current filter set to:', currentFilter);
        
        // Refresh tasks
        fetchTasks();
      });
    });
    
    // Add event listeners
    taskForm.addEventListener('submit', addTask);
    
    // Load any sample data if this is the first run
    if (!localStorage.getItem('tasks')) {
      const sampleTasks = [
        {
          id: 1,
          title: "Start my journey",
          description: "Begin working on my personal development",
          status: "completed",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: "Learn about APIs",
          description: "Study RESTful API concepts",
          status: "pending",
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          title: "Practice daily",
          description: "Dedicate at least 30 minutes each day",
          status: "pending",
          created_at: new Date().toISOString()
        }
      ];
      
      saveTasks(sampleTasks);
    }
    
    // Display initial quote and start rotation
    displayRandomQuote();
    updateSavedQuotesList();
    startQuoteRotation();
    
    // Initial fetch
    fetchTasks();
  });