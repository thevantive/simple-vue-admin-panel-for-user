<template>
  <div class="pt-10">
    <Header></Header>
    <div>
      <DataTableWithPagination ref="Table" title="Daftar Akun" :config="UserTableSettings" :target="`${webApiPath}/users`" :token="webToken" @action="action" />
      <DialogueForm v-if="visibility.form.usercreate" ref="UserCreateForm" :config="UserCreateFormSettings" :action="action" @close="action('toggle-user-create-form')" @submit="createUserFormSubmit"></DialogueForm>
      <DialogueForm v-if="visibility.form.userupdate" ref="UserUpdateForm" :config="UserUpdateFormSettings" :action="action" @close="action('toggle-user-update-form')" @submit="userUpdateFormSubmit"></DialogueForm>
      <DialogueForm v-if="visibility.form.userdelete" ref="UserDeleteForm" :config="UserDeleteFormSettings" :action="action" @close="action('toggle-user-removal-form')" @submit="userDeleteFormSubmit"></DialogueForm>
    </div>
    <ScreenAlert ref="ScreenAlert"></ScreenAlert>
  </div>
</template>

<script>
import Header from "@/views/components/Header.vue";
import DataTableWithPagination from "./components/DataTableWithPagination.vue";
import DialogueForm from "./components/dialogue/Form.vue";
import ScreenAlert from "./components/ScreenAlert.vue";

import { mapState } from "vuex";
import { UserTableSettings } from "@/components/tables/User";
import { UserCreateFormSettings, UserUpdateFormSettings, UserDeleteFormSettings } from "@/components/forms/User";
import Request from "@/components/Request";

export default {
  components: {
    Header,
    ScreenAlert,
    DialogueForm,
    DataTableWithPagination,
    Request,
  },
  data() {
    return {
      visibility: {
        form: {
          usercreate: false,
          userupdate: false,
        },
      },
      Request: new Request(),
    };
  },
  methods: {
    action(action, id, params) {
      switch (action) {
        case "toggle-user-create-form":
          this.visibility.form.usercreate = !this.visibility.form.usercreate;
          break;
        case "toggle-user-removal-form":
          this.id = id;
          this.visibility.form.userdelete = !this.visibility.form.userdelete;
          if (this.visibility.form.userdelete)
            this.$nextTick(() => {
              this.$refs.UserDeleteForm.setFieldValue("user_id", id);
            });
          break;
        case "toggle-user-update-form":
          this.id = id;
          this.visibility.form.userupdate = !this.visibility.form.userupdate;
          if (this.visibility.form.userupdate)
            this.$nextTick(() => {
              this.$refs.UserUpdateForm.setFieldValue("user_id", id);
              this.$refs.UserUpdateForm.setFieldValue("level", this.$refs.Table.data[id].level);
              this.$refs.UserUpdateForm.setFieldValue("fullname", this.$refs.Table.data[id].fullname);
              this.$refs.UserUpdateForm.setFieldValue("username", this.$refs.Table.data[id].username);
              this.$refs.UserUpdateForm.setFieldValue("email", this.$refs.Table.data[id].email);
            });
          break;
        default:
          this.$refs.ScreenAlert.show(`Handler Tidak Ditemukan Untuk Aksi: ${action}`, "red-600", 2000);
      }
    },

    async userDeleteFormSubmit(values, callback) {
      const { status, data } = await this.Request.delete(`${this.webApiPath}/user/${values.user_id}`, this.webToken);

      if (status) {
        this.visibility.form.userdelete = false;
        this.$refs.ScreenAlert.show("Berhasil Menghapus Pengguna", "green-600", 2000);
        await this.$refs.Table.fetch();
      } else {
        callback(data.meta.message, "red-600", 2000);
      }
    },

    async userUpdateFormSubmit(values, callback) {
      let diff = values.password != "";
      let compare = this.$refs.Table.data[values.user_id];

      if (!diff)
        for (let x in values) {
          if (values.hasOwnProperty(x) && compare[x] && values[x]) {
            diff = compare[x] != values[x];
            if (diff) break;
          }
        }

      if (diff) {
        const { status, data } = await this.Request.patch(`${this.webApiPath}/user/${values.user_id}`, values, this.webToken);

        if (status) {
          this.visibility.form.userupdate = false;
          this.$refs.ScreenAlert.show("Berhasil Memperbaharui Pengguna", "green-600", 2000);
          await this.$refs.Table.fetch();
        } else {
          callback(data.meta.message, "red-600", 2000);
        }
      } else {
        callback("Tidak Ada Perubahan", "red-600", 2000);
        this.$refs.ScreenAlert.show("Tidak Ada Perubahan", "red-600", 2000);
      }
    },

    async createUserFormSubmit(values, callback) {
      const { status, data } = await this.Request.post(`${this.webApiPath}/user/registration`, values, this.webToken);

      if (status) {
        this.visibility.form.usercreate = false;
        this.$refs.ScreenAlert.show("Berhasil Membuat Pengguna Baru", "green-600", 2000);
        await this.$refs.Table.fetch();
      } else {
        callback(data.meta.message, "red-600", 2000);
      }
    },
  },

  computed: {
    ...mapState(["webApiPath", "webToken"]),

    UserCreateFormSettings() {
      return UserCreateFormSettings;
    },

    UserUpdateFormSettings() {
      return UserUpdateFormSettings;
    },

    UserDeleteFormSettings() {
      return UserDeleteFormSettings;
    },

    UserTableSettings() {
      return UserTableSettings;
    },
  },
};
</script>
