<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>Каталог</h1>
      </v-container>
    </div>
    <v-container class="page-main">
      <v-row>
        <v-col cols="12" sm="6" md="3" lg="3">
          <NuxtLink to="/catalog/sredstva-gigieny-i-kosmetika" class="dark-link">
            <v-card
              elevation="2">
              <div class="no-photo-bg">
                <v-img
                  height="250"
                  src="https://intechspa.com/wp-content/uploads/2019/05/image-placeholder-png_324833-1024x1024.png"
                ></v-img>
              </div>
              <v-card-title class="justify-center text-center">
                  <span>Средства гигиены и <br/> косметика</span>
              </v-card-title>
            </v-card>
          </NuxtLink>
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="3">
          <NuxtLink to="/catalog/soderzhanie" class="dark-link">
            <v-card
              elevation="2">
              <div class="no-photo-bg">
                <v-img
                  height="250"
                  src="https://intechspa.com/wp-content/uploads/2019/05/image-placeholder-png_324833-1024x1024.png"
                ></v-img>
              </div>
              <v-card-title class="justify-center">
                <span>Содержание</span>
              </v-card-title>
            </v-card>
          </NuxtLink>
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="3">
          <NuxtLink to="/catalog/korma" class="dark-link">
            <v-card
              elevation="2">
              <div class="no-photo-bg">
                <v-img
                  height="250"
                  src="https://intechspa.com/wp-content/uploads/2019/05/image-placeholder-png_324833-1024x1024.png"
                ></v-img>
              </div>
              <v-card-title class="justify-center">
                <span>Корма</span>
              </v-card-title>
            </v-card>
          </NuxtLink>
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="3">
          <NuxtLink to="/catalog/vitaminy" class="dark-link">
            <v-card
              elevation="2">
              <div class="no-photo-bg">
                <v-img
                  height="250"
                  src="https://intechspa.com/wp-content/uploads/2019/05/image-placeholder-png_324833-1024x1024.png"
                ></v-img>
              </div>
              <v-card-title class="justify-center">
                <span>Витамины</span>
              </v-card-title>
            </v-card>
          </NuxtLink>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
    export default {
      auth: false,
      head() {
        return {
          title: this.$route.params.catalog
        }
      },
        name: "index"
    }
</script>

<style scoped lang="scss">
  @import "~/assets/catalog.scss";
  @import "~/assets/default.scss";
  .page-header{
    h1{
      font-family: 'Montserrat Light', sans-serif;
    }
  }
</style>
