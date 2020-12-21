<template>
  <div>
    <v-list>
      <v-list-item v-for="(user, index) of users" :key="index">{{user.email}}</v-list-item>
    </v-list>
  </div>

</template>

<script>
    import {environment} from "../../../assets/environment";

    export default {
      layout: 'admin',
      name: 'index',
      data() {
        return {
          users: []
        }
      },
      mounted() {
        this.$axios.get(`${environment.api}/profile_list`).then( res => {
          this.users = res.data;
        }, (err) => {
          this.checkError(err.response);
        })
      },
      methods: {
        checkError(error) {
          if (error.status === 401 || error.status === 403) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            this.$store.commit('setLoginState', false);
            this.$store.commit('setIsAdmin', false);
            this.$store.commit('setUser', null);
            this.$router.push('/admin');
          }
        }
      }
    }
</script>

<style scoped>

</style>
