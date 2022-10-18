const toDoInput = document.querySelector(".to_do_input");
const timerInput = document.querySelector(".timer_input");
const saveBtn = document.querySelector(".save_btn");
const tableBody = document.querySelector("table tbody");
const closePopupBtn = document.querySelector(".close_btn");

let toDosArr = [];
let checkListsItemArr = [];
let toDoValue = '';
let timerValue = '';

// 오늘할 일 인풋 체인지 이벤트리스너
toDoInput.addEventListener('change', (e) => {
    e.preventDefault();
    toDoValue = e.target.value;
})

// 알람 체인지 이벤트리스너
timerInput.addEventListener('change', (e) => {
    e.preventDefault();
    timerValue = e.target.value;
})

// save 버튼 클릭시 동작
saveBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if(!toDoValue){
        alert('오늘 할 일을 입력하세요!');
    } else if(!timerValue){
        alert('타이머를 입력하세요!');
    } else{
        setLocalStorage();
        addCheckLists();
        resetInput();
        paintColorBar();
        setCheckListsBody();
    }
})

// 팝업창 x 버튼을 클릭하면 동작
closePopupBtn.addEventListener('click', (e) => {
    const popup = document.querySelector('#popup');
    const tr = document.querySelectorAll("table tbody tr");
    const successCount = document.querySelector('.successCount');
    const checkListsCount = document.querySelector('.checkListsCount');
    const colorBar = document.querySelector('.color_bar');

    e.preventDefault();
    tr.forEach((el, i) => {
        el.remove();
    })
    successCount.innerText = 0;
    checkListsCount.innerText = 0;
    popup.style.display = 'none';
    colorBar.style.width = 0;
    toDosArr = [];
    checkListsItemArr = [];
    setCheckListsBody();
    localStorage.clear();
})

// 체크리스트를 로컬스토리지에 저장하는 함수 setLocalStorage
const setLocalStorage = () => {
    toDosArr.push({project:toDoValue, timer:timerValue});
    localStorage.setItem('toDos', JSON.stringify(toDosArr));
}

// 체크리스트를 추가하는 함수 addCheckLists
const addCheckLists = () => {
    const tr = document.createElement('tr');
    const id = document.createElement('td');
    const project = document.createElement('td');
    const timer = document.createElement('td');
    const checkboxBtn = document.createElement('td');
    const remove = document.createElement('td');
    const input = document.createElement('input');
    const deleteBtn = document.createElement('button');
    const deadLine = document.createElement('span');
    const tbodyTr = document.querySelectorAll("table tbody tr");
    
    checkListsItemArr = JSON.parse(localStorage.getItem('toDos'));
    checkListsItemArr.forEach((el, i) => {
        id.innerHTML = i;
        project.innerHTML = el.project;
        timer.innerHTML = el.timer;

        input.setAttribute('type', 'checkbox');
        input.setAttribute('class', 'checkbox');
        deleteBtn.setAttribute('class', 'delete_btn');
        timer.setAttribute('class', 'timer');
        deadLine.setAttribute('class', 'dead_line');

        checkboxBtn.appendChild(input);
        remove.appendChild(deleteBtn);
        tr.appendChild(id);
        tr.appendChild(project);
        tr.appendChild(timer);
        tr.appendChild(checkboxBtn);
        tr.appendChild(remove);
        tr.setAttribute('id', i);
        tr.appendChild(deadLine);
        tableBody.appendChild(tr);
    })
    deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        removeCheckList(e);
        paintColorBar();
        setCheckListsBody();
    });

    checkboxBtn.addEventListener("change", (e) => {
        e.preventDefault();
        paintColorBar();
    })
}

// x 버튼 클릭시 체크리스트를 지우는 함수 removeCheckList
const removeCheckList = (e) => {
    const tr = document.querySelectorAll("table tbody tr");
    const selectedCheckList = e.target.parentNode.parentNode;

    for(let i=selectedCheckList.id; i<checkListsItemArr.length; i++){
        tr[i].setAttribute('id', tr[i].id-1);
        tr[i].firstElementChild.innerText = i-1;
    }

    selectedCheckList.remove();
    toDosArr.splice(selectedCheckList.id, 1);
    localStorage.clear();
    localStorage.setItem('toDos', JSON.stringify(toDosArr));
    checkListsItemArr = JSON.parse(localStorage.getItem('toDos'));
}

