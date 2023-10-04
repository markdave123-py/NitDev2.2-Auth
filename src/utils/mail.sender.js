import sgmail from "@sendgrid/mail";
import { config } from "../config/env.js";

export const sendMail = async (userEmail, myEmail) => {
  const ApiKey = config.SENDGRID_APIKEY;

  sgmail.setApiKey(ApiKey);

  const message = {
    to: userEmail,
    from: myEmail,
    subject: "Reset Your Password",
    text: "This is the link to reset your password",
  };

  sgmail
    .send(message)
    .then((response) => {
        console.log("email sent")
        return response;
    })
    .catch((err) => console.log(err.response.body));
};
