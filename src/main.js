import { createApp } from 'vue'
import './style.css'
import 'dotenv'
import App from './App.vue'
// 引入vue-amap
import VueAMap, { initAMapApiLoader } from '@vuemap/vue-amap'
import '@vuemap/vue-amap/dist/style.css'

console.log('111')
// 初始化vue-amap
initAMapApiLoader({
    // 高德的key
    key: process.env.AMAP_API_KEY,
    securityJsCode: 'securityJsCode', // 新版key需要配合安全密钥使用
    //Loca:{
    //  version: '2.0.0'
    //} // 如果需要使用loca组件库，需要加载Loca
})

createApp(App).use(VueAMap).mount('#app')
