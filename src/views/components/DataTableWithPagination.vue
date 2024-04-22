<template>
  <div>
    <!-- Header Actions Buttons -->
    <div class="pb-3">
      <button v-for="(button, index) in config.actions.header" :key="index" :class="`inline-block mr-2 py-1 px-2 text-white rounded-xl bg-${button.color} shadow-md cursor-pointer`" @click="action(button.action)">
        <i :class="`align-middle rounded-md p-1 right-4 fa-solid fa-${button.label.icon} text-white cursor-pointer`"></i>
        <span class="align-middle ml-1 pr-1">{{ button.label.text }}</span>
      </button>
    </div>

    <!-- Search Input -->
    <div class="grid grid-cols-3 grid-gap-1 bg-white mb-3 rounded-md shadow-md">
      <div class="grid col-span-2 grid-cols-2">
        <div class="flex items-center pl-4">{{ title }}</div>
      </div>
      <div class="relative">
        <input v-model="search.value" type="text" id="search" class="w-full p-3 rounded-tl-none rounded-bl-none rounded-md shadow-sm bg-blue-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Pencarian" />
        <i class="absolute right-4 bottom-1/2 translate-y-1/2 fa-solid fa-search"></i>
      </div>
    </div>

    <!-- DataTable Component -->
    <DataTable :config="config" :rows="rows" @action="action" />

    <!-- Pagination Info -->
    <div class="flex justify-around items-start items-center mt-3 bg-white shadow-md px-3 rounded-md">
      <div class="w-1/2 align-middle">Baris {{ rows.length }} dari {{ Object.values(data).length }}</div>
      <div class="w-1/2 py-2 text-right align-middle">
        <span v-if="page.position > 0" @click="previous" class="p-1 border rounded-xl mx-1"><i class="fa-solid fa-arrow-left"></i></span>
        <span class="px-3 py-1 border rounded-xl mx-1">{{ page.position + 1 }}</span>
        <span v-if="data.length / page.rows > page.position + 1" @click="next" class="p-1 border rounded-xl mx-1"><i class="fa-solid fa-arrow-right"></i></span>
      </div>
    </div>

    <!-- ScreenAlert Component -->
    <ScreenAlert ref="ScreenAlert"></ScreenAlert>
  </div>
</template>

<script>
import Request from "@/components/Request";
import DataTable from "./DataTable.vue";
import ScreenAlert from "./ScreenAlert.vue";

export default {
  components: {
    DataTable,
    ScreenAlert,
  },
  props: {
    title: String,
    config: Object,
    target: String,
    token: String,
  },
  data() {
    return {
      data: {}, // Array to store fetched data rows
      page: {
        position: 0,
        rows: 25,
      },
      search: {
        value: "",
      },
      Request: new Request(), // Instance of Request component for API calls
    };
  },
  methods: {
    async fetch() {
      try {
        this.$refs.ScreenAlert.show("Memuat Data", "blue-500", null, true);
        const { status, data } = await this.Request.fetch(this.target, this.token ? this.token : null);
        if (status) {
          this.data = data.rows; // Store fetched data rows
          this.$refs.ScreenAlert.show("Berhasil Memuat Data", "green-600", 1000);
        } else {
          this.$refs.ScreenAlert.show("Gagal Memuat Data", "red-600", 2000);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        this.$refs.ScreenAlert.show("Gagal Memuat Data", "red-600", 2000);
      }
    },
    previous() {
      this.page.position--;
    },
    next() {
      this.page.position++;
    },
    filter(raw) {
      let filtered = {};

      for (let x in raw) {
        if (raw.hasOwnProperty(x)) {
          if (!this.search.value) filtered[x] = raw[x];
          else {
            for (let y in raw[x]) {
              if (raw[x].hasOwnProperty(y)) {
                if (raw[x][y] && raw[x][y].toString().toLowerCase().includes(this.search.value.toLowerCase())) {
                  filtered[x] = raw[x];
                  break;
                }
              }
            }
          }
        }
      }

      return filtered;
    },
    action(action, id) {
      this.$emit("action", action, id);
    },
  },
  computed: {
    rows() {
      const filteredData = this.filter(this.data);
      const filteredDataArray = Object.entries(filteredData);

      // Calculate start and end indices based on pagination
      const start = this.page.position * this.page.rows;
      const end = start + this.page.rows;

      // Slice the array of [key, value] pairs
      const slicedData = filteredDataArray.slice(start, end);

      // Extract the values while preserving the keys
      const slicedDataWithKeys = slicedData.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {}); // Paginate filtered data

      return slicedDataWithKeys;
    },
  },
  mounted() {
    this.fetch(); // Fetch data on component mount
  },
};
</script>
