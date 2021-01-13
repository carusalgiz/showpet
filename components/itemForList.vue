<template>
  <v-card
    elevation="2"
    class="h-100 d-flex flex-column"
  >
    <v-card-text class="d-flex flex-column flex-grow-1">
      <div class="img-container mb-3" v-bind:class="{'empty':item.picture == null}">
        <NuxtLink :to="path + '/' + item.slug">
          <v-img
            contain
            max-height="200"
            :src="item.picture != null ? env + item.picture : ''"
          ></v-img>
        </NuxtLink>
      </div>
      <NuxtLink :to="path + '/' + item.slug" class="item-link">
        {{item.name}}
      </NuxtLink>
      <v-spacer></v-spacer>
      <div class="d-flex justify-space-between align-center mt-2" v-if="item.categories.length > 0">
        <v-select
          v-if="item.categories.length > 1"
          :items="item.categories"
          v-model="addToCartData.option"
          item-text="option"
          item-value="id"
          return-object
          hide-details
          class="mr-3 mt-0 option-select pa-0"
          height="30"
        ></v-select>
        <div v-if="item.categories.length === 1">{{addToCartData.option.option}}</div>
        <div class="d-flex flex-column align-end">
                <span v-bind:class="{'discount': addToCartData.option.discount > 0 || item.discount > 0}">
                  <b>{{addToCartData.option.price}} P</b>
                </span>
          <template v-if="addToCartData.option.discount > 0 || addToCartData.option.discount > 0">
            <span class="green--text ml-4">{{itemPrice}} P</span>
          </template>
        </div>
      </div>
    </v-card-text>
    <div class="pl-4 pr-4 pb-4 d-flex justify-center">
      <v-btn @click="addToCart" class="w-100 custom-button"
      >Добавить в корзину</v-btn>
    </div>
  </v-card>
</template>

<script>
  import {age, flavor} from "../static/data";
  import {environment} from "../assets/environment";

  export default {
      props: ['item'],
      name: "itemForList",
      data() {
        return {
          ages: age,
          flavors: flavor,
          env: environment.api,
          addToCartData: {
            count: 1,
            option: {
              option: '',
              price: 0
            }
          },
          path: '/catalog/' + this.$route.params.category + '/' + this.$route.params.subCategory,
        }
      },
    mounted() {
      this.addToCartData.option = this.item.categories != null ? this.item.categories[0] : null;
      console.log(this.addToCartData.option);
    },
    methods: {
      addToCart() {
        let cart = localStorage.getItem('cart') != null ? JSON.parse(localStorage.getItem('cart')) : [];
        const option = this.addToCartData.option
        cart.push({
          id: this.item.id,
          data: {
            ...this.item
          },
          option: option,
          count: this.addToCartData.count,
          path: `${this.$route.path}/${this.item.slug}?id=${option.id}`
        })
        localStorage.setItem('cart', JSON.stringify(cart));
        this.$store.commit('setCart', cart);
      }
    },
    computed:{
      itemPrice() {
        if (this.item.discount < this.addToCartData.option.discount) {
          if (this.addToCartData.option.discount > 0) {
            return (this.addToCartData.option.price - ((this.addToCartData.option.price / 100) * this.addToCartData.option.discount)).toFixed(2)
          } else {
            return this.addToCartData.option.price
          }
        } else {
          if (this.item.discount > 0) {
            return (this.addToCartData.option.price - ((this.addToCartData.option.price / 100) * this.item.discount)).toFixed(2)
          } else {
            return this.addToCartData.option.price
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "~/assets/default.scss";
  .item-price{
    font-family: "Montserrat Bold", sans-serif;
    font-size: 1.2rem;
  }
  .discount{
    text-decoration: line-through;
  }
  .item-link{
    text-decoration: none;
    font-size: 1.2rem;
    line-height: 1.5rem;
    color: black;
    transition: .2s;
    &:hover{
      color: dodgerblue;
    }
  }
  .option-select{
    flex: 0 0 50%;
    font-size: 13px;
  }
  .img-container{
    height: 200px;
    &.empty{
      background-color: lightgray;
    }
  }
  .custom-button{
    background-color: white;
    border-radius: 5px;
    border: 3px solid #e71e63;
    color: #e71e63;
    font-weight: bold;
  }

</style>
