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


let workers = []

// const worker = {
  // name: 'Шаров',
  // groups: [],
  // isFull: false,
  // reducePercent: 0,
  // totalValue,
  // completedValue,
// }

// Функция создает и возращает нового сотрудника (объект)
function createWorker(name = '', groups = [], isFull = false, totalValue = 0, completedValue = 0, reducePercent = 0) {
  return {
   name,
   groups,
   isFull,
   totalValue,
   getTotalValue: function() {
    let total = this.groups.reduce((sum, group) => sum + group.amount, 0)
    let $workerAmountSpan = [...document.querySelectorAll('.worker__name')].find(worker => worker.value === this.name).nextElementSibling
    $workerAmountSpan.textContent = `${total} шт.`
    return total
  },
   completedValue,
   reducePercent,
   completedPercent: this.completedValue / this.totalValue * 100,
 }
}


// Функция создаёт и возвращает нового сотрудника (элемент DOM)
function renderWorker(name = '', amount = 0) {
  let worker = document.createElement('li')
  worker.classList.add('workers__list-item', 'worker')
  let workerCard = document.createElement('div')
  workerCard.classList.add('worker__card')
  let workerName = document.createElement('input')
  workerName.placeholder = "Фамилия"
  workerName.value = name
  workerName.value ? workerName.disabled = true : workerName.disabled = false
  workerName.required = true
  workerName.type = "text"
  workerName.classList.add('worker__name', 'worker__input')
  let workerAmount = document.createElement('span')
  workerAmount.classList.add('worker__amount')
  workerAmount.textContent = `${amount} шт.`
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

// Слушатель событий для создания карточки сотрудника в DOM по нажатию на "+"
const workersList = document.querySelector('.workers__list')
const workerAddButton = document.querySelector('.workers__add-button')
workerAddButton.addEventListener('click', () => workersList.appendChild(renderWorker()))

 // Функция сохраняет сотрудников в Local Storage
function saveWorkers() {
  localStorage.setItem('workers', JSON.stringify(workers))
  console.log('workers saved')
}

// Функция рендерит сотрудников из Local Storage в DOM и создаёт массив
function loadWorkers() {
  if (localStorage.getItem('workers')) {
    let currentWorkers = JSON.parse(localStorage.getItem('workers'))
    currentWorkers.forEach(worker => {
      workersList.appendChild(renderWorker(worker.name, worker.totalValue))
      workers.push(createWorker(worker.name, worker.groups, worker.isFull, +worker.totalValue, +worker.completedValue, +worker.reducePercent, ))
    });
    // setProgressBar()
    renderAllWorkersGroup()
  }
}

// Слушатель событий - запускает загрузку сотрудников при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadWorkers()
  // renderDistributedGroups()
})

// Слушатель событий - по изменению Input'a проверяет на сопадение имён
document.addEventListener('change', (event) => {
  if (event.target.classList.contains('worker__name')) {
    workers.forEach(worker => {
      if (worker.name === event.target.value) {
        showError('Такой сотрудник уже существует')
        event.target.value = ''
      }
    })
    if (event.target.value) {
      event.target.disabled = true
      addWorkerToArray(event.target.value)
      saveWorkers()
      // Добавляем сотрудника в options  у каждого select'a сотрудника в группе
      let $groupsWorkersSelects = [...document.querySelectorAll('.groups__select')]
      $groupsWorkersSelects.forEach($select => {
        $select.appendChild(renderWorkerSelectOption(event.target.value))
      }) 
    }
  }
})


// Функция добавляет сотрудника в массив
function addWorkerToArray(workerName) {
  workers.push(createWorker(workerName))
}

// Слушатель событий - по нажатию на "-" запускает удаление сотрудника
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('workers__remove-button')) {
    let currentWorkerName = event.target.closest('.worker').querySelector('.worker__name').value
    deleteWorker(currentWorkerName)
  }
})

