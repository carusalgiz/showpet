<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>Контакты</h1>
      </v-container>
    </div>
    <v-container class="page-main">
      <div class="d-lg-flex d-md-flex justify-space-between">
        <div class="question d-md-none d-lg-none d-flex flex-column align-center">
          <span>Есть вопросы?</span>
          <span>Напишите нам</span>
          <span class="mt-md-10 mt-lg-10 mt-5 mb-8">Будем рады ответить на любой ваш вопрос</span>
        </div>
        <v-form
          v-model="valid"
        >
          <v-row>
            <v-col cols="12"
                   md="6"
                   lg="6"
                   sm="6"
                   class="pb-0"
            >
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="Как к вам обращаться?"
                required
                filled
                rounded
                @keypress="send = false"
              ></v-text-field>
            </v-col>
            <v-col cols="12"
                   md="6"
                   lg="6"
                   sm="6"
                   class="pb-0"
            >
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Ваш электронный адрес"
                required
                filled
                rounded
                @keypress="send = false"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              class="pt-0 pb-0">
              <v-textarea
                solo
                v-model="text"
                label="Ваш вопрос"
                @keypress="send = false"
              ></v-textarea>
            </v-col>
          </v-row>
          <transition name="fade">
            <v-alert
              border="left"
              outlined
              color="deep-purple lighten-1"
              v-show="send"
            >
              Спасибо за ваш вопрос, скоро мы его прочитаем и обязательно вам ответим!
            </v-alert>
          </transition>

          <div class="d-flex justify-center mb-5">
            <v-btn
              :disabled="!valid"
              :color="valid ? 'deep-purple lighten-2' : 'secondary'"
              :dark="valid"
              large
              rounded
              elevation="5"
              @click="sendQuestion">Отправить сообщение</v-btn>
          </div>
        </v-form>
        <div>
          <div class="question d-md-flex d-lg-flex d-none flex-column align-center">
            <span>Есть вопросы?</span>
            <span>Напишите нам</span>
            <span class="mt-md-10 mt-lg-10 mt-5 mb-8">Будем рады ответить на любой ваш вопрос</span>
          </div>
          <div class="w-100">
            <h6>
              <v-icon small color="deep-purple lighten-1">mdi-email</v-icon>
              <span>sportsandshow@gmail.com</span>
            </h6>
            <h6>
              <v-icon small color="deep-purple lighten-1">mdi-map-marker</v-icon>
              <span>г. Хабаровск</span>
            </h6>
            <h6>
              <v-icon small color="deep-purple lighten-1">mdi-phone</v-icon>
              <span>тел.: +7 (4212) 933-626</span>
            </h6>
            <h6>
              <v-icon small color="deep-purple lighten-1">mdi-phone</v-icon>
              <span>тел.: +7-914-183-99-88</span>
            </h6>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
    export default {
      auth: false,
        name: "contacts",
        data() {
            return {
              valid: false,
              name: '',
              nameRules: [
                v => !!v || 'Заполните ваше имя'
              ],
              email: '',
              emailRules: [
                v => !!v || 'Заполните ваш электронный адрес',
                v => /.+@.+/.test(v) || 'Проверьте правильность написания email',
              ],
              text: '',
              send: false
            }
        },
        methods: {
          sendQuestion() {
            this.send = true;
          }
        }
    }
</script>

<style scoped lang="scss">
  @import "~/assets/default.scss";
  .page-header{
    h1{
      font-family: 'Montserrat Light', sans-serif;
    }
  }
  form{
    max-width: 50%;
  }
  .question{
    span:nth-child(1){
      font-family: 'Montserrat Light', sans-serif;
      font-size: 3rem;
      line-height: 3rem;
    }
    span:nth-child(2) {
      font-family: 'Montserrat Bold', sans-serif;
      font-size: 3rem;
    }
  }
  .w-100{
    h6{
      font-size: 1.1rem;
      letter-spacing: 0.03rem;
      line-height: 2.2rem;
      span{
        margin-left: 10px;
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: .4s;
    opacity: 1;
    transform: translateY(0);
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
    transition: .4s;
    transform: translateY(-50px);
  }
  @media (max-width: 960px) {
    form {
      max-width: unset;
    }
    .question{
      span:nth-child(1){
        font-size: 1.8rem;
        line-height: 2.1rem;
      }
      span:nth-child(2) {
        font-size: 2.2rem;
        line-height: 2.4rem;
      }
    }
  }
</style>
