<template>
  <div id="stockcard" :style="{ '--order': index }" class="p-2 select-none px-4 border mb-4 rounded">
    <div
      @click="toggleCollapse"
      
      class="
        flex
        w-full
        
        flex-col
        items-start
        sm:flex-row
        justify-between
        sm:items-center
        
        relative
        
        
      "
      >
      <!-- <span class="absolute top-0 right-0 px-2">{{ stock.percentage_change }}</span> -->
      <div class="stock_name_container my-2 flex-grow flex items-center">
        <div class="border p-2 w-12 rounded-3xl">
          <img :src="stock.image_url" class="w-full" />
        </div>
        <div class="mx-4 flex-grow">
          <p class="stock_abbr font-bold">{{ stock.symbol }}</p>
          
        </div>
      </div>
      <div class="stock_details border-t sm:border-0 py-2 w-full my-2 grid grid-cols-3 gap-10">
        <div class="text-center">
          <p class="font-medium text-gray-500 text-xs">Volume</p>
          <p>{{ stock.volume }}</p>
        </div>
         <div class="text-center">
          <p class="font-medium text-gray-500 text-xs">percent flux</p>
          <span :class="color" class="px-2 text-xs font-medium">{{ stock.percentage_change }}</span>
        </div> 
        <div class="text-center">
          <p class="font-medium text-gray-500 text-xs">Unit Price </p>
          <p class="ibm font-bold break-words">&#8358;{{ stock.unit_price }}</p>
        </div>
      </div>
    </div>
     <transition name="fade">
    <div v-show="isShow">
        <div class="flex justify-between items-center">
          <div>
            <p>Quantity:</p>
            <div class="flex items-center">
              <button @click="crement('-')" class="border p-2 rounded-full bg-black  h-8 w-8  flex justify-center items-center text-white font-light text-2xl">-</button>
              <p class="px-3">{{quantity}}</p>
              <button @click="crement('+')" class="border p-2 rounded-full bg-black  h-8 w-8  flex justify-center items-center text-white font-light text-2xl">+</button>
            </div>
          </div>
          <div>
            <button @click="purchase()"  :disabled="disable" class="border flex p-1 rounded px-6 hover:shadow bg-black text-white items-center "><BtnSpinner v-if="isSpin" /><span class="px-2">Buy</span></button>
          </div>
        </div>
    </div>
    </transition>
  </div>
</template>
<script>
import {ref, computed} from 'vue'
import {useStore} from 'vuex'
import { ElNotification } from "element-plus";
import BtnSpinner from './BtnSpinner.vue'

// const Quantity = Symbol("jo")
export default {
  name: "StockCard",
  setup(props){
    const isShow = ref(false)
    const isSpin = ref(false)
    const store = useStore()
    const quantity = ref(0)
    const data = { ...props.stock}
    const crement = (sign) => {
        if(sign === '+') {quantity.value += 1}
        else { quantity.value = quantity.value <= 0 ? quantity.value = 0 : quantity.value -= 1 }
     } 
    const toggleCollapse = () => {
      isShow.value = !isShow.value
    }
    const purchase = async () => {
      data.quantity = quantity.value.toString()
      isSpin.value= true;
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve(
            store.dispatch('assets/purchaseStock', data).then(() => {
              isSpin.value= false;
              store.dispatch("auth/refresh").then(() => {
                ElNotification({
                  title: "stock purchased",
                  type: "success",
                  message: "",
                })
              })
        // console.log(res)
      }).catch((err) => {
        isSpin.value= false; 
        ElNotification({
                  title: err.response.data.message,
                  type: "error",
                  message: "",
                })
        })
          );
        }, 1000)
      );
      isSpin.value= false;
      
    }
    return {
      crement,
      isSpin,
      purchase,
      quantity,
       color: computed(() => {
         const sign = props.stock.percentage_change.toString().charAt(0)
         let classes;
         switch(sign){
           case '-':
               classes = 'text-red-500';
               break;
           case '+':
               classes = 'text-green-500';
               break;
               default:
                 classes = 'text-green-500'
         }
         return classes
       }),
      disable: computed(() => { if (quantity.value <= 0 || isSpin.value === true) { return true } return false  }),
      isShow,
      toggleCollapse
    }
  },
  components: {
      BtnSpinner
  },
  props: ["stock", "index"],
};
</script>
<style lang="scss" scoped>
#stockcard {
  box-shadow: 0px 0px 10px rgba(12, 24, 37, 0.05);
  transition: .35s ease-in-out;
  animation-name: fadeUpOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 0.35s;
  animation-delay: calc(var(--order) * 200ms);
}
@keyframes fadeUpOpacity {
  20% {
    opacity: 0;
    transform: translateY(100px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
