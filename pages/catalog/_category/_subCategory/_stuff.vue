<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex flex-column justify-center">
        <h1>{{stuff.name}}</h1>
        <div class="breadcrumbs mt-3">
          <NuxtLink to="/" class="light-link"><span class="mr-5">Главная</span></NuxtLink>
          <NuxtLink to="/catalog" class="light-link"><span class="mr-5">Каталог</span></NuxtLink>
          <NuxtLink :to="'/catalog/' + breadcrumbs.category.link" class="light-link">
            <span class="mr-5">{{breadcrumbs.category.name}}</span>
          </NuxtLink>
          <NuxtLink :to="'/catalog/' + breadcrumbs.category.link + '/' + breadcrumbs.subCategory.link" class="light-link">
            <span class="mr-5">{{breadcrumbs.subCategory.name}}</span>
          </NuxtLink>
        </div>
      </v-container>
    </div>
    <div class="page-main">
      <v-container>
        <div class="d-md-flex d-lg-flex">
          <div class="img-item mr-md-10 mr-lg-10 mb-4 mt-3" v-bind:class="{'empty':stuff.picture == null}">
            <v-img
              :src="stuff.picture != null ? env + stuff.picture : ''"
              max-height="400"
              contain
            ></v-img>
          </div>
          <div class="d-flex flex-column">
            <h1 class="mt-5 mb-4 name">{{stuff.name}}</h1>
            <div class="d-flex align-center" v-if="stuff.categories.length > 0">
              <div class="option-block">
                <v-select
                  v-if="stuff.categories.length > 1"
                  :items="stuff.categories"
                  v-model="addToCartData.option"
                  item-text="option"
                  item-value="id"
                  hide-details
                  return-object
                  solo
                  class="mr-3 mt-2 mb-2 custom-select"
                >
                </v-select>
                <h3 v-else>{{addToCartData.option.option}}</h3>
              </div>
              <div class="ml-md-10 ml-lg-10 ml-5 price">
                <b>{{addToCartData.option.price}} Р</b>
              </div>
            </div>
            <span><b>Код товара:</b> {{addToCartData.option.code}}</span>
            <div class="count-block pa-3 mt-7">
              <div class="d-flex align-center mt-2">
                <v-btn-toggle class="w-100">
                  <v-btn color="secondary" @click="removeCount" class="custom-button"><v-icon class="white--text">mdi-minus</v-icon></v-btn>
                  <!--                <v-text-field outlined class="text-center" v-model="addToCartData.count"></v-text-field>-->
                  <input class="text-center count-input" v-model="addToCartData.count">
                  <v-btn color="secondary" @click="addCount" class="custom-button"><v-icon class="white--text">mdi-plus</v-icon></v-btn>
                </v-btn-toggle>

              </div>
              <div class="mt-5 w-100">
                <v-btn dark @click="addToCart" class="w-100 add-cart-btn"
                       color="pink"
                       >Добавить в корзину</v-btn>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-7">
          <p v-if="stuff.description != null">{{stuff.description}}</p>
        </div>
      </v-container>

    </div>
  </div>
</template>

<script>
  import {age, categories, flavor} from "../../../../static/data";
    import {environment} from "../../../../assets/environment";

    export default {
      auth: false,
      name: "Stuff",
      head() {
        return {
          title: this.stuff.name
        }
      },
      data() {
        return {
          ages: age,
          flavors: flavor,
          addToCartData: {
            count: 1,
            option: {
              option: '',
              price: 0
            }
          },
          stuff: {
            age: null,
            flavor: null,
            producer: null,
            name: '',
            description: '',
            code: 0,
            discount: 0,
            picture: null,
            section: '',
            subsection: '',
            categories: []
          },
          loading: false,
          env: environment.api,
          breadcrumbs: {
            category: {
              name: '',
              link: '',
              subs: []
            },
            subCategory: {
              name: '',
              link: '',
              subs: []
            }
          }
        }
      },
      mounted() {
        this.breadcrumbs.category = categories.filter(cat => cat.link === this.$route.params.category)[0];
        this.breadcrumbs.subCategory = categories.filter(cat => cat.link === this.$route.params.category)[0].subs.filter(subCat =>
          subCat.link === this.$route.params.subCategory)[0];
        this.loading = true;
        this.$axios.get(`${environment.api}/catalog/${this.$route.params.category}/${this.$route.params.subCategory}/${this.$route.params.stuff}`
        ).then( res => {
          this.stuff = {
            ...res.data
          };
          this.addToCartData.count = 1;
          this.addToCartData.option = this.stuff.categories != null ?
                  this.stuff.categories.length > 0 ? this.stuff.categories[0] : null : null;
        }, (err) => {
          this.checkError(err.response);
          this.loading = false;
        })
      },
      methods: {
        addCount() {
          this.addToCartData.count++;
        },
        removeCount() {
          if (this.addToCartData.count !== 0) {
            this.addToCartData.count--;
          }
        },
        addToCart() {
          let cart = localStorage.getItem('cart') != null ? JSON.parse(localStorage.getItem('cart')) : [];
          cart.push({
            id: this.stuff.id,
            data: {
              ...this.stuff
            },
            option: this.stuff.categories.filter(option => option === this.addToCartData.option)[0],
            count: this.addToCartData.count,
            path: this.$route.path
          })
          localStorage.setItem('cart', JSON.stringify(cart));
          this.$store.commit('setCart', cart);
        },
        checkError(error) {
          if (error.status === 401 || error.status === 403) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            this.$store.commit('setLoginState', false);
            this.$store.commit('setIsAdmin', false);
            this.$store.commit('setUser', null);
          }
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "~/assets/catalog.scss";
  @import "~/assets/default.scss";
  .page-header{
    h1{
      font-family: 'Montserrat Light', sans-serif;
      line-height: 2rem;
    }
  }
  .page-main{
    h1{
      font-family: 'Montserrat Light', sans-serif;
      line-height: 2rem;
    }
  }
  .img-item{
    width: 400px;
    height: 400px;
    &.empty{
      background-color: #f7f7f7;
    }
  }
  .option-block{
    width: 230px;
  }
  .count-block{
    background-color: #f7f7f7;
    width: 230px;
  }
  .count-input{
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
    width: 100%;
  }
  .custom-button{
    height: 35px !important;
    padding: 0 !important;
    width: 35px !important;
    min-width: unset !important;
  }
  .breadcrumbs span{
    white-space: nowrap;
  }
  .price{
    font-size: 1.5rem;
    font-family: "Montserrat Bold", sans-serif;
  }
  @media all and (max-width: 960px) {
    .option-block{
      width: 50%;
    }
    .count-block{
      width: 100%;
    }
    .price{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      flex-grow: 1;
    }
    .custom-button{
      height: 50px !important;
      width: 50px !important;
    }
    .add-cart-btn{
      height: 50px !important;
    }
    .img-item{
      width: 100%;
    }
    .name{
      font-size: 1.5rem;
    }
  }
</style>
