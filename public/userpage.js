// 친구 삭제 함수
function friendDelete(email) {
    // 경고 문구 출력
    if (confirm('삭제하시겠습니까?')) {
        var link = 'http://localhost:3000/friendDelete?email=' + email;
        location.href = link;
    }
}