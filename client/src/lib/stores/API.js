import axios from "axios";
import { PUBLIC_SERVER_BASE_URL } from '$env/static/public'

class API {
    constructor() {
        this.api = axios.create({
            baseURL: PUBLIC_SERVER_BASE_URL,
            withCredentials: true,
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });
        this.api.interceptors.response.use(this.handleSuccess, this.handleError);
    }

    handleSuccess(response) {
        return response;
    }

    handleError(error) {
        return error;
    }

    get(url, options) {
        return this.api.get(url, options);
    }

    post(url, data) {
        return this.api.post(url, data);
    }

    put(url, data) {
        return this.api.put(url, data);
    }

}

export default new API();