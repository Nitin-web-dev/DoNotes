function checkIffieldsAreEmpty(data) {
  if (
    !data ||
    Object.keys(data).length == 0 ||
    Object.values(data).some((value) => value.trim() === "")
  ) {
    return true;
  } else {
    false;
  }
}

function isValidEmail(email) {
  return email.includes("@");
}



module.exports = {
    checkIffieldsAreEmpty,
    isValidEmail
}