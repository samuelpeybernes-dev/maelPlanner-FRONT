import axios from 'axios';

const axiosAuth = axios.create({
    baseURL: "/planner"
});
const axiosNoAuth = axios.create({
    baseURL: "/planner"
});


axiosAuth.interceptors.request.use(
    config => {
        if (!config.headers.Authorization) {
            config.headers.Authorization = "Bearer "+ localStorage.getItem('token');
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

export {axiosAuth, axiosNoAuth}

