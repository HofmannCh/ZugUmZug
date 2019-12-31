<template>
  <header>
    <div>
  <b-navbar toggleable="lg" type="light" variant="light">
    <b-navbar-brand href="#">Zug Um Zug</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/">Home</b-nav-item>
        <b-nav-item to="/about">About</b-nav-item>

         <b-nav-item-dropdown text="Language" right>
          <b-dropdown-item to="/">EN</b-dropdown-item>
          <b-dropdown-item to="/">DE</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
  </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HeaderComponent extends Vue {}
</script>

<style lang="sass" scoped>

</style>