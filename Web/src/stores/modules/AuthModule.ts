import store from '@/stores'
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import api from '@/lib/Api'

export interface IAuthState {
    token: string | undefined
    userName: string | undefined
    userRoles: number | undefined
}

@Module({ dynamic: true, store, name: 'auth' })
class Auth extends VuexModule implements IAuthState {
    public token: string | undefined = localStorage.getItem('authToken') || undefined
    public userName: string | undefined = localStorage.getItem('userName') || undefined
    public userRoles: number | undefined = Number(localStorage.getItem('userRoles')) || undefined

    // Mutations
    @Mutation
    private SET_AUTH_SUCCESS(data: { userName: string, userRoles: number, token: string }) {
        this.userName = data.userName
        this.userRoles = data.userRoles
        this.token = data.token

        localStorage.setItem('authToken', this.token)
        localStorage.setItem('userName', this.userName)
        localStorage.setItem('userRoles', this.userRoles + "")
        api.defaults.headers.common['Authorization'] = this.token
    }

    @Mutation
    private SET_AUTH_LOGOUT() {
        this.userName = undefined
        this.userRoles = undefined
        this.token = undefined

        localStorage.removeItem('authToken')
        localStorage.removeItem('userName')
        localStorage.removeItem('userRoles')
        delete api.defaults.headers.common['Authorization']
    }

    // Actions
    @Action
    public Login(data: { userName: string, password: string }) {
        return new Promise((resolve, reject) => {
            this.Logout()
            api.post("/auth/login", { UserName: data.userName, Password: data.password })
                .then(resp => {
                    this.SET_AUTH_SUCCESS({ userName: resp.data.data.User.UserName, userRoles: resp.data.data.User.Roles, token: resp.data.data.Token })
                    resolve()
                })
                .catch(err => {
                    this.SET_AUTH_LOGOUT()
                    reject(err.response.data.data.message)
                })
        })
    }

    @Action
    public Logout() {
        this.SET_AUTH_LOGOUT()
    }

    public get isUserLoggedIn(): boolean { return !!this.token && !!this.userName }
}

export const AuthModule = getModule(Auth)