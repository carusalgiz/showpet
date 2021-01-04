<template>
  <div>
    <h2>Заказы</h2>
    <div class="d-flex justify-center" v-if="ordersLoading">
      <v-progress-circular indeterminate color="pink"></v-progress-circular>
    </div>
    <v-list dense v-else>
      <v-list-item v-for="(item,index) of order" :key="index">
        <order-item :model="item"></order-item>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
    import OrderItem from "../../../components/admin/orderItem";
    import {environment} from "../../../assets/environment";
    export default {
      layout: 'admin',
      name: "index",
      components: {OrderItem},
      data() {
        return {
          order: [],
          ordersLoading: false
        }
      },
      methods: {
        loadOrders() {
          this.ordersLoading = true;
          this.$axios.get(`${environment.api}/admin/order`, {headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }}).then( (result) => {
            this.order = result.data;
            console.log(result);
            this.ordersLoading = false;
          }, (err) => {
            this.checkError(err.response);
            this.ordersLoading = false;
          });
        },
        checkError(error) {
          if (error.status === 401 || error.status === 403) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            this.$store.commit('setLoginState', false);
            this.$store.commit('setIsAdmin', false);
            this.$store.commit('setUser', null);
            this.$router.push('/');
          }
        }
      },
      mounted() {
        this.loadOrders()
      }
    }
</script>

<style scoped lang="scss">
  @import "~/assets/default.scss";
  .content__list-wrapper{
    border-radius: 7px;
    border: 1px solid lightgray;
    padding: 5px 10px;
  }
</style>
