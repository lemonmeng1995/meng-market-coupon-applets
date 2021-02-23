<template>
	<view class="detail">
		<view class="det_banner">
			<uni-swiper-dot :info="det_bannerData" mode="round" field="content" :current="current" :dots-styles="dotsStyles">
				<swiper class="swiper-block" :autoplay="true" :interval="3000" :duration="1000" circular="true" previous-margin="45rpx"
				 next-margin="45rpx" current="0" @change="change">
					<swiper-item class="swiper-item" v-for="(item, index) in det_bannerData" :key="index">
						<image :src="item+this.$Fn.imageResize()" class="slide-image" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>
		<view class="det_share">
			<view class="share_box">
				<view class="share_title">{{name}}</view>
				<view class="color-999" v-if="isStore">累计已领 {{sale_count_num}}</view>
			</view>
			<view>
				<view class="share_detail" v-if="!isStore">
					<view class="share_detail_left">
						<view>
							<view class="detail_images">
								<image src="../../../static/v2/iconbiao.png" />
							</view>
							<text class="detail_prices">光享价</text>
							<text class="detail_icon">￥</text>
							<text class="detail_icon iconbigsize">{{pay_amount}}</text>
						</view>
						<!-- <view class="orgin-prices"><text>原价￥{{cost_price}}</text></view> -->
					</view>
					<view class="share_detail_right">
						<text>今日已售{{quantity_usage}}</text>
						<text style="margin:0 4rpx;">/</text>
						<text>累计已售{{sale_count_num}}</text>
					</view>
				</view>
				<view class="store_detail" v-if="merchant_count > 0" @click="linkShop">
					<view class="store_detail_title">{{merchant_count}}家门店通用</view>
					<view class="store_detail_view">
						<image src="../../../static/v2/md.png" mode=""></image>
						<text>查看门店列表</text>
						<uni-icons type="arrowright"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view class="detail_richtext">
			<view v-html="detail_rule"></view>
		</view>
		<view class="bottom_box">
			<view>
				<text class="bottom_box_price">光享价：</text>
				<text class="bottom_box_icon">¥</text>
				<text class="bottom_box_icon bigiconbtm">{{pay_amount}}</text>
			</view>
			<view class="bottom_btn" :style="{background:color}" @click="payMent"><text v-show="!show">{{text}}</text>
				<uni-countdown color="#fff" :second="second" background-color="transparent" :show-day="false" v-show="show"
				 splitor-color="#fff" @timeup="finish"></uni-countdown>
			</view>
		</view>
		<view class="active-box" @click="linkPage">
			<image src="../../../static/v2/activeimg3.png" />
		</view>


		<uni-popup ref="popup1" :maskClic="false">
			<view class="dialog_wrap paybackDialogshow">
				<view class="dialog_title">温馨提示</view>
				<view class="dialog_info" v-html="msg"></view>
				<view class="onclose" @click="onClose('popup1')">
					<image src="../../../static/v2/close.png" mode="" class="v2_close"></image>
				</view>
				<view class="btns">
					<button @click="onClose('popup1')" class="round">我已知晓</button>
				</view>
			</view>
		</uni-popup>


		<uni-popup ref="popup2" :maskClic="false">
			<view class="dialog_wrap paybackDialogshow">
				<view class="dialog_title">温馨提示</view>
				<view v-if="pay_code == 2 || pay_code == 3" v-html="pay_msg"></view>
				<view v-else-if="pay_code == 11" class="dialog_info" style="text-align:center">{{pay_msg}}</view>
				<view class="v2-red-color" v-else>{{pay_msg}}</view>
				<view class="onclose" @click="onClose('popup2')">
					<image src="../../../static/v2/close.png" mode="" class="v2_close"></image>
				</view>
				<view class="btns">
					<button @click="onClose('popup2')" class="round">我已知晓</button>
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				activity_id: '',
				quick_id: '',
				isStore: true,
				det_bannerData: [],
				current: 0,
				dotsStyles: {
					width: 6,
					backgroundColor: 'rgba(225, 225, 225, 0.6)',
					border: '0',
					bottom: 12,
					selectedBackgroundColor: '#fff',
					selectedBorder: '0'
				},
				second: 0,
				show: false,
				text: '',
				color: "rgb(139, 139, 139)",
				name: '',
				cost_price: '',
				pay_amount: '',
				is_sell_out: '',
				quantity_usage: '',
				sale_count_num: '',
				detail_rule: '',
				disabled_button_text: '',
				enable_button_text: '',
				is_band_mobile: '',
				merchant_count: "",
				disable: false,
				pay_code: '',
				pay_msg: '',
				msg: ''
			};
		},
		onLoad(e) {
			let rq = this.$Apiencry.getrq(e.rq);
			if (typeof rq.pay_code != "undefined" && rq.pay_code != "") {
				this.tabIndex = rq.card_type == 5 ? 1 : 0
				this.pay_code = rq.pay_code
				this.pay_msg = rq.pay_msg
				this.$refs.popup2.open()
			}
			this.name = rq.name;
			this.activity_id = this.$Cf.configData.activity_id;
			this.quick_id = rq.quick_id;
		},
		onShareAppMessage(res) {
			let shareInfo = uni.getStorageSync('activityInfo')
			return {
				title: shareInfo.share_title,
				path: "/pages/index/index",
			};
		},
		onShow() {
			this.getQuickDetail()
		},
		methods: {
			getQuickDetail() {
				uni.showLoading({
					title: '加载中'
				})
				let data = this.$Apiencry.aes_encryptObject({
					activity_id: this.activity_id,
					quick_id: this.quick_id
				})
				this.$Http.api({
					url: 'couponNewDetail',
					method: 'GET',
					data: data
				}).then(res => {
					if (res.code == 0) {
						let bjcard = res.data;
						this.is_band_mobile = bjcard.is_band_mobile;
						this.isStore = bjcard.activity_type == 1 ? true : false;
						this.merchant_count = bjcard.merchant_count;
						this.cost_price = bjcard.cost_price
						this.pay_amount = bjcard.pay_amount
						this.quantity_usage = bjcard.quantity_usage;
						this.sale_count_num = bjcard.sale_count_num ? bjcard.sale_count_num : '0';
						this.det_bannerData = bjcard.detail_banner.split(',')
						this.detail_rule = bjcard.detail_rule;
						this.disabled_button_text = bjcard.disabled_button_text;
						this.enable_button_text = bjcard.enable_button_text;
						this.is_sell_out = bjcard.is_sell_out;
						if (this.is_sell_out == 0) {
							this.text = "今日已售罄";
							this.color = "#8b8b8b";
						} else if (this.is_sell_out == 1) {
							this.text = bjcard.disabled_button_text;
							this.color = "#8b8b8b";
							if (bjcard.card_time) {
								this.card_time = bjcard.card_time;
								let itemArr = bjcard.timing_week.split(',');
								let myD = new Date();
								let week = myD.getDay().toString();
								if (itemArr.indexOf(week) != -1) {
									let start_titem = new Date(`${myD.getFullYear()}/${myD.getMonth() + 1}/${myD.getDate()} ${this.card_time}`).getTime(); //设置活动开始时间
									// let s_before_titem = start_titem - 5 * 60 * 1000;
									let cur_time = bjcard.now_time; //服务器当前时间
									if (cur_time >= start_titem) {
										this.show = false;
									} else {
										this.time = Math.round((start_titem - cur_time) / 1000);
										this.show = true;
										this.second = this.time
									}
								}
							}
						} else if (this.is_sell_out == 2) {
							this.text = "已参与";
							this.color = "#8b8b8b";
						} else if (this.is_sell_out == 3) {
							this.text = "未达标";
							this.color = "#8b8b8b";
						} else if (this.is_sell_out == 4) {
							this.text = "非新用户";
							this.color = "#8b8b8b";
						} else {
							this.text = bjcard.enable_button_text;
							this.color = "linear-gradient(108deg, #fa7b7c 4%, #f83131 87%)";
						}
						uni.hideLoading();
						if (bjcard.is_stock_msg) {
							uni.showToast({
								title: bjcard.is_stock_msg,
								icon: 'none'
							})
						}
					}
				}).catch(e => {
					console.log(e)
					uni.hideLoading();
				})
			},
			finish() {
				this.show = false;
				this.color = "linear-gradient(108deg, #fa7b7c 4%, #f83131 87%)";
				this.text = this.enable_button_text;
				this.is_sell_out = null;
			},
			payMent() {
				if (this.is_sell_out === '2' || this.is_sell_out === '0' || this.is_sell_out === '1' || this.is_sell_out === '3' ||
					this.is_sell_out === '4')
					return false;
				if (this.disable) return false
				this.disable = true
				let timer = setTimeout(() => {
					clearTimeout(timer)
					this.disable = false
				}, 2000)
				let page = this
				let data = page.$Apiencry.aes_encryptObject({
					card_type: 'quick',
					activity_id: page.activity_id
				})
				let is_band_mobile = this.is_band_mobile;
				if (is_band_mobile == "") {
					this.$Fn.throttle(() => {
						uni.navigateTo({
							url: "/user/entrance/entrance?page=detailIndex"
						})
					})();
				} else {
					let data = page.$Apiencry.aes_encryptObject({
						activity_id: this.activity_id,
						card_type: 'quick',
						quick_id: this.quick_id
					})
					page.$Http.api({
						url: 'quickPayment',
						method: 'POST',
						data: data
					}).then(res => {
						if (res.code == 0) {
							let payData = res.data
							let rq_data = this.$Apiencry.aes_encryptObject({
								quick_id: this.quick_id,
								out_trade_no: payData.outTradeNo
							})
							uni.requestPayment({
								provider: 'wxpay',
								appId: payData.appId,
								timeStamp: payData.timeStamp,
								nonceStr: payData.nonceStr,
								package: payData.package,
								signType: payData.signType,
								paySign: payData.paySign,
								success: function(res) {
									uni.redirectTo({
										url: `/pages/loading/loading?rq=${rq_data.rq}`
									})
								},
								fail: function(err) {
									page.orderCancel(payData.outTradeNo)
								}
							});
						}
					}).catch(e => {
						if (e.code == 2020007) {
							page.msg = e.msg
							page.$refs.popup1.open()
						} else if (e.code == 20200730) {
							page.color = "#8b8b8b";
							page.text = page.disabled_button_text;
							page.is_sell_out = '1'
							uni.showToast({
								title: e.msg,
								icon: 'none'
							})
						} else if (e.code == 20200731) {
							page.color = "#8b8b8b";
							page.text = "今日已售罄";
							page.is_sell_out = '0'
							uni.showToast({
								title: e.msg,
								icon: 'none'
							})
						} else {
							uni.showToast({
								title: e.msg,
								icon: 'none'
							})
						}
					})
				}
			},
			orderCancel(orderNo) {
				let params = this.$Apiencry.aes_encryptObject({
					out_trade_no: orderNo
				})
				this.$Http.api({
					url: 'couponOrderCancel',
					method: 'POST',
					data: params
				}).then(res => {
					return;
				}).catch(e => {
					console.log(e)
				})
			},
			onClose(ref) {
				this.$refs[ref].close()
			},
			change(e) {
				this.current = e.detail.current
			},
			linkShop() {
				let data = this.$Apiencry.aes_encryptObject({
					activity_id: this.activity_id,
					quick_id: this.quick_id
				})
				this.$Fn.throttle(() => {
					this.$St.navigate(`/detail/shop/shop?rq=${data.rq}`)
				})();
			},
			linkPage() {
				this.$Fn.throttle(() => {
					uni.navigateTo({
						url: '../../strategy/strategy'
					});
				})();
			}
		}
	};
