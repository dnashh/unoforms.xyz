import { writable } from 'svelte/store';

import API from "./API";

export const profile = writable(null);

export const getProfile = async () => {
    const response = await API.get('/profile');
    if(response.statusText == 'OK'){
        const data = response.data.user;
        data.meta = { responses: response.data.submissions }
        return data;
    }
}

export const updateProfile = async ({ name, bio, username }) => {
    const response = await API.post('/profile', { name, bio, username });
    if(response.statusText == 'OK'){
        const data = response.data.user;
        data.meta = { responses: response.data.submissions }
        profile.update(data);
        return true;
    } else {
        return false;
    }
}

export const read = async () => {
    profile.set(await getProfile());
}

read();