// Функция удаляет сотрудника из DOM, из массива и из групп
function deleteWorker(workerName) {
  
  groups.forEach(group => {
    if (group.currentWorker === workerName) {
      changeGroupCompletedStatus(group, false)
      group.currentWorker = ''
      group.isTaken = false
      group.isCompleted = false
      let $currentGroupSelect = [...document.querySelectorAll('.groups__name')].find(input => input.value === group.name).closest('.groups__item').querySelector('.groups__select')
      $currentGroupSelect.value = ''
      let $currentSelectOptions = [...$currentGroupSelect.querySelectorAll('.groups__option')]
      $currentSelectOptions.forEach($option => {
        $option.classList.remove('selected')
      })
    }
  })

  let currentWorkerElement = [...document.querySelectorAll('.worker__name')].find(input => input.value === workerName).closest('.worker')
  currentWorkerElement.remove()
  workers = workers.filter(worker => worker.name !== workerName)
  saveWorkers()

  // Удаляем сотрудника из списка опций сотруников группы товаров
  let $groupsWorkersOptions = [...document.querySelectorAll('.groups__option')].filter($option => $option.value === workerName)
  $groupsWorkersOptions.forEach($option => {
    $option.remove()
  })

  

  saveGroups()
}

// -------------------------------------------------------------------------------- ОТОБРАЖЕНИЕ / СКРЫТИЕ ГРУПП У СОТРУДНИКА

// TODO - ПЕРЕПИСАТЬ НА КНОПКУ - ГАЛОЧКУ

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('worker__card')) {
    toggleWorkerGroupList(event.target.closest('.worker'))
  } else if (event.target.classList.contains('worker__amount') ||
              event.target.classList.contains('worker__progress-container') ||
              event.target.classList.contains('worker__percent') ||
              event.target.classList.contains('worker__progress-bar')) 
              {
              toggleWorkerGroupList(event.target.closest('.worker'))
  } else if (event.target.classList.contains('worker__name')) {
    toggleWorkerGroupList(event.target.closest('.worker'))
  }
})

const toggleWorkerGroupList = (worker) => {
  let workerGroupList = worker.querySelector('.worker__groups-list')
  workerGroupList.classList.toggle('minimized')
  // console.log('toggle')
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------- ГРУППЫ ТОВАРОВ ---------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------

let groups = []

// const group = {
  // name: '00. КБТ',
  // amount: 245,
  // isTaken: false,
  // isCompleted: false,
  // currentWorker: 'Шаров',
// }

// Слушатель событий для рендера новой группы в DOM
const groupsList = document.querySelector('.groups__list')
const groupAddButton = document.querySelector('.groups__add-button')
groupAddButton.addEventListener("click", () => {
  groupsList.appendChild(renderGroup())
})

// Функция создаёт новую группу
function createGroup(name = '', amount = 0, currentWorker = '', isTaken = false, isCompleted = false) {
  return {
   name,
   amount,
   currentWorker,
   isTaken,
   isCompleted,
 }
}

// Функция возвращает новую пустую группу товаров (DOM)
function renderGroup(group = {}) {
  let $group = document.createElement('li')
  $group.classList.add('groups__item')
  let $groupName = document.createElement('input')
  $groupName.required = true
  $groupName.type = "text"
  $groupName.value = group.name ?? ''
  $groupName.value ? $groupName.disabled = true : $groupName.disabled = false
  $groupName.classList.add('groups__name', 'groups__input')
  $groupName.placeholder = "Группа товаров"
  let $groupAmount = document.createElement('input')
  $groupAmount.required = true
  $groupAmount.type = "number"
  $groupAmount.value = parseInt(group.amount) ?? ''
  $groupAmount.placeholder = "Кол."
  $groupAmount.classList.add('groups__amount', 'groups__input')
  let $groupText = document.createElement('span')
  $groupText.classList.add('groups__amount-text')
  $groupText.textContent = "шт."
  let $groupWorker = document.createElement('select')
  $groupWorker.classList.add('groups__select')
  $groupWorker.name = 'groups__select'
  $groupWorker.id = 'groups__select'
  $groupWorker.value = group.currentWorker ?? ''
  $groupWorker.textContent = group.currentWorker ?? ''
  let $groupOptionWhitespace = document.createElement('option')
  $groupOptionWhitespace.classList.add('groups__option')
  if (group.currentWorker === '') {
    $groupOptionWhitespace.selected = true
    $groupOptionWhitespace.value = ''
    $groupOptionWhitespace.textContent = ''
  }
  let $groupsCheckbox = document.createElement('input')
  $groupsCheckbox.type = "checkbox"
  if (group.isCompleted) {
    $groupsCheckbox.checked = true
    $groupAmount.disabled = true
    $groupWorker.disabled = true
  } else {
    $groupsCheckbox.checked = false
    $groupAmount.disabled = false
    $groupWorker.disabled = false
  }
  $groupsCheckbox.classList.add('groups__checkbox', 'checkbox')
  let $groupRemove = document.createElement('button')
  $groupRemove.type = "button"
  $groupRemove.classList.add('groups__remove-button', 'button')
  $group.appendChild($groupName)
  $group.appendChild($groupAmount)
  $group.appendChild($groupText)
  $group.appendChild($groupWorker)
  $groupWorker.appendChild($groupOptionWhitespace)
  workers.forEach(worker => {
    let $groupOption = renderWorkerSelectOption(worker.name)
    if (group.currentWorker === worker.name) {
      $groupOption.selected = true
      $groupOption.classList.add('selected')
    }
    $groupWorker.appendChild($groupOption)
  });
  $group.appendChild($groupsCheckbox)
  $group.appendChild($groupRemove)
  return $group
}

function renderWorkerSelectOption(workerName) {
  let $groupOption = document.createElement('option')
  $groupOption.classList.add('groups__option')
  $groupOption.value = workerName
  $groupOption.textContent = workerName
  return $groupOption
}

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
      groupsList.appendChild(renderGroup(group))
      groups.push(createGroup(group.name, +group.amount, group.currentWorker, group.isTaken, group.isCompleted))
    })
  }
}

