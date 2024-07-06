import { Parser } from "@json2csv/plainjs";
import ActionTriggers from "../models/ActionTriggers.js";
import actionCalls from "../rules/actionCalls.js";

export const issueDownload = async (data, callback) => {
  const excludeKeys = ["_time"];
  try {
    console.log("data : ", data);
    const parser = new Parser();
    const json = await formDataParser(data);
    const formData = await Promise.all(json["formData"]);
    const csv = parser.parse(
      formData.map((obj) => {
        const keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].startsWith("_") && !excludeKeys.includes(keys[i])) {
            delete obj[keys[i]];
            continue;
          }
          obj[keys[i]] = obj[keys[i]].value;
        }
        return obj;
      })
    );
    callback(csv);
  } catch {
    callback("");
  }
};

export async function formDataParser(form) {
  let formData = form.formData;
  const columns = new Set();
  if (formData.length) {
    columns.add("#");
    formData = await formData.map(async (data, index) => {
      let map = {};
      map["_details"] = data;
      map["#"] = { value: index + 1, id: index };
      map["_time"] = { value: data.createdAt };
      if (typeof data.responses == "object") {
        data.responses.forEach((response) => {
          const key = response.key.replaceAll("_", " ");
          map[key] = {
            value: response.value,
            id: response.id,
          };
          columns.add(key);
        });
        return map;
      } else {
        Object.keys(data).forEach((key) => {
          columns.add(key);
        });
        return data;
      }
    });
    columns.add("_time");
  }
  form.formData = formData;
  form.columns = columns;
  return form;
}

export const triggerActions = async (form, data, response_id) => {
  const actions = await ActionTriggers.findAll({
    where: { form: form.id, variables: { trigger_type: "auto" } },
  });
  actions.forEach((action) => {
    actionCalls(action.action, action.variables, data, form.id, response_id);
  });
};
