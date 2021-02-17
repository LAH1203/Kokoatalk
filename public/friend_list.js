function startChatting(friend_name) {
    var link = 'http://localhost:3000/chatting?friend_name=' + friend_name;
    location.href = link;
}

// 마이페이지 함수
function goToMyPage(name) {
    var link = 'http://localhost:3000/userPage?name=' + name;
    location.href = link;
}

// 유저 페이지 함수
function goToUserPage(name) {
    var link = 'http://localhost:3000/userPage?name=' + name;
    location.href = link;
}
