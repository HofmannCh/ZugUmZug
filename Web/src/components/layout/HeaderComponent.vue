<template>
  <header class="bg-light">
    <nav class="navbar navbar-expand-sm navbar-light bg-light">
      <a class="navbar-brand" href="#">Zug Um Zug</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#nav-collapse"
        aria-controls="nav-collapse"
        aria-expanded="false"
        aria-label="Menu ausklappen"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="nav-collapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" v-bind:class="{active: this.isThisSite('home')}">
            <a class="nav-link" href="/">Home</a>
          </li>
          <li
            class="nav-item"
            v-bind:class="{'active': this.isThisSite('about'), 'd-none': !this.isVisible('about')}"
          >
            <a class="nav-link" href="/about">About</a>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li v-if="isUserLoggedIn" class="nav-item">
            <a class="nav-link">{{userName}}</a>
          </li>
          <li
            v-if="!isUserLoggedIn"
            class="nav-item"
            v-bind:class="{active: this.isThisSite('login')}"
          >
            <a class="nav-link" href="/login">Login</a>
          </li>
          <li v-else class="nav-item">
            <a class="nav-link" href="#" @click="logout">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { AuthModule } from "@/stores/modules/AuthModule";
import { mapState, mapGetters } from "vuex";
import { Role } from "../../lib/UserRole";

@Component({
  computed: {
    ...mapGetters(["isUserLoggedIn"]),
    ...mapState({
      userName: (s: any) => s.auth.userName,
      userRoles: (s: any) => s.auth.userRoles
    })
  }
})
export default class HeaderComponent extends Vue {
  public isUserLoggedIn!: boolean;
  public userName!: string;
  public userRoles!: Number;

  constructor() {
    super();

    console.log([
      ["home", this.isVisible("home")],
      ["about", this.isVisible("about")],
      ["login", this.isVisible("login")],
      ["map", this.isVisible("map")],
      ["jokers", this.isVisible("jokers")],
      ["submitStations", this.isVisible("submitStations")],
      ["solveChallange", this.isVisible("solveChallange")]
    ]);
  }

  isThisSite(name: string) {
    return this.$route.name === name;
  }

  isVisible(name: string) {
    const router: any = this.$router;
    let route: any = router.options.routes.find((x: any) => x.name === name);

    if (!route) return false; // Route don't exists
    if (!route.meta || !route.meta.auth) return true; // In the route is nothing defined
    if (route.meta.auth && !this.isUserLoggedIn) return false; // Auth is required but not logged in
    if (!route.meta.visibleFor || !(route.meta.visibleFor instanceof Number))
      return false; // Route is restricted to roles
    if (
      ((this.userRoles as number) & route.meta.visibleFor) ===
      route.meta.visibleFor
    )
      return true; // Check is user is autorized to view page

    return false; // This shouldn't be called
  }

  logout() {
    AuthModule.Logout();
    this.$router.push("login");
  }
}
</script>

<style lang="sass" scoped>

</style>