import { writable } from "svelte/store";
import { formDataParser } from "$lib/utils/formDataParser";

import API from "./API";

export let FormStore = writable([]);
export let FormDataStore = writable({});

export const getAllForms = async () => {
  const response = await API.get("/forms");
  if (response.status == 200) {
    return response.data.forms;
  }
};

export const createForm = async ({ title }, callback) => {
  const response = await API.post("/forms/create", { title });
  if (response.status == 201) {
    callback({ target: { tagName: "SECTION" } });
    window.location.reload();
  } else {
    callback({ error: true });
  }
};

export const getFormDataByID = async (id) => {
  const response = await API.get(`/forms/${id}`);
  if (response.status == 200) {
    let data = await formDataParser(response.data.form);
    data.formData = await Promise.all(data?.formData);
    return data;
  }
};

export const updateFormStore = (id, data) => {
  FormStore.update((rows) => {
    rows = rows.map((row) => {
      if (row.id == data.id) {
        row = data;
      }
      return row;
    });
    return rows;
  });
};

export const updateForm = async (id, data) => {
  let res = await API.put(`/forms/update/${id}`, data);
  if (res.status == 201) {
    FormStore.update((rows) => {
      rows = rows.map((row) => {
        if (row.id == id) {
          row.title = res.data.form.title;
          row.isPublic = res.data.form.isPublic;
          row.allowDuplicates = res.data.form.allowDuplicates;
          row.redirectTo = res.data.form.redirectTo;
          row.primaryKeys = res.data.primaryKeys;
          row.updatedAt = res.data.form.updatedAt;
        }
        return row;
      });
      return rows;
    });
  }
  return res.data;
};

export const deleteResponse = async (responseID) => {
  if (
    confirm(
      "Are you Sure you want to delete this row? This action can't be reversed."
    )
  ) {
    let res = await API.post(`/forms/delete/data/${responseID}`);
    if (res.status == 200) {
      window.location.reload();
    }
  }
};

export const addAction = async (action, formID) => {
  const res = await API.post(`/actions/${formID}`, action);
  if (res.status == 201) {
    window.location.reload();
  }
};

export const editAction = async (action, formID) => {
  const res = await API.post(`/actions/${formID}/edit/${action.action}`, {
    variables: action.variables,
  });
  if (res.status == 201) {
    window.location.reload();
  }
};

export const deleteAction = async (actionID, formID) => {
  const res = await API.post(`/actions/${actionID}/delete/${formID}`);
  if (res.status == 200) {
    window.location.reload();
  }
};
