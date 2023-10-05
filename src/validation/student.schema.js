import Joi from "joi";

export const enrollCourse = Joi.object({
    course_code: Joi.string().required(),
    student_username: Joi.string().required(),
    role: Joi.string().valid("student").required(),
    
});
