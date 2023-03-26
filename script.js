const itemList = document.getElementById('item-list');
const descriptionInput = document.getElementById('description');
const deadlineInput = document.getElementById('deadline');
const addButton = document.getElementById('add-btn');

const recentlyAddedSort = document.getElementById('rcnt-add-btn')
const deadlineSort = document.getElementById('dline-btn')
const recentlyCompletedSort = document.getElementById('rcnt-comp-btn')

//Pre-load with items
const items = [{"id":1679837681895,"description":"Task 1","deadline":null,"completed":false,"createdAt":"2023-03-26T13:34:41.895Z"},{"id":1679838587112,"description":"Task 2","deadline":"2023-04-20T16:49","completed":false,"createdAt":"2023-03-26T13:49:47.112Z"},{"id":1679838599245,"description":"Task 3","deadline":"2023-04-11T16:49","completed":false,"createdAt":"2023-03-26T13:49:59.245Z"},{"id":1679838604877,"description":"Task 4","deadline":null,"completed":false,"createdAt":"2023-03-26T13:50:04.877Z"}];

sessionStorage.setItem('items', JSON.stringify(items));

const existingItems = JSON.parse(sessionStorage.getItem('items')) || [];

renderItems();


addButton.addEventListener('click', () => {
  const description = descriptionInput.value.trim();
  const deadline = deadlineInput.value.trim() || null;

  if (description.length > 0) {
    const newItem = {
      id: Date.now(),
      description,
      deadline,
      completed: false,
      createdAt: new Date().toISOString()
    };

    existingItems.push(newItem);
    sessionStorage.setItem('items', JSON.stringify(existingItems));

    const li = createItemElement(newItem);
    itemList.insertBefore(li, itemList.firstChild);

    descriptionInput.value = '';
    deadlineInput.value = '';
  }
});

itemList.addEventListener('click', event => {
  const target = event.target;

  if (target.classList.contains('delete-btn')) {
    const li = target.closest('li');
    const itemId = parseInt(li.dataset.itemId);
    const confirmed = confirm('Are you sure you want to delete this item?');

    if (confirmed) {
      existingItems.splice(existingItems.findIndex((item) => item.id === itemId), 1);
      sessionStorage.setItem('items', JSON.stringify(existingItems));
      li.remove();
    }
  }
});

itemList.addEventListener('change', (event) => {
  const target = event.target;

  if (target.classList.contains('complete-checkbox')) {
    const li = target.closest('li');
    const itemId = parseInt(li.dataset.itemId);
    const index = existingItems.findIndex((item) => item.id === itemId);
    existingItems[index].completed = target.checked;

    if (target.checked) {
      li.classList.add('completed');
      existingItems[index].completedAt = new Date().toISOString();
      itemList.appendChild(li);
    } 
    else {
      li.classList.remove('completed');
      existingItems[index].completedAt = null;
      itemList.insertBefore(li, itemList.firstChild);
    }

    sessionStorage.setItem('items', JSON.stringify(existingItems));
  }
});

recentlyAddedSort.addEventListener('click', () => {
  existingItems.sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  selectedFilter(recentlyAddedSort);
  renderItems();
});

deadlineSort.addEventListener('click', () => {
  existingItems.sort((a, b) => {
    return new Date(b.deadline) - new Date(a.deadline);
  });

  itemList.innerHTML = '';

  existingItems.forEach((item) => {
    const li = createItemElement(item);
    if(!item.completed) {
      if(item.deadline == null){
        itemList.appendChild(li);
      }
      else {
        itemList.insertBefore(li, itemList.firstChild);
      }
    }
  });

  existingItems.forEach((item) => {
    const li = createItemElement(item);
    if(item.completed) {
      li.classList.add('completed');
      itemList.appendChild(li);
    }
  });
 
  selectedFilter(deadlineSort);
});

recentlyCompletedSort.addEventListener('click', () => {
  existingItems.sort((a, b) => {
    return new Date(a.completedAt) - new Date(b.completedAt);
  });

  itemList.innerHTML = '';

  existingItems.forEach((item) => {
    const li = createItemElement(item);
    if(item.completed) {
      li.classList.add('completed');
      itemList.insertBefore(li, itemList.firstChild);
    }
    else{
      itemList.appendChild(li);
    }
  });

  selectedFilter(recentlyCompletedSort);
});

function renderItems(){
  itemList.innerHTML = '';

  existingItems.forEach((item) => {
    const li = createItemElement(item);
  
    if (item.completed) {
      li.classList.add('completed');
      itemList.appendChild(li);
    } 
    else {
      itemList.insertBefore(li, itemList.firstChild);
    }
  });
}

function createItemElement(item) {
  const li = document.createElement('li');
  li.dataset.itemId = item.id;
  li.innerHTML = `
    <div class="information-container">
      <span class="description">${item.description}</span>
      <span class="deadline">${formatDeadline(item.deadline)}</span>
    </div>
    <button class="delete-btn">Delete</button>
    <label class="complete-label">
      <input type="checkbox" class="complete-checkbox" ${item.completed ? 'checked' : ''}>
      <span>Completed</span>
    </label>
  `;

  if (item.completed) {
    li.classList.add('completed');
  }
  return li;
}

function formatDeadline(deadline) {
  if (!deadline) {
    return '';
  }

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  if(days > 0) return `Time left: ${days} days, ${hours} hours, ${minutes} minutes`;
  else if(hours > 0) return `Time left: ${hours} hours, ${minutes} minutes`;
  else return `Time left: ${minutes} minutes`;
}

function selectedFilter(selection){
  const buttons = document.querySelectorAll('.sort-container button');
  buttons.forEach(button => {
    button.classList.remove('selectedSort');
  });
  
  const selectedButton = selection;
  selectedButton.classList.add('selectedSort');
}