// Слушатель событий - запускает загрузку сотрудников при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadGroups()
})

// Слушатель событий - по изменению Input'a проверяет на сопадение имён групп
document.addEventListener('change', (event) => {
  if (event.target.classList.contains('groups__name')) {
    groups.forEach(groups => {
      if (groups.name === event.target.value && (event.target.classList.contains('groups__name'))) {
        showError('Такая группа товаров уже существует')
        event.target.value = ''
      }
    })
  }

  if (event.target.classList.contains('groups__amount') && event.target.closest('.groups__item').querySelector('.groups__name').value.trim() === '') {
    showError('Не указано название группы товаров')
    event.target.value = ''
    event.target.closest('.groups__item').querySelector('.groups__name').value = ''
  }

  if (event.target.classList.contains('groups__amount') && event.target.value < 1 && event.target.closest('.groups__item').querySelector('.groups__name').value.trim() !== '') {
    showError('Количество товаров должно быть больше нуля')
    event.target.value = ''
  }

  if (event.target.classList.contains('groups__amount') && event.target.closest('.groups__item').querySelector('.groups__name').value !== '') {
    let currentGroupObject = groups.find(group => event.target.closest('.groups__item').querySelector('.groups__name').value === group.name)
    if (currentGroupObject) {
      changeGroupAmount(currentGroupObject, event.target)
      saveGroups()
    } else {
      let groupNameInput = event.target.closest('.groups__item').querySelector('.groups__name')
      let groupAmountInput = event.target.closest('.groups__item').querySelector('.groups__amount')
      if (groupNameInput.value && groupAmountInput.value) {
        groupNameInput.disabled = true
        addGroupToArray(groupNameInput.value, groupAmountInput.value)
        saveGroups()
      }
    }
  }
})

// Функция добавляет группу в массив
function addGroupToArray(groupName, groupAmount) {
  groups.push(createGroup(groupName, +groupAmount))
}


// Слушатель событий - по нажатию на "-" запускает удаление группы
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('groups__remove-button')) {
    let currentGroupName = event.target.closest('.groups__item').querySelector('.groups__name').value
    deleteGroup(currentGroupName)
  }
})

// Функция удаляет сотрудника из DOM, из массива и из групп
function deleteGroup(groupName) {
  let $currentGroup = [...document.querySelectorAll('.groups__name')].find(input => input.value === groupName).closest('.groups__item')
  let currentGroupObject = groups.find(group => group.name === groupName)
  $currentGroup.remove()
  groups = groups.filter(group => group.name !== groupName)
  saveGroups()
  
  if (currentGroupObject.isTaken) {
    let $currentWorkerGroup = [...document.querySelectorAll('.worker__group-name')].find(group => group.textContent === groupName).closest('.worker__group')
    $currentWorkerGroup.remove()
    // changeWorkersAmount(currentWorkerObject)
  }

  workers.forEach(worker => {
    worker.groups = worker.groups.filter(group => group.name !== groupName)
    worker.isFull = false // TODO - ДОБАВИТЬ ПРОВЕРКУ ЕСЛИ РАВНО ISFULL
    worker.totalValue = worker.getTotalValue()
    if (currentGroupObject.isCompleted) {
      worker.completedValue -= +currentGroupObject.amount
    }
  })
  saveWorkers()
}

