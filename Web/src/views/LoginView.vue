<template>
  <b-container>
    <b-row align-content="center" p="6">
      <b-form @submit="onSubmit">
        <b-form-group id="input-group-userName" label="Nutzername" label-for="input-userName">
          <b-form-input
            id="input-userName"
            v-model="userName"
            type="text"
            required
            placeholder="Nutzername einfügen"
          />
        </b-form-group>

        <b-form-group id="input-group-password" label="Passwort" label-for="input-password">
          <b-form-input
            id="input-password"
            v-model="password"
            required
            placeholder="Passwort einfügen"
          />
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class LoginView extends Vue {
  private userName: string = "";
  private password: string = "";

  onSubmit(evt: any): void {
    evt.preventDefault();
    alert(JSON.stringify([this.userName, this.password]));
    this.$store.dispatch("login", {
      userName: this.userName,
      password: this.password
    });
  }
}
</script>

<style>
</style>