<template>
	<view :style="getPageStyle" class="home_page">
		<view class="bg_img">
			<uni-swiper-dot :info="indexBanner" mode="round" field="content" :current="current" :dots-styles="dotsStyles" v-if="indexBanner.length > 0">
				<swiper class="swiper-box" :autoplay="true" :indicator-dots="false" indicator-color="rgba(255, 255, 255, 0.6)"
				 indicator-active-color="#fff" @change="change">
					<swiper-item v-for="(item, index) in indexBanner" :key="index" @click="linkQuick(item,'banner')">
						<view class="swiper-item">
							<image class="image" :src="item.banner+this.$Fn.imageResize()" mode="aspectFill" />
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
			<view class="apply_card_banner">
				<image :src="applyCardBanner+this.$Fn.imageResize()" mode="widthFix" @click="linkApplyCard"></image>
			</view>
			<view class="activity_list">
				<view class="act_item" v-for="(item,index) in actTypeArr" :key="index">
					<view class="act_i_title" v-if="activityList[item.activity_name_type].length > 0">
						{{item.name}}
					</view>
					<view class="act_i_info_box">
						<view class="act_i_info_item" @click="linkQuick(item,'actlist')" v-for="(item,index) in activityList[item.activity_name_type]"
						 :key="index">
							<view class="info_img">
								<image :src="item.index_banner+imageResizeStr" mode="widthFix"></image>
							</view>
							<view class="info_text">
								<view class="color-333">
									{{item.name}}
								</view>
								<view class="color-999">
									<text>今日已售{{item.quantity_usage}}</text>
									<text style="margin:0 4rpx;">/</text>
									<text>累计已售{{item.sale_count_num ? item.sale_count_num : '0' }}</text>
								</view>
								<view class="flex">
									<view class="l_text">
										<image src="../../static/v2/gd.png" mode="widthFix"></image>
										<text class="color-666">光享价</text>
										<text class="red-text-color"><text>￥</text>{{item.pay_amount}}</text>
									</view>
									<view class="r_btn">
										<button type="default" class="round">立即购买</button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 				<view class="act_item">
					<view class="act_i_title" v-if="week_activity.length > 0">
						周末特惠活动
					</view>
					<view class="act_i_info_box">
						<view class="act_i_info_item" @click="linkQuick(item)" v-for="(item,index) in week_activity" :key="index">
							<view class="info_img">
								<image :src="item.index_banner" mode="widthFix"></image>
							</view>
							<view class="info_text">
								<view class="color-333">
									{{item.name}}
								</view>
								<view class="color-999">
									<text>已售{{item.quantity_usage}}</text>
								</view>
								<view class="flex">
									<view class="l_text">
										<image src="../../static/v2/gd.png" mode="widthFix"></image>
										<text class="color-666">光享价</text>
										<text class="red-text-color"><text>￥</text>{{item.pay_amount}}</text>
									</view>
									<view class="r_btn">
										<button type="default" class="round">立即购买</button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view> -->
			</view>
		</view>
		<uni-popup ref="popup">
			<view class="uni-popup" @click="closePopup">
				<view class="t_item">
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
				bgimg: "",
				quick_list: [],
				url2: "",
				url3: "",
				url4: "",
				token: uni.getStorageSync('token'),
				current: 0,
				dotsStyles: {
					width: 6,
					backgroundColor: 'rgba(225, 225, 225, 0.6)',
					border: '0',
					bottom: 30,
					selectedBackgroundColor: '#fff',
					selectedBorder: '0'
				},
				imageResizeStr: this.$Fn.imageResize()
			}
		},
		props: {
			index: {
				//当前tab的下标
				type: Number,
				default: 0
			},
			code: {
				type: String,
				default: ""
			},
			// msg: {
			// 	type: String,
			// 	default: ""
			// },
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
			isquanyi: {
				type: Number
			},
			indexBanner: {
				type: Array,
				default: []
			},
			actTypeArr: {
				type: Array,
				default: []
			},
			activityList: {
				type: Object,
				default: {}
			},
			applyCardBanner: {
				type: String,
				default: ""
			}
		},
		computed: {
			getPageStyle() {
				let displays = this.tabIndex == this.index ? 'block' : 'none';
				return `display:${displays};`;
			}
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
				// this.getIndexBanner();
				// this.getNewList()
			},
			// getNewList() {
			// 	let data = this.$Apiencry.aes_encryptObject({
			// 		activity_id: this.$Cf.configData.activity_id,
			// 	});
			// 	this.$Http.api({
			// 		url: "couponNewList",
			// 		method: "GET",
			// 		data: data
			// 	}).then(res => {
			// 		if (res.code == 0) {
			// 			this.hot_push = res.data.hot_push;
			// 			this.week_activity = res.data.week_activity
			// 		}
			// 	})
			// },
			// getIndexBanner() {
			// 	let data = this.$Apiencry.aes_encryptObject({
			// 		activity_id: this.$Cf.configData.activity_id,
			// 	});
			// 	this.$Http.api({
			// 		url: "couponIndexBanner",
			// 		method: "GET",
			// 		data: data
			// 	}).then(res => {
			// 		if (res.code == 0) {
			// 			this.info = res.data
			// 		}
			// 	})
			// },
			linkApplyCard() {
				let urls = uni.getStorageSync('activityInfo').apply_card_url;
				this.$Fn.throttle(() => {
					this.$St.navigate(`/pages/web-view/index?src=${encodeURIComponent(urls)}`);
				})();
			},
			async linkQuick(item, str) {
				if (this.code == '20_02_1_00014') {
					this.$Fn.throttle(() => {
						uni.navigateTo({
							url: "/user/entrance/entrance?code=20_02_1_00014",
						});
					})();
					return false;
				}
				await this.$login.getUserInfo()
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
					} else {
						this.$emit('status', {
							firstReload: true
						})
					}
				}
				if (activity_type == 0 || (banner_activity_type == 0 && SelectType == 1)) {
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
					if (item.page_code == 1) {
						this.$emit('status', {
							firstReload: true
						})
					} else {
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
			closePopup() {
				this.$refs.popup.close();
			}
			// async linkPage(str) {
			// 	await this.$login.getUserInfo()
			// 	if (str == 'jp') {
			// 		this.$St.navigate('/detail/detailPages/detailJP/detailJP')
			// 	} else if (str == 'bj') {
			// 		this.$St.navigate('/detail/detailPages/detailBJ/detailBJ')
			// 	} else {
			// 		let info = uni.getStorageSync('activityInfo')
			// 		let qy_data = this.$Apiencry.aes_encryptObject({
			// 			is_buy_quanyi: info.is_buy_quanyi,
			// 			quanyi_activity_id: info.quanyi_activity_id,
			// 			mobile: info.is_band_mobile
			// 		})
			// 		this.$Http.api({
			// 			url: 'quanyiLogin',
			// 			method: 'POST',
			// 			data: qy_data,
			// 		}).then(res => {
			// 			if (res.code == 0) {
			// 				if (res.data.link_url != "") {
			// 					let url = res.data.link_url
			// 					this.$Fn.throttle(() => {
			// 						this.$St.navigate(`/pages/web-view/index?src=${res.data.url}`);
			// 					})();
			// 				} else {
			// 					this.$emit('status', {
			// 						qiangReload: true
			// 					})
			// 				}
			// 			}
			// 		}).catch(e => {
			// 			console.log(e)
			// 		})
			// 	}
			// }
		}

	}
</script>

<style lang="scss">
	.red-text-color {
		color: #F32324;
	}

	.apply_card_banner {
		text-align: center;
		margin: 10rpx 0 40rpx 0;

		image {
			width: 690rpx;
		}
	}

	.uni-popup {
		width: 750rpx;
		height: 100vh;
		position: relative;

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

	.home_page {
		width: 100%;
		background: #f4f4f4;
		padding-top: 30rpx;
		min-height: 100vh;

		.bg_img {
			height: 100%;
			box-sizing: border-box;
			padding-bottom: 120rpx;

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

			.card-box {
				text-align: center;

				image {
					width: 96%;
				}
			}
		}

		.title {
			display: flex;
			align-items: center;
			margin: 40rpx 0 20rpx 20rpx;

			p {
				font-size: 36rpx;
			}

			.img_text {
				width: 160rpx;
				height: 40rpx;
				background: #fc3b30;
				border-radius: 40rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-left: 10rpx;

				image {
					width: 24rpx !important;
					height: 24rpx;
					vertical-align: middle;
					margin-right: 4rpx;
				}

				span {
					font-size: 26rpx;
					color: #fff;
				}
			}
		}
	}
</style>
