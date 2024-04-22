<template>
  <div class="fixed w-full top-0 left-0 z-50 bg-white shadow-sm select-none">
    <div :class="`${!smallscreen ? 'flex justify-between max-w-8xl mx-auto px-8' : 'flex justify-between w-full px-0 pr-1'}`">
      <div class="py-2 pl-3 cursor-pointer" @click="navigate('beranda')">
        <div class="text-lg font-bold leading-5">QTI CRUD TEST</div>
        <div class="text-xs">By Irvan Hilmi</div>
      </div>
      <div class="flex items-center">
        <template v-if="!smallscreen">
          <div v-for="(category, index) in menu" :key="index" class="relative p-1 py-4 mr-6 text-sm cursor-pointer" @click="toggleMenu(index)">
            <div>
              <span class="mr-1 font-bold">{{ category.label }}</span>
              <i class="fa-solid fa-chevron-down text-xs align-middle"></i>
            </div>
            <div v-if="menu[index].visible" class="absolute top-full right-0 bg-white shadow-lg rounded-b-md overflow-hidden">
              <div v-for="(item, index) in category.items" :key="index" class="relative p-2 px-4 hover:bg-gray-100 whitespace-nowrap" @click="navigate(item.route)">
                <span class="mr-2 pr-5 whitespace-nowrap">{{ item.label }}</span>
                <i :class="`absolute bottom-1/2 translate-y-1/2 right-3 w-5 text-center fa-solid ${item.icon} text-sm align-middle`"></i>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="rounded-full text-center p-1 px-2.5" @click="toggleMenu(null)">
            <i class="fa-solid fa-bars text-xl align-middle text-gray-800"></i>
          </div>
          <div v-if="visibility.menu" class="absolute top-full pb-2 right-0 bg-white rounded-b-xl shadow-xl">
            <div v-for="(category, index) in menu" :key="index" class="cursor-pointer mt-2" @click="toggleMenu(index)">
              <div class="font-bold p-1 px-3 text-sm">{{ category.label }}</div>
              <div class="py-0">
                <div v-for="(item, index) in category.items" :key="index" :class="`relative py-1 px-3 whitespace-nowrap ${Object.keys(category.items).pop() != index ? 'border-b' : ''}`" @click="navigate(item.route)">
                  <span class="mr-2 pr-5 whitespace-nowrap text-sm">{{ item.label }}</span>
                  <i :class="`absolute bottom-1/2 translate-y-1/2 right-3 w-5 text-center fa-solid ${item.icon} text-xl align-middle`"></i>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-if="identity">
          <div class="rounded-full text-center align-middle px-2.5 cursor-pointer" @click="toggleProfile">
            <i class="inline-block fa-solid fa-user-circle text-2xl align-middle text-gray-800"></i>
            <span v-if="!smallscreen" class="inline-block ml-2 text-sm align-middle text-gray-800">{{ identity.fullname }}</span>
          </div>
          <template v-if="visibility.profile">
            <div :class="`absolute top-full translate-y-2 right-2 bg-white p-3 rounded-xl shadow-md`" style="max-width: 300px">
              <div class="px-2">
                <div class="mb-2">
                  <div class="text-xs whitespace-nowrap">ID Pengguna</div>
                  <div class="text-sm font-bold">{{ identity.username }}</div>
                </div>
                <div class="mb-2">
                  <div class="text-xs whitespace-nowrap">Nama Lengkap</div>
                  <div class="text-sm font-bold">{{ identity.fullname }}</div>
                </div>
                <div class="mb-2">
                  <div class="text-xs whitespace-nowrap">Email</div>
                  <div class="text-sm font-bold">{{ identity.email }}</div>
                </div>
                <div class="mb-2">
                  <div class="text-xs whitespace-nowrap">Level</div>
                  <div class="text-sm font-bold">{{ identity.level == 1 ? "Super Admin" : identity.level == 2 ? "Admin" : "Pengguna" }}</div>
                </div>
              </div>
              <div class="pt-0">
                <button :class="`m-1 px-1 py-0.5 text-white rounded-xl bg-red-600 shadow-md cursor-pointer`" @click="navigate('keluar')">
                  <i :class="`align-middle rounded-md p-1 right-4 fa-solid fa-power-off text-md text-white cursor-pointer`"></i>
                  <span class="align-middle ml-1 pr-1 text-sm">Keluar</span>
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      visibility: {
        profile: false,
        menu: false,
      },
      screen: {
        width: window.innerWidth,
      },
      menu: {},
      identity: {},
    };
  },

  computed: {
    ...mapState(["userIdentity", "webToken"]),

    smallscreen() {
      return this.screen.width < 700;
    },
  },

  mounted() {
    console.log(this.userIdentity);
    /* apabila user identity atau token tidak tersedia */
    /* maka akan langsung dialihkan */
    if (!this.userIdentity) {
      this.$router.push(["/masuk"]);
    }

    /* mengambil identitas */
    this.identity = this.userIdentity;

    /* menambahkan handler untuk resize window */
    window.addEventListener("resize", this.handleResize);
  },

  created() {
    /* menambahkan handler untuk resize window */
    window.addEventListener("resize", this.handleResize);
  },

  destroyed() {
    /* menambahkan handler untuk resize window */
    window.removeEventListener("resize", this.handleResize);
  },

  methods: {
    toggleMenu(index) {
      if (index) {
        for (let key in this.menu) {
          if (this.menu.hasOwnProperty(key)) {
            this.menu[key].visible = key == index;
          }
        }
      } else {
        this.visibility.menu = !this.visibility.menu;
      }
      this.visibility.profile = false;
    },
    toggleProfile() {
      this.visibility.profile = !this.visibility.profile;
      if (this.visibility.profile) {
        this.visibility.menu = false;
      }
    },
    navigate(path) {
      this.$router.push(path);
    },
    handleResize() {
      this.screen.width = window.innerWidth;
    },
  },
};
</script>
