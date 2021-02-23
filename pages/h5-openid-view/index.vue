<!-- 打开H5页面 -->
<template>
	<view>
		<web-view :src="src" v-if="src.length > 0"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				SystemInfo: this.SystemInfo,
				src: ''
			};
		},
		watch: {
			src(val) {
				this.src = val;
			}
		},
		onLoad(e) {
			let page = this;
			if (e.src) {
				let src = decodeURIComponent(decodeURIComponent(e.src));
				page.src = src;
			};
			if (e.payParam) {
				let openid_coupon = JSON.parse(decodeURIComponent(e.payParam)).openid;
				this.$St.storageOperation('set', 'openid_coupon', openid_coupon)
				let data = page.$Apiencry.aes_encryptObject({
					activity_id:page.$Cf.configData.activity_id,
					openid_coupon:openid_coupon
				})
				page.$Http.api({
					url:'openidCoupon',
					method: 'POST',
					data: data
				}).then(res=>{
					if(res.code == 0){
						uni.showToast({
							title:'保存成功'
						})
						uni.reLaunch ({
							url:'/pages/index/index'
						});
					}
				})
			}
		},
		computed: {},
		methods: {}
	};
</script>

<style></style>
