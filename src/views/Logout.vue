<template></template>

<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions(['logout'])
  },
  mounted() {
    this.logout().then(() => {
      this.$router.push('/masuk')
    })
  }
}
</script>
