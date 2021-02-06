function autoLogin() {
  var autoLoginChecked = document.getElementById('autoLogin').getAttribute('checked');

  const form = document.login_form;
  const user_email = checkValidEmail(form);
  const user_password = checkValidPassword(form);

  if (autoLoginChecked) {
    localStorage.setItem(USER_EMAIL, user_email);
  }

  const currentUserEmail = localStorage.getItem(USER_EMAIL);

  if (currentUserEmail !== null) {
    var link = 'http://localhost:3000/login?email=' + currentUserEmail;
    location.href = link;
  }
}

autoLogin();