const groups = []

// Запуск функции наполнения групп при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadTable()
  loadWorkersTable()
  renderGroups()
  renderWorkers()
})

// Наполнение массива групп
const loadTable = function() {
  let loadedData = JSON.parse(localStorage.getItem('tableData'))
  if (loadedData) {
    for (i = 0; i < loadedData.length; i++) {
      loadedData[i].value = Number(loadedData[i].value)
      groups.push(loadedData[i])
    }
  }
}

// Наполнение массива сотрудников
const loadWorkersTable = function() {
  let loadedData = JSON.parse(localStorage.getItem('workersTableData'))
  if (loadedData) {
    for (i = 0; i < loadedData.length; i++) {
      loadedData[i].totalValue = Number(loadedData[i].totalValue)
      loadedData[i].reduceTotalValue = Number(loadedData[i].reduceTotalValue)
      loadedData[i].progress = Number(loadedData[i].progress)
      workers.push(loadedData[i])
    }
  }
}

// Отрисовка групп на странице
const renderGroups = function() {
  groups.forEach(group => {
    addGroup(group.name, group.value, group.currentWorker)
  });
}

// Отрисовка сотрудников на странице
const renderWorkers = function() {
  workers.forEach(worker => {
    addWorker(worker.name, worker.progress)
  });
}

const workers = [
  // {
  //   id: 0,
  //   name: 'Градобоев Антон',
  //   groups: [],
  //   totalValue: 0,
  //   reduceTotalValue: 0,
  //   isFull: false,
  // },
  // {
  //   id: 1,
  //   name: 'Костиков Юрий',
  //   groups: [],
  //   totalValue: 0,
  //   reduceTotalValue: 0,
  //   isFull: false,
  // },
  // {
  //   id: 2,
  //   name: 'Сапожников Евгений',
  //   groups: [],
  //   totalValue: 0,
  //   reduceTotalValue: 0,
  //   isFull: false,
  // },
  // {
  //   id: 3,
  //   name: 'Шаров Алексей',
  //   groups: [],
  //   totalValue: 0,
  //   reduceTotalValue: 0,
  //   isFull: false,
  // },
  // {
  //   id: 4,
  //   name: 'Бобов Александр',
  //   groups: [],
  //   totalValue: 0,
  //   reduceTotalValue: 0,
  //   isFull: false,
  // },
]

// Возвращает наибольшую НЕвзятую группу
const findMaxUntakenGroup = function () {
  let maxUntakerGroupValue = 0
  for (let group of groups) {
    if (+group.value >= maxUntakerGroupValue && group.isTaken === false) {
      maxUntakerGroupValue = +group.value
    }
  }
  let currentMaxGroup = groups.find(group => ((+group.value === maxUntakerGroupValue) && (group.isTaken === false)))
  if (currentMaxGroup.value === 0) {
    return false
  } else {
    return currentMaxGroup
  }
}

// Возвращает случайный индекс массива
const getRandomIndex = function(array) {
  return Math.floor(Math.random() * array.length)
}

// Возвращает сотрудника с наименьшим количеством товаров (если не полный)
const findLowestWorker = function() {
  let workersValues = []
  workers.forEach(worker => {
    if (!worker.isFull) {
      workersValues.push(worker.totalValue)
    }
  });
  return Math.min.apply(null, workersValues);
}

// Находит общее количество в группах
const sumOfGroupValues = function() {
  let sum = 0
  groups.forEach(group => {
    sum += group.value
  })
  return sum
}

// Находит среднее количество товаров на сотрудника
const averageOfGroupValues = Math.floor(sumOfGroupValues() / workers.length)

