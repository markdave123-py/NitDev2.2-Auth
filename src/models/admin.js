import { validateCreateCourse } from "../validation/admin.schema.js";
import client from "../config/db.js";

//Drop student
export async function dropStudent(payload) {
  try {
    const { role, student_role, student_username } = payload;
    if (role == "admin") {
      const query = `
    DELETE FROM ${student_role}
    WHERE username = $1
    RETURNING * 
    `;
      const values = [student_username];
      console.log(values);
      const result = await client.query(query, values);
      console.log(result.rowCount);
      if (result.rowCount) {
        console.log("Delete successful");
        return result.rows;
      } else {
        console.log("Student not found");
        return "STUDENT NOT FOUND";
      }
    } else {
      return "UNATHORIZED";
    }
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

//Create course
export async function createCourse(payload) {
  try {
    const {error, value} = validateCreateCourse.validate(payload);
    if (error) {
      console.log(error.details, error.message)
      return false
    }
    const {role, code, unit, teacher_username} = value;
    
    const currentUser = req.user;

    const {username } = currentUser;

    const query1 = `
            SELECT *
            FROM ${role}
            WHERE username = $1 
            `;
    const values1 = [ username ];
    const result1 = await client.query(query1, values1);

    if (result1.rowCount < 1){
      return false
    }

   const query = `
    INSERT INTO courses (code, unit, teacher_username)
    VALUES ($1, $2, $3)
    RETURNING * 
    `;
      const values = [code, unit, teacher_username];
      const result = await client.query(query, values);
      console.log(result.rows);
      return result.rows[0];
    
  } catch (err) {
    console.error(err.message);
    throw err;
  } 
}

//Delete course
export async function deleteCourse(payload) {
  try {
    const { role, course_code } = payload;
    if (role == "admin") {
      const query = `
      DELETE FROM courses
      WHERE code = $1
      RETURNING * 
      `;
      const values = [course_code];
      const result = await client.query(query, values);
      console.log(result.rows);
      return result.rows;
    } else {
      console.log("unauthorized");
      return "UNATHORIZED";
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  } finally {
    await client.end();
  }
}

//Get admin(s)
export async function getAdmin(payLoad) {
  try {
    const { role } = payLoad;
    if (role == "admin") {
      const query = `
      SELECT *
      FROM admin 
      `;
      const result = await client.query(query);
      console.log(result.rows);
      return result.rows;
    } else {
      console.log("unauthorized");
      return "UNATHORIZED";
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  } finally {
    await client.end();
  }
}

//Get lecturers
export async function getTeacher(payLoad) {
  try {
    const { role } = payLoad;
    if (role == "admin") {
      const query = `
        SELECT *
        FROM teacher
        `;
      const result = await client.query(query);
      console.log(result.rows);
      return result.rows;
    } else {
      console.log("unauthorized");
      return "UNATHORIZED";
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  } finally {
    await client.end();
  }
}

// const payLoader = {
//   role: "admin",
//   student_role: "student",
//   student_username: "Fadex",
// };
//Create course
// dropStudent(payLoader);

// const payLoader = {
//   role: "admin",
//   code: "MATHS159",
//   unit: 2,
//   teacher_username: "joladeola",
// };

// createCourse(payLoader);