</script>

<style scoped lang="scss">
	page {
		background: #f4f4f4;
		width: 100%;
		height: 100%;
	}

	@import '@/common/css/common.scss';

	.dialog_wrap {
		.btns {
			button {
				background: #9547ce;
			}
		}
	}

	.detail {
		width: 100%;
		height: 100%;
		background: #f4f4f4;
		position: relative;
		padding-bottom: 130rpx;
		min-height: 100vh;
		box-sizing: border-box;

		.det_banner {
			padding: 30rpx 0;

			.swiper-block {
				height: 340rpx;
			}

			.swiper-item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				border-radius: 10rpx;
			}

			.slide-image {
				border-radius: 10rpx;
				margin: 0rpx 0rpx 0 16rpx;
				width: 630rpx;
				height: 340rpx;
			}
		}

		.det_share {
			margin: 0 30rpx;
			background: #ffffff;
			border-radius: 20rpx;
			padding: 40rpx 30rpx 40rpx 30rpx;

			.share_box {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.share_title {
					font-size: 32rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					text-align: left;
					color: #333333;
				}

				.color-999 {
					font-size: 24rpx;
					color: #999;
				}

				.share_bottom {
					width: 100rpx;
					height: 45rpx;
					background: linear-gradient(100deg, #c47eff 5%, #8d1df4 92%);
					border-radius: 23rpx;

					font-size: 24rpx;
					font-family: PingFang-SC-Medium;
					text-align: left;
					color: #ffffff;
					line-height: 45rpx;
					text-align: center;
				}
			}

			.share_detail {
				display: flex;
				justify-content: space-between;
				margin-top: 36rpx;

				.share_detail_left {
					position: relative;

					.detail_images {
						position: relative;
						display: inline-block;
						height: 24rpx;
						width: 32rpx;

						image {
							width: 32rpx;
							height: 32rpx;
							background: rgba(0, 0, 0, 0);
							border: 1rpx solid #9233ce;
							border-radius: 50%;
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}

					.detail_prices {
						font-size: 24rpx;
						font-family: PingFang SC, PingFang SC-Medium;
						font-weight: 500;
						text-align: left;
						color: #666666;
						line-height: 36rpx;
						margin: 0 10rpx 0 10rpx;
					}

					.detail_icon {
						font-size: 20rpx;
						font-family: PingFangSC-Semibold;
						text-align: left;
						color: #f32324;
						line-height: 38rpx;
					}

					.iconbigsize {
						font-size: 40rpx;
						font-weight: 600;
					}

					.orgin-prices {
						font-size: 24rpx;
						font-family: PingFang SC, PingFang SC-Regular;
						font-weight: 400;
						text-align: left;
						color: #999999;
						line-height: 36rpx;
						margin: 30rpx 0 0 42rpx;
					}
				}

				.share_detail_right {
					font-size: 24rpx;
					font-family: PingFang-SC-Medium;
					text-align: left;
					color: #999999;
					line-height: 29rpx;
				}
			}

			.store_detail {
				display: flex;
				justify-content: space-between;
				margin-top: 40rpx;
				height: 80rpx;
				background: #ffffff;
				border: 1rpx solid #d9d9d9;
				border-radius: 16rpx;
				line-height: 80rpx;
				padding: 0 30rpx;

				view {
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					text-align: left;
					color: #666666;
				}

				image {
					width: 22rpx;
					height: 26rpx;
					vertical-align: baseline;
					margin-right: 6rpx;
				}
			}
		}

		.detail_richtext {
			margin: 30rpx 30rpx 0rpx 30rpx;
			background: #ffffff;
			border-radius: 20rpx;
			padding: 40rpx;
		}

		.bottom_box {
			display: flex;
			justify-content: space-between;
			padding: 0 30rpx;
			height: 98rpx;
			background: #ffffff;
			position: fixed;
			bottom: 0;
			width: 690rpx;
			align-items: center;

			.bottom_box_price {
				font-size: 26rpx;
				font-family: PingFang-SC-Medium;
				text-align: center;
				color: #333333;
				line-height: 70rpx;
			}

			.bottom_box_icon {
				font-size: 20rpx;
				font-family: PingFangSC-Semibold;
				text-align: left;
				color: #f32324;
				line-height: 38rpx;
			}

			.bigiconbtm {
				font-size: 40rpx;
				font-weight: 600;
			}

			.bottom_btn {
				width: 260rpx;
				height: 80rpx;
				border-radius: 40rpx;
				text-align: center;
				line-height: 80rpx;
				font-size: 30rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				color: #ffffff;
			}
		}

		.active-box {
			position: fixed;
			right: 10rpx;
			bottom: 300rpx;

			image {
				width: 122rpx;
				height: 122rpx;
			}
		}
	}
</style>
