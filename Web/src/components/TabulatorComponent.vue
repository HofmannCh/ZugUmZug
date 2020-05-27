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
          <button class="btn btn-primary col-12">Hinzufügen</button>
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
  };

  getApiController() {
    let val = this.apiController || "";
    val = val.startsWith("/") ? val : "/" + val;
    val = val.endsWith("/") ? val : val + "/list";
    return val;
  }

  private ajaxProxy(url: any, config: any, params: any) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // console.log("Start loading");
      // console.log(url);
      // console.log(config);
      // console.log(that.filter);
      // console.log(api);
      // console.log(that.getApiController());
      api.get(that.getApiController(),{
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

  readonly defaultOptions = {
    height: "auto",
    layout: "fitData",

    locale: "de",
    langs: this.locals,

    columns: this.columns,

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

  public updateTable(ev: any) {
    if (ev) ev.preventDefault();
    this.table?.replaceData();
  }

  private mounted() {
    (window as any).yeet = this;
    this.table = new Tabulator(this.$refs.tabulatorTable, {
      ...this.defaultOptions,
      ...this.options
    });
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