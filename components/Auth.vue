<template>
  <div class="auth-wrapper pa-5" v-bind:class="{'mobile':mobile}">
    <div class="d-flex flex-column align-center">
      <div class="triangle" v-if="!mobile"></div>
      <div class="d-flex w-100 justify-end exit">
        <v-btn icon tile @click="closeAuth" large>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <template v-if="mode === 'login'">
        <span class="login-title mb-4">Вход</span>
        <v-form v-model="loginValid" class="w-100" @submit.prevent="userLogin">
          <v-text-field
            label="Ваш телефон"
            :rules="usernameRules"
            required
            filled
            rounded
            v-mask="'# (###) ### ##-##'"
            prefix="+"
            v-model="auth.username"
          ></v-text-field>
          <v-text-field
            label="Ваш пароль"
            :rules="passwordRules"
            required
            filled
            rounded
            :type="showPassLogin ? 'text' : 'password'"
            v-model="auth.password"
            :append-icon="showPassLogin ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassLogin = !showPassLogin"
          ></v-text-field>
          <span class="text-success">{{loginMessage}}</span>
          <div class="d-flex flex-column align-center">
            <v-btn color="primary" large tile class="mb-3" :disabled="!loginValid" type="submit">Войти</v-btn>
            <span class="auth-link" @click="mode = 'register'">Еще не зарегистрированы? <br/>Зарегистрироваться</span>
          </div>
        </v-form>
      </template>
      <template v-if="mode === 'register'">
        <span class="login-title mb-4">Регистрация</span>
        <v-form v-model="registerValid" class="w-100" @submit.prevent="userRegister">
          <v-text-field
            label="Ваш телефон"
            :rules="usernameRules"
            required
            filled
            rounded
            v-mask="'# (###) ### ##-##'"
            prefix="+"
            v-model="register.username"
            @focusout="checkMobile"
          ></v-text-field>
          <div v-show="phoneFieldMessage.length !== 0" class="mb-2 black--text">{{phoneFieldMessage}}</div>
          <v-text-field
            label="Код подтверждения"
            required
            filled
            rounded
            v-model="register.code"
          ></v-text-field>
          <v-text-field
            label="Ваш email"
            :rules="emailRules"
            required
            filled
            rounded
            v-model="register.email"
          ></v-text-field>
          <v-text-field
            label="Ваш пароль"
            :rules="passwordRules"
            required
            filled
            rounded
            :type="showPassRegister ? 'text' : 'password'"
            v-model="register.password"
            :append-icon="showPassRegister ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassRegister = !showPassRegister"
          ></v-text-field>
          <span class="text-success">{{registerMessage}}</span>
          <div class="d-flex flex-column align-center">
            <v-btn color="primary" large tile class="mb-3" :disabled="!registerValid" type="submit">Зарегистрироваться
            </v-btn>
            <span class="auth-link" @click="mode = 'login'">Уже зарегистрированы? <br/>Войти</span>
          </div>
        </v-form>
      </template>
    </div>
  </div>
</template>

