const toDoInput = document.querySelector(".to_do_input");
const timerInput = document.querySelector(".timer_input");
const saveBtn = document.querySelector(".save_btn");
const tableBody = document.querySelector("table tbody");
const closePopupBtn = document.querySelector(".close_btn");

/*
localStorage.setItem('myCat', 'Tom');
const cat = localStorage.getItem('myCat');

localStorage.removeItem('myCat');
localStorage.clear(); // 전체제거
console.log(cat)

<tr>
    <td>1</td>
    <td>요가하기</td>
    <td>19:00</td>
    <td><input type="checkbox"></td>
    <td><img class="delete_btn" src="img/close.svg" alt="삭제"/></td>
</tr>
*/

let toDosArr = [];
let checkListsItemArr = [];
let toDoValue = '';
let timerValue = '';

toDoInput.addEventListener('change', (e) => {
    e.preventDefault();
    toDoValue = e.target.value;
})

timerInput.addEventListener('change', (e) => {
    e.preventDefault();
    timerValue = e.target.value;
})

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

const setLocalStorage = () => {
    toDosArr.push({project:toDoValue, timer:timerValue});
    // toDosArr.sort((a, b) => Number(a.timer.replace(':', '')) - Number(b.timer.replace(':', '')));
    localStorage.setItem('toDos', JSON.stringify(toDosArr));
}

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

const resetInput = () => {
    toDoInput.value = '';
    timerInput.value = '';
    toDoValue = '';
    timerValue = '';
}

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

window.onload = () => {
    setInterval(function() {
        setTimer();
        setClock();
    }, 500);
    setCheckListsBody();
}

