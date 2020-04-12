<template>
  <h1>{{this.$route.name}}</h1>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class EventsView extends Vue {
  constructor() {
    super();
  }
}
</script>

<style lang="sass" scoped>

</style>