import axios from 'axios'
import Vue from 'vue'
const api = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    },
    transformResponse: [(res): any => {
        const data = JSON.parse(res);
        if (data?.success == false) {
            console.error(data);
            Vue.toasted.show(data.data.message, {type:"error"});
        }
        return data;
    }]
});
export default api;