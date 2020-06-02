import Vue from 'vue'
import Vuex from 'vuex'
import { IAuthState, AuthModule } from './modules/AuthModule'
import { Role } from '@/lib/UserRole';

Vue.use(Vuex)

export interface IRootState {
  auth: IAuthState
}

const store = new Vuex.Store<IRootState>({});

Vue.prototype.isSuperAdmin = function () {
  return AuthModule.isUserSuperAdmin;
};

// Declare empty store first, dynamically register all modules later.
export default store