<template>
	<section id="page">
		<div class="page-main transition" v-bind:class="{'collapsed': isSideOpen}">
			<div class="page-hd clearfix">
				<img src="../assets/img/user.png" class="avatar" @click="sideToggle">
			</div>
			<div class="page-bd">
				<img src="../assets/img/logo.png" class="logo">
				<p class="desc"><span>额度更高</span>|<span>零手续费</span>|<span>审批更快</span></p>
			</div>
			<div class="page-ft">
        <label for="qrcode">
          <img src="../assets/img/scan.png" class="icon-scan">
          <span>扫码申请分期</span>
          <input type="file" id="qrcode" accept="image/jpeg, image/png" @change="chooseImage">
        </label>
			</div>
		</div>
		<aside class="sidebar transition" v-bind:class="{'open': isSideOpen}">
			<div class="sidebar-top text-center">
				<img src="../assets/img/avatar-circle.png" class="sidebar-avatar">
				<p class="account">15210647536</p>
			</div>
			<ul class="sidebar-menu">
				<li><router-link to="/myaccount" class="myaccount">我的账户</router-link></li>
				<li><router-link to="/problem" class="problem">常见问题</router-link></li>
				<li><a href="javacript:;" class="exit" @click="exit">退出登录</a></li>
			</ul>
		</aside>
	</section>
</template>
<script>
import { qcodeDecoder, logout } from '../api' 
export default {
	data () {
		return {
			isSideOpen: false
		}
	},
	methods: {
		sideToggle () {
			this.isSideOpen = !this.isSideOpen
		},
    touchStart (e) {
      this.startX = e.touches[0].clientX
      this.offsetX = 0
      this.startTime = Date.now()
    },
    touchMove (e) {
      e.preventDefault()
      this.offsetX = e.touches[0].clientX - this.startX
    },
    touchEnd (e) {
      if (Date.now() - this.startTime > 100) {
        if( this.offsetX > 80) {
          this.isSideOpen = true
        } else if (this.offsetX < -80) {
          this.isSideOpen = false
        }
      }
    },
    showToast (msg) {
      this.$toast({
        message: msg,
        duration: 2000
      })
    },
    chooseImage (e) {
      let qrcodeFile = document.getElementById('qrcode').files[0]
      if (!qrcodeFile) return false;
      // let formData = new FormData();
      // formData.append('qrcode', qrcodeFile)
      // qcodeDecoder(formData).then(res => {
      //   let result = res.data.result
      //   console.log(result)
      // })
      let result = '{"shopUuid": "85F1C4A00A614FCABE69A99628A334A7"}';
      if(result.indexOf('"shopUuid":') === -1) {
        this.showToast('二维码有误')
        return false
      }
      let shopUuid = JSON.parse(result).shopUuid
      if (shopUuid) {
        sessionStorage.setItem('shopUuid', shopUuid)
        this.$router.push('/channel')
      }
    },
    exit () {
      let data = {
        customerSessionId: sessionStorage.getItem('sessionId')
      }
      logout(data).then(res => {
        console.log(res)
        this.$router.push('/')
      })
    }
	},
  mounted () {
    let page = document.getElementById('page')
    page.addEventListener('touchstart', this.touchStart)
    page.addEventListener('touchmove', this.touchMove)
    page.addEventListener('touchend', this.touchEnd)
  }
}
</script>
<style scoped>
	.page-main {
		position: fixed;
		left: 0;
		width: 100%;
		height: 100%;
		background: url(../assets/img/yue_bg.png) no-repeat;
		background-size: 100% 100%;
    overflow: hidden;
	}
	.page-main.collapsed {
		left: 70%;
	}
	.page-hd {
		width: 100%;
		height: 100px;
		overflow: hidden
	}
  .avatar {
  	position: absolute;
  	top: 10px;
  	left: 10px;
  	width: 20px;
  	height: 20px;
  }
  .page-bd {
		padding: 20px;
		text-align: center
  }
  .logo {
  	width: 200px;
  	padding: 0 0 20px;
  }
  .desc {
  	font-size: 14px;
  	color: #fff;
  }
  .desc span {
  	padding: 0 10px;
  }
  .page-ft {
  	position: absolute;
  	bottom: 0;
  	width: 100%;
  	height: 40px;
  	line-height: 40px;
  	font-size: 16px;
  	color: #fff;
  	text-align: center;
  	background: #00b4ea;
  }
  .icon-scan {
  	width: 20px;
  	height: 19px;
  	vertical-align: middle
  }
  .sidebar {
  	position: absolute;
  	left: -70%;
  	width: 70%;
  	height: 100%;
  	padding: 20px;
  	background: #fff
  }
  .sidebar.open {
		left: 0;
	}
  .sidebar-top {
  	padding: 20px;
  	border-bottom: 1px solid #ccc;
  }
  .sidebar-avatar {
  	margin-bottom: 15px;
  }
  .account {
    margin: 5px;
    font-size: 16px;
  }
  .sidebar-menu {
  	text-align: left;
  	font-size: 16px
  }
  .sidebar-menu li a {
  	display: block;
  	padding: 15px;
  	color: #666;
  }
  .sidebar-menu li a::before {
  	content: '';
  	display: inline-block;
  	width: 20px;
  	height: 20px;
  	margin-right: 10px;
  	vertical-align: bottom;
  	background-size: cover;
  }
  .sidebar-menu li a.myaccount::before {
		background: url(../assets/img/user-circle.png) no-repeat;
  }
  .sidebar-menu li a.problem::before {
		background: url(../assets/img/problem-circle.png) no-repeat;
  }
  .sidebar-menu li a.exit::before {
		background: url(../assets/img/exit.png) no-repeat;
  }
</style>