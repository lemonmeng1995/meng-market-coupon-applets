<template>
	<view :style="getPageStyle" class="v2-qiang">
		<!-- v-if="isWhitet" -->
		<view>
			<uni-swiper-dot :info="info" mode="round" field="content" :current="current" :dots-styles="dotsStyles" v-if="info.length > 0">
				<swiper class="swiper-box" :autoplay="true" @change="change">
					<swiper-item v-for="(item, index) in info" :key="index" @click="linkQuick(item,'banner')">
						<view class="swiper-item">
							<image class="image" :src="item.banner+this.$Fn.imageResize()" mode="aspectFill" />
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
			<view class="activity_list">
				<view class="act_item">
					<view class="act_i_title">
						首刷礼
					</view>
					<view class="act_i_info_box">
						<view class="act_i_info_item" v-for="(item,index) in brushActivityList" :key="index" @click="linkQuick(item,'actlist')">
							<view class="info_img">
								<image :src="item.index_banner+this.$Fn.imageResize()" mode="widthFix"></image>
							</view>
							<view class="info_text flex">
								<view class="flex">
									<view class="color-333">
										{{item.name}}
									</view>
									<view class="color-999">
										累计已领 {{item.sale_count ? item.sale_count :'0' }}
									</view>
								</view>
								<view class="r_btn">
									<button type="default" class="round">查看详情</button>
								</view>
							</view>
						</view>
					</view>
					<view class="no-data" v-if="brushActivityList.length == 0">
						<image src="https://image.sqqmall.com/2020/12/11/093538b61b590025.png" mode="widthFix"></image>
						<view class="">
							您暂无可领取的首刷礼
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="img-box" v-else>
			<image :src="bgImg+this.$Fn.imageResize()" mode="widthFix" @click="linkUrl"></image>
		</view> -->

		<uni-popup ref="popup1" :maskClic="false">
			<view class="dialog_wrap paybackDialogshow">
				<view class="dialog_title">温馨提示</view>
				<view class="dialog_info" v-html="msg"></view>
				<!-- <view class="onclose" @click="onClose('popup1')">
					<image src="../../static/v2/close.png" mode="" class="v2_close"></image>
				</view> -->
				<view class="btns">
					<button @click="onClose('popup1')" class="round">我已知晓</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activityInfo: '',
				msg: '',
				info: [],
				current: 0,
				isWhitet: true,
				bgImg: '',
				reserve_field: '',
				dotsStyles: {
					width: 6,
					backgroundColor: 'rgba(225, 225, 225, 0.6)',
					border: '0',
					bottom: 30,
					selectedBackgroundColor: '#fff',
					selectedBorder: '0'
				},
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
			},
			brushActivityList: {
				type: Array,
				default:[]
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
			change(e) {
				this.current = e.detail.current
			},
			//页面初始化
			init() {
				let page = this;
				page.activityInfo = page.$Cf.configData.activityInfo;
				this.getBrushBanner();
			},
			onClose(ref) {
				this.$refs[ref].close()
			},
			linkQuick(item, str) {
				let banner_activity_type = null;
				let activity_type = null;
				if (str == 'banner') {
					banner_activity_type = item.activity_type; //首页banner 区分
				} else {
					activity_type = item.activity_type; //首页活动详情 0 
				}
				let SelectType = item.select_type
				let mobile = uni.getStorageSync('activityInfo').is_band_mobile;
				if (banner_activity_type == 1) {
					if (mobile == '') {
						this.$Fn.throttle(() => {
							uni.navigateTo({
								url: '/user/entrance/entrance'
							})
						})();
					}
				}
				if (activity_type == 1 || (banner_activity_type == 0 && SelectType == 1)) {
					let quick_id = item.quick_id
					let name = item.name
					let rq_data = this.$Apiencry.aes_encryptObject({
						quick_id: quick_id,
						name: name
					})
					this.$Fn.throttle(() => {
						this.$St.navigate(`/detail/detailPages/detailIndex/detailIndex?rq=${rq_data.rq}`)
					})();
				}
				if (SelectType == 2) { //外链
					let url = item.UrlLink
					this.$St.navigate(`/pages/web-view/index?src=${encodeURIComponent(url)}`);
				} else if (SelectType == 3) { //内部链接
					if (item.page_code != 1) {
						let name = item.page_arr['url']
						let img = item.page_arr['bg_image'];
						let url = item.page_arr['reserve_field'];
						this.$Fn.throttle(() => {
							this.$St.navigate(`custom/custompageA/${name}?img=${img}&url=${encodeURIComponent(url)}`);
						})();
					}
				} else if (SelectType == 4) { //自定义页面
					let img = item.page_image;
					this.$Fn.throttle(() => {
						this.$St.navigate(`custom/customIndex/customIndex?src=${img}`);
					})();
				}
			},
			// brushIsWhitet() {
			// 	uni.showLoading({
			// 		title: '加载中'
			// 	})
			// 	let data = this.$Apiencry.aes_encryptObject({
			// 		activity_id: this.$Cf.configData.activity_id,
			// 		mobile: this.activityInfo.is_band_mobile,
			// 	});
			// 	this.$Http.api({
			// 		url: "couponBrushIsWhitet",
			// 		method: "GET",
			// 		data: data
			// 	}).then(res => {
			// 		if (res.code == 0) {
			// 			if (res.data.is_white == 1) {
			// 				this.isWhitet = true;
			// 				this.getBrushActivityList()
			// 			} else {
			// 				this.bgImg = res.data.bg_image;
			// 				this.reserve_field = res.data.reserve_field;
			// 				this.isWhitet = false;
			// 			}
			// 			uni.hideLoading()
			// 		}
			// 	}).catch(e => {
			// 		uni.hideLoading()
			// 	})
			// },
			getBrushBanner() {
				uni.showLoading({
						title: '加载中'
					})
				let data = this.$Apiencry.aes_encryptObject({
					activity_id: this.$Cf.configData.activity_id,
					mobile: this.activityInfo.is_band_mobile,
				});
				this.$Http.api({
					url: "couponBrushBanner",
					method: "GET",
					data: data
				}).then(res => {
					if (res.code == 0) {
						this.info = res.data
					}
					uni.hideLoading()
				}).catch(e=>{
					uni.hideLoading()
				})
			},
			linkUrl() {
				let url = this.reserve_field;
				this.$Fn.throttle(() => {
					this.$St.navigate(`/pages/web-view/index?src=${encodeURIComponent(url)}`);
				})();
			}
		}

	}
