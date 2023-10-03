import bcrypt from "bcrypt";

// async function hashPassword(password) {
//   let genPassword = await bcrypt.genSalt(5);
//   return genPassword;
// }


// const hasher = (password, saltRounds, err, hash) => {
//   bcrypt.hash(password, saltRounds, function (err, hash) {});
// };

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10)
}

export const passwordMatches = async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword)
}


// let result = hashPassword("ADEJUMO");
// console.log(result);
