function addFriend(user_name) {
    var link = 'http://localhost:3000/friendAdd?user_name=' + user_name;
    location.href = link;
}

function searchUser(user_list) {
    const form = document.add_friend_form;
    const search_user_name = form.search_name.value;

    console.log(user_list);
    const user_list_array = user_list.split(',');

    for (i in user_list_array) {
        if (user_list_array[i].indexOf(search_user_name) != -1) {
            var link = 'http://localhost:3000/addFriend?search_name=' + search_user_name;
            location.href = link;
        }
    }
}