<template>
	<view class="shop">
		<view class="search-view">
			<uni-search-bar :radius="100" @confirm="search" cancelButton="none" bgColor="#f7f8fa"></uni-search-bar>
		</view>
		<uni-list :border="true" class="uni-list-wrap">
			<uni-list-item class="uni-list-item" v-for="(item,index) in merchantList" :key="index">
				<template slot="header" class="header" @click="onChange(item)">
					<view class="title">
						<text>{{item.name}}</text>
					</view>
					<view class="text">
						<image src="../../static/v2/md.png" mode=""></image>
						<text class="">
							{{ item.province }}{{ item.city }}{{ item.county }}{{ item.address }}
						</text>
						<uni-icons type="arrowright" size="16"></uni-icons>
					</view>
				</template>
				<template slot="footer" class="footer">
					<view @click="goPhone(item.mobile)">
						<image src="../../static/v2/v2_phone.png" alt=""></image>
						<view class="">
							电话
						</view>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		<view v-if="finished" class="noMore">没有更多门店了~</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				merchantList: [],
				quick_id: '',
				activity_id: '',
				name: '',
				page: 1,
				finished: false,
				url: require('../../static/v2/v2_phone.png'),
				totalPage: ''
			}
		},
		onLoad(e) {
			this.activity_id = this.$Cf.configData.activity_id;
			this.quick_id = this.$Apiencry.getrq(e.rq).quick_id;
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
				let data = this.$Apiencry.aes_encryptObject({
					quick_id: this.quick_id,
					name: this.name,
				})
				this.$Http.api({
					url: 'merchantList',
					method: 'GET',
					data: {
						rq: data.rq,
						page: this.page,
						limit: 15
					}
				}).then(res => {
					if (res.code == 0) {
						this.merchantList = [...this.merchantList, ...res.data];
						this.totalPage = res.totalPage;
						if (this.page >= res.totalPage && res.totalPage != 0) {
							this.finished = true;
						}
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			onChange(item) {
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						const latitude = res.latitude; //纬度
						const longitude = res.longitude; //经度
						uni.openLocation({
							longitude: Number(item.longitude),
							latitude: Number(item.latitude),
							name: item.name,
							address: item.address,
							success: function() {
								console.log('success');
							}
						});
					},
					fail: function(e) {
						console.log(e)
					}
				});
			},
			goPhone(mobile) {
				uni.makePhoneCall({
					// 手机号
					phoneNumber: mobile,
					// 成功回调
					success: (res) => {
						// this.merchantList = []
						console.log('调用成功!')
					},
					// 失败回调
					fail: (res) => {
						// this.merchantList = []
						console.log('调用失败!')
					}
				});
			},
			search(e) {
				this.page = 1;
				this.merchantList = []
				this.finished = false
				this.name = e.value;
				this.getList()
			}
		}
	}
</script>

<style lang="scss">
	.shop {
		padding: 0rpx 24rpx !important;

		.search-view {
			position: fixed;
			top: 0;
			left: 0;
			height: 116rpx;
			z-index: 9999;
			width: 100%;
		}

		.uni-searchbar {
			// padding: 20rpx 24rpx !important;

			.uni-searchbar__box {
				border: 0;
			}
		}

		.uni-list {
			padding-top: 100rpx;

			.active {
				.header .text {
					transition: all 0.5s;
					max-height: 200rpx;
				}

				.text text.uni-icons.data-v-0bf90c00 {
					// transition: all 0.5s;
					transform: rotateX(180deg);
				}
			}

			// .uni-list-item:last-child{
			// 	border-botton:1px solid #ebedf0;
			// }
			.uni-list-item__container {
				padding: 20rpx 0rpx !important;
				align-items: center;
			}

			.uni-list-item {

				// border-color: #ebedf0;
				.uni-icon-wrapper {
					padding: 0;
				}

				.uni-icons {
					font-size: 32rpx;
					position: absolute;
					top: 58rpx;
					right: 140rpx;
					transition: all 0.5s;
				}

				.header {
					width: 80%;
				}

				.title {
					width: 100%;
					font-size: 32rpx;
					color: #333;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-right: 8rpx;
					margin-bottom: 14rpx;

					view {
						width: 50rpx;
						height: 50rpx;
						margin-bottom: 0;


					}

				}

				.text {
					height: 40rpx;
					overflow: hidden;
					font-size: 26rpx;
					color: #707070;
					transition: all 0.5s;
					width: 100%;
					word-wrap: break-word;
					word-break: normal;
					line-height: 38rpx;
					padding-right: 50rpx;
					box-sizing: border-box;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					line-clamp: 1;
					-webkit-box-orient: vertical;

					image {
						width: 22rpx;
						height: 26rpx;
						vertical-align: middle;
						margin-right: 4rpx;
					}
				}

				.footer {
					text-align: center;
					margin-right: 28rpx;

					&>view {
						view {
							font-size: 24rpx;
							color: #666
						}
					}

					image {
						width: 50rpx;
						height: 50rpx;
					}
				}
			}
		}

		.noMore {
			color: #969799;
			font-size: 28rpx;
			line-height: 100rpx;
			text-align: center;
		}
	}
</style>
