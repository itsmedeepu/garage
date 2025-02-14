const isValidText = (data) => {
  if (!data || data.trim() === "") {
    return false;
  }
  return true;
};

const isValidEmail = (data) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(data);
};

const isValidPassword = (data) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(data);
};

const isValidObject = (data) => {
  console.log(data);
  data.forEach((element) => {
    if (!isValidText(data([element]))) {
      return false;
    }
  });
  return true;
};

module.exports = { isValidText, isValidEmail, isValidPassword, isValidObject };
