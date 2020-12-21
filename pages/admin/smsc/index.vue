<template>
  <div>
    <div class="d-flex">
      <div class="d-flex">
        <v-select
          :items="categories"
          v-model="currentCategory"
          item-text="name"
          item-value="link"
          label="Категория"
          return-object
          solo
          @change="setSubCategory"
          class="mr-3"
        >
        </v-select>
        <v-select
          :items="currentCategory.subs"
          v-model="currentSubCategory"
          item-text="name"
          item-value="link"
          label="Подкатегория"
          return-object
          solo
          :disabled="currentCategory.subs.length === 0"
          @change="loadItems"
        >
        </v-select>
      </div>
    </div>
    <v-btn color="primary" class="mb-3" @click="openCategoryForm({data: null, mode: 0})">
      <v-icon>mdi-plus</v-icon>
      <span>Добавить товар</span>
    </v-btn>
    <v-dialog
      v-model="createNewDialog"
      width="700"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{dialogData.title}}
        </v-card-title>
        <v-card-text>
          <v-form v-model="createItemValid" class="mt-4">
            <v-row>
              <v-col cols="6" class="pt-0 pb-0">
                <v-select
                  :items="categories"
                  v-model="newItemForm.section"
                  item-text="name"
                  item-value="link"
                  label="Категория"
                  return-object
                  class="mr-3"
                >
                </v-select>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-select
                  :items="newItemForm.section.subs"
                  v-model="newItemForm.subsection"
                  item-text="name"
                  item-value="link"
                  label="Подкатегория"
                  return-object
                  :disabled="newItemForm.section.subs.length === 0"
                >
                </v-select>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-text-field
                  label="Артикул"
                  required filled
                  type="number"
                  v-model="newItemForm.code"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-text-field
                  label="Производитель"
                  required filled
                  type="text"
                  v-model="newItemForm.producer"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-select
                  :items="ages"
                  v-model="newItemForm.age"
                  item-text="name"
                  item-value="value"
                  label="Возраст животного"
                  v-if="currentCategory.link === 'korma' || currentCategory.link === 'vitaminy'"
                  return-object
                  solo
                ></v-select>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-select
                  :items="flavors"
                  v-model="newItemForm.flavor"
                  item-text="name"
                  item-value="value"
                  label="Вкус корма"
                  return-object
                  v-if="currentCategory.link === 'korma'"
                  solo
                ></v-select>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-text-field
                  label="Название"
                  required filled
                  v-model="newItemForm.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-textarea
                  label="Описание"
                  required filled
                  v-model="newItemForm.description"
                ></v-textarea>
              </v-col>
            </v-row>
            <div class="d-flex align-center" style="height: 250px">
              <div class="image-container">
                <v-img
                  max-height="250"
                  contain
                  :src="newItemForm.picture"
                ></v-img>
              </div>
              <div class="d-flex flex-column justify-space-between h-100 w-100 ml-4">
                <v-text-field
                  label="Скидка на категорию"
                  required filled
                  type="number"
                  hide-details
                  class="mb-2 flex-grow-0"
                  v-model="newItemForm.discount"
                ></v-text-field>
                <v-file-input
                  v-if="newItemForm.picture == null"
                  label="Фотография товара"
                  v-model="picture"
                  truncate-length="15"
                  hide-details
                  class="mb-4 flex-grow-0"
                  @change="pictureChange"
                ></v-file-input>
                <v-btn v-if="newItemForm.picture != null" @click="clearPhoto">Удалить фото</v-btn>
              </div>
            </div>

          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="itemSend"
          >
            {{dialogData.button}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      <div
        v-for="(item,i) in items"
        class="mb-2"
      >
       <category-item :item="item" :key="i"
                      v-on:openCategoryForm="openCategoryForm"
                      v-on:deleteCategory="deleteCategory"
       ></category-item>

      </div>
  </div>
</template>

<script>
    import {environment} from "../../../assets/environment";
    import {age, categories, flavor} from "../../../static/data";
    import CategoryItem from "../../../components/admin/categoryItem";

    export default {
      name: "index",
      components: {CategoryItem},
      layout: 'admin',
      data() {
        return {
          createItemValid: false,
          categories: categories,
          currentCategory: {
            name: '',
            link: '',
            subs: []
          },
          currentSubCategory: null,
          items: [],
          createNewDialog: false, // окно новой категории
          newItemForm: {
            age: null,
            flavor: null,
            producer: null,
            name: '',
            description: '',
            code: 0,
            discount: 0,
            picture: null,
            section: categories[0],
            subsection: categories[0].subs[0]
          },
          dialogData: {
            title: 'Добавление нового товара',
            button: 'Создать'
          },
          picture: null,
          ages: age,
          flavors: flavor,
          formMode: 0, // 0 - create, 1 - edit,
        }
      },
      mounted() {
        this.currentCategory = this.categories[0];
        this.newItemForm.section = this.categories[0];
        this.newItemForm.subsection = this.categories[0].subs[0];
        this.setSubCategory();
      },
      methods: {
        clearPhoto() {
          this.newItemForm.picture = null;
          this.picture = null;
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
        },
        resetItemForm() {
          this.newItemForm = {
            age: null,
            flavor: null,
            producer: null,
            name: '',
            description: '',
            code: 0,
            discount: 0,
            picture: null,
            section: this.categories[0],
            subsection: this.categories[0].subs[0]
          };
          this.picture = null;
        },
        setSubCategory() {
          if (this.currentCategory.subs.length !== 0) {
            this.currentSubCategory = this.currentCategory.subs[0];
          }
          this.loadItems();
        },
        loadItems() {
          this.$axios.get(`${environment.api}/admin/smsc?section=${this.currentCategory.link}&subsection=${this.currentSubCategory.link}`,
            {headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
              }}).then( res => {
              this.items = res.data;
            }, (err) => {
              this.checkError(err.response);
          })
        },
        openCategoryForm(event) {
          console.log(event);
          this.formMode =  event.mode;
          if ( event.mode === 0) { // create
            this.resetItemForm();
            this.dialogData.title = 'Добавление нового товара';
            this.dialogData.button = 'Создать';
          } else { // edit
            this.newItemForm = {... event.data};
            this.newItemForm.section = this.categories.filter(elem => elem.link === this.newItemForm.section)[0];
            this.newItemForm.subsection = this.newItemForm.section.subs.filter(elem => elem.link === this.newItemForm.subsection)[0];
            this.newItemForm.picture = this.newItemForm.picture != null ? environment.api + this.newItemForm.picture : null;
            this.dialogData.title = 'Редактирование товара';
            this.dialogData.button = 'Обновить';
            console.log(this.newItemForm);
          }
          this.createNewDialog = true;
        },
        pictureChange() {
          this.newItemForm.picture = this.picture != null ? URL.createObjectURL(this.picture) : '';
        },
        itemSend() {
          this.formMode === 0 ? this.createCategory() : this.updateCategory()
        },
        updateCategory() {
          const formData = new FormData();
          formData.append("picture", this.picture != null ?
            this.picture :
            this.newItemForm.picture != null ? this.newItemForm.picture.replace(environment.api, '') : null);
          // formData.append("picture", null);
          formData.append("name", this.newItemForm.name);
          formData.append("description", this.newItemForm.description);
          formData.append("code", this.newItemForm.code);
          formData.append("discount", this.newItemForm.discount);
          formData.append("section", this.newItemForm.section.link);
          formData.append("subsection", this.newItemForm.subsection.link);
          this.newItemForm.age != null ? formData.append("age", this.newItemForm.age.value) : false;
          this.newItemForm.flavor != null ? formData.append("flavor", this.newItemForm.flavor.value) : false;
          formData.append("producer", this.newItemForm.producer);
          this.$axios.put(`${environment.api}/admin/categories/${this.newItemForm.id}`, formData,
            {headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
              }}
          ).then( res => {
            this.resetItemForm();
            this.loadItems();
            this.createNewDialog = false;
          }, (err) => {
            this.checkError(err.response);
          })
        },
        createCategory() {
          const formData = new FormData();
          formData.append("picture", this.picture != null ? this.picture : this.newItemForm.picture);
          formData.append("name", this.newItemForm.name);
          formData.append("description", this.newItemForm.description);
          formData.append("code", this.newItemForm.code);
          formData.append("discount", this.newItemForm.discount);
          formData.append("section", this.currentCategory.link);
          formData.append("subsection", this.currentSubCategory.link);
          this.newItemForm.age != null ? formData.append("age", this.newItemForm.age.value) : false;
          this.newItemForm.flavor != null ? formData.append("flavor", this.newItemForm.flavor.value) : false;
          formData.append("producer", this.newItemForm.producer);
          this.$axios.post(`${environment.api}/admin/categories`, formData,
                {headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                  }}
          ).then( res => {
            this.resetItemForm();
            this.loadItems();
            this.createNewDialog = false;
          }, (err) => {
            this.checkError(err.response);
          })
        },
        deleteCategory(id) {
          this.$axios.delete(`${environment.api}/admin/categories/${id}`,
            {headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
              }}
          ).then( res => {
            this.loadItems();
          }, (err) => {
            this.checkError(err.response);
          })
        }
      }
    }
</script>

<style scoped>
  @import "~/assets/default.scss";
  .image-container{
    min-width: 250px;
    width: 250px;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: lightgray;
  }
  .sub-items-list{
    border-radius: 5px;
    border: 1px solid lightgray;
    height: 10px;
  }
</style>
