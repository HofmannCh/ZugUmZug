<template>
  <div class="table-wrapper">
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
          <button
            class="btn btn-primary col-12"
            @click="e => { e.preventDefault(); openModal(); }"
          >Hinzufügen</button>
        </div>
      </form>
    </div>
    <div ref="tabulatorTable" class="table table-sm"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import api from "@/lib/Api";
const Tabulator = require("tabulator-tables");
const Url = require("url");

@Component({})
export default class TabulatorComponent extends Vue {
  @Prop() options?: any;
  @Prop({ required: true }) columns?: any[];

  @Prop({ required: true }) apiController?: string;

  filter: string = "";

  constructor() {
    super();
  }

  table: any;

  readonly locals: any = {
    de: {
      ajax: {
        loading: "Lade",
        error: "Fehler"
      },
      groups: {
        item: "Item",
        items: "Items"
      },
      pagination: {
        first: `<i class="fa fa-angle-double-left"></i>`,
        first_title: "Erste Seite",
        last: `<i class="fa fa-angle-double-right"></i>`,
        last_title: "Letzte Seite",
        prev: `<i class="fa fa-angle-left"></i>`,
        prev_title: "Vorherige Seite",
        next: `<i class="fa fa-angle-right"></i>`,
        next_title: "Nächste Seite"
      }
    }
  };

  created() {
    this.$on("reloadTable", () => this.updateTable());
  }

  getApiController() {
    let val = this.apiController || "";
    val = val.startsWith("/") ? val : "/" + val;
    val = val.endsWith("/") ? val.substring(0, val.length - 1) : val;
    return val;
  }

  private ajaxProxy(url: any, config: any, params: any) {
    const that = this;
    return new Promise(function(resolve, reject) {
      api
        .get(that.getApiController() + "/list", {
          params: {
            filterText: that.filter,
            tb: JSON.stringify(params)
          }
        })
        .then(data => {
          // console.log(data.data);
          resolve(data.data);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });

      setTimeout(
        () => resolve({ last_page: 1, data: [{ Id: 1, Name: "1" }] }),
        2000
      );
    });
  }

  private openModal(id?: number) {
    this.$emit("showModal", id ?? 0);
  }

  readonly defaultOptions = {
    height: "auto",
    layout: "fitData",

    locale: "de",
    langs: this.locals,

    columns: this.columns,
    rowDblClick: (e: any, row: any) =>
      this.openModal(row.getData().Id as number),

    pagination: "remote",
    paginationSize: 10,

    ajaxURL: api.defaults.baseURL,
    ajaxFiltering: true,
    ajaxSorting: true,

    initialSort: [{ column: "Id", dir: "asc" }],

    placeholder: "Keine Daten vorhanden",

    ajaxRequestFunc: this.ajaxProxy,
    ajaxLoaderLoading: `<div title='Loading' style='background-image: url("${require("@/assets/loading.svg")}"); background-repeat: no-repeat; height: 20px; width: 150px;'/>`
  };

  public updateTable(ev?: any) {
    if (ev) ev.preventDefault();
    this.table?.replaceData();
  }

  private mounted() {
    this.table = new Tabulator(this.$refs.tabulatorTable, {
      ...this.defaultOptions,
      ...this.options
    });
    (window as any).yeet = this.table;
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