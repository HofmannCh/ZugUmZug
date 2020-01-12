import axios from 'axios';

export default class AuthService {
    async login(username: string, password: string) {
        const response = await axios.post('/auth/login', {
                UserName: username,
                Password: password
            });
        if (response.data.Token) {
            localStorage.setItem('authToken', response.data.Token);
        }
        return response.data;
    }

    logout() {
        localStorage.removeItem('user');
    }

    //   register(user) {
    //     return axios.post(API_URL + 'signup', {
    //       username: user.username,
    //       email: user.email,
    //       password: user.password
    //     });
    //  }
}