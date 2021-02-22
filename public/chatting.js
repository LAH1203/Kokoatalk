//"use strict"
const socket = io();
/*
const chatList = document.querySelector('.chat_list')
const chatInput = document.querySelector('.chat_input');
const displayContainer = document.querySelector('.display_container');
*/
const chatList = document.getElementById('chat_list');
const chatInput = document.getElementById('chat_input');
const displayContainer = document.getElementById('display_container');

function send(my_name) {
    console.log('sent', chatInput.value);
    const param = {
        name: my_name, // input 태그의 value에 접근
        msg: chatInput.value
    }
    chatInput.value = '';
    socket.emit("chatting", param); // 서버에서 받는 부분
}

function LiModel(name, msg, time) {
    this.name = name;
    this.msg = msg;
    this.time = time;

    this.makeLi = function() {
        const li = document.createElement('li');
        const span = document.createElement('span');
        li.classList.add(nickname.value === this.name ? "sent": "received");
        /*
        const dom = `
            span(class='profile')
              span(class='user') ${this.name}
              img(class='image' src='https://placeimg.com/50/50/any' alt='any')
            span(class='message') ${this.msg}
            span(class='time') ${this.time}`;
        li.innerHTML = dom;
        */
        span.innerText = `${this.name} : ${this.msg}`;
        li.appendChild(span);
        chatList.appendChild(li);
    }
}

// 채팅 받아오는 부분
socket.on("chatting", (data) => {
    console.log('전달받음');
    const {name, msg, time} = data;
    const item = new LiModel(name, msg, time);
    item.makeLi();
    displayContainer.scrollTo(0, displayContainer.scrollHeight)

});
