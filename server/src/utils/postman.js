import * as dotenv from "dotenv";
import nodemailer from "nodemailer";
import ejs from "ejs";
import TEMPLATES from "./TEMPLATES.js";

dotenv.config();

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = (template, to, data) => {
  var mailOptions = {
    from: '"UnoForms" <noreply@unoforms.xyz>',
    to,
    subject: TEMPLATES[template].subject,
    html: ejs.render(TEMPLATES[template].html, data),
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Successfully sent", info);
  });
};

export const customTransportAndTemplate = (
  variables,
  data,
  form_id,
  response_id,
  callback
) => {
  const custom = nodemailer.createTransport({
    host: variables["EMAIL_HOST"],
    port: variables["EMAIL_PORT"],
    auth: {
      user: variables["EMAIL_USER"],
      pass: variables["EMAIL_PASS"],
    },
  });

  const mailOptions = {
    from: variables["from"],
    to: ejs.render(variables["sendTo"].toString(), { data }),
    subject: variables["subject"],
    html: ejs.render(variables["template"], { variables, data }),
  };

  custom.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("mail error", error);
    }
    console.log("Successfully sent", info);
    callback({
      formId: form_id,
      responseId: response_id,
      key: `_action_${variables["Action Name"].replaceAll(" ", "_")}`,
      value: true.toString(),
      type: typeof true,
    });
  });
};
