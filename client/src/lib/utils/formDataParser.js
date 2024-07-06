export async function formDataParser(form) {
  let formData = form.formData;
  const columns = new Set();
  if (formData.length) {
    columns.add("#");
    formData = formData.map(async (data, index) => {
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
          if (!response.key.startsWith("_")) {
            columns.add(key);
          }
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
