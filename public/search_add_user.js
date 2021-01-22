function addFriend(user_name) {
    // 해당 친구 이름 옆에 있는 친구 추가 버튼 클릭 시 이 함수가 실행됨

    // 이 함수 내에서는 DB에 친구로 해당 유저와 본인을 연결하는 코드를 작성하면 됨
}

function searchUser(user_list) {
    const form = document.add_friend_form;
    const search_user_name = form.search_name.value;

    for(var i = 0; i < user_list; i++) {
        console.log(user_list[i]);
        if (user_list[i] == search_user_name) {
            var link = 'http://localhost:3000/addFriend?search_name=' + search_user_name;
            location.href = link;
        }
    }
}