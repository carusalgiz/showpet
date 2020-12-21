<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>Корзина</h1>
      </v-container>
    </div>
    <div class="page-main">
      <v-container>
        <div v-if="cart.length !== 0">
          <div class="d-none d-sm-none d-md-flex d-lg-flex">
            <v-simple-table class="cart-table w-100">
              <template v-slot:default>
                <thead>
                <tr>
                  <th style="width: 55%" class="pl-8 pt-5 pb-5">
                    <b>Товар</b>
                  </th>
                  <th style="width: 15%" class="pt-5 pb-5 text-center">
                    <b>Цена</b>
                  </th>
                  <th style="width: 10%" class="pt-5 pb-5 text-center">
                    <b>Кол-во</b>
                  </th>
                  <th style="width: 15%" class="pt-5 pb-5 text-center">
                    <b>Всего</b>
                  </th>
                  <th style="width: 5%" class="pt-5 pb-5 pr-8 text-center"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) of cart" :key="'cartItem' + index">
                  <td style="width: 55%" class="pl-8 pt-6 pb-6">
                    <div class="d-flex align-center">
                      <div class="image-container" v-bind:class="{'empty': item.data.picture == null}">
                        <v-img :src="item.data.picture != null ? env + item.data.picture : ''"
                               max-width="100"
                               max-height="80"
                               contain
                               class="mr-5"></v-img>
                      </div>

                      <NuxtLink :to="item.path">{{item.data.name}}</NuxtLink>
                    </div>
                  </td>
                  <td style="width: 15%" class="pt-6 pb-6 text-center number">{{item.option.price}}</td>
                  <td style="width: 10%" class="pt-6 pb-6 text-center number">
                    <div class="d-flex align-center">
                      <v-btn color="primary" :disabled="item.count === 0"
                             icon outlined fab x-small @click="removeCount(item)"><v-icon>mdi-minus</v-icon></v-btn>
                      <span class="ml-3 mr-3">{{item.count}}</span>
                      <v-btn color="primary" icon outlined fab x-small @click="addCount(item)"><v-icon>mdi-plus</v-icon></v-btn>
                    </div>
                  </td>
                  <td style="width: 15%" class="pt-6 pb-6 text-center number">{{item.option.price * item.count}} Р</td>
                  <td style="width: 5%" class="pt-6 pb-6 pr-8 text-center">
                    <v-btn fab @click="removeItem(index)"
                           outlined
                           dark
                           x-small color="error"><v-icon>mdi-close</v-icon></v-btn>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>

          <div class="d-flex d-sm-flex d-md-none d-lg-none flex-column">
            <v-card v-for="(item, index) of cart" :key="'cartItem' + index" class="mb-3">
              <div class="d-flex justify-center mt-2" v-bind:class="{'empty': item.data.picture == null}">
                <v-img :src="item.data.picture != null ? env + item.data.picture : ''"
                       max-height="130"
                       contain
                       class="mr-5"></v-img>
              </div>
              <div class="pl-4 mt-2 code">Код товара: {{item.data.code}}</div>
              <v-card-title class="pt-1">
                <NuxtLink :to="item.path" class="name">{{item.data.name}} {{item.option.option}}</NuxtLink>
              </v-card-title>
              <v-card-text>
                <div class="d-flex justify-space-between">
                  <div class="d-flex align-center">
                    <v-btn color="primary" :disabled="item.count === 0"
                           icon outlined fab x-small @click="removeCount(item)"><v-icon>mdi-minus</v-icon></v-btn>
                    <span class="ml-3 mr-3 option">{{item.count}}</span>
                    <v-btn color="primary" icon outlined fab x-small @click="addCount(item)"><v-icon>mdi-plus</v-icon></v-btn>
                  </div>
                  <span class="option">{{item.option.price * item.count}} Р</span>
                </div>
                <div class="d-flex justify-center mt-4">
                  <v-btn @click="removeItem(index)"
                         outlined
                         color="pink">Удалить</v-btn>
                </div>


              </v-card-text>
            </v-card>
          </div>
          <div class="d-flex justify-end full-price mt-5">
            <span class="mr-3">Итого:</span>
            <span>{{fullPrice}}</span>
          </div>
          <h1 class="mb-5 mt-10 text-center">Данные для оформления заказа</h1>
          <v-form v-model="checkoutValid" @submit.prevent="makeOrder">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="6" class="pb-0 pt-0">
                <v-text-field
                  label="Ваше имя *"
                  required
                  :rules="nameRules"
                  filled
                  class="rounded-lg"
                  rounded
                  v-model="checkoutForm.firstName"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6" class="pb-0 pt-0">
                <v-text-field
                  label="Ваша фамилия"
                  filled
                  rounded
                  class="rounded-lg"
                  v-model="checkoutForm.lastName"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6" class="pb-0 pt-0">
                <v-text-field
                  label="Ваш телефон *"
                  :rules="phoneRules"
                  required
                  filled
                  rounded
                  class="rounded-lg"
                  v-mask="'# (###) ### ##-##'"
                  prefix="+"
                  v-model="checkoutForm.phone"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6" class="pb-0 pt-0">
                <v-text-field
                  label="Ваш email *"
                  :rules="emailRules"
                  required
                  filled
                  class="rounded-lg"
                  rounded
                  v-model="checkoutForm.email"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-text-field
              required
              label="Ваш адрес *"
              :rules="addressRules"
              filled
              rounded
              class="rounded-lg"
              v-model="checkoutForm.address"
            ></v-text-field>
            <v-textarea
              label="Дополнительная информация"
              required
              filled
              class="rounded-lg"
              rounded
              v-model="checkoutForm.info"
            ></v-textarea>
            <span>* - поля, обязательные для заполнения</span>
            <div class="d-flex w-100 justify-end mt-4">
              <v-btn type="submit"
                     large
                     :color="checkoutValid ? 'pink' : 'primary'"
                     :dark="checkoutValid"
                     :disabled="!checkoutValid"
                     tile>Оформить заказ</v-btn>
            </div>
          </v-form>
        </div>

        <div v-else class="d-flex w-100 justify-center">
          <h2>В корзине отсутствуют товары</h2>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
    import {environment} from "../assets/environment";

    export default {
      auth: false,
      name: "cart",
      data() {
          return {
            cart: [],
            env: environment.api,
            checkoutValid: false,
            checkoutForm: {
              firstName: '',
              lastName: '',
              email: '',
              phone: '7',
              address: '',
              info: ''
            },
            addressRules: [
              v => !!v || 'Заполните ваш адрес'
            ],
            nameRules: [
              v => !!v || 'Заполните ваше имя'
            ],
            phoneRules: [
              v => !!v || 'Заполните ваш телефон'
            ],
            emailRules: [
              v => !!v || 'Заполните ваш электронный адрес',
              v => /.+@.+/.test(v) || 'Проверьте правильность написания email',
            ],
            fullPrice: 0
          }
      },
      methods: {
        addCount(item) {
          item.count++;
          this.fullPrice += item.option.price;
          localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        removeCount(item) {
          if (item.count !== 0) {
            item.count--;
            this.fullPrice -= item.option.price;
            localStorage.setItem('cart', JSON.stringify(this.cart));
          }
        },
        removeItem(index) {
          this.cart.splice(index, 1);
        },
        makeOrder() {
          console.log(this.checkoutForm);
        },
        updateUserInfo() {
          if (sessionStorage.getItem('user') != null) {
            const user = JSON.parse(sessionStorage.getItem('user'));
            this.checkoutForm.firstName = user.first_name;
            this.checkoutForm.lastName = user.last_name;
            this.checkoutForm.email = user.email;
            this.checkoutForm.phone = user.username;
          }
        }
      },
      mounted() {
        this.updateUserInfo();
        this.$store.subscribe((mutation, state) => {
          if (mutation.type === 'setLoginState') {
            this.updateUserInfo();
          }
        });
        this.cart = localStorage.getItem('cart') != null ? JSON.parse(localStorage.getItem('cart')) : [];
        for (let item of this.cart) {
          this.fullPrice += item.option.price * item.count;
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "~/assets/catalog.scss";
  @import "~/assets/default.scss";
  .image-container{
    width: 100px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    &.empty{
      background-color: #f7f7f7;
    }
  }
  .full-price{
    font-size: 1.3rem;
    & span:first-child{
      font-family: "Montserrat Regular", sans-serif;
    }
    & span:last-child{
      font-family: "Montserrat Bold", sans-serif;
    }
  }
  .page-header{
    h1{
      font-family: 'Montserrat Light', sans-serif;
    }
  }
  .cart-table {
    box-shadow: 0 0 15px 2px lightgray;
    font-family: 'Montserrat', sans-serif;
    thead{
      font-family: 'Montserrat Bold', sans-serif;
      box-shadow: 0 2px 7px 1px lightgrey;
      th{
        font-size: 1.1rem !important;
      }
    }
    tbody{
      td{
        font-size: 1rem !important;
        color: black;
        &.number{
          font-family: 'Montserrat Bold', sans-serif;
        }
        a{
          text-decoration: none;
          color: black;
          transition: .2s;
          &:hover{
            color: dodgerblue;
          }
        }
      }
      tr:hover{
        cursor: default;
        background-color: initial !important;
      }
    }
  }
  @media all and (max-width: 960px) {
    .option{
      font-family: "Montserrat Bold", sans-serif;
      font-size: 1rem;
    }
    .code{
      font-size: 0.9rem;
    }
    .name{
      line-height: 1.5rem;
      font-size: 1.2rem;
      color: black;
    }
  }
</style>
