<template>
  <div class="container">
    <h1 class="text-center text-sm-left my-2 my-sm-3">Gruppen verwalten</h1>
    <div class="container-fluid my-2 p-0">
      <form class="form-inline col-12 col-lg-8 col-xl-6 ml-lg-auto p-0">
        <div class="form-group col-8 col-sm-6 mb-2 p-1 pl-0">
          <input type="text" class="form-control col-12" placeholder="Suche..." v-model="filter" />
        </div>
        <div class="form-group col-4 col-sm-3 mb-2 p-1">
          <input
            type="submit"
            class="form-control btn btn-primary col-12"
            value="Suchen"
            @click="updateTable"
          />
        </div>
        <div class="form-group col-12 col-sm-3 mb-2 p-1 pr-0">
          <button class="btn btn-primary col-12">Hinzufügen</button>
        </div>
      </form>
    </div>
    <div ref="tabulator"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import api from "@/lib/Api";
const Tabulator = require("tabulator-tables");

@Component({})
export default class GroupsView extends Vue {
  constructor() {
    super();
  }

  private table: any;
  filter? = "";

  updateTable(ev: any) {
    if (ev) ev.preventDefault();
    this.table?.replaceData();
  }

  private mounted() {
    const that = this;
    let s = 10;
    (window as any).yeet = this.table = new Tabulator(this.$refs.tabulator, {
      height: "auto",
      layout: "fitData",
      locale: "de",
      langs: {
        "de": {
          ajax: {
            loading: "Lade",
            error: "Fehler"
          },
          groups: {
            item: "Item",
            items: "Items"
          },
          pagination: {
            first: "Erste",
            first_title: "Erste Seite",
            last: "Letzte",
            last_title: "Letzte Seite",
            prev: "Vor.",
            prev_title: "Vorherige Seite",
            next: "Näch.",
            next_title: "Nächste Seite"
          }
        }
      },
      columns: [
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
      ],
      pagination: "remote",
      paginationSize: s,
      placeholder: "Keine Daten vorhanden",
      ajaxRequestFunc: (url: any, config: any, params: any) => {
        return new Promise(function(resolve, reject) {
          // console.log("Start loading");
          // console.log(url);
          // console.log(config);
          // console.log(params);
          // console.log(that.filter);

          setTimeout(() => {
            // console.log("End loading");
            let i = params.page * params.size;
            resolve({
              last_page: 20,
              data: [
                { Id: i, Name: "Name " + i++ },
                { Id: i, Name: "Name " + i++ },
                { Id: i, Name: "Name " + i++ },
                { Id: i, Name: "Name " + i++ },
                { Id: i, Name: "Name " + i++ },
                { Id: i, Name: "Name " + i++ },
                { Id: i, Name: "Name " + i++ },
                { Id: i, Name: "Name " + i++ },
                { Id: i, Name: "Name " + i++ },
                { Id: i, Name: "Name " + i++ }
              ]
            });
          }, 2000);
        });
      },
      ajaxLoaderLoading: `<div title='Loading' style='background-image: url("${require("@/assets/loading.svg")}"); background-repeat: no-repeat; height: 20px; width: 150px;'/>`
    });
    this.table.setData(api.defaults.baseURL);
  }
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