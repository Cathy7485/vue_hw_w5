import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js'

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'kc777';

const productModal = {
  //當id變動時，取得遠端資料，並呈現modal
  props: ['id', 'addToCart'],
  data(){
    return {
      modal:{},
      tempProduct: {},
      qty: 1,
    }
  },
  template:"#userProductModal",
  watch: {
    id(){
      console.log('productModal:' , this.id);
      axios.get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
        .then(res => {
          console.log('單一產品:', res.data.product);
          this.tempProduct = res.data.product;
          this.modal.show();
        })
    }
  }, 
  methods:{
    hide(){
      this.modal.hide();
    }
  },
  mounted(){
    this.modal = new bootstrap.Modal(this.$refs.modal);
  }
}

const app = createApp({
  data(){
    return{
      products: [],
      productId: '',
    }
  },
  methods:{
    getProducts(){
      axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
        .then(res=>{
          console.log( '產品列表:',res.data.products);
          this.products = res.data.products;
        })
    },
    openModal(id){
      this.productId = id;
      console.log("從外層帶入", id)
    },
    addToCart(product_id, qty = 1){ //當沒有使用參數時，會使用預設值
      const data ={
        product_id,
        qty,
      };
      axios.post(`${apiUrl}/v2/api/${apiPath}/cart`,{ data })
        .then(res => {
          console.log('加入購物車:', res.data);
          this.$refs.productModal.hide();
        })
    },
  },
  // 區域註冊
  components: {
    productModal,
  },
  mounted(){
    this.getProducts();
    
  }


});


app.mount('#app')


