// --------------------------------------------------------------------------------
// -------------------------------------------------------------------------------- ПРИВЯЗКА, ОТВЯЗКА, ПЕРЕПРИВЯЗКА СОТРУДНИКА К ГРУППАМ
// --------------------------------------------------------------------------------

// Слушатель событий изменения привязки сотрудника к группе товаров
document.addEventListener('change', (event) => {
  if (event.target.classList.contains('groups__select')) {
    let currentGroupObject = groups.find(group => group.name === event.target.closest('.groups__item').querySelector('.groups__name').value)
    if (event.target.value && !currentGroupObject.currentWorker) {
      bindWorkerToGroup(event.target, currentGroupObject)
    } else if (!event.target.value) {
      unbindWorkerFromGroup(currentGroupObject)
    } else if (currentGroupObject.currentWorker) {
      unbindWorkerFromGroup(currentGroupObject)
      bindWorkerToGroup(event.target, currentGroupObject)
    }
    saveGroups()
    saveWorkers()
  }
})

// Функция привязывает сотрудника к группе и добавляет её в массив групп сотрудника
function bindWorkerToGroup(workerNameSelect, groupObject) {
  let currentWorkerObject = workers.find(worker => worker.name === workerNameSelect.value)
  groupObject.currentWorker = currentWorkerObject.name
  groupObject.isTaken = true
  currentWorkerObject.groups.push(groupObject)
  currentWorkerObject.totalValue = currentWorkerObject.getTotalValue()
  renderWorkerGroup(currentWorkerObject, groupObject)
  let $currentSelect = [...workerNameSelect.querySelectorAll('.groups__option')].find(select => select.value === currentWorkerObject.name)
  $currentSelect.classList.add('selected')
  changeWorkersAmount(currentWorkerObject)
}

// Функция удаляет группу из объекта сотрудника и отвязывает сотрудника от группы
function unbindWorkerFromGroup(groupObject) { // TODO - ДОБАВИТЬ ПРОВЕРКУ IS FULL У СОТРУДНИКА
  let currentWorkerObject = workers.find(worker => worker.name === groupObject.currentWorker)
  groupObject.currentWorker = ''
  groupObject.isTaken = false
  currentWorkerObject.groups = currentWorkerObject.groups.filter(group => group.name !== groupObject.name)
  currentWorkerObject.totalValue = currentWorkerObject.getTotalValue()
  let $currentOptions = [...document.querySelectorAll('.groups__name')].find(group => group.value === groupObject.name).closest('.groups__item').querySelectorAll('.groups__option')
  let $currentOption = [...$currentOptions].find(option => option.value === currentWorkerObject.name)
  $currentOption.classList.remove('selected')
  if (groupObject.isCompleted) {
    currentWorkerObject.completedValue -= +groupObject.amount
  }
  let $currentGroupCard = [...document.querySelectorAll('.worker__group-name')].find(group => group.textContent === groupObject.name).closest('.worker__group')
  $currentGroupCard.remove()
  changeWorkersAmount(currentWorkerObject)
}

// Функция меняет количество товаров в DOM-карточке сотрудника
function changeWorkersAmount(workerObject) {
  let $workerAmount = [...document.querySelectorAll('.worker__name')].find(worker => worker.value === workerObject.name).nextElementSibling
  if ($workerAmount.classList.contains('worker__amount')) {
    $workerAmount.textContent = `${workerObject.totalValue} шт.`
  }
}

// --------------------------------------------------------------------------------
// -------------------------------------------------------------------------------- СМЕНА КОЛИЧЕСТВА ТОВАРОВ В ГРУППЕ
// --------------------------------------------------------------------------------

