import Vue from 'vue'
import App from './App'
//加载公共应用类
import Apiencry from "@/common/api/encryption.js"
import St from '@/common/lib/system.js'
import Fn from '@/common/lib/function.js'
import Cf from '@/common/lib/config.js'
import Http from '@/common/lib/http.js'
import Login from '@/common/lib/login.js'
Vue.prototype.$St = St
Vue.prototype.$Fn = Fn
Vue.prototype.$Cf = Cf
Vue.prototype.$Http = Http
Vue.prototype.$Apiencry = Apiencry
Vue.prototype.$login = Login

Vue.config.productionTip = false
App.mpType = 'app'



const app = new Vue({
	...App
})
//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
// RouterMount(app, '#app')
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
