export const UserCreateFormSettings = {
  minwidth: 600,
  action: 'submitusercreate',
  submit: {
    target: 'user/create'
  },
  grid: 2,
  title: {
    text: 'Membuat Pengguna baru',
    description: 'QTI CRUD API'
  },
  fields: [
    {
      fullname: {
        mandatory: true,
        label: {
          icon: 'user',
          text: 'Nama Lengkap'
        },
        type: 'name',
      },
      email: {
        mandatory: true,
        label: {
          icon: 'user',
          text: 'Email'
        },
        type: 'email',
      },
      username: {
        mandatory: true,
        label: {
          icon: 'user',
          text: 'ID Pengguna'
        },
        type: 'text',
      },
      password: {
        mandatory: true,
        label: {
          icon: 'user',
          text: 'Kata Sandi'
        },
        type: 'password',
      },
      level: {
        mandatory: true,
        label: {
          icon: 'user',
          text: 'Level'
        },
        type: 'select',
        list: {
          1: "Super Admin",
          2: "Admin",
          3: "Pengguna"
        }
      }
    }
  ],
  buttons: {
    submit: {
      icon: 'check',
      text: 'Simpan',
      color: 'green-600',
      action: 'submit'
    },
    cancel: {
      icon: 'x',
      text: 'Kembali',
      color: 'red-600',
      action: 'close'
    }
  }
}
export const UserUpdateFormSettings = {
  minwidth: 600,
  action: 'submituserlevelchange',
  grid: 2,
  title: {
    text: 'Memperbaharui Pengguna',
    description: 'QTI CRUD TEST'
  },
  fields: [
    {
      user_id: {
        mandatory: true,
        label: {
          icon: 'user',
          text: 'Pilih Pengguna'
        },
        type: 'select',
        target: `users/list`,
        list: {}
      },
      fullname: {
        mandatory: true,
        label: {
          icon: 'user',
          text: 'Nama Lengkap'
        },
        type: 'name',
      },
      username: {
        mandatory: true,
        label: {
          icon: 'user',
          text: 'ID Pengguna'
        },
        type: 'text',
      },
      email: {
        mandatory: true,
        label: {
          icon: 'user',
          text: 'Email'
        },
        type: 'email',
      },
      password: {
        label: {
          icon: 'user',
          text: 'Kata Sandi Baru'
        },
        type: 'password',
      },
      level: {
        mandatory: true,
        label: {
          icon: 'person',
          text: 'Level'
        },
        type: 'select',
        list: {
          1: "Super Admin",
          2: "Admin",
          3: "Pengguna"
        }
      }
    }
  ],
  buttons: {
    submit: {
      icon: 'check',
      text: 'Simpan',
      color: 'green-600',
      action: 'submit'
    },
    cancel: {
      icon: 'x',
      text: 'Kembali',
      color: 'red-600',
      action: 'close'
    }
  }
}
export const UserDeleteFormSettings = {
  minwidth: 300,
  grid: 1,
  title: {
    text: 'Menghapus Pengguna',
    description: 'QTI CRUD TEST'
  },
  fields: [
    {
      user_id: {
        mandatory: true,
        label: {
          icon: 'user',
          text: 'Pilih Pengguna'
        },
        type: 'select',
        target: `users/list`,
        list: {}
      },
    }
  ],
  buttons: {
    submit: {
      icon: 'check',
      text: 'Hapus',
      color: 'red-600',
      action: 'submit'
    },
    cancel: {
      icon: 'x',
      text: 'Kembali',
      color: 'green-600',
      action: 'close'
    }
  }
}