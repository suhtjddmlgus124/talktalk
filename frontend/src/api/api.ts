import axios, { type AxiosError } from "axios";


const api = axios.create({
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

export default api;
export { type AxiosError };