// Функция для отображения ошибок
function showError(errorText) {
  
  let errorContainer = document.querySelector('.error__cantainer')
  errorContainer.classList.toggle('hidden')
  errorContainer.querySelector('.error__text').textContent = errorText
  setTimeout(() => {
    errorContainer.classList.toggle('hidden')
  errorContainer.querySelector('.error__text').textContent = ''
  }, 3000)
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------- СОТРУДНИКИ -------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------

const workers = []

// const worker = {
  // name: 'Шаров',
  // groups: [],
  // isFull: false,
  // totalValue,
  // reducePercent: 0,
// }

// -------------------------------------------------------------------------------- РАБОТА СО СПИСКОМ СОТРУДНИКОВ

// Функция создает и возращает нового сотрудника (объект)
function createWorker(name = '', groups = [], isFull = false, reducePercent = 0, totalValue = 0, completedValue = 0) {
   return newWorker = {
    name,
    groups,
    isFull,
    totalValue,
    completedValue,
    reducePercent,
  }
}

// Функция создаёт и возвращает нового сотрудника (элемент DOM)
function renderWorker(name = '') {
  let worker = document.createElement('li')
  worker.classList.add('workers__list-item', 'worker')
  let workerCard = document.createElement('div')
  workerCard.classList.add('worker__card')
  let workerName = document.createElement('input')
  workerName.placeholder = "Фамилия"
  workerName.value = name
  workerName.required = true
  workerName.type = "text"
  workerName.classList.add('worker__name', 'worker__input')
  let workerAmount = document.createElement('span')
  workerAmount.classList.add('worker__amount')
  let workerProgressContainer = document.createElement('div')
  workerProgressContainer.classList.add('worker__progress-container')
  let workerProgressBar = document.createElement('div')
  workerProgressBar.classList.add('worker__progress-bar')
  let workersPercent = document.createElement('span')
  workersPercent.classList.add('worker__percent')
  workersPercent.textContent = '0%'
  let workersRemoveButton = document.createElement('button')
  workersRemoveButton.classList.add('workers__remove-button', 'button')
  workersRemoveButton.type = 'button'
  let workersGroupList = document.createElement('ul')
  workersGroupList.classList.add('worker__groups-list', 'minimized')
  worker.appendChild(workerCard)
  workerCard.appendChild(workerName)
  workerCard.appendChild(workerAmount)
  workerCard.appendChild(workerProgressContainer)
  workerProgressContainer.appendChild(workerProgressBar)
  workerCard.appendChild(workersPercent)
  workerCard.appendChild(workersRemoveButton)
  worker.appendChild(workersGroupList)
  return worker
 }

// Функция пересоздаёт массив сотрудников на основании заполненных input'ов
function refillWorkersArray() {
  let newWorkersList = [];
  let currentWorkersNodeNames = document.querySelectorAll(".worker__name");
  currentWorkersNodeNames.forEach((workerNameNode) => {
    if (workerNameNode.value && workerNameNode.value.trim() !== "") {
      let existingWorker = workers.find(
        (worker) => worker.name === workerNameNode.value
      );
      if (existingWorker) {
        newWorkersList.push(existingWorker);
      } else {
        newWorkersList.push(createWorker(workerNameNode.value));
      }
    }
  });
  workers.length = 0;
  for (i = 0; i < newWorkersList.length; i++) {
    newWorkersList[i].id = i;
    workers.push(newWorkersList[i]);
  }
  saveWorkers();
}

// Слушатель событий для создания карточки сотрудника в DOM по нажатию на "+"
const workersList = document.querySelector('.workers__list')
const workerAddButton = document.querySelector('.workers__add-button')
workerAddButton.addEventListener('click', () => workersList.appendChild(renderWorker()))

// Слушатель событий - по изменению Input'a имени сотрудника перезаписывает массив с сотрудниками и сохраняет его в LS
document.addEventListener('change', (event) => {
  if (event.target.classList.contains("worker__name")) {
    workers.forEach(worker => {
      if (worker.name === event.target.value) {
        console.log('Имена совпали')
        showError('Такой сотрудник уже существует')
        event.target.value = ''
      } else {
        console.log('else сработал')
      }
    });
    refillWorkersArray();
    saveWorkers();
  }
});


// Слушатель событий - по нажатию на "-" удаляет текущего сотрудника из DOM, перезаписывает массив сотрудников, сохраняет его в LS
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('workers__remove-button')) {
    event.target.parentNode.parentNode.remove()
    clearWorkerFromGroupList(event.target)
    refillWorkersArray()
    saveWorkers()
  }
})

