<template>
  <div>
    <div class="d-flex justify-space-between">
      <h3>Статьи</h3>
      <v-dialog v-model="articleOpen" persistent max-width="800">
        <template v-slot:activator="{on, attrs}">
          <v-btn color="primary" v-bind="attrs" v-on="on">
            Добавить статью
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">
            {{mode === 'add' ? 'Добавление статьи' : 'Редактирование статьи'}}
          </v-card-title>
          <v-card-text>
            <v-text-field class="mb-4" hide-details label="Название статьи" v-model="article.title"></v-text-field>
            <v-radio-group v-model="article.type">
              <v-radio
                v-for="type of articleClass.getTypes"
                :key="type.value"
                :label="type.name"
                :value="type.value"
              ></v-radio>
            </v-radio-group>
            <tiptap-vuetify v-model="article.text" :extensions="extensions"/>
            <div class="mt-3">{{article.text ? article.text : 'Здесь будет отображаться результат'}}</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="purple darken-1" outlined text @click="saveArticle">
              Сохранить
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              outlined
              @click="articleOpen = false"
            >
              Закрыть
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>

</template>

<script>
  import {
    TiptapVuetify,
    Heading,
    Bold,
    Italic,
    Strike,
    Underline,
    Code,
    Paragraph,
    BulletList,
    OrderedList,
    ListItem,
    Link,
    Blockquote,
    HardBreak,
    HorizontalRule,
    History
  } from 'tiptap-vuetify'
  import Article from "../../../class/article";

  export default {
    components: { TiptapVuetify },
    layout: 'admin',
    name: "index",
    data() {
      return {
        extensions: [
          History,
          Blockquote,
          Link,
          Underline,
          Strike,
          Italic,
          ListItem,
          BulletList,
          OrderedList,
          [
            Heading,
            {
              options: {
                levels: [1, 2, 3]
              }
            }
          ],
          Bold,
          Link,
          Code,
          HorizontalRule,
          Paragraph,
          HardBreak
        ],
        article: Article,
        articleClass: Article,
        articleOpen: false,
        mode: 'add'
      }
    },
    methods: {
      saveArticle() {
        console.log(this.article);
      }
    },
    mounted() {
      this.article = new Article();
    }
  }
</script>

<style scoped lang="scss">

</style>
