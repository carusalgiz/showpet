<template>
  <v-dialog v-model="fullInfoOpen" persistent max-width="800">
    <template v-slot:activator="{on, attrs}">
      <v-btn outlined text v-bind="attrs" v-on="on" large
             class="w-100 d-flex align-center justify-space-between pa-2">
        <div class="d-flex flex-column align-start">
          <span>Заказ №{{order.id}}</span>
          <span>{{transformDate(order.add_date)}}</span>
        </div>
        <h3 class="purple--text mb-0">{{order.state}}</h3>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        <div class="d-flex w-100 justify-space-between">
          <span>Заказ №{{order.id}}</span>
          <span>{{transformDate(order.add_date)}}</span>
        </div>
      </v-card-title>
      <v-card-text>
        <v-row class="mb-3">
          <v-col cols="6" md="4" sm="4" lg="4">
            <v-select hide-details class="fit" :items="statuses" v-model="order.state" item-text="name" item-value="value" label="Статус заказа"></v-select>
          </v-col>
          <v-col cols="6" md="4" sm="4" lg="4">
            <v-select hide-details class="fit" :items="pay_choices" v-model="order.pay_type" item-text="name" item-value="value" label="Тип оплаты"></v-select>
          </v-col>
          <v-col cols="6" md="4" sm="4" lg="4">
            <v-select hide-details class="fit" :items="pay_state" v-model="order.pay_state" item-text="name" item-value="value" label="Статус оплаты"></v-select>
          </v-col>
          <v-col cols="6" md="4" sm="4" lg="4">
            <v-text-field hide-details label="Имя" v-model="order.name"></v-text-field>
          </v-col>
          <v-col cols="6" md="4" sm="4" lg="4">
            <v-text-field hide-details label="Телефон" v-model="order.phone"></v-text-field>
          </v-col>
          <v-col cols="6" md="4" sm="4" lg="4">
            <v-text-field hide-details label="Адрес" v-model="order.address"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea rows="2" hide-details label="Дополнительная информация" v-model="order.info"></v-textarea>
          </v-col>
        </v-row>

        <div class="d-flex justify-space-between">
          <h2 class="mb-3">Товары:</h2>
          <v-dialog max-width="800">
            <template v-slot:activator="{on, attrs}">
              <v-btn :disabled="order.pay_state === 'PAYED'" color="pink" v-bind="attrs" v-on="on" dark small>Добавить</v-btn>
            </template>
            <v-card>
              <item-list-for-order v-on:addItem="addItem"></item-list-for-order>
            </v-card>
          </v-dialog>

        </div>

        <div v-for="(item, index) of order.goods" :key="index" class="d-flex good-wrapper mb-1 black--text">
          <div class="d-flex flex-column flex-grow-1">
            <div>{{item.data.code}} • <b>{{item.data.name}}</b></div>
            <div class="d-flex">
              <div class="mr-4">{{item.option.option}}</div>
              <div class="mr-4">Цена: <span class="pink--text"><b>{{item.option.price}} Р</b></span></div>
              <div class="mr-4">Скидка: <span class="pink--text"><b>{{item.option.discount}}</b></span></div>
              <div>Цена со скидкой: <span class="green--text"><b>{{getItemPrice(item.option)}}</b></span></div>
            </div>
            <div class="d-flex">
              <div class="mr-2">Количество:</div>
              <div class="d-flex align-center">
                <v-btn color="primary" :disabled="item.count === 0 || order.pay_state === 'PAYED'"
                       icon outlined rounded x-small @click="removeCount(item)"><v-icon>mdi-minus</v-icon></v-btn>
                <span class="ml-3 mr-3">{{item.count}}</span>
                <v-btn color="primary" icon outlined rounded x-small @click="addCount(item)" :disabled="order.pay_state === 'PAYED'"><v-icon>mdi-plus</v-icon></v-btn>
              </div>
            </div>

          </div>
          <div class="d-flex flex-column">
            <v-btn rounded outlined icon color="error" @click="deleteItem(index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
        <div class="d-flex align-center mt-4">
          <v-spacer></v-spacer>
          <span class="mr-2">Скидка:</span>
          <v-text-field style="max-width: 60px" type="number" class="mr-4" v-model="order.discount" suffix="%"></v-text-field>
          <span class="mr-2">Итого:</span>
          <h2 class="mb-0 green--text"><b>{{fullCount}} Р</b></h2>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="purple darken-1" outlined text @click="saveOrder">Обновить данные заказа</v-btn>
        <v-btn
          color="green darken-1"
          text
          outlined
          @click="fullInfoOpen = false"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
    import ItemListForOrder from "./itemListForOrder";
    import {PAY_CHOICES, PAY_STATE, STATE_CHOICES} from "../../static/data";
    import {environment} from "../../assets/environment";

    export default {
      components: {ItemListForOrder},
      props: ['model'],
      name: "orderItem",
      data() {
        return {
          fullInfoOpen: false,
          statuses: STATE_CHOICES,
          pay_choices: PAY_CHOICES,
          pay_state: PAY_STATE,
          order: {...this.model}
        }
      },
      methods: {
        getItemPrice(option) {
          if (option.discount > this.order.discount) {
            if (option.discount > 0) {
              return (option.price - ((option.price / 100) * option.discount)).toFixed(2)
            } else {
              return option.price
            }
          } else {
            if (this.order.discount > 0) {
              return (option.price - ((option.price / 100) * this.order.discount)).toFixed(2)
            } else {
              return option.price
            }
          }
        },
        transformDate(date) {
          return this.$moment(date).format('DD.MM.YYYY hh:mm:ss')
        },
        addCount(item) {
          item.count++;
        },
        removeCount(item) {
          item.count--;
        },
        deleteItem(index){
          this.order.goods.splice(index,1);
        },
        addItem(item) {
          let index = -1;
          this.order.goods.forEach((elem, i) => {
            if (elem.option.id === item.option.id) index = i
          })
          if (index === -1) {
            this.order.goods.push(item);
          } else {
            this.order.goods[index].count++;
          }
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
        },
        saveOrder() {
          this.$axios.put(`${environment.api}/admin/order/${this.order.id}`, this.order, {headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }}).then( (result) => {
            console.log(result)
          }, (err) => {
            this.checkError(err.response);
          });
        }
      },
      computed: {
        fullCount() {
          if (this.order.discount > 0) {
            const full_price = this.order.goods.reduce( (sum, elem) => {
              return sum + (elem.count * elem.option.price)
            },0);
            return (full_price - ((full_price / 100) * this.order.discount)).toFixed(2)
          } else {
            return this.order.goods.reduce( (sum, elem) => {
              return sum + (elem.count * elem.option.price)
            },0).toFixed(2)
          }
        },
      },
      mounted() {
        console.log(this.order)
      }
    }
</script>

<style scoped>
  @import "~/assets/default.scss";

  .good-wrapper{
    padding: 7px;
    border: 1px solid lightgray;
    border-radius: 7px;
  }
</style>
