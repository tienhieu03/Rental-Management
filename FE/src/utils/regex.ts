const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
export const checkEmail = (email: string) => {
  return emailRegex.test(email);
};
export const checkPassword = (password: string) => {
  return passwordRegex.test(password); //kiểm tra mật khẩu có ít nhất 8 ký tự, ít nhất 1 chữ cái và 1 số
};
export const checkIdCard = (idCard: string) => {
  // Kiểm tra độ dài và định dạng
  if (
    typeof idCard !== "string" ||
    idCard.length !== 12 ||
    !/^\d{12}$/.test(idCard)
  ) {
    return false;
  }

  // Kiểm tra mã vùng và giới tính
  const regionCode = parseInt(idCard[0]);
  if (regionCode < 0 || regionCode > 8) {
    return false;
  }

  // Kiểm tra giới tính và năm sinh
  const generationCode = parseInt(idCard[1]);
  const yearSuffix = parseInt(idCard.substring(2, 3));

  // Kiểm tra logic thế hệ
  let birthYear;
  if (generationCode === 0 || generationCode === 1) {
    birthYear = 1900 + yearSuffix;
  } else if (generationCode === 2 || generationCode === 3) {
    birthYear = 2000 + yearSuffix;
  } else {
    return false; // Không thuộc các thế hệ hợp lệ
  }

  // Nếu tất cả các điều kiện thỏa mãn
  return true;
};
const phoneRegexVN = /^(0[3|5|7|8|9])\d{8}$/;
const checkPhoneNumberVN = (phoneNumber: string) => {
  return phoneRegexVN.test(phoneNumber);
};
export { checkPhoneNumberVN };
