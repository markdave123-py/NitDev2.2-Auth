//Database Interactions
import client from "../config/db.js";
import { hashPassword, passwordMatches } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { sendMail } from "../utils/mail.sender.js";
import { config } from "../config/env.js";
import { registerSchema, loginSchema, resetSchema } from "../validation/auth.schema.js";

//Function to check if username already exists in database
export async function checkIfUserExists(username, role) {
  const query = `
    SELECT COUNT(*) as count
    FROM ${role}
    WHERE username = $1
  `;
  const values = [username];
  const result = await client.query(query, values);
  return +result.rows[0].count;
}

//Function to register new users
export async function register(payload) {

  const { error, value } = registerSchema.validate(payload);

  if (error) {
    console.log(error.details, error.message)
    return false
  }
  const { username, userPassword, role } = value;

  try {
    const userExists = await checkIfUserExists(username, role);
    if (userExists) {
      console.log("I exist");
      return false;
    } else {

      const hashedPassword = await hashPassword(userPassword);
      const query = `
            INSERT INTO ${role} (username, password)
            VALUES($1, $2)
            RETURNING *
            `;
      const values = [username, hashedPassword];
      const result = await client.query(query, values);
      console.log(result.rows, result);
      const { password, ...userData } = result.rows[0];
      return userData;
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
  // } finally {
  //   await client.end();
  // }
}

//Function to log existing users
export async function login(payload) {

  const {error, value} = loginSchema.validate(payload)

  if (error) {
    console.log(error.message, error.details)
    return false
  }

  
  const { username, userPassword, role } = value;
  
  try {
    const userExists = await checkIfUserExists(username, role);
    if (!userExists) {
      console.log("I don't exist");
      return false;
    }
   
    // const hashedPassword = await hashPassword(password);
    // console.log(hashedPassword)
    
    const query = `
            SELECT *
            FROM ${role}
            WHERE username = $1 
            `;
    const values = [username];
    
    const result = await client.query(query, values);
    

    const user = result.rows[0];

    const {password,registered_at, ...userData} = user;
  

    const isMatch = await passwordMatches(userPassword, user.password);

    if (!isMatch) {
      return false;
    }

    const token = await generateToken(userData);

    return token;

  
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });

  }
  
}

export const sendResetLink = async (payload) => {

  const { error, value } = resetSchema.validate(payload);
  if (error) {

    console.log(error.details, error.message)
    return false
  }

  const { username, role} = value;

  const userExists = await checkIfUserExists(username, role)

  if (!userExists) {
    return false;
  }

 try {

  const response =  await sendMail(username, config.SENDER_EMAIL)

  return response
  
 } catch (error) {
    console.log(error)

 }


}
export async function resetPassword(payload) {
  const { username, role, new_password } = payload;

  const userExists = await checkIfUserExists(username, role)

  if (!userExists) {
    return false;
  }

  try {
    const query = `
            UPDATE ${role}
            SET password = $1
            WHERE username = $2
            RETURNING *
            `;
    const values = [new_password, username];
    const result = await client.query(query, values);
    return result.rows;
  } catch (err) {
    console.error(err.message);
    throw err;

  }

}
//   } finally {
//     await client.end();
//   }
// }

// const payload = {
//   username: "doper",
//   role: "admin",
//   current_password: "jjk",
//   new_password: "jojo-siwa",
// };

// const payloader = {
//   username: "joladeola",
//   password: "jade1543",
//   role: "teacher",
// };

// register(payloader);
// reset(payload);
