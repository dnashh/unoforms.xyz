import API from "$lib/stores/API.js"

export const prerender = true;

/** @type {import('./$types').PageLoad} */
export function load() {
    API.get('/auth/status').then(({data}) => {
        if(data?.user?.id){
            window.location.href = "/"
        }
    });
}