// Функция меняет количество товаров в объекте группы, в массиве групп объекта сотрудника и в DOM
function changeGroupAmount(currentGroupObject, groupInput) {
  if (groupInput.value === '') {
    showError('Количество не должно быть пустым')
    groupInput.value = currentGroupObject.amount
  }
  if (currentGroupObject.isTaken) {
    let $currentGroupAmountSpan = [...document.querySelectorAll('.worker__group-name')].find(group => group.textContent === currentGroupObject.name).closest('.worker__group').querySelector('.worker__group-amount')
    $currentGroupAmountSpan.textContent = groupInput.value + ' шт.'
    workers.forEach(worker => {
      let currentWorkerGroup = worker.groups.find(group => group.name === currentGroupObject.name)
      if (currentWorkerGroup) {
        currentWorkerGroup.amount = +groupInput.value
        worker.totalValue = worker.getTotalValue()
        if (currentGroupObject.isCompleted) {
          worker.completedValue -= currentGroupObject.amount
          worker.completedValue += +groupInput.value
        }
      }
    })
  }
  currentGroupObject.amount = +groupInput.value
  saveWorkers()
}

// --------------------------------------------------------------------------------
// -------------------------------------------------------------------------------- ОТРИСОВКА ГРУПП ДЛЯ СОТРУДНИКА
// --------------------------------------------------------------------------------

// Функция запускает рендер всех карточек групп для всех сотрудников
function renderAllWorkersGroup() {
  let $workers = [...document.querySelectorAll('.worker__name')]
  $workers.forEach($worker => {
    let currentWorkerObject = workers.find(worker => worker.name === $worker.value)
    currentWorkerObject.groups.forEach(group => {
      renderWorkerGroup(currentWorkerObject, group)
    })
  });
}

// Функция рендерит карточку группы для указанного сотрудника
function renderWorkerGroup(workerObject, groupObject) {
  let $currentWorker = [...document.querySelectorAll('.worker__name')].find(worker => worker.value === workerObject.name).closest('.worker')
  $currentWorker.querySelector('.worker__groups-list').appendChild(createWorkerGroup(groupObject.name, groupObject.amount, groupObject.isCompleted))
}

// Функция возвращает карточку группы для списка групп сотрудника (DOM элемент)
function createWorkerGroup(groupName, groupAmount, groupIsCompleted) {
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


// --------------------------------------------------------------------------------
// -------------------------------------------------------------------------------- ОТМЕТКА ГРУПП ВЫПОЛНЕННЫМИ
// --------------------------------------------------------------------------------

document.addEventListener('change', (event) => {
  if (event.target.classList.contains('worker__group-checkbox')) {
    let currentGroupObject = groups.find(group => group.name === event.target.closest('.worker__group').querySelector('.worker__group-name').textContent)
    let isChecked = event.target.checked
    changeGroupCompletedStatus(currentGroupObject, isChecked)
  }

  if (event.target.classList.contains('groups__checkbox')) {
    let currentGroupObject = groups.find(group => group.name === event.target.closest('.groups__item').querySelector('.groups__name').value)
    let isChecked = event.target.checked
    changeGroupCompletedStatus(currentGroupObject, isChecked)
  }
})

function changeGroupCompletedStatus(currentGroup, isChecked) {
  let $currentGroupCheckbox = [...document.querySelectorAll('.groups__name')].find(input => input.value === currentGroup.name).closest('.groups__item').querySelector('.groups__checkbox')
  let $currentWorkerGroupCheckbox = [...document.querySelectorAll('.worker__group-name')].find(span => span.textContent === currentGroup.name).closest('.worker__group').querySelector('.worker__group-checkbox')
  let $currentGroupAmount = $currentGroupCheckbox.closest('.groups__item').querySelector('.groups__amount')
  let $currentGroupSelect = $currentGroupCheckbox.closest('.groups__item').querySelector('.groups__select')
  let currentGroupWorker = workers.find(worker => worker.name === currentGroup.currentWorker)
  if (isChecked) {
    currentGroup.isCompleted = true
    $currentWorkerGroupCheckbox.checked = true
    console.log($currentWorkerGroupCheckbox)
    $currentGroupCheckbox.checked = true
    $currentGroupAmount.disabled = true
    $currentGroupSelect.disabled = true
    currentGroupWorker.groups.forEach(group => {
      if (group.name === currentGroup.name) {
        group.isCompleted = true
      }
    }) 
  } else {
    currentGroup.isCompleted = false
    $currentWorkerGroupCheckbox.checked = false
    $currentGroupCheckbox.checked = false
    $currentGroupAmount.disabled = false
    $currentGroupSelect.disabled = false
    currentGroupWorker.groups.forEach(group => {
      if (group.name === currentGroup.name) {
        group.isCompleted = false
      }
    }) 
  } 
  saveGroups()
  saveWorkers()
}
