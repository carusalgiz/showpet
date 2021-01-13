<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="users"
      :items-per-page="15"
      :loading="loading"
      loading-text="Загрузка..."
      class="elevation-1"
    >
      <template v-slot:item.is_staff="{ item }">
        {{item.is_staff ? 'Да' : 'Нет'}}
      </template>
      <template v-slot:item.last_login="{ item }">
        {{transformDate(item.last_login)}}
      </template>
    </v-data-table>
  </div>

</template>

<script>
    import {environment} from "../../../assets/environment";

    export default {
      layout: 'admin',
      name: 'index',
      data() {
        return {
          loading: false,
          headers: [
            { text: 'Email', value: 'email'},
            { text: 'Телефон', value: 'username' },
            { text: 'Имя', value: 'first_name' },
            { text: 'Админ', value: 'is_staff' },
            { text: 'Дата последнего входа', value: 'last_login' }
          ],
          users: []
        }
      },
      mounted() {
        this.loading = true;
        this.$axios.get(`${environment.api}/admin/users`,
          {headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }}).then( res => {
          this.users = res.data;
          this.loading = false;
        }, (err) => {
          this.checkError(err.response);
        })
      },
      methods: {
        transformDate(date) {
          return this.$moment(date).format('DD.MM.YYYY hh:mm:ss')
        },
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
