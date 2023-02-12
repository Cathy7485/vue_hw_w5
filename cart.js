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
      cart: {},
      loadingItem: '', //存id
    }
  },
  methods:{
    getProducts(){
      axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
        .then(res=>{
          this.products = res.data.products;
        })
    },
    openModal(id){
      this.productId = id;
    },
    addToCart(product_id, qty = 1){ //當沒有使用參數時，會使用預設值
      const data ={
        product_id,
        qty,
      };
      axios.post(`${apiUrl}/v2/api/${apiPath}/cart`,{ data })
        .then(res => {
          this.$refs.productModal.hide();
          this.getCarts();
        })
    },
    getCarts() {
      axios.get(`${apiUrl}/v2/api/${apiPath}/cart`)
        .then(res => {
          this.cart = res.data.data;
        })
    },
    updateCartItem(item){ // 83行是購物車的id, 80行是產品的id
      const data = {
        product_id: item.product.id,
        qty: item.qty,
      };
      this.loadingItem = item.id;
      axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`, {data})
        .then(res => {
          this.loadingItem = '';
          this.getCarts();
        })
    },
    deleteItem(item) { 
      this.loadingItem = item.id;
      axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`)
        .then(res => {
          this.loadingItem = '';
          this.getCarts();
        })
    },
  },
  // 區域註冊
  components: {
    productModal,
  },
  mounted(){
    this.getProducts();
    this.getCarts();
    
  }


});


app.mount('#app')


























