export default class Article {
  public static getTypes = [
    {name: 'Новость или Акция', value: 'NEWS'},
    {name: 'Статья', value: 'ARTICLE'}
  ]

  text: any;
  title: any;
  type: any;
  slug: any;
  picture: any;
  created_date: any;
  published_date: any;

  constructor() {
    this.text = '';
    this.title = '';
    this.type = 'ARTICLE';
  }
}
