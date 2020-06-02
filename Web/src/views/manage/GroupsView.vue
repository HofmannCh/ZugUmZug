<template>
  <div class="container-fluid">
    <h1 class="text-center text-sm-left my-2 my-sm-3">Gruppen verwalten</h1>
    <tabulator-component :columns="columns" ref="table" apiController="/manage/group" />
    <group-modal-component ref="modal" apiController="/manage/group" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from "vue-property-decorator";
import api from "@/lib/Api";
import TabulatorComponent from "@/components/TabulatorComponent.vue";
import GroupModalComponent from "@/components/models/GroupModalComponent.vue";
import BaseTableMixin from "@/components/layout/BaseTableMixin";

@Component({
  components: { TabulatorComponent, GroupModalComponent },
  mixins: [BaseTableMixin]
})
export default class GroupsView extends Mixins(BaseTableMixin) {
  private readonly columns: any = [
    { title: "Id", field: "Id" },
    { title: "Name", field: "Name" },
    { title: "Beschreibung", field: "Description" },
    { title: "Mitglieder", field: "Users" },
    { title: "Verantwortlich", field: "BasisUser" },
    {
      title: "EventId",
      field: "EventId",
      visible: (this as any).isSuperAdmin()
    },
    {
      title: "Uuid",
      field: "Uuid",
      visible: (this as any).isSuperAdmin(),
      headerSort: false
    }
  ];
}
</script>

<style lang="sass">
.tabulator
  .tabulator-loader
    background-color: rgba(0, 0, 0, 0.2)
    .tabulator-loader-msg.tabulator-loading
      border: 2px solid black
      background: #fff
      border-radius: 0
      padding: 6px
</style>