<template>
  <div id="app" class="row">
    <div class="col-sm-12 col-lg-10 mx-auto p-0 d-flex flex-column">
      <header-component class="flex-grow-0 flex-shrink-0" />
      <router-view class="flex-grow-1 flex-shrink-0 px-3" />
      <footer-component class="flex-grow-0 flex-shrink-0" />
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
  name = "app"
}
</script>