<script>
  import {environment} from '../assets/environment';
  export default {
    auth: false,
    name: "Auth",
    props: ['mobile'],
    data() {
      return {
        loginMessage: '',
        registerMessage: '',
        loginValid: false,
        registerValid: false,
        showPassRegister: false,
        showPassLogin: false,
        mode: 'login',
        auth: {
          username: '7',
          password: ''
        },
        register: {
          username: '7',
          password: '',
          code: '',
          email: ''
        },
        usernameRules: [
          v => !!v || 'Заполните ваш телефон'
        ],
        passwordRules: [
          v => !!v || 'Заполните ваш пароль'
        ],
        phoneFieldMessage: '',
        emailRules: [
          v => !!v || 'Заполните ваш электронный адрес',
          v => /.+@.+/.test(v) || 'Проверьте правильность написания email',
        ],
      }
    },
    mounted() {
      this.checkToken();
    },
    methods: {
      checkMobile() {
        const phone = this.register.username
          .replaceAll(' ', '')
          .replace('-', '')
          .replace('(', '')
          .replace(')', '');
        this.$axios.get(`${environment.api}/signup?username=${phone}`).then(res => {
          if (res.data === 'Code was send') {
            this.phoneFieldMessage = 'На указанный номер отправлен код подтверждения'
          } else {
            this.phoneFieldMessage = res.data;
          }
        }, err => {
          this.phoneFieldMessage = 'Проверьте правильность написания номера телефона'
        });
      },
      checkToken() {
        if (sessionStorage.getItem('token') != null) {
          this.$axios.post(`${environment.api}/token/refresh/`, {refresh: sessionStorage.getItem('refresh_token')}).then(res => {
            sessionStorage.setItem('token', res.data.access);
            this.$store.commit('setToken',res.data.access);
            this.$store.commit('setLoginState', true);
            this.$store.commit('setUser', JSON.parse(sessionStorage.getItem('user')));
            this.$store.commit('setIsAdmin', JSON.parse(sessionStorage.getItem('user')).is_staff);
          }, () => {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            this.$store.commit('setLoginState', false);
            this.$store.commit('setUser', null);
            this.$store.commit('setIsAdmin', false);
          });
        }
      },
      userLogin() {
        const data = {
          username: this.auth.username
            .replaceAll(' ', '')
            .replace('-', '')
            .replace('(', '')
            .replace(')', ''),
          password: this.auth.password
        };

        this.$axios.post(`${environment.api}/login/`, data).then(res => {
          sessionStorage.setItem('token', res.data.access_token);
          sessionStorage.setItem('refresh_token', res.data.refresh_token);
          sessionStorage.setItem('user', JSON.stringify(res.data.user));
          this.$store.commit('setLoginState',true);
          this.$store.commit('setToken',res.data.access_token);
          this.$store.commit('setUser', res.data.user);
          this.$store.commit('setIsAdmin', res.data.user.is_staff);
          this.loginMessage = 'Успешный вход!';
        }, () => {
          this.loginMessage = 'При входе произошла ошибка';
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('refresh_token');
          sessionStorage.removeItem('user');
          this.$store.commit('setLoginState',false);
          this.$store.commit('setToken', null);
          this.$store.commit('setUser', null);
          this.$store.commit('setIsAdmin', false);
        });
      },
      userRegister() {
        const data = {
          username: this.register.username
            .replaceAll(' ', '')
            .replace('-', '')
            .replace('(', '')
            .replace(')', ''),
          password: this.register.password,
          email: this.register.email,
          code: this.register.code
        };
        this.$axios.post(`${environment.api}/signup/`, data).then(res => {
          this.$axios.post(`${environment.api}/login/`, data).then(res => {
            sessionStorage.setItem('token', res.data.access_token);
            sessionStorage.setItem('refresh_token', res.data.refresh_token);
            sessionStorage.setItem('user', JSON.stringify(res.data.user));
            this.loginMessage = 'Успешный вход!';
            this.$store.commit('setLoginState',true);
            this.$store.commit('setToken',res.data.access_token);
            this.$store.commit('setUser', res.data.user);
            this.$store.commit('setIsAdmin', res.data.user.is_staff);
          }, err => {
            this.loginMessage = 'При входе произошла ошибка';
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('refresh_token');
            sessionStorage.removeItem('user');
            this.$store.commit('setLoginState',false);
            this.$store.commit('setToken', null);
            this.$store.commit('setUser', null);
            this.$store.commit('setIsAdmin', false);
          });
          this.registerMessage = 'Регистрация прошла успешно, теперь вы можете войти в свою учетную запись';
        }, err => {
          this.registerMessage = 'При регистрации произошла ошибка, повторите попытку позднее';
          console.log(err);
        });
      },
      closeAuth() {
        this.$emit('closeAuth');
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "~/assets/default.scss";

  * {
    font-family: 'Montserrat', sans-serif;
  }

  .text-success {
    color: #3b8070;
  }

  .auth-link {
    color: black;
    transition: .2s;
    text-align: center;

    &:hover {
      color: dodgerblue;
      cursor: pointer;
    }
  }

  .exit {
    margin-bottom: -44px;
    position: relative;
    top: -20px;
  }

  .auth-wrapper {
    position: absolute;
    width: 350px;
    background-color: rgb(255 255 255);
    border-radius: 8px;
    left: -135px;
    box-shadow: 0 0 15px 0px #626677;
    &.mobile{
      position: unset;
      width: 100%;
      box-shadow: unset;
    }
  }

  .login-title {
    font-size: 26px;
    color: black;
  }

  .triangle {
    border-top: 15px solid transparent;
    border-bottom: 15px solid white;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    position: relative;
    top: -50px;
    margin-bottom: -20px;
  }
</style>
