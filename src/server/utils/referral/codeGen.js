module.exports = function () {
  const alphabet = "abcdefghjklmnopgrstuywxqzv1234567890";
  const len = 6;
  let code = "";
  for (let i = 0; i < len; i++) {
      code += alphabet[Math.floor(Math.random() * (alphabet.length))];
  }
  return code.toUpperCase();
};