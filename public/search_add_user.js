function addFriend(user_name) {
    // 해당 친구 이름 옆에 있는 친구 추가 버튼 클릭 시 이 함수가 실행됨

    // 이 함수 내에서는 DB에 친구로 해당 유저와 본인을 연결하는 코드를 작성하면 됨

    // DB에 성공적으로 저장되었을 경우 /addFriendSuccess로, 그렇지 않으면 /addFriendFail로 이동!
    // 페이지 이동은 미리 링크를 만들어놨으므로 링크 이동 해주시면 됩니다.
}

function searchUser(user_list) {
    const form = document.add_friend_form;
    const search_user_name = form.search_name.value;

    console.log(user_list);
    const user_list_array = user_list.split(',');

    for (i in user_list_array) {
        if (user_list_array[i] == search_user_name) {
            var link = 'http://localhost:3000/addFriend?search_name=' + search_user_name;
            location.href = link;
        }
    }
}