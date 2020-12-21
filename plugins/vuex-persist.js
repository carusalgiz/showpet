import VuexPersistence from 'vuex-persist'
import Vue from 'vue'
import Vuex, { Payload, Store } from 'vuex'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  strictMode: true,
  storage: window.sessionStorage
})

const store = new Vuex.Store({
  strict: true,
  state: {
    user: {
      name: 'Arnav'
    },
    foo: {
      bar: 'baz'
    }
  },
  plugins: [vuexLocal.plugin]
})

export default store
