import { Mixin } from 'vue-mixin-decorator';
import { Prop, Vue } from "vue-property-decorator";
import api from '@/lib/Api';

@Mixin
export default class BaseFormMixin extends Vue {
  model?: any = {};
  title: string = "";

  @Prop({ required: true }) apiController?: string;
  getApiController() {
    let val = this.apiController || "";
    val = val.startsWith("/") ? val : "/" + val;
    val = val.endsWith("/") ? val.substring(0, val.length - 1) : val;
    return val;
  }

  created() {
    this.$on("showModal", this.showModal)
  }

  showModal(id: number) {

    if (id <= 0) {
      this.title = "Neu erstellen";
      this.model = {};
      this.showModel();
      return;
    } else {
      this.title = "Bearbeiten";
      api.get(this.getApiController() + "/r/" + id).then(res => {
        this.model = res.data.data;
        this.showModel();
      })
    }
  }

  showModel() {
    this.$bvModal.show("modal");
  }

  validateAndSend(e: Event) {
    const form = (this.$refs["form"] as any);
    if (form.checkValidity()) {
      // update
      api.post(this.getApiController() + "/cou", this.model).then(res => {
        // console.log(res.data);
        Vue.toasted.success(res.data.message);
        this.$emit("closeModalAndReloadTable");
      });
    } else {
      e.preventDefault();
      form.classList.add("was-validated");
    }
  }
}
