<template>
  <v-list-group :value="false" >
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title class="d-flex align-center justify-space-between">
          <div class="d-flex flex-column">
            <span>Заказ №{{order.id}}</span>
            <span>{{transformDate(order.add_date)}}</span>
          </div>
          <h3 class="purple--text mb-0">{{order.state}}</h3>
        </v-list-item-title>
      </v-list-item-content>
    </template>

    <v-list-item v-for="(item,index) of order.goods" :key="index">
      <v-row>
        <v-col cols="12" md="10" sm="10" lg="10">
          <div class="d-flex flex-column">
            <span><b>{{item.data.name}}</b></span>
            <span>Код товара: {{item.data.code}} • {{item.option.option}}</span>
          </div>
        </v-col>
        <v-col cols="12" md="2" sm="2" lg="2">
          <div class="d-flex flex-column">
            <span class="green--text">{{item.option.price}}</span>
            <span>{{item.count}} шт</span>
          </div>
        </v-col>
      </v-row>
    </v-list-item>
    <div class="d-flex justify-end align-center mt-2">
      <span class="mr-2 black--text">Итого:</span><h3 class="mb-0 green--text"><b>{{fullCount()}}</b></h3>
    </div>
  </v-list-group>
</template>

<script>
    export default {
      props: ['order'],
      name: "ordersPageItem",
      methods: {
        transformDate(date) {
          return this.$moment(date).format('DD.MM.YYYY hh:mm:ss')
        },
        fullCount() {
          return this.order.goods.reduce( (sum, elem) => {
            return sum + (elem.count * elem.option.price)
          },0)
        }
      },
      mounted() {
        console.log(this.order);
      }
    }
</script>

<style scoped>
  @import "~/assets/default.scss";
</style>
