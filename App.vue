<script>
	export default {
		onLaunch: function(e) {
			this.checkIsIPhoneX()
			if (wx.canIUse('getUpdateManager')) {
				this.$St.systemCheckUpdate()
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			checkIsIPhoneX: function() {
				const _this = this
				wx.getSystemInfo({
					success: function(res) {
						//或者根据 screenHeight 进行判断  
						if (res.platform == 'ios' && res.screenHeight >= 812) {
							_this.$Cf.configData.isIPX = true
						}
					}
				})
			},
		}

	}
</script>

<style lang="scss">
	//轮播小圆点
	.uni-swiper__warp {
		.uni-swiper__dots-box {
			.uni-swiper__dots-item {
				height: 12rpx !important;
			}
		}
	}

	.uni-countdown {
		display: flex;
		justify-content: center !important;
		align-items: center;
		height: 100%;
		padding: 0 !important;

		.uni-countdown__number {
			width: auto;
			margin: 0rpx;
			font-size: 30rpx !important;
		}

		.uni-countdown__splitor {
			padding-top: 0rpx;
		}
	}

	//首页活动
	.activity_list {
		.act_item {
			padding: 0 30rpx;
			margin-bottom: 40rpx;

			.act_i_title {
				margin-bottom: 20rpx;
				font-weight: 700;
				color: #000;
				font-size: 32rpx;
			}


			.flex {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20rpx;

				button {
					background: linear-gradient(90deg, #fa7677 -6%, #f73232);
					width: auto;
				}

				.l_text {
					image {
						width: 33rpx;
						vertical-align: middle;
						margin-right: 4rpx;
					}

					.red-text-color {
						margin-left: 6rpx;
						font-size: 40rpx;
						font-weight: 700;

						text {
							font-size: 24rpx;
						}
					}

					.color-666 {
						color: #666;
						font-size: 24rpx;
					}

				}
			}

			.act_i_info_item {
				padding: 30rpx;
				background: #ffffff;
				border-radius: 20rpx;

				.info_img {
					margin-bottom: 34rpx;

					image {
						width: 100%;
						border-radius: 16rpx;
					}
				}

				.info_text {
					.color-333 {
						color: #333;
						margin-bottom: 10rpx;
					}

					.color-999 {
						color: #999;
						font-size: 24rpx;
					}

					.r_btn {
						button {
							color: #fff;
							font-size: 28rpx;
						}
					}

				}

				&+.act_i_info_item {
					margin-top: 22rpx;
				}
			}
		}
	}
</style>
