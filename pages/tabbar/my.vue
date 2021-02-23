<template>
	<view :style="getPageStyle" class="my">
		<view class="bg_img">
			<view class="header" @click="changeMobile('first')">
				<view class="user_img">
					<open-data type="userAvatarUrl"></open-data>
				</view>
				<view class="user_name">
					<text>{{ mobile ? mobile:'请点击登录'}}</text>
					<open-data type="userNickName"></open-data>
				</view>
			</view>
			<view class="img_box" @click="linkQuan">
				<image src="https://image.sqqmall.com/2020/12/02/bcb8c46c46c42aae.png" alt="" />
				<!-- mode="widthFix" -->
			</view>
		</view>
		<view class="panel">
			<button open-type="contact" class="paneCon" v-if="customer_service.status == 1">
				<view class="before">
					<image src="../../static/v2/my(1).png" alt="" class="cell_left_img" />
					<text class="custom-title">专属客服</text>
				</view>
				<view class="arrow_img">
					<image src="../../static/v2/arrow.png" alt="" />
				</view>
			</button>
			<button class="paneCon" v-if="apply_card.status == 1" @click="onHandeclick(apply_card.url)">
				<view class="before">
					<image src="../../static/v2/my(2).png" alt="" class="cell_left_img" />
					<text class="custom-title">我要办卡</text>
				</view>
				<view class="arrow_img">
					<image src="../../static/v2/arrow.png" alt="" />
				</view>
			</button>
			<button class="paneCon" v-if="share.status == 1" @click="$refs.popup.open()">
				<view class="before">
					<image src="../../static/v2/my(3).png" alt="" class="cell_left_img" />
					<text class="custom-title">我要分享</text>
				</view>
				<view class="arrow_img">
					<image src="../../static/v2/arrow.png" alt="" />
				</view>
			</button>
		</view>

		<view class="btn-box">
			<button class="ui-btn" @click="changeMobile()" v-show="mobile!=''">切换账号</button>
		</view>
		<uni-popup ref="popup">
			<view class="uni-popup" @click="$refs.popup.close()">
				<view :class="isIPX ? 'isIpx t_item':'t_item'">
					<image src="https://image.sqqmall.com/2020/11/17/c85ec49de8087d99.png" mode=""></image>
				</view>
				<view class="c_item">
					我知道了
				</view>
				<view class="b_item">
					<image src="https://image.sqqmall.com/2020/11/17/d718928251678c10.png" mode=""></image>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarurl: "",
				nickname: "",
				mobile: '',
				customer_service: {

				},
				apply_card: {

				},
				share: {

				},
				isIPX: this.$Cf.configData.isIPX
			}
		},
		props: {
			index: {
				//当前tab的下标
				type: Number,
				default: 0
			},
			tabIndex: {
				//当前选中子页面下标
				type: Number,
				default: 0
			},
			reload: {
				//值变更为true则将触发初始化
				type: Boolean,
				default: false
			}
		},
		computed: {
			getPageStyle() {
				let displays = this.tabIndex == this.index ? 'block' : 'none';
				return `display:${displays};`;
			},

		},
		watch: {
			reload(reload) {
				if (reload) {
					this.init();
				}
			}
		},
		methods: {
			//页面初始化
			init() {
				let page = this;
				let data = page.$Apiencry.aes_encryptObject({
					activity_id: this.$Cf.configData.activity_id,
				});
				page.$Http.api({
					url: 'userMyInfo',
					method: 'GET',
					data: data
				}).then(res => {
					if (res.code == 0) {
						this.mobile = res.data.mobile
						page.customer_service = res.data.system_config['customer_service'];
						page.apply_card = res.data.system_config['apply_card'];
						page.share = res.data.system_config['share'];
					}
				})
			},
			onHandeclick(urls) {
				this.$Fn.throttle(() => {
					this.$St.navigate(`/pages/web-view/index?src=${encodeURIComponent(urls)}`);
				})();
			},
			changeMobile(str) {
				if (str) {
					if (!this.mobile) {
						this.$Fn.throttle(() => {
							uni.navigateTo({
								url: '/user/entrance/entrance?page=my'
							})
						})();
					}
				} else {
					this.$Fn.throttle(() => {
						uni.navigateTo({
							url: '/user/entrance/entrance?page=my'
						})
					})();
				}

			},
			linkQuan() {
				if (this.mobile) {
					let data = this.$Apiencry.aes_encryptObject({
						mobile: this.mobile
					})
					this.$Fn.throttle(() => {
						this.$St.navigate(`/user/quan/quan?rq=${data.rq}`)
					})();
				} else {
					this.$Fn.throttle(() => {
						uni.navigateTo({
							url: '/user/entrance/entrance?page=my'
						})
					})();
				}

			}
		}

	}
</script>

<style lang="scss" scoped>
	.uni-popup {
		width: 750rpx;
		height: 100vh;
		position: relative;

		.isIpx.t_item {
			top: 16rpx;
		}

		.t_item {
			top: 0;
			left: -90rpx;
			width: 100%;

			image {
				height: 262rpx;
			}
		}

		.b_item {
			bottom: 0rpx;
			width: 100%;

			image {
				height: 605rpx;
			}
		}

		.c_item {
			width: 360rpx;
			height: 80rpx;
			background: #ffffff;
			border-radius: 16rpx;
			text-align: center;
			font-size: 30rpx;
			line-height: 80rpx;
		}

		.c_item {
			top: 35%;
			left: 50%;
			transform: translateX(-50%);
		}

		.t_item,
		.b_item,
		.c_item {
			position: absolute;

			image {
				width: 100%;
			}
		}
	}

	.btn-box {
		display: flex;
		justify-content: center;
		margin-top: 26%;

		.ui-btn {
			border: 1px solid #8e65da;
			width: 80%;
			border-radius: 50rpx;
			color: #8e65da;
			width: 75% !important;
		}
	}

	.my {
		.header {
			display: flex;
			padding: 75rpx 20rpx 20rpx 40rpx;
			align-items: center;
			box-sizing: border-box;

			.user_img {
				vertical-align: middle;
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				border: 2px solid #fff;
				overflow: hidden;
				margin-right: 20rpx;
			}

			.user_name {
				font-size: 36rpx;
				font-weight: 500;
				display: flex;
				flex-direction: column;
			}
		}

		.img_box {
			width: 94%;
			margin: 0 auto;

			image {
				width: 100%;
				height: 200rpx;
			}
		}

		.bg_img {
			background: url(https://image.sqqmall.com/2020/11/17/b7cfb46152730514.png) no-repeat center top;
			width: 100%;
			background-size: 100% 92%;
		}

		.panel {
			.paneCon {
				padding: 10px 16px;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.before {
					width: 250rpx;
					vertical-align: center;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.arrow_img {
					display: flex;
					align-items: center;
				}

				image {
					width: 54rpx;
					height: 54rpx;
				}
			}
		}
	}

	button {
		display: block;
		width: 100%;
		background-color: #fff;
		font-size: 32rpx !important;
		// padding: 10px 16px !important;
		margin: 0px !important;
	}

	button::after {
		border: none !important;
	}
</style>
