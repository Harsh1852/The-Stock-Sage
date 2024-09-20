export const formatPrice = (price) => {
  let formattedPrice = "";
  if (price !== null && price !== undefined && price !== "") {
    formattedPrice = String(price).replace(/,/g, "");
    formattedPrice = `₹ ${parseFloat(formattedPrice)}`;
  }
  return formattedPrice;
};

export const formatPercent = (percent) => {
  let formattedPercent = "";
  if (percent !== null && percent !== undefined && percent !== "") {
    formattedPercent = parseFloat(percent).toFixed(2);
    formattedPercent = `${String(formattedPercent)}%`;
  }
  return formattedPercent;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// (?=.*[a-z]): Ensures at least one lowercase letter.
// (?=.*[A-Z]): Ensures at least one uppercase letter.
// (?=.*\d): Ensures at least one digit.
// (?=.*[@$!%*?&]): Ensures at least one special character from the set @$!%*?&.
// [A-Za-z\d@$!%*?&]{8,}: Ensures the password consists only of the specified characters and is at least 8 characters long.
export const validateStrongPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};
