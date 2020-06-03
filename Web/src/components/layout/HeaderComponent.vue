<template>
  <header class="bg-light">
    <nav class="navbar navbar-expand-sm navbar-light bg-light">
      <a class="navbar-brand" href="#">Zug um Zug</a>
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
          <router-link
            v-for="r in allMainRoutes"
            :key="r.name"
            :to="r.path"
            class="nav-item nav-link"
            exact
            active-class="active"
          >{{r.title}}</router-link>

          <!-- Manage -->
          <li class="nav-item dropdown" v-if="allManageRoutes.length > 1">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >Manage</a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <router-link
                v-for="r in allManageRoutes"
                :key="r.name"
                :to="r.path"
                class="dropdown-item"
                exact
                active-class="active"
              >{{r.title}}</router-link>
            </div>
          </li>
          <router-link
            v-else-if="allManageRoutes.length == 1"
            :to="allManageRoutes[0].path"
            class="nav-item nav-link"
            exact
            active-class="active"
          >{{allManageRoutes[0].title}}</router-link>

          <!-- Teams -->
          <li class="nav-item dropdown" v-if="isSuperAdmin()">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >Teams</a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <router-link
                v-for="r in allTeamsRoutes"
                :key="r.name"
                :to="r.path"
                class="dropdown-item"
                exact
                active-class="active"
              >{{r.title}}</router-link>
            </div>
          </li>
          <router-link
            v-else
            v-for="r in allTeamsRoutes"
            :key="r.name"
            :to="r.path"
            class="nav-item nav-link"
            exact
            active-class="active"
          >{{r.title}}</router-link>
          <!-- -->
        </ul>
        <ul class="navbar-nav">
          <li v-if="isUserLoggedIn" class="nav-item">
            <a class="nav-link">{{userName}}</a>
          </li>
          <li v-if="!isUserLoggedIn" class="nav-item" :class="{'active':isSiteVisible('login')}">
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
import { Role } from "@/lib/UserRole";

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
  public userRoles!: number;

  constructor() {
    super();
  }

  private allRoutes: any[] = [];
  private allMainRoutes: any[] = [];
  private allManageRoutes: any[] = [];
  private allTeamsRoutes: any[] = [];

  private mounted() {
    this.updateNav();
  }

  @Watch("userName")
  private onUserChange() {
    this.updateNav();
  }

  private updateNav() {
    const generallyExclude = ["login", "about", "home"];

    const manageNames = [
      "manageJokers",
      "manageChallenge",
      "manageGroups",
      "manageUsers",
      "manageEvents"
    ];

    const teamsNames = [
      "teamsGroups",
      "teamsSubmitStations",
      "teamsSolveChallenge"
    ];

    const routes = (this.$router as any).options.routes.filter(
      (x: any) => !generallyExclude.includes(x.name)
    );
    this.allRoutes = [];
    this.allMainRoutes = [];
    this.allManageRoutes = [];

    for (const route of routes!) {
      if (!this.isRouteVisible(route)) continue;
      const pr = {
        name: route.name,
        title: route.meta.title,
        path: route.path,
        isActive: false
      };
      this.allRoutes.push(pr);
      if (manageNames.includes(route.name)) this.allManageRoutes!.push(pr);
      else if (teamsNames.includes(route.name)) this.allTeamsRoutes!.push(pr);
      else this.allMainRoutes!.push(pr);
    }

    const active = this.allRoutes!.find(x => this.isSiteVisible(x.name));
    if (active) active.isActive = true;
  }

  isRouteVisible(route: any) {
    // route doesn't exists
    if (!route) {
      return false;
    }
    // No auth required or superadmin
    else if (!route.meta || !route.meta.auth || (this as any).isSuperAdmin()) {
      return true;
    }
    // Auth is required, but user is not logged in
    else if (route.meta.auth && !this.isUserLoggedIn) {
      return false;
    }
    // Check if auth is valid
    else if (!route.meta.visibleFor) {
      return false;
    }
    // Check roles
    else if ((this.userRoles & route.meta.visibleFor) > 0) {
      return true;
    }
    // This shouldn't be called
    else {
      return false;
    }
  }

  isSiteVisible(name: string): boolean {
    return name === this.$route.name;
  }

  logout() {
    AuthModule.Logout();
    this.$router.push("login");
  }
}
</script>

<style lang="sass" scoped>
.nav-item
  word-wrap: break-word
  text-overflow: ellipsis
  white-space: nowrap
  overflow: hidden

  &.dropdown
    overflow: visible
</style>