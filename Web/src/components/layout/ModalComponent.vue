<template>
  <b-modal id="modal" :title="title" @ok="$emit('ok', $event)" size="md">
    <slot />
    <!-- <template v-slot:modal-footer="{ ok, cancel }">
      <b-button size="sm" variant="success" @click="ok()">OK</b-button>
      <b-button size="sm" variant="danger" @click="cancel()">Cancel</b-button>
    </template> -->
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