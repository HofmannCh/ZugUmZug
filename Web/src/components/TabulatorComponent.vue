<template>
  <div class="table-wrapper">
    <div class="container-fluid my-1 p-0">
      <div class="row px-3">
        <div class="col-3 col-sm-auto col-md-auto py-0 pl-0 pr-1 mb-1">
          <select
            class="select paging-select form-control"
            @change="viewCountChange"
            v-model="viewCount"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="-1">Alle</option>
          </select>
        </div>
        <div class="d-none d-sm-inline-block col-6 col-sm-auto col-md-auto py-0 pl-1 pr-0 mb-1">
          <button class="btn btn-primary col-12 form-control" @click="downloadContent">
            <i class="fa fa-download"></i>
          </button>
        </div>
        <div class="d-none d-md-inline-block py-0 pl-2 pr-2 mb-1"></div>
        <div class="col-5 col-sm-6 col-md-auto py-0 pl-1 pr-1 mb-1 ml-auto">
          <input type="text" class="form-control col-12 search-text" placeholder="Suche..." />
        </div>
        <div class="d-none d-md-inline-block col-auto py-0 pl-1 pr-1 pr-md-1 mb-1">
          <button class="btn btn-primary col-12 form-control" @click="updateTable">Suchen</button>
        </div>
        <div class="d-none d-md-inline-block col-auto py-0 pl-1 pr-0 mb-1">
          <button
            class="btn btn-primary col-12 form-control"
            @click="e => { e.preventDefault(); openModal(); }"
          >Hinzufügen</button>
        </div>
        <div class="col-2 col-sm-auto d-md-none py-0 pl-1 pr-1 pr-md-1 mb-1">
          <button class="btn btn-primary col-12 form-control" @click="updateTable">
            <i class="fa fa-search"></i>
          </button>
        </div>
        <div class="col-2 col-sm-auto d-md-none py-0 pl-1 pr-0 mb-1">
          <button
            class="btn btn-primary col-12 form-control"
            @click="e => { e.preventDefault(); openModal(); }"
          >
            <i class="fa fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
    <!-- <div class="container-fluid my-2 p-0">
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
            
          >Hinzufügen</button>
        </div>
      </form>
    </div>-->
    <div ref="tabulatorTable" class="table table-sm"></div>
    <div
      ref="table-footer"
      v-if="viewCount >= 0"
    >Angezeigt: {{ viewCount }} von total {{ totalCount || "" }}</div>
    <div
      ref="table-footer"
      v-else
    >Angezeigt: {{ totalCount || "" }} von total {{ totalCount || "" }}</div>
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
  viewCount: number = 10;
  totalCount: number = 0;

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
          // data.data.data = data.data.data.map((x: any) => {
          //   // x._Actions = `<button class="btn btn-sm btn-danger"><i class="fa fa-trash"></i></button>`;
          //   return x;
          // });
          resolve(data.data);
        })
        .catch(err => {
          reject(err);
        });
    }).then((data: any) => {
      this.totalCount = (data.total as number) ?? 0;
      return data;
    });
  }

  private openModal(id?: number) {
    this.$emit("showModal", id ?? 0);
  }

  private deleteCellFormatter(
    cell: any,
    formatterParams: any,
    onRendered: any
  ) {
    return `<button class="btn btn-sm btn-danger delete-action"><i class="fa fa-trash"></i></button>`;
  }

  private cellClick(e: MouseEvent, row: any) {
    // console.log(e);
    const eles = (e as any)?.path as Array<Element>;
    if (!eles) return;

    let container = undefined;
    let btn = undefined;
    for (let i = 0; i < eles.length; i++) {
      if (eles[i].classList.contains("tabulator-cell")) {
        btn = i > 0 ? eles[i - 1] : eles[i];
        container = eles[i];
        break;
      }
    }

    if (!container || !btn) return;
    for (const c of container.children as Iterable<Element>) {
      if (btn == c) {
        e.preventDefault();
        const data = row.getData();
        if (c.classList.contains("delete-action")) {
          if (confirm(`${data.Name ?? data.Id} löschen?`)) {
            api.delete("/manage/group/d/" + data.Id).then(res => {
              this.table.deleteRow(data.Id);
              Vue.toasted.success("Gelöscht");
            });
            // console.log("Delete ", row.getData().Id);
          }
        }
      }
    }
  }

  viewCountChange(e: Event) {
    // console.log(this.viewCount);
    this.table.setPageSize(this.viewCount);
  }

  downloadContent(e: Event) {
    this.table.download("csv", "data.csv");
  }

  readonly defaultOptions = {
    height: "auto",
    layout: "fitDataStretch",

    locale: "de",
    langs: this.locals,

    index: "Id",
    columns: [
      ...(this.columns as Array<any>),
      {
        title: "",
        formatter: this.deleteCellFormatter,
        headerSort: false,
        hozAlign: "right",
        cellClick: this.cellClick
      }
    ],
    rowDblClick: (e: any, row: any) =>
      this.openModal(row.getData().Id as number),

    pagination: "remote",
    paginationSize: this.viewCount,
    // footerElement: this.$refs["table-footer"], //"<i class='fa fa-trash'></i>",

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