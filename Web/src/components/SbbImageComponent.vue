<template>
  <div>
    <div class="sbb-img">
      <img class="backgroundImage sbb" v-bind:src="reqSrc" alt="SBB background image" />
      <span>
        <a href="https://sbb.ch/">© SBB CFF FFS</a>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
@Component
export default class SbbImageComponent extends Vue {
  @Prop({ required: true }) public reqSrc?: string;

  constructor() {
    super();
  }
}
</script>

<style lang="sass" scoped>
.sbb-img
  position: relative
  width: 100%
  height: 100%

img
  width: 100%
  height: 100%
  object-fit: cover

span
  position: absolute
  bottom: 0
  right: 0
  padding: 2px 5px
  background-color: $gray-600

  a
    color: $black !important
</style>