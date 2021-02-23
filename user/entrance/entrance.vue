<template>
	<view class='page'>
		<view>
			<view class='header'>
				<view class="image">
					<open-data type="userAvatarUrl" :default-avata="avatarUrl"></open-data>
				</view>
				<text>光想着你</text>
			</view>
			<button class='bottom' type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo"
			 v-if="isCanUse">
				授权微信头像昵称
			</button>
			<button class='bottom' type='primary' open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" lang="zh_CN" v-if="isBingMobile"
			 :disabled="disabled">
				微信手机号登录
			</button>
			<view class="footer" @click="linkPage">
				登录代表您已同意 <text>《用户协议》</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickName: null,
				avatarUrl: 'https://image.sqqmall.com/2020/12/17/5b6de8dea352df04.jpg',
				isCanUse: true, //默认为true
				isBingMobile: false,
				code: '',
				disabled: false,
				page: ''
			}
		},
		onLoad(e) { //默认加载
			this.page = e.page;
			let _this = this
			if(!(e.code && e.code == '20_02_1_00014')){
				uni.getSetting({
					success(res) {
						if (res.authSetting['scope.userInfo']) {
							// _this.avatarUrl = uni.getStorageSync('avatarUrl');
							_this.isCanUse = false;
							_this.isBingMobile = true
							uni.login({
								success: res => {
									_this.code = res.code //记得在data里面定义一个code
								},
								fail: res => {
									//失败
								}
							})
						}
					}
				})
			}
		},
		methods: {
			//第一授权获取用户信息===》按钮触发
			wxGetUserInfo() {
				let _this = this;
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						let params = infoRes.userInfo;
						params.encryptedData = infoRes.encryptedData
						params.iv = infoRes.iv
						_this.nickName = infoRes.userInfo.nickName; //昵称
						_this.avatarUrl = infoRes.userInfo.avatarUrl; //头像
						_this.$login.getToken({
							success() {
								if (uni.getStorageSync("openid_coupon") == "") {
									_this.$login.getAuthOpenid();
								} else {
									uni.reLaunch({
										url: '/pages/index/index'
									})
								}
							}
						}, params)
					},
					fail(res) {
						console.log(res)
					}
				});
			},
			getPhoneNumber(e) {
				let page = this
				page.disabled = true;
				let data = page.$Apiencry.aes_encryptObject({
					js_code: this.code,
					iv: e.detail.iv,
					encryptedData: e.detail.encryptedData
				})
				uni.showLoading({
					title: "获取中"
				})
				page.$Http.api({
					url: "wxDecryptData",
					method: 'GET',
					data: data,
				}).then(res => {
					if (res.data != null) {
						uni.hideLoading()
						let bm_rq = page.$Apiencry.aes_encryptObject({
							activity_id: page.$Cf.configData.activity_id,
							openid_coupon: uni.getStorageSync('openid_coupon'),
							mobile: res.data
						})
						page.bindMobile(bm_rq)
					}
				}).catch(e => {
					uni.hideLoading()
					uni.showToast({
						title: '请重新获取账号',
						icon: 'none'
					})
					this.disabled = false
				})
			},
			bindMobile(data) {
				this.$Http.api({
					url: 'userBangMobile',
					method: 'POST',
					data: data,
				}).then(res => {
					if (res.code == 0) {
						this.disabled = false;
						this.$Fn.throttle(() => {
							if (this.page == 'my' || this.page == 'first') {
								uni.reLaunch({
									url: `/pages/index/index?pageReload=${this.page}`
								})
							} else if (this.page == 'detailIndex') {
								uni.navigateBack({
								    delta: 1
								});
							}
						})();
					}
				}).catch(e => {
					this.disabled = false;
					uni.showToast({
						title: '注册失败',
						icon: 'none'
					})
				})
			},
			linkPage() {
				this.$Fn.throttle(() => {
					uni.navigateTo({
						url: "../agreement/agreement"
					})
				})();
			}
		}
	}
</script>

<style lang="scss">
	.header {
		margin: 110rpx 0 90rpx 50rpx;
		text-align: center;
		width: 650rpx;
		height: 300rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.header .image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
		border-radius: 50%;
		overflow: hidden;
	}

	.content {
		margin-left: 50rpx;
		margin-bottom: 90rpx;
	}

	.content text {
		display: block;
		color: #9d9d9d;
		margin-top: 40rpx;
	}

	.bottom {
		border-radius: 80rpx;
		margin: 100rpx 50rpx;
		font-size: 35rpx;
	}

	.footer {
		text-align: center;

		text {
			color: #8E65DA;
		}
	}
</style>
