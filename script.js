// -------------------------------------------------------------------------------- ОБЪЕКТЫ СОТРУДНИКОВ И ГРУПП ТОВАРОВ
const groups = []

// const group = {
  // name: '00. КБТ',
  // amount: 245,
  // isTaken: false,
  // isCompleted = false,
  // worker: 'Шаров',
// }

const workers = []

// const worker = {
  // name: 'Шаров',
  // groups: [],
  // isFull: false,
  // reducePercent: 0,
// }

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------- СОТРУДНИКИ -------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------- РАБОТА СО СПИСКОМ СОТРУДНИКОВ

// Функция создает и возращает нового сотрудника (объект)
function createWorker(name = '', groups = [], isFull = false, reducePercent = 0) {
   return newWorker = {
    name,
    groups,
    isFull,
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
function refillWorkers() {
  workers.length = 0;
  let currentWorkersList = document.querySelectorAll(".worker")
  currentWorkersList.forEach((worker) => {
    let workerName = worker.querySelector(".worker__name").value
    if (workerName && workerName.trim() !== '') {
      workers.push(createWorker(workerName));
    }
  });
}

// Функция меняет шиирну полоски прогресс-бара
function changeProgressBar() {
  let currentBars = document.querySelectorAll('.worker__progress-bar')
  currentBars.forEach(bar => {
    let currentValue = bar.parentNode.parentNode.querySelector('.worker__percent').textContent
    bar.style.width = currentValue
  });
}

// Слушатель событий - запускает загрузку сотрудников при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadWorkers()
})

// Слушатель событий для создания карточки сотрудника в DOM по нажатию на "+"
const workersList = document.querySelector('.workers__list')
const workerAddButton = document.querySelector('.workers__add-button')
workerAddButton.addEventListener('click', () => workersList.appendChild(renderWorker()))

// Слушатель событий - по изменению Input'a имени сотрудника перезаписывает массив с сотрудниками и сохраняет его в LS
document.addEventListener('change', (event) => {
  if (event.target.classList.contains('worker__name')) {
    refillWorkers()
    saveWorkers()
  }
})

// Слушатель событий - по нажатию на "-" удаляет текущего сотрудника из DOM, перезаписывает массив сотрудников, сохраняет его в LS
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('workers__remove-button')) {
    event.target.parentNode.parentNode.remove()
  }
  refillWorkers()
  saveWorkers()
})

// -------------------------------------------------------------------------------- СОХРАНЕНИЕ И ЗАГРУЗКА СОТРУДНИКОВ

// Функция сохраняет сотрудников в Local Storage
function saveWorkers() {
  localStorage.setItem('workers', JSON.stringify(workers))
}

// Функция рендерит сотрудников из Local Storage в DOM и записывает их в массив
function loadWorkers() {
  if (localStorage.getItem('workers')) {
    let currentWorkers = JSON.parse(localStorage.getItem('workers'))
    currentWorkers.forEach(worker => {
      workersList.appendChild(renderWorker(worker.name))
      workers.push(createWorker(worker.name))
    });
    changeProgressBar()
  }
}

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

// -------------------------------------------------------------------------------- ДОБАВЛЕНИЕ И УДАЛЕНИЕ ГРУППЫ ТОВАРОВ

// Слушатель событий для создания новой группы
const groupsList = document.querySelector('.groups__list')
const groupAddButton = document.querySelector('.groups__add-button')
groupAddButton.addEventListener("click", () => {
  groupsList.appendChild(renderGroup());
});


// Функция возвращает новую пустую группу товаров
function renderGroup() {
  let group = document.createElement('li')
  group.classList.add('groups__item')
  let groupName = document.createElement('input')
  groupName.required = true
  groupName.type = "text"
  groupName.value = ""
  groupName.classList.add('groups__name', 'groups__input')
  groupName.placeholder = "Группа товаров"
  let groupAmount = document.createElement('input')
  groupAmount.required = true
  groupAmount.type = "number"
  groupAmount.value = ""
  groupAmount.placeholder = "Кол-во"
  groupAmount.classList.add('groups__amount', 'groups__input')
  let groupText = document.createElement('span')
  groupText.classList.add('groups__amount-text')
  groupText.textContent = "шт."
  let groupWorker = document.createElement('span')
  groupWorker.classList.add('groups__worker')
  let groupsCheckbox = document.createElement('input')
  groupsCheckbox.type = "checkbox"
  groupsCheckbox.disabled = true
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

// Функция удаляет текущую группу
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('groups__remove-button')) {
    event.target.parentNode.remove()
  }
})