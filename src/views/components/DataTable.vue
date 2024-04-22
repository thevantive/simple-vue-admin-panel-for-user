<template>
  <div class="p-2 px-3 bg-white rounded-md shadow-md">
    <div>
      <table class="w-full">
        <thead>
          <tr>
            <th v-for="column in visibleColumns" :key="column.id" class="p-1 pb-5 text-left">
              <span class="text-sm">{{ column.label }}</span>
            </th>
            <th v-if="this.config.actions && this.config.actions.row" class="relative w-0"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(key, y) in Object.keys(rows)" :key="y" :class="`hover:bg-gray-100 ${parseInt(y) !== length(rows) ? 'border-b' : ''} ${focusrowactions[key] ? 'bg-gray-200' : ''}`">
            <td v-for="(column, x) in visibleColumns" :key="x">
              <div :class="`${column.type == 'statuses' ? statuses(rows[key][x], column) : ''} p-1 text-sm`">{{ format(rows[key][x], column) }}</div>
            </td>
            <td v-if="config.actions.row" class="relative w-0 p-2">
              <button :class="`px-2 ${focusrowactions[key] ? 'text-gray-600' : 'text-gray-300 hover:text-gray-600'}`" @click="focusaction(key)">
                <i class="fa-solid fa-ellipsis"></i>
              </button>
              <div v-if="focusrowactions[key]" :class="`absolute rounded-xl shadow-md ${y + 1 > length(rows) / 2 ? 'bottom-1' : 'top-1'} border right-full z-10 overflow-hidden`">
                <div v-for="(action, x) in config.actions.row" :key="x" class="bg-gray-100 hover:bg-gray-300" @click="handle(action.action, key)">
                  <button v-if="visible(rows[key], action.condition)" :class="`py-2 px-3 w-full flex items-center ${x !== config.actions.length - 1 ? 'border-b' : ''}`">
                    <i :class="`fa-solid w-5 fa-${action.label.icon}`"></i>
                    <div class="ml-2 text-xs whitespace-nowrap">{{ action.label.text }}</div>
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="length(rows) == 0">
            <td>
              <div class="p-1 text-sm">Data Tidak Tersedia</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { Formatter } from "@/helper";
export default {
  props: {
    config: Object,
    rows: Object,
  },
  data() {
    return {
      focusrowactions: [],
    };
  },
  mounted() {
    document.addEventListener(
      "click",
      function () {
        for (let x in this.focusrowactions) {
          this.focusrowactions[x] = false;
        }
      }.bind(this)
    );
  },
  computed: {
    visibleColumns() {
      let columns = {};

      for (let x in this.config.columns) {
        if (this.config.columns.hasOwnProperty(x) && !this.config.columns[x].hide) {
          columns[x] = this.config.columns[x];
        }
      }

      return columns;
    },
  },
  methods: {
    length(raw) {
      return Object.values(raw).length;
    },
    focusaction(y) {
      setTimeout(() => {
        if (y) this.focusrowactions[y] = true;
      }, 100);
    },
    statuses(value, column) {
      return `inline-block px-3 rounded-xl bg-${column.colors[value].bg}-500 text-${column.colors[value].tx}`;
    },
    format(value, column) {
      switch (column.type) {
        case "alias":
          value = column.aliased && column.aliased[value] ? column.aliased[value] : "Tidak Diketahui";
          break;
        case "date":
          value = value ? Formatter.date(value) : "n/a";
          break;
        case "datetime":
          value = Formatter.datetime(value);
          break;
        case "currency":
          if (value && value != "") {
            let str = value.toString().split("").reverse();
            let res = [];

            for (let x = 0; x < str.length; x++) {
              res[res.length] = x % 3 == 0 && x != str.length - 1 ? `${str[x]}.` : `${x}`;
            }

            value = `Rp ${res.reverse().join("")}`;
          } else {
            value = `Rp 0`;
          }
          break;
      }

      if (column.suffix) value = `${value} ${column.suffix}`;

      return value;
    },
    visible(row, conditions) {
      if (!conditions) return true;
      let result = true;

      for (let x in conditions) {
        if (conditions.hasOwnProperty(x)) {
          (() => {
            const condition = conditions[x];
            const value = row[condition.column];

            if (row[condition.column]) {
              switch (condition.type) {
                case "not":
                  result = value != condition.value;
                  break;
                default:
                  result = value == condition.value;
                  break;
              }
            }
          })();

          if (!result) break;
        }
      }

      return result;
    },
    handle(action, id) {
      this.$emit("action", action, id);
    },
  },
};
</script>
