<template>
<div class="page">
	<div class="banner"></div>
	<ul class="channel-list">
		<li class="channel-item" v-for="channel in channelList">
			<div class="channel-item-icon"></div>
			<div class="channel-item-detail" @click="selectChannel(channel)">
				<p v-text="channel.mechanismNickName"></p>
				<span>分期金额：￥{{channel.lowestAmount}}-{{channel.amount}}</span>
			</div>
		</li>
	</ul>
</div>
</template>

<script>
import { getShopMechanismInfoList } from '../api'
	export default {
		data () {
			return {
				channelList: []
			}
		},
		methods: {
			getMechanismList () {
				let sessionId = sessionStorage.getItem('sessionId')
    		let shopUuid = sessionStorage.getItem('shopUuid')
    		let data = {
    			shopUuid: shopUuid,
        	customerSessionId: sessionId
    		}
    		getShopMechanismInfoList(data).then(res => {
    			console.log(res)
    			if (res.data.code === 0) {
    				let result = res.data.result;
	    			let shopId = result.shopData.shopId;
	    			let shopName = result.shopData.shopName;
	    			this.channelList = result.shopMechanismInfoVoList;
    			} else {
    				 this.$toast({
							message: res.data.message
						})
    			}
    		})
			},
			selectChannel (channel) {
				sessionStorage.setItem('shopMechanism', JSON.stringify(channel))
				this.$router.push('/chooseterm')
			}
		},
		mounted () {
			this.getMechanismList()
		}
	}
</script>

<style scoped>
p {
	margin: 0;
}
.banner{
	width:100%;
	height:149px;
	background-image: url(../assets/img/channel-bg.png);
	background-repeat: no-repeat;
	background-position: center center;
	background-size:cover;
	margin-bottom: 20px;
}
.channel-item {
	height:44px;
	border-top: 1px solid #e4e4e4;
	border-bottom: 1px solid #e4e4e4;
	display: flex;
	align-items: center;
	background: #fff;
	margin-bottom:10px;
}
.channel-item-icon {
	width:26px;
	height:26px;
	background-image: url(../assets/img/purse.png);
	background-repeat: no-repeat;
	background-position: center center;
	background-size: 100%;
	margin:0 4%;
}
.channel-item-detail {
	display: block;
	width: 100%;
}
.channel-item-detail > span{
	color:#d0d0d0;
	font-size: 12px;
}
</style>