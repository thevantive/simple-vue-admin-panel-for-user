<template>
  <div class="fixed w-full h-full top-0 left-0 bg-black z-50 opacity-25" @click="close"></div>
  <div class="fixed w-2/3 p-5 px-6 bottom-1/2 right-1/2 translate-y-1/2 translate-x-1/2 bg-white z-50 rounded-xl">
    <div class="pb-5">
      <div class="text-xl">Detail Produk Aset</div>
      <div>{{ `${asset_product.product_type_name} ${asset_product.product_name} - ${asset_product.serial_number}` }}</div>
    </div>
    <div class="mb-3">
      <div class="mb-1 text-lg">Dokumentasi Produk</div>
      <div class="grid grid-cols-3 p-3 gap-1 border rounded-xl">
        <img class="width-full" src="https://picsum.photos/400/300" alt="" @click="preview('https://picsum.photos/400/300')" />
        <img class="width-full" src="https://picsum.photos/400/300" alt="" @click="preview('https://picsum.photos/400/300')" />
      </div>
    </div>
    <div>
      <div class="mb-1 text-lg">Informasi Dasar</div>
      <div class="grid grid-cols-3 p-3 gap-x-5 gap-y-2 border rounded-xl">
        <div v-for="(column, x) in columns" :key="x">
          <template v-if="!(asset_product.user_name == 'n/a' && (x == 'user_since' || x == 'user_name'))">
            <div class="text-sm whitespace-nowrap">{{ column.label }}</div>
            <div class="text-r whitespace-nowrap font-bold">{{ format(asset_product[x], column) }}</div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <template v-if="imagepreviewurl">
    <div class="fixed w-full h-full top-0 left-0 bg-black z-60 opacity-25" @click="preview(null)"></div>
    <div class="fixed bottom-1/2 right-1/2 translate-y-1/2 translate-x-1/2 top-0 left-0 z-60">
      <img class="block h-full mx-auto" :src="imagepreviewurl" alt="" />
    </div>
  </template>
</template>

<script>
import { Formatter } from '@/helper'
import { mapState } from 'vuex'

export default {
  emits: ['close'],
  props: {
    columns: Object,
    asset_product: Object
  },
  data() {
    return {
      imagepreviewurl: null
    }
  },
  computed: {
    ...mapState(['api', 'token'])
  },
  methods: {
    format(value, column) {
      switch (column.type) {
        case 'date':
          value = Formatter.date(value)
          break
        case 'datetime':
          value = Formatter.datetime(value)
          break
      }
      return value
    },
    preview(url) {
      this.imagepreviewurl = url
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