// Функция удаляет удаленного сотрудника из списка групп
function clearWorkerFromGroupList(removeButton) {
  let currentWorkerName = removeButton.parentNode.querySelector('.worker__name').value
  console.log(currentWorkerName)
  groups.forEach(group => {
    if (group.currentWorker === currentWorkerName) {
      console.log(group.currentWorker)
      group.currentWorker = ''
      group.isTaken = false
      group.isCompleted = false
    }
  })
  saveGroups()
  // location.reload()
}

// -------------------------------------------------------------------------------- СОХРАНЕНИЕ И ЗАГРУЗКА СОТРУДНИКОВ

// Функция сохраняет сотрудников в Local Storage
function saveWorkers() {
  localStorage.setItem('workers', JSON.stringify(workers))
  console.log('workers saved')
}

// Функция рендерит сотрудников из Local Storage в DOM и записывает их в массив
function loadWorkers() {
  if (localStorage.getItem('workers')) {
    let currentWorkers = JSON.parse(localStorage.getItem('workers'))
    currentWorkers.forEach(worker => {
      workersList.appendChild(renderWorker(worker.name, worker.groups))
      workers.push(createWorker(worker.name, worker.groups, worker.isFull, +worker.reducePercent, +worker.totalValue, worker.completedValue))
    });
    setProgressBar()
  }
}

// Слушатель событий - запускает загрузку сотрудников при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadWorkers()
  renderDistributedGroups()
})

// -------------------------------------------------------------------------------- ОТОБРАЖЕНИЕ / СКРЫТИЕ ГРУПП У СОТРУДНИКА

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('worker__card')) {
    toggleWorkerGroupList(event.target)
  } else if (event.target.classList.contains('worker__name') || 
             event.target.classList.contains('worker__amount') ||
             event.target.classList.contains('worker__progress-container') ||
             event.target.classList.contains('worker__percent')) {
              toggleWorkerGroupList(event.target.parentNode)
  } else if (event.target.classList.contains('worker__progress-bar')) {
    toggleWorkerGroupList(event.target.parentNode.parentNode)
  }
})

