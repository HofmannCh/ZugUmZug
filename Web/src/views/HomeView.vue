<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" class="mx-auto d-block">
    <hello-world-component msg="Welcome to Your Vue.js App" class="text-center"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import HelloWorldComponent from '@/components/HelloWorldComponent.vue'

@Component({
  components: { HelloWorldComponent }
})
export default class HomeView extends Vue {
}
</script>
