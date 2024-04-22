<template>
  <div :class="`fixed p-1 px-4 right-1/2 translate-x-1/2 shadow-xl rounded-full text-sm text-center text-white bg-${backgroundColor} z-100 transition-all`" :style="style">
    <span><i v-if="loading" class="fa-solid fa-spinner animate-spin mr-1"></i></span><span class="whitespace-nowrap">{{ text }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      text: "",
      hide: true,
      color: "red",
      timeout: null,
      screen: {
        width: null,
      },
    };
  },

  created() {
    window.addEventListener("resize", this.resize);
  },
  destroyed() {
    window.removeEventListener("resize", this.resize);
  },

  computed: {
    style() {
      if (this.smallscreen) return this.hide ? "bottom: calc(100% + 10px); transition: ease 1s bottom" : "bottom: calc(100% - 150px); transition: ease .5s bottom";
      return this.hide ? "bottom: -100px; transition: ease 1s bottom" : "bottom: 100px; transition: ease .5s bottom";
    },
    smallscreen() {
      if (!this.screen.width) this.screen.width = window.innerWidth
      return this.screen.width < 650;
    },
    backgroundColor() {
      return this.color;
    },
  },
  methods: {
    show(text, color, time, loading) {
      clearTimeout(this.timeout);

      if (loading) this.loading = true;
      else this.loading = false;

      this.text = text;
      this.hide = false;
      if (color) this.color = color;

      if (time)
        this.timeout = setTimeout(() => {
          this.hide = true;
        }, 3000);
    },
    toggle() {
      this.hide = !this.hide;
    },
    resize() {
      this.screen.width = window.innerWidth;
    },
  },
};
</script>