const toggleWorkerGroupList = (worker) => {
  let workerGroupList = worker.parentNode.querySelector('.worker__groups-list')
  workerGroupList.classList.toggle('minimized')
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------- ГРУППЫ ТОВАРОВ ---------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------

const groups = []

// const group = {
  // name: '00. КБТ',
  // amount: 245,
  // isTaken: false,
  // isCompleted = false,
  // worker: 'Шаров',
// }

// -------------------------------------------------------------------------------- ДОБАВЛЕНИЕ И УДАЛЕНИЕ ГРУППЫ ТОВАРОВ

// Слушатель событий для рендера новой группы в DOM
const groupsList = document.querySelector('.groups__list')
const groupAddButton = document.querySelector('.groups__add-button')
groupAddButton.addEventListener("click", () => {
  groupsList.appendChild(renderGroup());
});

// Функция создаёт новую группу
function createGroup(name = '', amount = 0, isTaken = false, isCompleted = false, currentWorker = '') {
  return newGroup = {
   name,
   amount,
   isTaken,
   isCompleted,
   currentWorker,
 }
}

// Функция возвращает новую пустую группу товаров
function renderGroup(name = '', amount = '', isCompleted = false) {
  let group = document.createElement('li')
  group.classList.add('groups__item')
  let groupName = document.createElement('input')
  groupName.required = true
  groupName.type = "text"
  groupName.value = name
  groupName.classList.add('groups__name', 'groups__input')
  groupName.placeholder = "Группа товаров"
  let groupAmount = document.createElement('input')
  groupAmount.required = true
  groupAmount.type = "number"
  groupAmount.value = amount
  groupAmount.placeholder = "Кол-во"
  groupAmount.classList.add('groups__amount', 'groups__input')
  let groupText = document.createElement('span')
  groupText.classList.add('groups__amount-text')
  groupText.textContent = "шт."
  let groupWorker = document.createElement('input')
  groupWorker.type ='text'
  groupWorker.placeholder = 'Фамилия'
  groupWorker.required = true
  groupWorker.classList.add('groups__worker', 'groups__input')
  let groupsCheckbox = document.createElement('input')
  groupsCheckbox.type = "checkbox"
  groupsCheckbox.disabled = true
  if (isCompleted) {
    groupsCheckbox.checked = true
    groupAmount.disabled = true
    groupName.disabled = true
    groupWorker.disabled = true
  } else {
    groupsCheckbox.checked = false
    groupAmount.disabled = false
    groupName.disabled = false
    groupWorker.disabled = false
  }
  groupsCheckbox.classList.add('groups__checkbox', 'checkbox')
  let groupRemove = document.createElement('button')
  groupRemove.type = "button"
  groupRemove.classList.add('groups__remove-button', 'button')
  group.appendChild(groupName)
  group.appendChild(groupAmount)
  group.appendChild(groupText)
  group.appendChild(groupWorker)
  group.appendChild(groupsCheckbox)
  group.appendChild(groupRemove)
  return group
}

// Функция пересоздаёт массив групп на основании заполненных input'ов
function refillGroups() {
  groups.length = 0;
  let currentGroupsList = document.querySelectorAll('.groups__item')
  currentGroupsList.forEach((group) => {
    let groupName = group.querySelector('.groups__name').value
    let groupAmount = group.querySelector('.groups__amount').value
    let currentWorker = group.querySelector('.groups__worker').value
    let isTaken
    let isCompleted
    if (groupName && groupAmount && groupName.trim() !== '' && groupAmount.trim() !== '') {
      groups.push(createGroup(groupName, +groupAmount, isTaken, isCompleted, currentWorker));
    }
  });
}

// Слушатель событий - по изменению Input'a имени группы и количества товаров перезаписывает массив с группами и сохраняет его в LS
document.addEventListener('change', (event) => {
  if ((event.target.classList.contains('groups__name') || event.target.classList.contains('groups__amount'))) {
    groups.forEach(group => {
      if (group.name === event.target.value) {
        showError('Такая группа уже существует')
        event.target.value = ''
      } else {
      }
    })
    refillGroups()
    saveGroups()  
  }
})

// Функция удаляет текущую группу из DOM
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('groups__remove-button')) {
    event.target.parentNode.remove()
    let currentGroupName = event.target.parentNode.querySelector('.groups__name').value
    let currentDistributedGroups = document.querySelectorAll('.worker__group-name')
    currentDistributedGroups.forEach(group => {
      if (group.textContent === currentGroupName) {
        console.log(currentGroupName)
        let currentWorkerName = group.parentNode.parentNode.parentNode.querySelector('.worker__name').value
        let currentGroupObject = groups.find(group => group.name === currentGroupName)
        let currentWorkerObject = workers.find(worker => worker.name === currentWorkerName)
        currentWorkerObject.groups = currentWorkerObject.groups.filter(group => group.name !== currentGroupName)
        currentWorkerObject.totalValue -= currentGroupObject.amount
        currentWorkerObject.isFull = false
        if (currentGroupObject.isCompleted) {
          currentWorkerObject.completedValue -= currentGroupObject.amount
        }
        group.parentNode.remove()
      }
    });
    refillGroups()
    saveGroups()
    saveWorkers()
  }
})

// -------------------------------------------------------------------------------- СОХРАНЕНИЕ И ЗАГРУЗКА ГРУПП

// Функция сохраняет сотрудников в Local Storage
function saveGroups() {
  localStorage.setItem('groups', JSON.stringify(groups))
  console.log('groups saved')
}

// Функция рендерит сотрудников из Local Storage в DOM и записывает их в массив
function loadGroups() {
  if (localStorage.getItem('groups')) {
    let currentGroups = JSON.parse(localStorage.getItem('groups'))
    currentGroups.forEach(group => {
      groupsList.appendChild(renderGroup(group.name, +group.amount, group.isCompleted))
      groups.push(createGroup(group.name, +group.amount, group.isTaken, group.isCompleted, group.currentWorker))
    });
    bindWorkerToGroup()
  }
}

// Слушатель событий - запускает загрузку сотрудников при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadGroups()
})

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------- РАСПРЕДЕЛЕНИЕ ГРУПП ----------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------


