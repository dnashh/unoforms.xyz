import { writable } from 'svelte/store';

import API from "./API";

export const status = async () => {
    const res = await API.get('/auth/status');
    if(res.statusText = 'OK'){
        return res.data?.user;
    } else {
        return await refresh();
    }
}

export let userStore =  writable(await status());

export const login = async (login, password, callback) => {
    API.post('/auth/login', { login, password })
    .then((resp) => {
        if(resp.status == 200){
            userStore.set(resp.data.user);
        }
        callback(resp);
    })
    .catch(callback);
}

export const signup = async (name, email, password, callback) => {
    API.post('/auth/signup', { name, email, password }).then((resp) => {
        if(resp.response.status == 201){
            login(email, password, callback);
        } else {
            callback(resp);
        }
    }).catch(callback);
}

export const logout = async () => {
    await API.get('/auth/logout');
    userStore.set(null);
}

export const refresh = async () => {
    const res = await API.post('/auth/refresh', {});
    if(res.statusText = 'OK'){
        return res.data?.user;
    } else {
        return null;
    }
}

export const forgotPassword = async (email) => {
    const res = await API.post('/auth/forgot-password', { email });
    return res.data?.message;

}

export const resetPassword = async (token, password) => {
    const res = await API.post(`/auth/reset-password?token=${token}`, { password });
    return res.data.message;
}