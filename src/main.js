// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import App from './App'
import routes from './router'
import MintUI from 'mint-ui'
import { Indicator, Toast } from 'mint-ui';
import 'mint-ui/lib/style.css'
import './assets/css/main.css'
Vue.use(Router)
Vue.use(MintUI)
const router = new Router({
  routes  
})
router.beforeEach((to, from, next) => {
	if(to.path === '/' || to.path === '/signup' || to.path === '/resetpass' || 
		to.path === '/smsLogin' || to.path === '/agreement') {
		sessionStorage.clear()
		return next()
	} else {
		if (!sessionStorage.getItem('sessionId')) {
			return next('/')
		} else {
			return next()
		}
	}
})
axios.interceptors.request.use(function (config) {
  Indicator.open({
	  spinnerType: 'fading-circle'
	})
	console.log(config)
  return config
}, function (error) {
  console.log('request error')
  return Promise.reject(error)
})
axios.interceptors.response.use(function (res) {
	Indicator.close()
  if (res.data.code ===  999) {
  	sessionStorage.removeItem('sessionId')
    Toast('长时间未操作,请重新登录')
    return router.push('/')
  } else if (res.data.code === 403) {
  	Toast('无此权限')
  	return router.push('/index')
  }
  return res;
}, function (error) {
	console.log(error)
  Toast('服务器响应错误，请重试')
  return Promise.reject(error)
})
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
