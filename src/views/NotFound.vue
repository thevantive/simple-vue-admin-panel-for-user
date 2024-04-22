<template>
  <div>
    <Header></Header>
    <div class="fixed bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2">
      <div class="text-center bg-white p-4 px-8 rounded-lg shadow-md">
        <div class="text-xl whitespace-nowrap">Halaman Ini Tidak Tersedia</div>
        <div class="text-sm whitespace-nowrap font-">Mohon Kunjungi Halaman Lain</div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/views/components/Header.vue'

export default {
  components: {
    Header
  }
}
</script>