// Функция возвращает наибольшую НЕвзятую группу
function findMaxUntakenGroup() {
  let maxUntakerGroupAmount = 0
  for (let group of groups) {
    if (+group.amount >= maxUntakerGroupAmount && group.isTaken === false) {
      maxUntakerGroupAmount = +group.amount
    }
  }
  let currentMaxGroup = groups.find(group => ((+group.amount === maxUntakerGroupAmount) && (group.isTaken === false)))
  if (!currentMaxGroup || currentMaxGroup.amount === 0 ) {
    return false
  } else {
    return currentMaxGroup
  }
}

// Функция возвращает случайный индекс массива
const getRandomIndex = function(array) {
  return Math.floor(Math.random() * array.length)
}

// Функция возвращает сотрудников с наименьшим количеством товаров (если не полный)
function findLowestWorkers() {
  let workersValues = []
  console.log()
  workers.forEach(worker => {
    if (!worker.isFull) {
      workersValues.push(worker.totalValue)
    }
  });
  return Math.min.apply(null, workersValues);
}

// Функция возвращает общее количество в группах
function sumOfGroupValues() {
  let sum = 0
  groups.forEach(group => {
    sum += group.amount
  })
  return sum
}

// Функция возвращает среднее количество товаров на сотрудника
function findAverageAmountofGroups() {
  return Math.floor(sumOfGroupValues() / workers.length)
}

// Функция добавляет самую большую невзятую группу сотруднику с наименьшим количеством
function getGroup() {
  let workersLowestValue = findLowestWorkers()
  let currentMaxUntakenGroup = findMaxUntakenGroup()
  let lowestWorkers = workers.filter(worker => worker.totalValue === workersLowestValue)
  let currentRandomWorkerIndex = getRandomIndex(lowestWorkers)
  let currentWorker = lowestWorkers[currentRandomWorkerIndex]

  if (currentMaxUntakenGroup) {
    currentWorker.groups.push(currentMaxUntakenGroup)
    currentMaxUntakenGroup.currentWorker = currentWorker.name
    currentWorker.totalValue += currentMaxUntakenGroup.amount
    currentMaxUntakenGroup.isTaken = true
  
    let otherReduceValues = function() {
      let sum = -(currentWorker.reduceTotalValue)
      workers.forEach(worker => {
        sum += worker.reduceTotalValue
      });
      return sum / workers.length
    }
    if (currentWorker.reduceTotalValue > 0) {
      otherReduceValues()
    }
    console.log(findAverageAmountofGroups())
    if (currentWorker.totalValue >= (findAverageAmountofGroups() - currentWorker.reduceTotalValue + otherReduceValues())) {
      currentWorker.isFull = true
    }
  }
}

// Функция распределяет все группы между сотрудниками
function getAllGroups() {
  // wipeDistribution()
  for (let group of groups) {
    getGroup()
  }
  saveWorkers()
  saveGroups()
  renderDistributedGroups()
  // location.reload()
}

// Функция очищает всё распределение
function wipeDistribution() {
  workers.forEach(worker => {
    worker.groups.length = 0
    worker.totalValue = 0
    worker.completedValue = 0
    worker.isFull = false
  })
  groups.forEach(group => {
    group.currentWorker = ''
    group.isTaken = false
    group.currentWorker = ''
    group.isCompleted = false
  });
  let currentNames = document.querySelectorAll('.groups__worker')
  currentNames.forEach(name => {
    name.textContent = ''
  });
  saveWorkers()
  saveGroups()
}

// Функция загружает распределённые группы в карточки сотрудников в DOM
function renderDistributedGroups() {
  let workersNodes = document.querySelectorAll('.worker')
  workersNodes.forEach(worker => {
    let workerNameInputValue = worker.querySelector('.worker__name').value
    let currentWorkerObject = workers.find(worker => worker.name === workerNameInputValue)
    let currentWorkerGroupListNode = worker.querySelector('.worker__groups-list')
    let workersGroups = currentWorkerObject.groups
    workersGroups.forEach(group => {
      currentWorkerGroupListNode.appendChild(renderWorkerGroup(group.name, group.amount, group.isCompleted))
    });
  });
}

