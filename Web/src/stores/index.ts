import Vue from 'vue'
import Vuex from 'vuex'
import { IAuthState } from './modules/AuthModule'
import { IGroupState } from './modules/GroupModule';
import { Role } from '@/lib/UserRole';

Vue.use(Vuex)

export interface IRootState {
    auth: IAuthState
    group: IGroupState
}

const store = new Vuex.Store<IRootState>({});

Vue.prototype.isSuperAdmin = function() {
    return ((store.state.auth?.userRoles as number ?? 0) & Role.SuperAdmin) === Role.SuperAdmin;
  };

// Declare empty store first, dynamically register all modules later.
export default store