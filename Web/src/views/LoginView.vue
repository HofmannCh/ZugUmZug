<template>
  <div id="content">
    <div class="sbb-img">
      <img
        class="backgroundImage sbb"
        src="../assets/sbb/SBB P DTZ S-Bahn Zue Richterswil.jpg"
        alt="Background image"
      />
      <span>
        <a href="https://sbb.ch/">© SBB CFF FFS</a>
      </span>
    </div>
    <form @submit="onSubmit">
      <div
        class="form-group"
        id="input-group-userName"
        label="Nutzername"
        label-for="input-userName"
      >
        <label for="input-userName">Nutzername</label>
        <input
          id="input-userName"
          class="form-control"
          v-model="userName"
          type="text"
          required
          placeholder="Nutzername einfügen"
        />
      </div>

      <div class="form-group" id="input-group-password" label="Passwort" label-for="input-password">
        <label for="input-password">Passwort</label>
        <input
          id="input-password"
          class="form-control"
          v-model="password"
          type="password"
          required
          placeholder="Passwort eingeben"
        />
      </div>
      <input class="btn btn-primary" type="submit" value="Einloggen" />
      <div class="alert alert-danger mt-3" role="alert" v-if="alertText">{{ alertText }}</div>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { AuthModule } from "@/stores/modules/AuthModule";

@Component
export default class LoginView extends Vue {
  private userName: string = "";
  private password: string = "";

  private alertText: string = "";

  onSubmit(evt: any): void {
    evt.preventDefault();
    this.alertText = "";
    AuthModule.Login({ userName: this.userName, password: this.password })
      .then(res => {
        this.$router.push(
          this.$route.query.returnUrl
            ? { path: this.$route.query.returnUrl as string }
            : { name: "home" }
        );
      })
      .catch(err => {
        this.alertText = err.message;
      });
  }
}
</script>

<style lang="sass">

#content
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%

form
  background-color: $white
  width: 90%
  height: auto
  margin: 20px auto

#LoginView img
  width: 100%
  height: auto

.sbb-img
  display: none

@media only screen and (min-width: map-get($grid-breakpoints, "sm"))
  #content
    padding: 0 !important
  
  .sbb-img
    display: block

  form
    position: absolute
    top: 20%
    right: 20px
    width: 450px
    padding: 20px
    margin: 0
    box-sizing: border-box
    border-left: 8px solid $black

</style>