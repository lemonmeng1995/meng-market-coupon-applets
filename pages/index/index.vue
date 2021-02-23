<template>
	<view class="content">
		<view v-if="activity_status == 0">
			<tabbar-home ref="home" :tabIndex="tabIndex" :index="0" :reload="footer_tabs[0].reload" @status="firstStatus"
			 :actTypeArr="activity_type_name_arr" :activityList="activityList" :indexBanner="indexBanner" :code="code"
			 :applyCardBanner="applycard_banner"></tabbar-home>
			<tabbar-first ref="first" :tabIndex="tabIndex" :index="1" :reload="footer_tabs[1].reload" :brushActivityList='brushActivityList'></tabbar-first>
			<tabbar-my ref="my" :tabIndex="tabIndex" :index="2" :reload="footer_tabs[2].reload"></tabbar-my>
			<footertab :tabIndex="tabIndex" @tabChange="tabChange" :footer_tabs="footer_tabs" />
		</view>
		<view v-else class="error">
			<view class="img_text">
				<image src="https://image.sqqmall.com/2020/12/08/473e7bc174e84204.png" alt="活动结束" mode="widthFix" />
				<view class="cs" v-html="activity_msg"></view>
			</view>
		</view>

		<uni-popup ref="popup2" @change="maskChange" class="ui-popup">
			<view class="mask_img">
				<image src="https://image.sqqmall.com/2021/01/18/a05a6e7a812ce458.png" mode="widthFix" @click="onClose('popup2')"
				 :class="isIPX ? 'isIpx':''"></image>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import footertab from "@/components/FooterTab/FooterTab.vue";
	import tabbarHome from "../tabbar/home.vue";
	import tabbarFirst from "../tabbar/first.vue";
	import tabbarMy from "../tabbar/my.vue";
	export default {
		components: {
			footertab,
			tabbarHome,
			tabbarFirst,
			tabbarMy,
		},
		data() {
			return {
				tabIndex: 0, // 当前tab下标
				footer_tabs: [{
						icon: require("../../static/v2/tab3.png"),
						default_icon: require("../../static/v2/tab4.png"),
						txt: "首页",
						reload: false,
					},
					{
						icon: require("../../static/v2/tab1.png"),
						default_icon: require("../../static/v2/tab2.png"),
						txt: "首刷礼",
						reload: false,
					},
					{
						icon: require("../../static/v2/my1.png"),
						default_icon: require("../../static/v2/my2.png"),
						txt: "我的",
						reload: false,
					},
				],
				is_quanyi: null,
				is_band_mobile: "",
				pay_code: '',
				pay_msg: '',
				activity_status: 0,
				activity_msg: '',
				navTitle: "",
				activity_type_name_arr: [],
				activityList: "",
				indexBanner: [],
				brushActivityList: [],
				code: '',
				// msg: '',
				applycard_banner: '',
				isIPX: this.$Cf.configData.isIPX
			};
		},
		onLoad(e) {
			let rq = this.$Apiencry.getrq(e.rq)
			if (typeof rq.pay_code != "undefined" && rq.pay_code != "") {
				this.tabIndex = rq.card_type == 5 ? 1 : 0
				this.pay_code = rq.pay_code
				this.pay_msg = rq.pay_msg

			}
			let collect = uni.getStorageSync('collect_tag')
			if (!collect) {
				this.$refs.popup2.open()
			}
			if (e.pageReload == 'first') {
				this.tabIndex = 1
				this.footer_tabs[1].reload = true;
			}
			if (e.pageReload == 'my') {
				this.tabIndex = 2
				this.footer_tabs[2].reload = true;
			}
		},
		onShow() {
			let _this = this;
			if (!(uni.getStorageSync('openId') && uni.getStorageSync('user_id') && uni.getStorageSync('user_id') != '0' && uni.getStorageSync(
					'token'))) {
				_this.$login.getToken({
					success: function(res) {
						_this.getCouponInfo();
						_this.getNewList()
						_this.getIndexBanner();
						_this.getBrushActivityList();
						if (res.code == '20_02_1_00014') {
							_this.code = res.code;
							// _this.msg = res.msg
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					}
				});
			} else {
				_this.getCouponInfo();
				_this.getNewList()
				_this.getIndexBanner();
				_this.getBrushActivityList();
			}
		},
		onShareAppMessage(res) {
			let shareInfo = uni.getStorageSync('activityInfo')
			return {
				title: shareInfo.share_title,
				path: "/pages/index/index",
			};
		},
		methods: {
			maskChange(e) {
				if (!e.show) {
					uni.setStorageSync('collect_tag', 'collect')
				}
			},
			firstStatus(e) {
				if (e.firstReload) {
					this.tabIndex = 1
					this.footer_tabs[1].reload = true;
				}
			},
			onClose(ref) {
				uni.setStorageSync('collect_tag', 'collect')
				this.$refs[ref].close()
			},
			getIndexBanner() {
				let data = this.$Apiencry.aes_encryptObject({
					activity_id: this.$Cf.configData.activity_id,
				});
				this.$Http.api({
					url: "couponIndexBanner",
					method: "GET",
					data: data
				}).then(res => {
					if (res.code == 0) {
						this.indexBanner = res.data
					}
				})
			},
			getNewList() {
				let data = this.$Apiencry.aes_encryptObject({
					activity_id: this.$Cf.configData.activity_id,
				});
				this.$Http.api({
					url: "couponNewList",
					method: "GET",
					data: data
				}).then(res => {
					if (res.code == 0) {
						this.activityList = res.data
					}
				})
			},
			//首刷礼
			getBrushActivityList() {
				let data = this.$Apiencry.aes_encryptObject({
					activity_id: this.$Cf.configData.activity_id,
				});
				this.$Http.api({
					url: "couponBrushActivityList",
					method: "GET",
					data: data
				}).then(res => {
					if (res.code == 0) {
						this.brushActivityList = res.data
					}
				}).catch(e => {
					console.log(e.msg)
				})
			},
			getCouponInfo() {
				let data = this.$Apiencry.aes_encryptObject({
					activity_id: this.$Cf.configData.activity_id,
				});
				this.$Http
					.api({
						url: "weixinCouponInfo",
						method: "GET",
						data: data,
					})
					.then((res) => {
						if (res.data) {
							let info_data = res.data;
							this.applycard_banner = info_data.background_image;
							this.navTitle = info_data.page_title;
							this.activity_type_name_arr = info_data.activity_type_name_arr
							uni.setNavigationBarTitle({
								title: this.navTitle,
							});
							this.activity_status = info_data.status['code'];
							this.activity_msg = info_data.status['msg'];
							this.$Cf.configData.activityInfo = info_data;
							this.$St.storageOperation("set", "activityInfo", info_data);
							this.$St.storageOperation("set", "navTitle", this.navTitle);
							this.is_quanyi = info_data.is_quanyi;
							this.is_band_mobile = info_data.is_band_mobile;
						}
					});
			},
			async tabChange(i) {
				if (this.code == '20_02_1_00014') {
					this.$Fn.throttle(() => {
						uni.navigateTo({
							url: "/user/entrance/entrance?code=20_02_1_00014",
						});
					})();
					return false;
				}
				await this.$login.getUserInfo()
				let page = this;
				if (page.is_band_mobile == "" && page.footer_tabs[i].txt == "首刷礼") {
					page.footer_tabs[i].reload = false;
					uni.navigateTo({
						url: "/user/entrance/entrance?page=first",
					});
					return false;
				}
				if (page.tabIndex != i) {
					page.tabIndex = i;
					if (page.footer_tabs[i].reload === false) {
						page.footer_tabs[i].reload = true;
					}
				}

				if (page.tabIndex == 1) {
					uni.setNavigationBarTitle({
						title: "首刷礼",
					});
					page.footer_tabs[0].reload = false;
					page.footer_tabs[2].reload = false;
				} else if (page.tabIndex == 2) {
					uni.setNavigationBarTitle({
						title: "我的",
					});
					page.footer_tabs[0].reload = false;
					page.footer_tabs[1].reload = false;
				} else {
					page.footer_tabs[1].reload = false;
					page.footer_tabs[2].reload = false;
					this.getNewList()
					this.getIndexBanner()
					this.brushActivityList()
					let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
					let curRoute = routes[routes.length - 1].route; //获取当前页面路由
					let curParam = routes[routes.length - 1].options; //获取路由参数
					// 拼接参数
					let param = "";
					for (let key in curParam) {
						param += "&" + key + "=" + curParam[key];
					}
					uni.setNavigationBarTitle({
						title: page.navTitle
					});
				}
			},
		},
	};
</script>

<style lang="scss">
	@import '@/common/css/common.scss';

	.dialog_wrap {
		.btns {
			button {
				background: linear-gradient(180deg, #b251ec, #8b3bd2);
			}
		}
	}

	.error {
		height: 100vh;
		background: #FFFBF4;
		text-align: center;
		padding-top: 40%;
		box-sizing: border-box;

		image {
			width: 428rpx;
			height: 886rpx;
		}

		.cs {
			font-size: 30rpx;
			margin-top: 20rpx;
		}
	}

	.ui-popup {
		.mask_img {
			height: 100vh;
			position: relative;

			image.isIpx {
				top: 30rpx;
			}

			image {
				width: 370rpx;
				position: absolute;
				top: 8rpx;
				left: -24rpx;
			}
		}
	}
</style>
