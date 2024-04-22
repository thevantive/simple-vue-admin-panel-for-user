<template>
  <div>
    <div class="fixed w-full h-full bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 bg-black opacity-50"></div>
    <div class="fixed bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 w-min-400 sm:w-min-350">
      <div class="w-full rounded-lg p-2">
        <div class="mb-5 p-3 rounded-lg shadow-md bg-blue-600 text-white text-center">
          <div class="font-bold text-2xl">QTI CRUD API</div>
          <div class="text-xs">Menggunakan Python FastAPI & Vue</div>
        </div>
        <div class="mb-5 pt-5 p-5 bg-white rounded-lg shadow-md">
          <div class="relative mb-4 text-center">
            <div class="absolute w-full bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 border-4 rounded-full"></div>
            <span class="relative text-lg bg-white px-5 font-bold text-gray-600">Masuk</span>
          </div>
          <form @submit.prevent="signin">
            <div>
              <input class="w-full border p-3 px-4 text-sm rounded-lg shadow-xs mb-2" type="text" v-model="input.username" placeholder="Email atau Nama Pengguna" />
            </div>
            <div>
              <input class="w-full border p-3 px-4 text-sm rounded-lg shadow-xs" type="password" v-model="input.password" placeholder="Kata Sandi" />
            </div>
            <div class="mt-5">
              <button class="p-1 px-4 rounded-md text-white bg-green-600" type="submit">
                <i class="fa-solid align-middle fa-arrow-right-to-bracket text-sm align-middle mr-2"></i>
                <span class="align-middle">Masuk</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="fixed bottom-1 right-1/2 translate-x-1/2 opacity-35 whitespace-nowrap align-middle">
      <i class="inline-block fa-regular align-middle fa-copyright text-lg align-middle mr-2"></i>
      <span class="inline-block align-middle text-xs whitespace-nowrap">QTI CRUD API by <b>Irvan Hilmi</b></span>
    </div>

    <ScreenAlert ref="ScreenAlert"></ScreenAlert>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ScreenAlert from "./components/ScreenAlert.vue";

export default {
  components: {
    ScreenAlert,
  },
  data() {
    return {
      input: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions(["login"]),
    async signin() {
      const [username, password] = [this.input.username, this.input.password];

      if (username !== "" && password !== "") {
        try {
          /* memberi notifikasi proses pada user */
          this.$refs.ScreenAlert.show("Mohon tunggu", "blue-600", null, true);

          /* mengirimkan */
          const { status, message } = await this.login({ username, password });

          /* apabila login berhasil maka akan diarahkan ke beranda */
          if (status) {
            /* membuat alert berhasil login */
            this.$refs.ScreenAlert.show("Berhasil Masuk, Mengalihkan..", "green-600", 500, true);

            /* menunggu alert selesai */
            setTimeout(() => {
              this.$router.push("/beranda");
            }, 1200);
          } else this.$refs.ScreenAlert.show(message, "red-600", 2000);
        } catch (error) {
          /* apabila terjadi error  */
          console.log(error);
          this.$refs.ScreenAlert.show("Terjadi kesalahan pada server", "red-600", 2000);
        }
      } else {
        this.$refs.ScreenAlert.show("Mohon isi terlebih dahulu", "red-600", 2000);
      }
    },
    async submitForm() {
      await this.signin();
    },
    navigate(path) {
      this.$router.push(`${path}`);
    },
  },
};
</script>
