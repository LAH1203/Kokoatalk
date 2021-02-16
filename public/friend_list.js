function startChatting(friend) {
    // 매개변수로 주어진 friend는 내가 클릭한 친구(이름 또는 UID 또는 이메일)

    // 그러니까 여기에서는 friend와의 개인 채팅방으로 이어지는 코드를 작성하면 될 듯?
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
