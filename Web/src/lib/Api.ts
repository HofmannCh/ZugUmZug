import axios from 'axios'
import Vue from 'vue'
import store from '@/stores';
const api = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL ?? "https://api-zuz.hofi.dev/",
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    transformResponse: [(res): any => {
        const data = JSON.parse(res);
        if (data?.success == false) {
            Vue.toasted.show(data.data.message, {type:"error"});
        }
        return data;
    }]
});

api.interceptors.request.use((conf) => {
    // if(store.getters["isUserLoggedIn"])
    //     conf.headers["Authorization"] = store.state.auth.token;
    return conf;
})

export default api;