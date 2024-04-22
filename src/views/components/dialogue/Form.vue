<template>
  <div>
    <div class="fixed w-full h-full top-0 left-0 bg-black opacity-25 z-50" @click="close()"></div>
    <div class="fixed bottom-1/2 translate-y-1/2 right-1/2 translate-x-1/2 z-50" :style="`min-width: ${config.minwidth}px`">
      <div class="relative p-6 bg-white rounded-2xl">
        <div class="absolute top-2 right-2" @click="close()">
          <i :class="`align-middle w-8 rounded-md p-1 fa-solid fa-xmark text-2xl cursor-pointer`"></i>
        </div>
        <div class="px-2">
          <div class="font-bold text-xl">{{ config.title.description }}</div>
          <div class="text-md leading-4">{{ config.title.text }}</div>
        </div>
        <form :class="`pt-5`" @submit.prevent="submit()">
          <div>
            <div v-for="(group, index) in config.fields" :class="`mb-7 ${config.grid ? 'grid grid-cols-' + config.grid + ' gap-4' : ''}`" :key="index">
              <div v-for="(field, name) in group" :key="name">
                <FormField v-if="field.type == 'file'" :name="name" :config="field" :ref="`field-${name}`" @previewpdf="previewpdf" @previewimage="previewimage"></FormField>
                <FormField v-else :name="name" :config="field" :ref="`field-${name}`"></FormField>
              </div>
            </div>
          </div>
          <div class="align-middle text-center text-white">
            <span v-for="(button, index) in config.buttons" :class="`bg-${button.color} mr-2 p-1 px-2 rounded-xl cursor-pointer`" :key="index" @click="action(button.action)">
              <i :class="`align-middle rounded-md p-1 right-4 fa-solid fa-${button.icon} cursor-pointer`"></i>
              <span class="align-middle ml-1 pr-1 text-sm">{{ button.text }}</span>
            </span>
          </div>
        </form>
      </div>
    </div>
    <ScreenAlert ref="ScreenAlert"></ScreenAlert>
  </div>
</template>

<script>
import { mapState } from "vuex";
import FormField from "../FormField.vue";
import ScreenAlert from "../ScreenAlert.vue";

export default {
  emits: ["submit", "close", "action"],
  components: {
    FormField,
    ScreenAlert,
  },
  data() {
    return {
      visibility: {
        preview: {
          pdf: false,
        },
      },
      file: null,
      fields: {},
    };
  },
  props: {
    id: String,
    config: Object,
  },
  computed: {
    ...mapState(["token", "api"]),
  },
  methods: {
    action(action) {
      switch (action) {
        case "submit":
          this.submit();
          break;
        case "close":
          this.close();
          break;
        default:
          this.$emit("action", action, this.id, this.getValues());
      }
    },
    close() {
      this.$emit("close");
    },
    setFieldValue(name, value) {
      let ref = this.$refs[`field-${name}`][0];
      ref.config.default = value;
      ref.raw = value;
      ref.value = ref.config.list && ref.config.list[value] ? ref.config.list[value] : value;
    },
    previewpdf(file, url) {
      this.$refs.ScreenPDFPreview.open(file, url);
    },
    previewimage(file, url) {
      this.$refs.ScreenImagePreview.open(file, url);
    },
    getValues() {
      let values = {};
      let status = true;
      let message;

      /* memecah daftar field sesuai konfigurasi */
      for (let x = 0; x < this.config.fields.length; x++) {
        for (let y in this.config.fields[x]) {
          /* memeriksa dan memastikan field tersedia */
          if (this.$refs[`field-${y}`]) {
            (() => {
              const result = this.$refs[`field-${y}`][0].getValue();
              values[y] = result.value;
              status = result.status;
            })();
          }

          /* apabila salah satu field kebutuhannya tidak terpenuhi */
          if (!status) {
            message = this.config.fields[x][y].label.text;
            message = `${message} Tidak Boleh Kosong`;
            break;
          }
        }

        /* loop utama juga akan diberhentikan apabila status false */
        if (!status) break;
      }

      /* apabila status true maka values akan di return */
      if (status) return values;

      /* memberikan log error karena kebutuh form tidak dipenuhi */
      this.$refs.ScreenAlert.show(`${message}`, "red-600", 2000);
      return null;
    },
    submit() {
      let values = this.getValues();

      /* melanjutkan submit apabila seluruh field terpenuhi */
      if (values) {
        this.$refs.ScreenAlert.show("Mengirim Data, Mohon Tunggu..", "blue-600");
        this.$emit("submit", values, (message, color, time) => {
          this.$refs.ScreenAlert.show(message, color, time);
        });
      }
    },
  },
};
</script>
