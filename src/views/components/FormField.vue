<template>
  <div>
    <div class="px-3 whitespace-nowrap">
      <template v-if="config.label && !config.label.hide">
        <i :class="`align-middle w-8 text-center rounded-md p-1 right-4 fa-solid fa-${config.label.icon} cursor-pointer`"></i>
        <span class="text-sm align-middle whitespace-nowrap">{{ config.label.text }}</span>
      </template>
    </div>
    <div class="relative border rounded-full">
      <template v-if="config.type == 'file'">
        <input :id="`fileinput${name}`" class="w-full p-2 px-3 rounded-full text-xs focus:outline-none hidden cursor-pointer" type="file" :accept="fileaccept" @change="filechange" @focus="focus" @blur="blured" />
        <label :for="`fileinput${name}`" class="block w-full p-2 px-3 rounded-full text-xs focus:outline-none whitespace-nowrap cursor-pointer overflow-hidden">{{ file ? file.name : config.placeholder }}</label>
        <div v-if="file" class="absolute right-1 bottom-1/2 translate-y-1/2">
          <span class="align-middle p-0.5 rounded-full mr-0.5 hover:bg-blue-800 shadow-md transition-colors bg-blue-600" @click="previewfile">
            <i :class="`rounded-md text-center mx-auto w-6 text-sm fa-solid fa-search text-white cursor-pointer`"></i>
          </span>
          <span class="align-middle p-0.5 rounded-full hover:bg-blue-800 shadow-md transition-colors bg-blue-600" @click="removefile">
            <i :class="`rounded-md text-center mx-auto w-6 text-sm fa-solid fa-trash text-white cursor-pointer`"></i>
          </span>
        </div>
      </template>
      <template v-else>
        <input class="w-full p-2 px-3 rounded-full text-xs focus:outline-none" v-model="value" :type="inputtype" :readonly="config.type == 'select'" :placeholder="`${config.type == 'select' || config.placeholder ? (config.placeholder ? config.placeholder : 'Pilih') : ''}`" @keyup="onKeyup" @focus="focus" @blur="blured" />
        <template v-if="config.type == 'select' && focused">
          <div class="absolute left-0 top-full bg-white shadow-md border rounded-lg z-50 overflow-y-scroll" style="max-height: 100px">
            <div v-for="(item, index) in config.list" class="border-b cursor-pointer hover:bg-gray-100" :key="index" @click="change(index)">
              <span class="inline-block py-2 p-3 text-xs">{{ item }}</span>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import Request from "@/components/Request";

import { Formatter } from "@/helper";
import { mapState } from "vuex";

export default {
  emits: ["previewpdf", "previewimage"],
  props: {
    name: String,
    config: Object,
  },
  data() {
    return {
      file: null,
      preview: false,
      raw: "",
      value: "",
      focused: false,
      interval: {
        keyup: null,
      },
    };
  },
  computed: {
    ...mapState(["webApiPath", "webToken"]),

    /* url dari file yang dipilih */
    filepreviewurl() {
      return this.file ? URL.createObjectURL(this.file) : "";
    },

    /* jenis file yang akan diterima sesuai konfigurasi */
    fileaccept() {
      switch (this.config.accept) {
        case "pdf":
          return ".pdf";
        case "image":
          return ".jpg, .jpeg, .png";
        default:
          return null;
      }
    },

    /* mengambil jenis file input */
    /* beberapa konfigurasi sama jenisnya */
    inputtype() {
      switch (this.config.type) {
        case "numeric":
          return "number";
        case "password":
          return "password";
        default:
          return "text";
      }
    },
  },
  mounted() {
    /* inisiasi request komponen */
    this.Request = new Request(this.api, this.token);

    /* inisiasi perilaku input */
    switch (this.config.type) {
      case "file":
        this.config.placeholder = this.config.placeholder ? this.config.placeholder : "Upload File";
        break;
      case "currency":
        this.value = Formatter.currency(this.config.default ? this.config.default : 0);
        break;
      case "select":
        if (this.config.target) this.getList(this.config.target);
        break;
    }
  },
  methods: {
    /* mengambil daftar list untuk select */
    async getList(uri) {
      const result = await this.Request.fetch(`${this.webApiPath}/${uri}`);

      if (result.status) {
        this.config.list = result.data.list;
        if (this.config.default && result.data.list[this.config.default]) {
          this.setValue(this.config.default);
        }
      }
    },

    /* mengambil value dari state yang tersimpan */
    getValue() {
      const status = !this.config.mandatory || (this.raw && this.raw != "");
      let value = null;

      if (status) {
        switch (this.config.type) {
          case "select":
            value = parseInt(this.raw);
            break;
          default:
            value = this.raw.toString();
            break;
        }
      }

      return { status: status, value: value };
    },

    /* menyimpan value pada state */
    setValue(value) {
      this.raw = value;
      this.value = this.config.list[value];
    },

    /* untuk menangani field dengan jenis file */
    filechange(event) {
      /* mengambil file baru dari input */
      const file = event.target.files[0];

      /* mereset kembali file yang tersimpan */
      this.file = null;
      this.raw = null;

      /* apabila file tersedia */
      if (file) {
        /* membuat reader */
        const reader = new FileReader();

        /* menyimpan file */
        this.file = file;

        /* menambahkan method pada reader */
        /* untuk menyimpan hasilnya ke value */
        reader.onload = () => {
          const base64 = reader.result;
          this.raw = base64;
        };

        /* membaca file */
        reader.readAsDataURL(file);
      }
    },

    /* menangani ketikan pada input field */
    onKeyup() {
      /* menghapus interval sebelumnya */
      clearTimeout(this.interval.keyup);

      /* membuat interval dengan jeda singkat agar proses format */
      /* tidak berjalan terus menerus setiap mengetik */
      this.interval.keyup = setTimeout(() => {
        switch (this.config.type) {
          /* semua nama hanya wajib menggunakan huruf tanpa angka maupun simbol */
          /* hanya sepasi yang di perbolehkan */
          case "name":
            /* memecah string dan mengubahnya menjadi lower case */
            let raw = this.value.replace(/[^a-zA-Z\s]/g, "");
            raw = raw.toLowerCase().split(" ");

            /* menghapus value pada input */
            this.value = "";

            /* lalu menambahkan satu satu agar CamelCase */
            for (let x in raw) {
              if (this.value != "") this.value += " ";
              this.value += raw[x].charAt(0).toUpperCase() + raw[x].slice(1);
            }

            /* value digunakan juga sebagai nilai pada endpoint */
            this.raw = this.value;
            break;
          case "currency":
            this.raw = Formatter.currencyToNumber(this.value);
            this.value = Formatter.currency(this.value);
            break;
          default:
            this.raw = this.value;
        }
      }, 120);
    },

    /* untuk melihat dokumen pdf secara preview */
    previewfile() {
      if (this.config.accept) {
        switch (this.config.accept) {
          case "pdf":
            this.preview = !this.preview;
            this.$emit("previewpdf", this.file, this.filepreviewurl);
            break;
          case "image":
            this.preview = !this.preview;
            this.$emit("previewimage", this.file, this.filepreviewurl);
            break;
        }
      }
    },

    /* menghapus file input */
    removefile() {
      this.file = null;
    },

    focus() {
      this.focused = true;
    },

    change(index) {
      this.raw = index;
      this.value = this.config.list[index];
    },
    blured() {
      setTimeout(() => {
        this.focused = false;
      }, 120);
    },
  },
};
</script>
