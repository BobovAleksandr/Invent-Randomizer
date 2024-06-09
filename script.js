const groups = []

// Запуск функции наполнения групп при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadTable()
  renderGroups()
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

// Отрисовка групп на странице
const renderGroups = function() {
  groups.forEach(group => {
    addGroup(group.name, group.value, group.currentWorker)
  });
}

const workers = [
  {
    id: 0,
    name: 'Градобоев Антон',
    groups: [],
    totalValue: 0,
    reduceTotalValue: 0,
    isFull: false,
  },
  {
    id: 1,
    name: 'Костиков Юрий',
    groups: [],
    totalValue: 0,
    reduceTotalValue: 0,
    isFull: false,
  },
  {
    id: 2,
    name: 'Сапожников Евгений',
    groups: [],
    totalValue: 0,
    reduceTotalValue: 0,
    isFull: false,
  },
  {
    id: 3,
    name: 'Шаров Алексей',
    groups: [],
    totalValue: 0,
    reduceTotalValue: 0,
    isFull: false,
  },
  {
    id: 4,
    name: 'Бобов Александр',
    groups: [],
    totalValue: 0,
    reduceTotalValue: 0,
    isFull: false,
  },
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

// Ренедеринг строки в таблицу
const addGroup = function(groupName = "", groupValue = "", groupWorker = "") {
  let tableBody = document.querySelector('.table__body')
  let newRow = document.createElement('tr')
  let newGroupNameTd = document.createElement('td')
  let newGroupValueTd = document.createElement('td')
  let newWorkerNameTd = document.createElement('td')
  let newGroupNameInput = document.createElement('input')
  let newGroupValueInput = document.createElement('input')
  let newWorkerNameInput = document.createElement('input')
  let newWorkerRemoveButton = document.createElement('button')
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

  tableBody.appendChild(newRow)
  newRow.appendChild(newGroupNameTd)
  newRow.appendChild(newGroupValueTd)
  newRow.appendChild(newWorkerNameTd)
  newGroupNameTd.appendChild(newGroupNameInput)
  newGroupValueTd.appendChild(newGroupValueInput)
  newWorkerNameTd.appendChild(newWorkerNameInput)
  newWorkerNameTd.appendChild(newWorkerRemoveButton)
}

// Вызов функции добавления строки
let addGroupButton = document.querySelector('.table__add-button')
addGroupButton.addEventListener('click', () => {
  addGroup()
})

// Вызов функции сохранения таблицы
document.addEventListener('change', (event) => {
  if (event.target.classList.contains('table__input-group-name')) {}
  saveTable()
  console.log('data saved')
})

// Сохранение в Local Storage при изменении input'ов таблтцы
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
      currentWorker: currentNameInputs[i].value
    }
    currentData.push(newObj)
  }
  localStorage.setItem('tableData', JSON.stringify(currentData))
}

// Удаление группы из списка
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('table__input-worker-remove-button')) {
    removeGroup(event.target)
  }
})

// Удаляет строчку
const removeGroup = function(button) {
  let parentRow = button.parentElement.parentElement
  parentRow.remove()
  saveTable()
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