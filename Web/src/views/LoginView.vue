<template>
  <div id="content" class="container-fluid">
    <sbb-image-component :reqSrc="require('@/assets/sbb/SBB P DTZ S-Bahn Zue Richterswil.jpg')" class="sbb-img" />
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
import SbbImageComponent from "../components/SbbImageComponent.vue";
import { mapGetters } from "vuex";

@Component({
  components: { SbbImageComponent },
  computed: {
    ...mapGetters(["isUserLoggedIn"])
  }
})
export default class LoginView extends Vue {
  private isUserLoggedIn!: boolean;
  private userName: string = "";
  private password: string = "";

  private alertText: string = "";

  constructor() {
    super();
  }

  private mounted() {
    if (this.isUserLoggedIn) this.go();
  }

  private go() {
    this.$router.push(
      this.$route.query.returnUrl
        ? { path: this.$route.query.returnUrl as string }
        : { name: "home" }
    );
  }

  private onSubmit(evt: any): void {
    evt.preventDefault();
    AuthModule.Login({ userName: this.userName, password: this.password })
      .then(res => {
        this.go();
      })
      .catch(err => {});
  }
}
</script>

<style lang="sass" scoped>

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