// 성공률 그래프를 채우는 함수 paintColorBar
const paintColorBar = () => {
    const checkboxBtn = document.querySelectorAll(".checkbox");
    const colorBar = document.querySelector('.color_bar');
    const popup = document.querySelector('#popup');
    const successCount = document.querySelector('.successCount');
    const checkListsCount = document.querySelector('.checkListsCount');

    let checkedCount = 0;
    checkboxBtn.forEach((el) => {
        if(el.checked){
            checkedCount++;
        } 
    })
    successCount.innerText = checkedCount;
    checkListsCount.innerText = checkListsItemArr.length;
    const successRate = Math.floor(checkedCount / checkListsItemArr.length * 100);
    colorBar.style.width = successRate + '%';
    if(successRate === 100){
        colorBar.style.background = 'var(--red-color)';
        popup.style.display = 'block';
    } else{
        colorBar.style.background = 'var(--main-color)';
        popup.style.display = 'none';
    }
}

// 오늘 할 일, 알람 인풋 리셋 함수 resetInput
const resetInput = () => {
    toDoInput.value = '';
    timerInput.value = '';
    toDoValue = '';
    timerValue = '';
}

// 알람 setTimer
const setTimer = () => {
    const today = new Date();   
    const hours = ('0' + today.getHours()).slice(-2); 
    const minutes = ('0' + today.getMinutes()).slice(-2);
    const timer = document.querySelectorAll('.timer');
    const tr = document.querySelectorAll("table tbody tr");
    const deadLine = document.querySelectorAll(".dead_line");
    const checkboxBtn = document.querySelectorAll(".checkbox");
    const deleteBtn = document.querySelectorAll(".delete_btn");
    const currentTime = hours + ':' + minutes;

    timer.forEach((el, i) => {
        const timerTime = el.innerText;

        if(currentTime > timerTime){
            checkboxBtn[i].setAttribute('disabled', true);
            deleteBtn[i].setAttribute('disabled', true);
            deadLine[i].style.display = 'block';
            tr[i].style.color = 'var(--border-color)';
            tr[i].style.color = 'var(--border-color)';
        } else if(currentTime === timerTime){
            if(checkboxBtn[i].checked){
                tr[i].style.color = 'var(--main-color)';
            } else{
                tr[i].style.color = 'var(--red-color)';
            }
        } else{
            if(checkboxBtn[i].checked){
                tr[i].style.color = 'var(--main-color)';
            } else{
                tr[i].style.color = 'var(--black-color)';
            }
        }
    })
}

// 시계 setClock
const setClock = () => {
    const today = new Date();   
    const hoursValue = ('0' + today.getHours()).slice(-2); 
    const minutesValue = ('0' + today.getMinutes()).slice(-2);
    const secondsValue = ('0' + today.getSeconds()).slice(-2);
    const hours = document.querySelector(".hours");
    const minutes = document.querySelector(".minutes");
    const seconds = document.querySelector(".seconds");

    hours.innerText = hoursValue;
    minutes.innerText = minutesValue;
    seconds.innerText = secondsValue;
}

// 체크리스트가 있는지 확인하여 테이블 혹은 안내문을 띄우는 함수 setCheckListsBody
const setCheckListsBody = () => {
    const table = document.querySelector("table");
    const writeToDo = document.querySelector('.write_to_do');

    if(checkListsItemArr.length === 0){
        table.style.display = 'none';
        writeToDo.style.display = 'block';
    } else{
        table.style.display = 'table';
        writeToDo.style.display = 'none';
    }
}

// 온로드 시 알람, 시계 동작
window.onload = () => {
    setInterval(function() {
        setTimer();
        setClock();
    }, 500);
    setCheckListsBody();
}