// Функция возвращает новую карточку группы (элемент DOM) 
function renderWorkerGroup(groupName, groupAmount, groupIsCompleted) {
  let workerGroup = document.createElement('li')
  workerGroup.classList.add('worker__group')
  let workerGroupName = document.createElement('span')
  workerGroupName.classList.add('worker__group-name')
  workerGroupName.textContent = groupName
  let workerGroupAmount = document.createElement('span')
  workerGroupAmount.classList.add('worker__group-amount')
  workerGroupAmount.textContent = groupAmount + ' шт.'
  let workerGroupCheckbox = document.createElement('input')
  workerGroupCheckbox.type = 'checkbox'
  workerGroupCheckbox.classList.add('worker__group-checkbox', 'checkbox')
  if (groupIsCompleted) {
    workerGroupCheckbox.checked = true
  } else {
    workerGroupCheckbox.checked = false
  }

  workerGroup.appendChild(workerGroupName)  
  workerGroup.appendChild(workerGroupAmount)  
  workerGroup.appendChild(workerGroupCheckbox)
  return workerGroup
}

// Функция вставялет в DOM фамилии сотруников к группам
function bindWorkerToGroup() {
  let currentGroupsNodeList = document.querySelectorAll('.groups__item')
  currentGroupsNodeList.forEach(groupNode => {
    let groupNodeName = groupNode.querySelector('.groups__name').value
    let currentGroup = groups.find(group => group.name === groupNodeName)
    let currentGroupWorker = groupNode.querySelector('.groups__worker')
    currentGroupWorker.value = currentGroup.currentWorker
  })
}

// Функция добавляет статус группе "Назначена"
function makeGroupTaken(input) {
  let targetGroupName = input.parentNode.querySelector('.groups__name').value
  let currentGroup = groups.find(group => group.name === targetGroupName)
  let currentWorkerObject = workers.find(worker => worker.name === input.value)
  if (currentGroup.isTaken) {
    if (input.value === '') {
      currentGroup.isTaken = false
      currentGroup.isCompleted = false
      let currentClearedWorkerObject = workers.find(worker => worker.name === currentGroup.currentWorker)
      currentClearedWorkerObject.totalValue -= currentGroup.amount
      currentClearedWorkerObject.isFull = false
      currentClearedWorkerObject.groups = currentClearedWorkerObject.groups.filter(group => group.name !== currentGroup.name)
      currentGroup.currentWorker = ''
      if (currentGroup.isCompleted) {
        currentClearedWorkerObject.completedValue -= currentGroup.amount
      }
    } else if (!currentWorkerObject) {
      console.log('input с новым челом')
      showError('Такой сотрудник не создан')
      let currentClearedWorkerObject = workers.find(worker => worker.name === currentGroup.currentWorker)
      console.log(currentClearedWorkerObject)
      console.log(input)
      input.value = currentClearedWorkerObject.name
    } else {
      currentGroup.currentWorker = input.value
      let currentClearedWorkerObject = workers.find(worker => worker.name === currentGroup.currentWorker)
      currentClearedWorkerObject.totalValue -= currentGroup.amount
      currentClearedWorkerObject.isFull = false
      currentClearedWorkerObject.groups = currentClearedWorkerObject.groups.filter(group => group.name !== currentGroup.name)
      currentGroup.currentWorker = input.value
      currentWorkerObject.groups.push(currentGroup)
      currentWorkerObject.totalValue += currentGroup.amount
      if (currentGroup.isCompleted) {
        currentClearedWorkerObject.completedValue += currentGroup.amount
      }
    }
  } else if (currentWorkerObject) {
    currentGroup.isTaken = true
    currentGroup.currentWorker = input.value
    currentWorkerObject.groups.push(currentGroup)
    currentWorkerObject.totalValue += currentGroup.amount
  } else if (input.value === '') {
    
  } else {
    input.value = ''
    showError('Такой сотрудник не создан')
  }
  saveGroups()
  saveWorkers()
}

document.addEventListener('change', (event) => {
  if (event.target.classList.contains('groups__worker')) {
    makeGroupTaken(event.target)
  }
})

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------- ОТМЕТКИ О ВЫПОЛНЕНИИ ----------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------

