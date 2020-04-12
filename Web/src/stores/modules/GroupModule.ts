import store from '@/stores'
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import api from '@/lib/Api'

export interface IGroupState {
    groupName: string | undefined
    groupId: number | undefined
    groupUuid: string | undefined
}

@Module({ dynamic: true, store, name: 'group' })
class Group extends VuexModule implements IGroupState {
    public groupName: string | undefined = localStorage.getItem('groupName') || undefined
    public groupId: number | undefined = Number(localStorage.getItem('groupId')) || undefined
    public groupUuid: string | undefined = localStorage.getItem('groupUuid') || undefined

    // Mutations
    @Mutation
    private SET_GROUP_SUCCESS(data: { groupName: string, groupId: number, groupUuid: string }) {
        this.groupName = data.groupName
        this.groupId = data.groupId
        this.groupUuid = data.groupUuid

        localStorage.setItem('groupName', this.groupName)
        localStorage.setItem('groupId', this.groupId + "")
        localStorage.setItem('groupUuid', this.groupUuid)
    }

    @Mutation
    private SET_GROUP_UNREGISTER() {
        this.groupName = undefined
        this.groupId = undefined
        this.groupUuid = undefined

        localStorage.removeItem('authToken')
        localStorage.removeItem('userName')
        localStorage.removeItem('userRoles')
        delete api.defaults.headers.common['Authorization']
    }

    // Actions
    @Action
    public RegisterGroup(data: { groupUuid: string }) {
        return new Promise((resolve, reject) => {
            this.UnregisterGroup()
            api.get("/group/uuid/" + data.groupUuid)
                .then(resp => {
                    this.SET_GROUP_SUCCESS({ groupName: resp.data.data.Name, groupId: resp.data.data.Id, groupUuid: resp.data.data.Uuid })
                    resolve()
                })
                .catch(err => {
                    this.SET_GROUP_UNREGISTER()
                    reject(err.response?.data?.message)
                })
        })
    }

    @Action
    public UnregisterGroup() {
        this.SET_GROUP_UNREGISTER()
    }

    public get isGroupRegistered(): boolean { return !!this.groupUuid }
}

export const AuthModule = getModule(Group)