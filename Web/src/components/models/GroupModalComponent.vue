<template>
  <modal-component id="modal" :title="title" @ok="validateAndSend">
    <b-form @submit.prevent ref="form" :validated="false">
      <b-form-group v-if="isSuperAdmin()" label="Id" label-for="Group.Id" label-cols-md="4">
        <b-form-input id="Group.Id" v-model="model.id" type="number" readonly />
      </b-form-group>

      <b-form-group label="Name" label-for="Group.Name" label-cols-md="4">
        <b-form-input id="Group.Name" v-model="model.Name" type="text" required />
      </b-form-group>

      <b-form-group label="Beschreibung" label-for="Group.Description" label-cols-md="4">
        <b-form-input id="Group.Description" v-model="model.Description" type="text" />
      </b-form-group>

      <b-form-group label="Basis User" label-for="Group.BasisUserId" label-cols-md="4">
        <b-form-select id="Group.BasisUserId" v-model="model.BasisUserId">
          <option value="1">Bob 1</option>
          <option value="2">Bob 2</option>
          <option value="3">Bob 3</option>
          <option value="4">Bob 4</option>
          <option value="5">Bob 5</option>
        </b-form-select>
      </b-form-group>
    </b-form>
  </modal-component>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";
import BaseFormMixin from "./BaseFormMixin";
import ModalComponent from "../layout/ModalComponent.vue";

@Component({
  mixins: [BaseFormMixin],
  components: { ModalComponent }
})
export default class GroupModalComponent extends Mixins(BaseFormMixin) {}
</script>