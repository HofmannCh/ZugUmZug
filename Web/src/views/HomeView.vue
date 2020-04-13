<template>
  <div class="container">
    <div class="home py-3 col-md-12 col-lg-8 mx-auto">
      <sbb-image-component :reqSrc="require('@/assets/sbb/SBB Weihnachtszug.jpg')"/>
    </div>
    <hello-world-component msg="Herzlich Willkommen!" class="text-left mt-2" />
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos illum fugiat facere ullam ipsum quis ab eligendi, blanditiis autem voluptate nesciunt earum doloribus placeat vitae? Ea doloremque dolores atque ullam?</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import SbbImageComponent from "@/components/SbbImageComponent.vue";
import HelloWorldComponent from "@/components/HelloWorldComponent.vue";

@Component({
  components: { HelloWorldComponent, SbbImageComponent }
})
export default class HomeView extends Vue {}
</script>
