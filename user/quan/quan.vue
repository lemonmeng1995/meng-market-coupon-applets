<template>
	<view class="quan">
		<view class="panel">
			<view class="text">
				<view class="title">我的立减金</view>
				<view>
					您总共获得<text class="red_num">{{ count }}</text>个立减金
				</view>
			</view>
		</view>
		<uni-list :border="false" v-if="count > 0">
			<block v-for="(item,index) in couponList" :key="index">
				<uni-list-item class="list_item" :class="item.Status == 'EXPIRED' ? 'bgimg3' : item.Status == 'USED' ? 'bgimg2': 'bgimg1'">
					<view slot="header" class="l_num"><text><text class="em">￥</text>{{item.CouponValue}}</text></view>
					<view slot="body" class="r_info">
						<view class="title">光大银行{{ item.CouponValue }}元立减券</view>
						<view class="text">微信支付</view>
						<view class="time">有效期至：{{ item.AvailableEndTime }}</view>
						<view class="time">获取时间：{{ item.CreateTime }}</view>
					</view>
				</uni-list-item>
			</block>
		</uni-list>
		<div class="empty-box" v-else>
			<img src="https://image.sqqmall.com/2020/11/26/fabc5800a9d53ae7.png" alt="" />
			<p>您还没有获得任何立减金～</p>
		</div>
		<view v-show="finished" class="noMore">没有更多了~</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				couponList: [],
				page: 1,
				openid: '',
				count: 0,
				activity_id: '',
				totalPage: '',
				finished: false,
				mobile: ''
			}
		},
		async onLoad(e) {
			this.activity_id = this.$Cf.configData.activity_id;
			this.openid = await this.$St.storageOperation('get', 'openid_coupon');
			this.mobile = this.$Apiencry.getrq(e.rq).mobile
			this.getList()
		},
		onReachBottom() {
			let page = this.page;
			page++;
			if (page <= this.totalPage) {
				this.page = page;
				this.getList()
			}
		},
		methods: {
			getList() {
				uni.showLoading({
					title: "加载中"
				})
				let _this = this;
				let data = this.$Apiencry.aes_encryptObject({
					activity_id: _this.activity_id,
					openid: _this.openid,
					mobile: this.mobile
				})
				_this.$Http.api({
					url: 'getCouponInfoList',
					method: 'GET',
					data: {
						rq: data.rq,
						page: this.page
					}
				}).then(res => {
					if (res.code == '0') {
						uni.hideLoading()
						_this.count = +res.count;
						_this.couponList = [..._this.couponList, ...res.data];
						_this.totalPage = res.totalPage;
						if (_this.page >= res.totalPage && res.totalPage != 0) {
							_this.finished = true;
						}
					}
				}).catch((err) => {
					uni.hideLoading()
					uni.showToast({
						title: err.msg,
						icon: 'none'
					})
				})
			}
		}

	}
</script>

<style lang="scss">
	.quan {
		.uni-list {
			padding-top: 200rpx;
		}

		.uni-list--border:after {
			height: 0rpx !important;
		}

		.list_item.bgimg1 {
			.uni-list-item {
				background: url('https://image.sqqmall.com/2020/11/26/8fcf9617a2f9d01d.png');
				background-size: 100% 100%;
			}
		}

		.list_item.bgimg2 {
			.uni-list-item {
				background: url('https://image.sqqmall.com/2020/11/26/f610ff2f382173bf.png');
				background-size: 100% 100%;
			}
		}

		.list_item.bgimg3 {
			.uni-list-item {
				background: url('https://image.sqqmall.com/2020/11/26/e3d9ec424c8173c9.png');
				background-size: 100% 100%;
			}
		}

		.uni-list-item {
			width: 100%;
			height: 230rpx;
			background-repeat: no-repeat;
			box-sizing: border-box;
			border-top: none;
			border-bottom: none;

			.uni-list-item__container {
				padding-left: 0;
			}

			.l_num {
				color: #fff;
				padding-top: 18rpx;
				margin-right: 40rpx;
				width: 252rpx;
				text-align: center;
				padding-left: 5rpx;

				.em {
					font-size: 34rpx;
				}

				text {
					font-size: 66rpx;
				}
			}

			.r_info {
				margin-top: 10rpx;

				.title {
					font-size: 32rpx;
					font-weight: 500;
				}

				.text {
					font-size: 26rpx;
					color: #2a2a2a;
					margin-bottom: 10rpx;
					margin-top: 6rpx;
				}

				.time {
					font-size: 24rpx;
					line-height: 30rpx;
					color: #7f7f7f;
				}
			}
		}

		.panel {
			position: fixed;
			top: 0;
			left: 0;
			background-color: #fff;
			box-shadow: 0px 6rpx 12rpx 0px rgba(0, 0, 0, 0.1);
			width: 100%;
			display: flex;
			justify-content: space-between;
			padding: 30rpx 48rpx 30rpx 30rpx;
			margin-bottom: 10rpx;
			z-index: 999;
			// position: relative;

			.text {
				.title {
					font-size: 40rpx;
					color: #333;
					font-weight: 600;
					margin-bottom: 20rpx;
				}

				p {
					font-size: 30rpx;
					color: #2a2a2a;
				}
			}

			.sel {
				display: flex;
				flex-direction: column;

				img {
					width: 48rpx;
					height: 48rpx;
					margin-bottom: 12rpx;
				}

				p {
					font-size: 24rpx;
					color: #666;
				}
			}
		}

		.empty-box {
			margin: 200rpx 0px 60rpx 0;
			width: 100%;
			text-align: center;

			img {
				width: 420rpx;
				height: 340rpx;
			}

			p {
				font-size: 28rpx;
				color: #999;
			}
		}

		.noMore {
			color: #969799;
			font-size: 28rpx;
			line-height: 100rpx;
			text-align: center;
		}

		.ui-popup {
			position: absolute;
			z-index: 100;
			width: 140rpx;
			padding: 20rpx 24rpx 24rpx 24rpx;
			text-align: center;
			background: url('https://image.sqqmall.com/2020/11/14/e3a99019cce71045.png') no-repeat;
			background-size: 100% 100%;
			right: 40rpx;
			top: 120rpx;

			p:first-child {
				padding-top: 10rpx;
			}

			p {
				font-size: 26rpx;
				border-bottom: 1px solid #8b60d5;
				padding-bottom: 16rpx;
				padding-top: 24rpx;
			}

			p:last-child {
				border-bottom: 0;
			}
		}
	}
</style>