</script>

<style lang="scss" scoped>
	.no-data {
		text-align: center;
		padding: 200rpx 0;
		background: #fff;
		border-radius: 20rpx;

		image {
			width: 260rpx;
		}

		view {
			font-size: 28rpx;
			color: #999;
		}
	}

	.img-box {
		width: 100%;

		image {
			width: 100%;
		}
	}

	.v2-qiang {
		min-height: 100vh;
		width: 100%;
		background: #f4f4f4;
		padding-top: 30rpx;
		box-sizing: border-box;
		padding-bottom: 120rpx;

		.info_text.flex {
			.flex {
				flex-direction: column;
				align-items: baseline;
			}
		}

		.swiper-box {
			margin-bottom: 40rpx;
			height: 272rpx;

			.swiper-item {
				height: 272rpx;
				padding: 0 30rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 30rpx;
				}
			}
		}
	}

	.ui-btn-panel {
		position: absolute;
		width: 100%;
		background: #fff;
		border-radius: 20rpx 20rpx 0px 0px;
		padding: 20rpx 24rpx;
		bottom: 0rpx;
		height: 160rpx;
		padding-top: 50rpx;
		box-sizing: border-box;
		margin-bottom: 100rpx;
		line-height: 120rpx;

		.ui-btn {
			background: linear-gradient(180deg, #b251ec, #8b3bd2);
			font-size: 30rpx;
			color: #fff;
			text-align: center;
			border-radius: 8rpx;
			height: 80rpx;
			line-height: 80rpx;
		}
	}
</style>
