<template>
	<section>
		<div class="page" v-bind:class="{'focus': isFocus}">
			<div class="page-hd">
				<router-link to="/signup" class="signup-link">注册</router-link>
				<p class="logo"><img src="../assets/img/yue_logo.png"></p>
			</div>
			<div class="page-bd">
				<form name="signinForm" class="signinForm">
					<mt-field label="手机号" placeholder="请输入手机号" type="tel" class="icon_phone" v-model="form.mobile"></mt-field>
					<mt-field label="密码" placeholder="请输入密码" type="password" class="icon_pass" v-model="form.pass"></mt-field>
					<mt-button type="default" size="large" class="signin-button" @click.prevent="onSubmit">登 录</mt-button>
				</form>
			</div>
			<div class="page-ft">
				<p class="text-center">
					<router-link to="/resetpass">忘记密码</router-link>|
    			<router-link to="/smsLogin">短信验证登录</router-link>
				</p>
			</div>
		</div>
	</section>
</template>
<script>
import { requestLogin } from '../api'
import Validate from '../assets/js/WxValidate'
import Md5 from '../assets/js/md5'
import utils from '../assets/js/utils'
export default {
	data () {
		return {
			form: {
				mobile: '',
				pass: ''
		  },
		  isFocus:  false
		}
	},
	methods: {
		showToast (msg) {
			this.$toast({
			  message: msg,
			  duration: 1000
			})
		},
		focusEvent () {
			this.isFocus = true
		},
		blurEvent () {
			this.isFocus = false
		},
		initValidate() {
	    this.validate = new Validate({
	      mobile: {
	        required: true,
	        tel: true, 
	      },
	      pass: {
	        required: true,
	        minlength: 6 
	      }
	    }, {
	      mobile: {
	        required: '请输入手机号',
	        tel: '请输入正确手机号'
	      },
	      pass: {
	        required: '请输入密码',
	        minlength: '密码不少于6位'
	      },
	    })
    },
		onSubmit () {
			let self = this;
			if (!this.validate.checkForm(this.form)) {
	      const error = this.validate.errorList[0]
	      this.showToast(error.msg)
	      return false
	    }
	    let form = {
	    	mobile: this.form.mobile,
	    	pass: Md5.hex_md5(this.form.pass)
	    }
	    console.log(form)
			requestLogin(form).then(res => {
				console.log(res)
				if(res.data.code === 0) {
					self.showToast('登录成功')
					let name = btoa(escape(btoa(self.form.mobile).split('').reverse().join()))
          let pass = btoa(escape(btoa(self.form.pass).split('').reverse().join()))
          utils.setCookie('mobile', name, '7d')
          utils.setCookie('ukey', pass, '7d')
					let result = res.data.result
					sessionStorage.setItem('sessionId', result.customerSessionId)
					this.$router.push({ path: '/index' })
				} else {
					self.showToast(res.data.message)
				}
			})
			.catch(function (error) {
        console.log(error)
      })
		}
	},
	mounted () {
		this.initValidate()
		if (utils.getCookie('mobile') && utils.getCookie('ukey')) {
      this.form.mobile = atob(unescape(atob(utils.getCookie('mobile'))).split(',').reverse().join(''))
      this.form.pass = atob(unescape(atob(utils.getCookie('ukey'))).split(',').reverse().join(''))
    }
    let input = document.getElementsByClassName('mint-field-core')
    input[0].addEventListener('focus', this.focusEvent)
    input[1].addEventListener('focus', this.focusEvent)
    input[0].addEventListener('blur', this.blurEvent)
    input[1].addEventListener('blur', this.blurEvent)
	}
}
</script>
<style scoped>
	.page {
	  position: absolute;
	  top: 0;
	  bottom: 0;
	  width: 100%;
	  background: #00b4ea url(../assets/img/sign_bg.png) no-repeat;
	}
	.page.focus {
		bottom: -100%;
	}
	.signup-link {
		position: absolute;
		top: 5px;
		right: 5px;
		padding: 10px;
		color: #fff;
	}
	.logo {
		padding: 10px;
		text-align: center
	}
	.page-bd {
		padding: 15px;
		color: #fff;
	}
	.signin-button {
		margin-top: 30px;
		color: #00b4e7;
		background: #fff
	}
	.page-ft {
		width: 100%;
		margin-top: 50px;
		color: #ddd;
		font-size: 14px
	}
	.page-ft a {
		padding: 0 10px;
	}
</style>