// Добавляет самую большую невзятую группу сотруднику с наименьшим процентом
const getGroup = function() {
  let lowestValue = findLowestWorker()
  let currentMaxUntakenGroup = findMaxUntakenGroup()
  let lowestWorkers = workers.filter(worker => worker.totalValue === lowestValue)
  let currentRandomWorkerIndex = getRandomIndex(lowestWorkers)
  let currentWorker = lowestWorkers[currentRandomWorkerIndex]

  if (currentMaxUntakenGroup) {
    currentWorker.groups.push(currentMaxUntakenGroup)
    currentWorker.totalValue += currentMaxUntakenGroup.value
    currentMaxUntakenGroup.isTaken = true
  
    if (currentWorker.reduceTotalValue > 0) {
      let otherReduceValues = function() {
        let sum = -(currentWorker.reduceTotalValue)
        workers.forEach(worker => {
          sum += worker.reduceTotalValue
        });
        return sum / workers.length
      }

      if (currentWorker.totalValue >= (averageOfGroupValues - currentWorker.reduceTotalValue + otherReduceValues())) {
        currentWorker.isFull = true
      }
    }
  }
}

// Распределяет все группы между сотрудниками
const getAllGroups = function() {
  wipeDistribution()
  for (let group of groups) {
    getGroup()
    renderWorkerNames()
    saveTable()
  }
  // location.reload()
}

// Ренедеринг строки в таблицу групп
const addGroup = function(groupName = "", groupValue = "", groupWorker = "") {
  let tableBody = document.querySelector('.table__body')
  let newRow = document.createElement('tr')
  let newGroupNameTd = document.createElement('td')
  let newGroupValueTd = document.createElement('td')
  let newWorkerNameTd = document.createElement('td')
  let newCheckboxTd = document.createElement('td')
  let newGroupNameInput = document.createElement('input')
  let newGroupValueInput = document.createElement('input')
  let newWorkerNameInput = document.createElement('input')
  let newWorkerRemoveButton = document.createElement('button')
  let newGroupCheckbox = document.createElement('input')
  newGroupNameInput.classList.add('table__input-group-name', 'table__input')
  newGroupValueInput.classList.add('table__input-group-value', 'table__input')
  newWorkerNameInput.classList.add('table__input-worker-name', 'table__input')
  newRow.classList.add('main__table-row')
  newGroupNameInput.type = "text"
  newGroupValueInput.type = "number"
  newWorkerNameInput.type = "text"
  newWorkerNameInput.disabled = true
  newGroupNameInput.value = groupName
  newGroupValueInput.value = groupValue
  newWorkerNameInput.value = groupWorker
  newWorkerRemoveButton.type = "button"
  newWorkerRemoveButton.textContent = "-"
  newWorkerRemoveButton.classList.add('table__input-worker-remove-button', 'button')
  newGroupCheckbox.classList.add('table__checkbox')
  newGroupCheckbox.type = "checkbox"

  tableBody.appendChild(newRow)
  newRow.appendChild(newGroupNameTd)
  newRow.appendChild(newGroupValueTd)
  newRow.appendChild(newWorkerNameTd)
  newRow.appendChild(newCheckboxTd)
  newGroupNameTd.appendChild(newGroupNameInput)
  newGroupValueTd.appendChild(newGroupValueInput)
  newWorkerNameTd.appendChild(newWorkerNameInput)
  newCheckboxTd.appendChild(newGroupCheckbox)
  newCheckboxTd.appendChild(newWorkerRemoveButton)
}

// Вызов функции добавления строки в таблицу групп
let addGroupButton = document.querySelector('.table__add-button')
addGroupButton.addEventListener('click', () => {
  addGroup()
})

// Рендеринг строки в таблицу сотрудникв
const addWorker = (workerName = "", workerProgress = 0) => {
  let tableBody = document.querySelector('.workers__table-body')
  let newRow = document.createElement('tr')
  let newWorkerNameTd = document.createElement('td')
  let newWorkerProgressTd = document.createElement('td')
  let newWorkerNameInput = document.createElement('input')
  let newWorkerProgressContainer = document.createElement('div')
  let newWorkerProgressValue = document.createElement('div')
  let newWorkerProgressText = document.createElement('span')
  let newWorkerRemoveButton = document.createElement('button')

  newWorkerNameInput.classList.add('workers-table__input-worker-name', 'table__input')
  newWorkerNameInput.type = "text"
  newWorkerNameInput.value = workerName
  newWorkerProgressContainer.classList.add('workers-table__progress-bar-container')
  newWorkerProgressValue.classList.add('workers-table__progress-bar-value')
  newWorkerProgressText.classList.add('workers-table-progress-bar-text')
  newWorkerProgressText.textContent = workerProgress + '%'
  newWorkerRemoveButton.classList.add('workers-table__input-worker-remove-button', 'button')
  newWorkerRemoveButton.type = "button"

  tableBody.appendChild(newRow)
  newRow.appendChild(newWorkerNameTd)
  newWorkerNameTd.appendChild(newWorkerNameInput)
  newRow.appendChild(newWorkerProgressTd)
  newWorkerProgressTd.appendChild(newWorkerProgressContainer)
  newWorkerProgressTd.appendChild(newWorkerRemoveButton)
  newWorkerRemoveButton.textContent = "-"
  newWorkerProgressContainer.appendChild(newWorkerProgressText)
  newWorkerProgressContainer.appendChild(newWorkerProgressValue)
}

