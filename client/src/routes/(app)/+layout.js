import API from "$lib/stores/API.js"

export const prerender = false;
export const ssr = false;

/** @type {import('./$types').PageLoad} */
export function load() {
    API.get('/auth/status')
    .then((response) => {
        if(response?.status != 200){
            try {
                window.location.href = '/login'
            } catch { /* empty */ }
        }
    })
}