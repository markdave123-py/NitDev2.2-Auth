//Database Interactions
import client from "../config/db.js";
import { hashPassword, passwordMatches } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

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
  const { username, password, role } = payload;

  try {
    const userExists = await checkIfUserExists(username, role);
    if (userExists) {
      console.log("I exist");
      return false;
    } else {

      const hashedPassword = await hashPassword(password);
      const query = `
            INSERT INTO ${role} (username, password)
            VALUES($1, $2)
            RETURNING *
            `;
      const values = [username, hashedPassword];
      const result = await client.query(query, values);
      console.log(result.rows, result);
      return {
        username: result.rows[0].username,
        role: role,
        registeredAt: result.rows[0].registered_at,
      };
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
  const { username, password, role } = payload;


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
  

    const isMatch = await passwordMatches(password, user.password);

    if (!isMatch) {
      return false;
    }

    const token = await generateToken(user);

    return token;

  
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });

  }
  
}

export async function reset(payload) {
  const { username, role, new_password } = payload;
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
  } finally {
    await client.end();
  }
}

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