// Функция отмечает группу как выполненную
function setGroupCompleted(currentCheckbox) {
  let currentGroupName = currentCheckbox.parentNode.querySelector('.worker__group-name').textContent
  let currentWorker = currentCheckbox.parentNode.parentNode.parentNode.querySelector('.worker__name').value
  let currentGroupObject = groups.find(group => group.name === currentGroupName)
  let currentWorkerObject = workers.find(worker => worker.name === currentWorker)
  let currentGroupInWorker = currentWorkerObject.groups.find(group => group.name === currentGroupName)
  let currentGroupsNodes = document.querySelectorAll('.groups__name')
  let currentGroupNode
  currentGroupsNodes.forEach(groupNode => {
    if (groupNode.value === currentGroupName) {
      currentGroupNode = groupNode
      let currentGroupCheckbox = currentGroupNode.parentElement.querySelector('.groups__checkbox')
      let currentInputs = document.querySelectorAll('.groups__input')
      currentInputs.forEach(input => {
        if (input.disabled) {
          input.disabled = false
        } else {
          input.disabled = true
        }
      });
      if (currentGroupCheckbox.checked === true) {
        currentGroupCheckbox.checked = false 
    } else {
      currentGroupCheckbox.checked = true
    }
  }})
  if (currentCheckbox.checked) {
    currentGroupObject.isCompleted = true
    currentGroupInWorker.isCompleted = true
    currentWorkerObject.completedValue += currentGroupObject.amount
  } else {
    currentGroupObject.isCompleted = false
    currentGroupInWorker.isCompleted = false
    currentWorkerObject.completedValue -= currentGroupObject.amount
  }
  saveGroups()
  saveWorkers()
}

// Слушатель событий - при отметке чекбокса запускает отметку группы
document.addEventListener('change', (event) => {
  if (event.target.classList.contains('worker__group-checkbox')) {
    setGroupCompleted(event.target)
    setProgressBar()
  }
})

// Функция высчитывает процент вполнениfя каждым сотрудником
function setProgressBar() {
  let currentProgressBarsNodes = document.querySelectorAll('.worker__progress-bar')
  currentProgressBarsNodes.forEach(progressBar => {
    let currentWorkerNodeName = progressBar.parentNode.parentNode.querySelector('.worker__name').value
    let currentPercentText = progressBar.parentNode.parentNode.querySelector('.worker__percent')
    let currentWorker = workers.find(worker => worker.name === currentWorkerNodeName)
    let currentPercent = Math.ceil((((currentWorker.completedValue / currentWorker.totalValue) * 100)))
    progressBar.style.width = currentPercent + '%'
    if (!isNaN(currentPercent)) {
      currentPercentText.textContent = currentPercent + '%'
    } 
  });
}

// Функция меняет количество товаров в группе, если она была распределена
function changeDistributedGroupAmount(groupAmountInput) {
  let currentGroupName = groupAmountInput.parentNode.querySelector('.groups__name').value
  let currentGroupObject = groups.find(group => group.name === currentGroupName)
  currentGroupObject.amount = +groupAmountInput.value
  let currentWorkerName = groupAmountInput.parentNode.querySelector('.groups__worker').value
  if (currentWorkerName) {
    let currentWorkerObject = workers.find(worker => worker.name === currentWorkerName)
    let currentWorkerGroups = currentWorkerObject.groups
    let currentWorkerGroup = currentWorkerGroups.find(group => group.name === currentGroupName)
    currentWorkerObject.totalValue -= currentWorkerGroup.amount
    if (currentWorkerObject.totalValue >= (averageOfGroupValues - currentWorkerObject.reduceTotalValue + otherReduceValues())) {
      currentWorkerObject.isFull = true
    } else {
      currentWorkerObject.isFull = false
    }
    currentWorkerGroup.amount = +groupAmountInput.value
    currentWorkerObject.totalValue += currentWorkerGroup.amount
    let groupNodes = document.querySelectorAll('.worker__group-name')
    groupNodes.forEach(groupNode => {
      if (groupNode.textContent === currentGroupName) {
        let currentNodeAmount = groupNode.parentNode.querySelector('.worker__group-amount')
        currentNodeAmount.textContent = currentWorkerGroup.amount + ' шт.'
      }
    });

  }
  saveWorkers()
  saveGroups()
  setProgressBar()
}

document.addEventListener('change', (event) => {
  if (event.target.classList.contains('groups__amount')) {
    changeDistributedGroupAmount(event.target)
  }
})
