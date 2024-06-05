const groups = [
  {
    id: 0,
    name: 'ТВ',
    value: '45',
    percent: '8',
    isTaken: false,
  },
  {
    id: 1,
    name: 'Смартфоны',
    value: '87',
    percent: '12',
    isTaken: false,
  },
  {
    id: 2,
    name: 'Чехлы',
    value: '541',
    percent: '18',
    isTaken: false,
  },
  {
    id: 3,
    name: 'КБТ',
    value: '102',
    percent: '14',
    isTaken: false,
  },
  {
    id: 4,
    name: 'Ноутбуки',
    value: '85',
    percent: '2',
    isTaken: false,
  },
  {
    id: 5,
    name: 'Аксы сото',
    value: '204',
    percent: '26',
    isTaken: false,
  },
  {
    id: 6,
    name: 'Мыши',
    value: '124',
    percent: '11',
    isTaken: false,
  },
  {
    id: 7,
    name: 'Мониторы',
    value: '20',
    percent: '3',
    isTaken: false,
  },
  {
    id: 8,
    name: 'Инструмент',
    value: '95',
    percent: '9',
    isTaken: false,
  },
]

const worker1 = {
  name: 'Вася',
  groupsId: [],
  totalPercent: 0
}

const worker2 = {
  name: 'Саня',
  groupsId: [],
  totalPercent: 0
}

const worker3 = {
  name: 'Макс',
  groupsId: [],
  totalPercent: 0
}



// Выбрать рандомную невзятую группу
let getRandomUntakenGroup = function() {
  let unTakenGroupsId = []
  groups.forEach(group => {
    if (group.isTaken === false) {
      unTakenGroupsId.push(group.id)
    }
  });
  return unTakenGroupsId[Math.floor(Math.random() * unTakenGroupsId.length)]
}

// Выдать сотруднику рандомную группу
function getValues(...workers) {
  for (let worker of workers) {
    let currentRandomGroup = getRandomUntakenGroup()
    worker.groupsId.push(currentRandomGroup)
    groups.forEach(group => {
      if (group.id === currentRandomGroup) {
        group.isTaken = true
        worker.totalPercent += +group.percent
        console.log(worker)
      }
    });
  }
}

