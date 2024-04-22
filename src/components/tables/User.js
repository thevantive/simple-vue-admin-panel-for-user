export const UserTableSettings = {
  columns: {
    created_at: { label: "Tanggal Pembuatan", type: "date" },
    fullname: { label: "Nama Lengkap" },
    username: { label: "Nama Pengguna" },
    email: { label: "Email" },
    level: { label: "Level", type: "alias", aliased: {
      "1": "Super Admin",
      "2": "Admin",
      "3": "Pengguna"
    }},
    last_login_at: { label: "Terakhir Masuk Pada", type: "datetime" },
  },
  actions: {
    header: [
      {
        label: {
          text: "Buat Akun Baru",
          icon: "pencil",
        },
        color: "green-600",
        action: "toggle-user-create-form",
      },
    ],
    row: [
      {
        label: {
          text: "Perbaharui",
          icon: "pencil",
        },
        action: "toggle-user-update-form",
      },
      {
        label: {
          text: "Hapus",
          icon: "trash",
        },
        action: "toggle-user-removal-form",
      }
    ]
  }}