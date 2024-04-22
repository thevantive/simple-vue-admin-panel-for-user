<template>
  <div>
    <div class="fixed w-full h-full top-0 left-0 bg-black opacity-25 z-50" @click="close()"></div>
    <div class="fixed bottom-1/2 translate-y-1/2 right-1/2 translate-x-1/2 z-50" :style="`min-width: ${config.minwidth}px`">
      <div class="relative p-6 bg-white rounded-2xl">
        <div class="mb-4">
          <div class="absolute top-2 right-2" @click="close()">
            <i :class="`align-middle w-8 rounded-md p-1 fa-solid fa-xmark text-2xl cursor-pointer`"></i>
          </div>
          <div class="px-2">
            <div class="font-bold text-xl">{{ config.title.description }}</div>
            <div class="text-md leading-4">{{ config.title.text }}</div>
          </div>
        </div>
        <DataTable class="border" :columns="config.columns" :actions="config.actions" :rows="rows" @action="action" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DataTable from "../DataTable.vue";

export default {
  emits: ["close", "action"],
  components: {
    DataTable,
  },
  props: {
    id: String,
    config: Object,
  },
  data() {
    return {
      rows: {},
    };
  },
  computed: {
    ...mapState(["api", "token"]),
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const headers = {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        };
        const res = await fetch(`${this.api}/${this.config.target}`, { headers });

        if (res.status === 401) {
          this.$store.commit("clearToken");
          this.$router.push("/masuk");
          return;
        }

        const data = await res.json();
        this.rows = data.rows;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    close() {
      this.$emit("close");
    },
    action(action, id, params) {
      switch (action) {
        default:
          this.$emit("action", action, id, params);
      }
    },
  },
};
</script>
