<template>
  <modal-component id="modal" :title="title" @ok="validateAndSend">
    <b-form @submit.prevent ref="form" :validated="false">
      <b-form-group v-if="isSuperAdmin()" label="Id" label-for="Group.Id" label-cols-md="4">
        <b-form-input id="Group.Id" v-model="model.Id" type="number" readonly />
      </b-form-group>

      <b-form-group label="Name" label-for="Group.Name" label-cols-md="4">
        <b-form-input id="Group.Name" v-model="model.Name" type="text" required />
      </b-form-group>

      <b-form-group label="Beschreibung" label-for="Group.Description" label-cols-md="4">
        <b-form-input id="Group.Description" v-model="model.Description" type="text" />
      </b-form-group>

      <b-form-group label="Nutzer" label-for="Group.Users" label-cols-md="4" description="Namen kommasepariert einfügen">
        <b-form-input id="Group.Users" v-model="model.Users" type="text" placeholder="Muster, Robin, Marie, ..." />
      </b-form-group>

      <b-form-group label="Basis User" label-for="Group.BasisUserId" label-cols-md="4">
        <b-form-select id="Group.BasisUserId" v-model="model.BasisUserId" required>
          <option v-for="bu in basisUsers" :key="bu.Id" :value="bu.Id">{{ bu.UserName }}</option>
        </b-form-select>
      </b-form-group>
    </b-form>
  </modal-component>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";
import BaseFormMixin from "./BaseFormMixin";
import ModalComponent from "@/components/layout/ModalComponent.vue";
import api from "@/lib/Api";

@Component({
  mixins: [BaseFormMixin],
  components: { ModalComponent }
})
export default class GroupModalComponent extends Mixins(BaseFormMixin) {
  basisUsers: Array<{Id:number, UserName:string}> = [];
  created() {
    api.get("/manage/group/listBasisUsers").then(res => {
       this.basisUsers = res.data.data;
    });
  }
}
</script>