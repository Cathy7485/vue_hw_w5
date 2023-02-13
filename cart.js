import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js'

// 表單驗證，把全部規則載進來
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  // validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

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

const app = Vue.createApp({
  data(){
    return{
      products: [],
      productId: '',
      cart: {},
      loadingItem: '', //存id

      data:{
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      }
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
        .catch(err => alert(err.response.data.message))
    },
    deleteItem(item) { 
      this.loadingItem = item.id;
      axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`)
        .then(res => {
          this.loadingItem = '';
          this.getCarts();
        })
        .catch(err => alert(err.response.data.message))
    },
    onSubmit(){
      console.log('onSubmit');
    }  
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
// 表單驗證元件(全域註冊)
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app')


























