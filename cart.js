import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js'


const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'kc777';

const app = createApp({
  data(){
    return{
      products: [],

    }
  },
  methods:{
    getProducts(){
      axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
        .then(res=>{
          console.log( '產品列表:',res.data.products);
          this.products = res.data.products;
        })
    }
  },
  mounted(){
    this.getProducts();
  }


});


app.mount('#app')


























