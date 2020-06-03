<template>
  <b-modal id="modal" :title="title" @ok="$emit('ok', $event)" size="md">
    <slot />
  </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ModalComponent extends Vue {
  @Prop() title?: string;
}
</script>

<style lang="sass">

</style>