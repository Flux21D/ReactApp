const removeNewUser = () => {
  let auth = sessionStorage.getItem("auth");

  if (auth) {
    auth = JSON.parse(auth);

    auth.isNew = false;

    sessionStorage.setItem("auth", JSON.stringify(auth));
  }
};

export default removeNewUser;
