<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>Личный кабинет</h1>
      </v-container>
    </div>
    <v-container class="page-main">
      <div class="d-flex" v-if="loggedIn">
        <AccountMenu></AccountMenu>
        <div class="main-content">
          <h2>Заказы</h2>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
  // import {environment} from "../assets/environment";
  import AccountMenu from "../../../components/accountMenu";
  import {mapGetters} from "vuex";

  export default {
    components: {AccountMenu},
    auth: false,
    name: "Orders",
    data() {
      return {
        user: null,
        loggedIn: false,
      }
    },
    methods: {
      ...mapGetters(['getLoginState', 'getUser'])
    },
    mounted() {
      this.user = this.getUser();
      this.loggedIn = this.getLoginState();
      if (!this.loggedIn) {
        this.$router.push('/')
      } else {
        this.$store.subscribe((mutation, state) => {
          if (mutation.type === 'setLoginState') {
            this.loggedIn = state.loginState;
          }
          if (mutation.type === 'setUser') {
            this.user = state.user;
          }
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "~/assets/default.scss";

  .page-header {
    h1 {
      font-family: 'Montserrat Light', sans-serif;
    }
  }

  .menu {
    width: 20%;
    min-width: 250px;
    margin-right: 50px;

    span {
      font-family: 'Montserrat Bold', sans-serif;

      &.active, &:hover {
        color: deeppink;
        cursor: pointer;
      }
    }
  }

  .main-content {
    width: 80%;
  }
</style>
