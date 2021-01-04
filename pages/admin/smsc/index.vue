<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <div class="d-flex">
        <v-btn color="success" class="mr-4" fab small @click="getSmsList">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-menu
          ref="menuStart"
          v-model="menuStart"
          :close-on-content-click="false"
          :return-value.sync="dateStart"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateStart"
              label="История от.."
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              class="mr-4"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateStart"
            no-title
            scrollable
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="menuStart = false"
            >
              Отмена
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.menuStart.save(dateStart)"
            >
              Сохранить
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-menu
          ref="menuEnd"
          v-model="menuEnd"
          :close-on-content-click="false"
          :return-value.sync="dateEnd"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateEnd"
              label="История до .."
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateEnd"
            no-title
            scrollable
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="menuEnd = false"
            >
              Отмена
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.menuEnd.save(dateEnd)"
            >
              Сохранить
            </v-btn>
          </v-date-picker>
        </v-menu>

        <v-text-field
          class="ml-4"
          v-model="phone"
          label="История по телефону"
          placeholder="89999999999"
        ></v-text-field>
      </div>

      <h2>Баланс: {{balance}}</h2>
    </div>

    <div>{{smsList}}</div>
  </div>
</template>

<script>
    import moment from 'moment';
    import {environment} from "../../../assets/environment";

    export default {
      name: "index",
      layout: 'admin',
      data() {
        return {
          smsList: null,
          balance: 0,
          menuStart: false,
          dateStart: null,
          menuEnd: false,
          dateEnd: null,
          phone: ''
        }
      },
      mounted() {
        this.getSmsList();
        this.getBalance();
      },
      methods: {
        getSmsList() {
          let params = '';
          if (this.dateStart) { params += `&start=${this.$moment(this.dateStart).format('DD.MM.YYYY')}`}
            else { params += `&start=${this.$moment(new Date()).format('DD.MM.YYYY')}`}
          if (this.dateEnd) { params += `&end=${this.$moment(this.dateEnd).format('DD.MM.YYYY')}}`}
            else { params += `&end=${this.$moment(new Date()).format('DD.MM.YYYY')}`}
          if (this.phone.trim().length > 0) {
            params += `&phone=${this.phone.replaceAll(' ', '')
            .replace('-', '')
            .replace('(', '')
            .replace(')', '')}`}
          this.$axios.get(`${environment.api}/admin/sms?type=history${params}`,
            {headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
              }}).then( (result) => {
            this.smsList = result.data;
          }, (err) => {
            this.checkError(err.response);
          });
        },
        getBalance() {
          this.$axios.get(`${environment.api}/admin/sms?type=balance`,
            {headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
              }}).then( (result) => {
            this.balance = result.data.balance;
          }, (err) => {
            this.checkError(err.response);
          });
        },
        checkError(error) {
          if (error.status === 401 || error.status === 403) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            this.$store.commit('setLoginState', false);
            this.$store.commit('setIsAdmin', false);
            this.$store.commit('setUser', null);
            this.$router.push('/admin');
          }
        }
      }
    }
</script>

<style scoped>
  @import "~/assets/default.scss";

</style>
