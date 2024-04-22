import { createStore } from 'vuex'

const store = createStore({
  state: {
    webApiPath: '',
    webToken: localStorage.getItem('webToken'),
    userIdentity: localStorage.getItem('userIdentity') && localStorage.getItem('userIdentity') != 'undefined' ? JSON.parse(localStorage.getItem('userIdentity')) : null
  },
  mutations: {
    setToken(state, token) {
      state.webToken = token
    },
    clearToken(state) {
      state.webToken = null
    },
    setIdentity(state, userIdentity) {
      state.userIdentity = userIdentity
    },
    clearIdentity(state) {
      state.userIdentity = null
    }
  },
  actions: {
    async login({ commit, state }, { username, password }) {
      try {

        /* mencoba mengirim request */
        const response = await fetch(`${state.webApiPath}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        })

        /* apabila terjadi kesalahan */
        if (!response.ok) throw new Error('Invalid Server Response')

        /* memformat response menjadi json */
        const data = await response.json()

        /* apabila status berhasil (true) */
        if (data.meta && data.meta.status) {

          /* mentimpan token dan identity */
          commit('setToken', data.token)
          commit('setIdentity', JSON.stringify(data.identity))

          /* menyimpan state */
          state.webToken = data.token
          state.userIdentity = data.identity

          /* berhasil masuk dan mebberikan status true */
          return { status: true, message: 'Berhasil Masuk'}
        }
        
        /* apabila ada kriteria credential yang tidak sesuai */
        return { status: false, message: data.meta.message }
      } catch (error) {
        return { status: false, message: 'Terjadi Kesalahan Pada Server' }
      }
    },
    logout({ commit }) {
      commit('clearToken')
      commit('clearIdentity')
    }
  }
})

store.subscribe((mutation, state) => {
  switch (mutation.type) {
    case 'setToken':
      localStorage.setItem('webToken', state.webToken)
      break
    case 'clearToken':
      localStorage.removeItem('webToken')
      break
    case 'setIdentity':
      localStorage.setItem('userIdentity', state.userIdentity)
      break
    case 'clearIdentity':
      localStorage.removeItem('userIdentity')
      break
  }
})

export default store
