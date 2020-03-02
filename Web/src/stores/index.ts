import Vue from 'vue'
import Vuex from 'vuex'
import { IAuthState } from './modules/AuthModule'

Vue.use(Vuex)

export interface IRootState {
    auth: IAuthState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})