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
          <li
            v-for="r in getVisibleSites()"
            :key="r.path"
            class="nav-item"
            :class="{'active':r.isActive}"
          >
            <a class="nav-link" :href="r.path">{{r.title}}</a>
          </li>
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
  public userRoles!: number;

  constructor() {
    super();
  }

  getVisibleSites() {
    const ret: { title: string; path: string; isActive: boolean }[] = [];
    const p = (x: any): { title: string; path: string; isActive: boolean } => {
      return {
        title: x.meta.title,
        path: x.path,
        isActive: x.name === this.$route.name
      };
    };
    for (const route of (this.$router as any).options.routes.filter(
      (x: any) => x.name !== "login"
    )) {
      // route doesn't exists
      if (!route) {
        continue;
      }
      // No auth required
      else if (!route.meta || !route.meta.auth) {
        ret.push(p(route));
      }
      // Auth is required, but user is not logged in
      else if (route.meta.auth && !this.isUserLoggedIn) {
        continue;
      }
      // Check if auth is valid
      else if (!route.meta.visibleFor) {
        continue;
      }
      // Check roles
      else if (
        (this.userRoles & route.meta.visibleFor) > 0 ||
        (this.userRoles & Role.SuperAdmin) == Role.SuperAdmin
      ) {
        ret.push(p(route));
      }
      // This shouldn't be called
      else {
        continue;
      }
    }
    return ret;
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

</style>