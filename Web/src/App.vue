<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12 col-lg-10 p-0 mx-auto">
          <div id="components-wrapper" class="d-flex flex-column">
            <header-component class="flex-grow-0 flex-shrink-0" />
            <div class="flex-grow-1 flex-shrink-0" id="top-content">
              <router-view />
            </div>
            <footer-component class="flex-grow-0 flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import HeaderComponent from "@/components/layout/HeaderComponent.vue";
import FooterComponent from "@/components/layout/FooterComponent.vue";

@Component({
  components: {
    HeaderComponent,
    FooterComponent
  }
})
export default class App extends Vue {
  name = "app";
}
</script>

<style lang="sass" scoped>

#components-wrapper
  min-height: 100vh

#top-content
  position: relative
</style>