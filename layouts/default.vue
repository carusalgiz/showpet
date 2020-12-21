<template>
  <v-app light v-scroll="onScroll">
    <Header :scrolled="scrolled"></Header>
    <div class="main">
      <Nuxt />
    </div>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";
export default {
  components: {Footer, Header},
  data () {
    return {
      scrolled: false
    }
  },
  methods: {
    onScroll(event) {
      this.scrolled = event.target.documentElement.scrollTop > 150;
    }
  }
}
</script>
<style scoped>
  .main{
  }
</style>
