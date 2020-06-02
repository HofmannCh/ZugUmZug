<template>
  <footer class="bg-light p-3">
    <div>Lukas Hofmann 2019 - {{ new Date().getFullYear() }} &copy;</div>
  </footer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class FooterComponent extends Vue {
}
</script>

<style lang="sass" scoped>
footer
  min-height: 80px
  display: flex
  flex-direction: column
  justify-content: center
</style>