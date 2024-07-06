import formResponse from "../models/formResponse.js";
import { customTransportAndTemplate } from "../utils/postman.js";

const persistAction = (data) => {
  formResponse.create(data);
};

export default (id, variables, data, form_id, response_id) => {
  switch (id) {
    case 1:
      customTransportAndTemplate(variables, data, form_id, response_id, persistAction);
  }
};