// Вызов функции добавления строки в таблицу сотрудников
let addWorkerButton = document.querySelector('.workers-table__add-button')
addWorkerButton.addEventListener('click', () => {
  console.log('s')
  addWorker()
})

// Вызов функции сохранения таблицы групп
document.addEventListener('change', (event) => {
  if (event.target.classList.contains('workers-table__input-worker-name')) {}
  saveWorkersTable()
  console.log('data saved')
})

// Вызов функции сохранения таблицы групп
document.addEventListener('change', (event) => {
  if (event.target.classList.contains('table__input-group-name')) {}
  saveTable()
  console.log('data saved')
})

// Сохранение в Local Storage при изменении input'ов таблтцы сотрудников
let saveWorkersTable = function() {
  let currentWorkerNames = document.querySelectorAll('.workers-table__input-worker-name')
  let currentData = []
  for (i = 0; i < currentWorkerNames.length; i++) {
    let newObj = {
      id: i,
      name: currentWorkerNames[i].value,
      groups:[],
      totalValue: 0,
      reduceTotalValue: 0,
      isFull: false,
      progress: 0,
    }
    currentData.push(newObj)
  }
  localStorage.setItem('workersTableData', JSON.stringify(currentData))
}

// Сохранение в Local Storage при изменении input'ов таблтцы групп
let saveTable = function() {
  let currentGroupNames = document.querySelectorAll('.table__input-group-name')
  let currentGroupValues = document.querySelectorAll('.table__input-group-value')
  let currentNameInputs = document.querySelectorAll('.table__input-worker-name')
  let currentData = []
  for (i = 0; i < currentGroupNames.length; i++) {
    let newObj = {
      name: currentGroupNames[i].value,
      value: currentGroupValues[i].value,
      id: i,
      isTaken: false,
      isComplete: false,
      currentWorker: currentNameInputs[i].value
    }
    currentData.push(newObj)
  }
  localStorage.setItem('tableData', JSON.stringify(currentData))
}

// Удаление группы из списка
document.addEventListener('click', (event) => {
  if ((event.target.classList.contains('table__input-worker-remove-button')) || 
      (event.target.classList.contains('workers-table__input-worker-remove-button'))) {
    removeGroup(event.target)
  }
})

// Удаляет строчку
const removeGroup = function(button) {
  let parentRow = button.parentElement.parentElement
  parentRow.remove()
  saveTable()
  saveWorkersTable()
  console.log('data saved')
}

// Заполняет таблицу сотрудниками
const renderWorkerNames = function() {
  let groupsInputs = document.querySelectorAll('.table__input-group-name')
  groupsInputs.forEach(input => {
    workers.forEach(worker => {
      worker.groups.forEach(group => {
        if (group.name === input.value) {
          let currentRow = input.parentNode.parentNode
          let currentWorkerInput = currentRow.querySelector('.table__input-worker-name')
          currentWorkerInput.value = worker.name
        }
      });
    })
  })
}

// Очищает всё распределение
const wipeDistribution = function() {
  workers.forEach(worker => {
    worker.groups.length = 0
    worker.totalValue = 0
    worker.isFull = false
  })
  groups.forEach(group => {
    group.currentWorker = ""
    group.isTaken = false
  });
  let currentNameInputs = document.querySelectorAll('.table__input-worker-name')
  currentNameInputs.forEach(input => {
    input.value = ""
  });
}