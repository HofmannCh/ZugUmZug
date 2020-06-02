import { Mixin } from 'vue-mixin-decorator';
import { Prop, Vue } from "vue-property-decorator";
import Bus from "@/lib/Bus";
@Mixin
export default class BaseTableMixin extends Vue {
    private table?: Vue = undefined;
    private modal?: Vue = undefined;

    mounted() {
        this.table = this.$refs["table"] as Vue;
        this.modal = this.$refs["modal"] as Vue;

        this.table.$on("showModal", this.showModal);
        this.modal.$on("closeModalAndReloadTable", this.closeModalAndReloadTable);
    }

    showModal(id:number) {
        this.modal?.$emit("showModal", id);
    }

    closeModalAndReloadTable() {
        console.log("close");
        this.table?.$emit("reloadTable");
    }
}
