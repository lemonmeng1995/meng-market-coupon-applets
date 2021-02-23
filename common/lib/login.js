import Apiencry from "@/common/api/encryption.js"
import Http from '@/common/lib/http.js'
import Cf from '@/common/lib/config.js'
import St from '@/common/lib/system.js'
import Fn from '@/common/lib/function.js'
export default {
	getTokenOpenid: function(params = {}) {
		let _this = this;
		console.log('fffffffffff', params)
		//获取token
		//获取openId
		uni.showLoading({
			title: '登录中...'
		});
		uni.login({
			provider: 'weixin',
			success: function(loginRes) {
				let code = loginRes.code;
				if (loginRes.code) {
					//获取token
					Cf.configData.code = loginRes.code
					let data = Apiencry.aes_encryptObject({
						activity_id: Cf.configData.activity_id,
						js_code: code,
						userInfo: params
					});
					Http.api({
						url: 'weixinLogin',
						method: 'POST',
						data: data,
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
					}).then(res => {
						if (res.data) {
							uni.hideLoading();
							var token = res.data.token;
							var openId = res.data.openid;
							// var shareUserId = res.data.shareUserId;
							var user_id = res.data.user_id;
							var openid_coupon = res.data.openid_coupon
							St.storageOperation('set', 'token', token)
							St.storageOperation('set', 'openId', openId)
							// St.storageOperation('set', 'shareUserId', shareUserId)
							St.storageOperation('set', 'user_id', user_id)
							St.storageOperation('set', 'openid_coupon', openid_coupon)
						}
					}).catch((e) => {
						console.log(e)
						uni.hideLoading();
					})
				}
			},
			fail: function(res) {
				console.log(res);
			}
		})
	},
	//登录
	login() {
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				success: function(res) {
					resolve(res);
				},
				fail: function(err) {
					reject({
						code: 0,
						msg: '获取用户登录code失败',
					});
				}
			});
		});
	},
	//用户登录获取token

	async getToken(requestHandler = {
		success: function(res) {}
	}, userData = {}) {
		uni.showLoading({
			title: '登录中...'
		});
		let login = await this.login();
		let params = Apiencry.aes_encryptObject({
			activity_id: Cf.configData.activity_id,
			js_code: login.code,
			userInfo: userData
		});
		let loginArgs = {
			url: Cf.UrlList.pages.weixinLogin,
			data: params,
			method: 'POST',
		}
		let data = await Http.api(loginArgs)
		uni.hideLoading();
		if (data.code == 0 || data.code == '20_02_1_00014') {
			var token = data.data.token;
			var openId = data.data.openid;
			// var shareUserId = data.data.shareUserId;
			var user_id = data.data.user_id;
			var openid_coupon = data.data.openid_coupon
			St.storageOperation('set', 'token', token)
			St.storageOperation('set', 'openId', openId)
			// St.storageOperation('set', 'shareUserId', shareUserId)
			St.storageOperation('set', 'user_id', user_id)
			if (openid_coupon) {
				St.storageOperation('set', 'openid_coupon', openid_coupon)
			}
			requestHandler.success(data)
		} else {
			uni.showToast({
				title: data.msg,
				icon: "none"
			})
		}
		// return token
	},
	getCouponInfo() {
		let data = Apiencry.aes_encryptObject({
			activity_id: Cf.configData.activity_id,
		});
		Http.api({
				url: "weixinCouponInfo",
				method: "GET",
				data: data,
			})
			.then((res) => {
				if (res.data) {
					Cf.configData.activityInfo = res.data;
					St.storageOperation("set", "activityInfo", res.data);
				}
			}).catch(e => {
				uni.showToast({
					title: e.msg,
					icon: 'none'
				})
			});
	},
	getUserInfo() {
		let _this = this
		return new Promise((resolve, reject) => {
			uni.getSetting({
				success(res) {
					if (res.authSetting["scope.userInfo"]) {
						if (uni.getStorageSync("openid_coupon") == "") {
							_this.getAuthOpenid();
						} else {
							resolve(res)
						}
					} else {
						Fn.throttle(() => {
							uni.navigateTo({
								url: `/user/entrance/entrance`,
							});
						})();
					}
				},
			});
		});
	},
	getAuthOpenid() {
		let data = Apiencry.aes_encryptObject({
			activity_id: Cf.configData.activity_id,
		});
		Http.api({
				url: "authOpenid",
				method: "POST",
				data: data,
			})
			.then((res) => {
				if (res.code == 0) {
					let url = res.data.url;
					uni.redirectTo({
						url: `/pages/h5-openid-view/index?src=${encodeURIComponent(url)}`,
					});
				}
			})
			.catch((e) => {
				uni.showToast({
					title: e.msg,
					icon: 'none'
				})
			});
	},
}
