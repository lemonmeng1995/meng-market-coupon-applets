<template>
	<view class="loading">
		<image src="../../static/v2/loading.gif" mode="widthFix" v-show="isShow"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: true,
				quick_id: '',
				pay_code: '',
				pay_msg: ''
			}
		},
		onLoad(e) {
			let rq = this.$Apiencry.getrq(e.rq);
			this.out_trade_no = rq.out_trade_no;
			this.quick_id = rq.quick_id;
			this.getORderQuery()
		},
		methods: {
			getORderQuery() {
				let data = this.$Apiencry.aes_encryptObject({
					activity_id: this.$Cf.configData.activity_id,
					out_trade_no: this.out_trade_no,
					quick_id: this.quick_id
				})
				let time = 10;
				let orede_time = setInterval(() => {
					this.$Http.api({
						url: 'quickOrderQuery',
						method: "GET",
						data: data,
					}).then(res => {
						let code = res.data.pay_code;
						let pay_msg = res.data.pay_msg;
						if (Number(code) > 1) {
							this.pay_code = code;
							this.pay_msg = pay_msg
							clearInterval(orede_time);
							this.linkPage()
						} else {
							time--;
							if (time <= 0) {
								this.pay_code = code;
								this.pay_msg = pay_msg
								clearInterval(orede_time);
								this.linkPage()
							}
						}
					})
				}, 2000);
			},
			linkPage() {
				let rq_data = this.$Apiencry.aes_encryptObject({
					pay_code: this.pay_code,
					pay_msg: this.pay_msg,
					quick_id: this.quick_id
				})
				uni.redirectTo({
					url: `/detail/detailPages/detailIndex/detailIndex?rq=${rq_data.rq}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.loading {
		text-align: center;

		image {
			width: 294rpx;
			margin-top: 50%;
		}
	}
</style>
