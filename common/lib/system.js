/**
 * 系统方法封装
 */

import Vue from 'vue'
import Fn from './function.js'
import Cf from './config.js'
import Http from './http.js'
import Au from './authorize.js'

export default {
	//版本检查更新
	systemCheckUpdate() {
		let page = this;
		// #ifdef MP
		let updateManager = uni.getUpdateManager();
		updateManager.onCheckForUpdate((res) => {
			// 请求完新版本信息的回调
			console.log("是否有新版本：" + res.hasUpdate);
			if (res.hasUpdate) { //如果有新版本
				// 小程序有新版本，会主动触发下载操作（无需开发者触发）
				updateManager.onUpdateReady(() => { //当新版本下载完成，会进行回调
					uni.showModal({
						title: '小程序更新提示',
						content: '新版本已经准备好，单击确定重启应用',
						showCancel: false,
						success: (res) => {
							if (res.confirm) {
								page.storageOperation('clear');
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						}
					})
				})
				// 小程序有新版本，会主动触发下载操作（无需开发者触发）
				updateManager.onUpdateFailed(() => { //当新版本下载失败，会进行回调
					uni.showModal({
						title: '提示',
						content: '检查到有新版本，但下载失败，请检查网络设置',
						showCancel: false,
					})
				})
			}
		});
		// #endif
	},

	//获取系统信息
	getSystemInfoSync() {
		let page = this;
		let res = uni.getSystemInfoSync();
		let info = {
			brand: res.brand, //手机品牌	
			model: res.model, //手机型号	
			screenWidth: res.screenWidth, //屏幕宽度	
			screenHeight: res.screenHeight, //屏幕高度
			windowWidth: res.windowWidth, //可使用窗口宽度
			windowHeight: res.windowHeight, //可使用窗口高度
			statusBarHeight: res.statusBarHeight, //状态栏的高度(设备最顶部网络/时间/电量等)
			platform: res.platform, //客户端平台，值域为：ios、android
			bottomBar: uni.upx2px(100), //底部菜单高度
			bottomBarPd: 0, //底部下边距高度
			isIpx: false, //是否是iphone10以上产品
		}
		if (info.model) {
			let x = info.model.toLowerCase().replace(/ /g, '');
			if (Fn.isContain(x, 'iphonex') || Fn.isContain(x, 'iphone1')) {
				info.bottomBar = info.bottomBar + uni.upx2px(68); //iphone10系列全面屏底部抬高68rpx
				info.bottomBarPd = uni.upx2px(68);
				info.isIpx = true;
			}
		}
		let capsule = null;
		// #ifdef MP
		capsule = uni.getMenuButtonBoundingClientRect();
		// #endif
		if (Fn.isEmpty(capsule)) {
			//如果出现故障,则从缓存中拿出上一次获取的正确的值
			capsule = page.storageOperation('get', 'capsule');
			//如果获取都失败,缓存里没有数据,则使用默认值
			if (Fn.isEmpty(capsule)) {
				if (info.isIpx) {
					capsule = {
						bottom: 82,
						height: 32,
						left: 278,
						right: 365,
						top: 50,
						width: 87
					}
					info.statusBarHeight = info.statusBarHeight === 0 ? 44 : info.statusBarHeight;
				} else {
					capsule = {
						bottom: 58,
						height: 32,
						left: 278,
						right: 365,
						top: 26,
						width: 87
					}
					info.statusBarHeight = info.statusBarHeight === 0 ? 20 : info.statusBarHeight;
				}
			}
		} else {
			page.storageOperation('set', 'capsule', capsule);
		}
		info.jiaonanBar = 0;
		// #ifdef MP
		info.jiaonanBar = 100;
		// #endif
		info.custom = capsule;
		info.customBar = capsule.bottom + capsule.top - info.statusBarHeight;
		// #ifdef MP-ALIPAY
		info.customBar = info.statusBarHeight + info.titleBarHeight;
		// #endif
		Vue.prototype.SystemInfo = info;
	},

	// 本地缓存操作 operate:set(存储)/get(获取)/remove(移除)/clear(清除);deadtime(有效时间);sync:true(同步)/false (异步)
	storageOperation(operate, key = '', data = '', deadtime = 0, sync = true) {
		let dtimeKey = key + '_deadtime';
		let time = Fn.getTimestamp();
		deadtime = parseInt(deadtime);
		return new Promise((resolve, reject) => {
			try {
				if (operate == 'set') { //存储
					if (sync) { //同步存储
						uni.setStorageSync(key, data);
						if (deadtime > 0) {
							deadtime = time + deadtime;
							uni.setStorageSync(dtimeKey, deadtime);
						}
						resolve();
					} else { //异步存储
						uni.setStorage({
							key: key,
							data: data,
							success: () => {
								if (deadtime > 0) {
									deadtime = time + deadtime;
									uni.setStorage(dtimeKey, deadtime);
								}
								resolve();
							},
							fail: () => {
								reject('异步设置缓存失败:' + key + '-' + data);
							}
						})
					}
				} else if (operate == 'get') { //获取
					deadtime = parseInt(uni.getStorageSync(dtimeKey))
					if (deadtime) {
						if (deadtime <= time) {
							reject('缓存已过期:' + key);
						}
					}
					if (sync) { //同步获取
						let value = uni.getStorageSync(key);
						Fn.isEmpty(value) ? reject('获取的缓存数据为空:' + key) : resolve(value);
					} else { //异步获取
						uni.getStorage({
							key: key,
							success: (res) => {
								Fn.isEmpty(res.data) ? reject('获取的缓存数据为空:' + key) : resolve(res.data);
							},
							fail: () => {
								reject('异步获取缓存失败:' + key);
							}
						})
					}
				} else if (operate == 'remove') { //移除
					if (sync) { //同步移除
						uni.removeStorageSync(key);
						uni.removeStorageSync(dtimeKey);
						resolve();
					} else { //异步移除
						uni.removeStorage({
							key: key,
							success: () => {
								uni.removeStorage(dtimeKey);
								resolve();
							},
							fail: () => {
								reject('异步移除缓存失败');
							}
						})
					}
				} else if (operate == 'clear') { //清除
					if (sync) { //同步清除
						uni.clearStorageSync();
						resolve();
					} else { //异步清除
						uni.clearStorage();
						resolve();
					}
				} else {
					reject('没有该缓存操作选项:' + operate);
				}
			} catch (e) {
				reject('操作失败:' + operate + '-' + key + '-' + data);
			}
		})
	},

	//页面跳转 url:页面路径/返回页面层数,
	//type:to(前进)/back(后退)/redirectTo(关闭当前页面，跳转到应用内的某个页面)/reLaunch(关闭所有页面，打开到应用内的某个页面)/switchTab(跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面)
	//time:延迟多久执行（因安卓机关闭支付界面回调跳转BUG，故最少要延迟200毫秒执行）
	navigate(url, type = 'to', time = 0) {
		let page = this;
		return new Promise(function(resolve, reject) {
			if (Fn.getParamType(url) == 'string') {
				if (url.substr(0, 1) != '/') {
					url = '/' + url;
				}
			}
			setTimeout(function() {
				if (type == 'to') {
					uni.navigateTo({
						url: url,
						success: function(res) {
							resolve();
						}
					})
				} else if (type == 'back') {
					let delta = url;
					if (Fn.getParamType(delta) != 'number') {
						delta = 1;
					}
					uni.navigateBack({
						delta: delta
					})
					resolve();
				} else if (type == 'switchTab') {
					uni.switchTab({
						url: url,
						success: function(res) {
							resolve();
						}
					})
				} else if (type == 'reLaunch') {
					uni.reLaunch({
						url: url,
						success: function(res) {
							resolve();
						}
					})
				} else if (type == 'redirectTo') {
					uni.redirectTo({
						url: url,
						success: function(res) {
							resolve();
						}
					})
				}
			}, time);
		})
	},

	//小程序跳转 obj:参数,type:to(前进)/back(后退),time:延迟多久执行,envVersion:跳转版本 trial(体验版)/develop(开发版)/release(正式版)
	navigateMiniProgram(obj, type = "to", time = 0, envVersion = "release") {
		return new Promise(function(resolve, reject) {
			let extraData = Fn.isContain(obj, 'extraData') ? obj.extraData : {};
			setTimeout(function() {
				if (type == 'to') {
					let appId = obj.appId;
					let path = Fn.isContain(obj.path, 'path') ? obj.path : 'pages/index/index';
					uni.navigateToMiniProgram({
						appId: appId,
						path: path,
						extraData: extraData,
						envVersion: envVersion,
						success: function(res) {
							resolve();
						},
						fail: function(res) {
							reject('小程序跳转失败');
						}
					})
				} else {
					uni.navigateBackMiniProgram({
						extraData: extraData,
						success: function(res) {
							resolve();
						},
						fail: function(res) {
							reject('小程序回跳失败');
						}
					})
				}
			}, time);
		})
	},

	//获取服务供应商
	getProvider(service) {
		return new Promise(function(resolve, reject) {
			uni.getProvider({
				service: service,
				success: function(res) {
					resolve(res);
				},
				fail: function(e) {
					reject('获取服务供应商失败');
				}
			})
		})
	},

	//登录
	login(force = false) {
		return new Promise((resolve, reject) => {
			uni.login({
				force: force,
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
	async getToken() {
		let page = this;
		Cf.LoginRestriction -= 1;
		if (Cf.LoginRestriction < 0) {
			throw {
				code: 500,
				msg: '登录次数超限制，请稍后重试',
			}
		}
		let login = await page.login().catch(err => {
			throw err;
		});
		let params = {
			code: login.code,
			anonymous_code: login.anonymousCode,
		}
		let userInfo = await page.storageOperation('get', 'userInfo').catch(err => {});
		if (userInfo) {
			params.mobile = !Fn.isEmpty(userInfo.mobile) ? userInfo.mobile : '';
			params.nickname = !Fn.isEmpty(userInfo.nickName) ? userInfo.nickName : '';
			params.avatar = !Fn.isEmpty(userInfo.avatarUrl) ? userInfo.avatarUrl : '';
			params.gender = !Fn.isEmpty(userInfo.gender) ? userInfo.gender : '';
		}
		let loginArgs = Http.apiArgs({
			modular: 'basics',
			url: 'getToken',
			data: params,
		})
		let data = await Http.request(loginArgs).catch(err => {
			throw err;
		})
		let token = data.token;
		Cf.LoginRestriction = 3;
		await page.storageOperation('set', 'token', token)
			.catch(err => {
				throw err;
			})
		return token
	},

	//开发环境获取指定用户token
	async getDemoToken() {
		let page = this;
		Cf.LoginRestriction -= 1;
		if (Cf.LoginRestriction < 0) {
			throw {
				code: 500,
				msg: '登录次数超限制，请稍后重试',
			}
		}
		let loginArgs = Http.apiArgs({
			modular: 'basics',
			url: 'getDemoToken',
			data: {
				demo_code: Cf.demoData.demo_code,
				uid: Cf.demoData.demo_uid,
			}
		})
		let data = await Http.request(loginArgs).catch(err => {
			throw err;
		})
		let token = data.token;
		Cf.LoginRestriction = 3;
		await page.storageOperation('set', 'demo-token', token)
			.catch(err => {
				throw err;
			})
		return token;
	},

	//用户信息权限校验
	checkUserInfoScope() {
		let page = this;
		return new Promise((resolve, reject) => {
			Au.checkUserInfoScope().then(res => {
				resolve(res);
			}).catch(err => {
				page.navigate('pages/comsingle/authorizedLogin');
				reject();
			});
		});
	},

	//返回指定路由的页面对象
	getCurrentPage(url) {
		let pages = getCurrentPages(); //获取页面栈
		if (Fn.isEmpty(url)) {
			url = 'pages/index/index';
		}
		//获取到返回的页面下标
		let pageIndex = pages.findIndex(findItem => {
			return findItem.route === url //需返回的页面路由,如:'pages/index/index'
		})
		//获取到返回的页面对象
		let prevPage = pages[pageIndex];
		return prevPage;
		// #ifdef APP-PLUS
		prevPage.$vm.custemOnReady(); //app端写法
		// #endif
		// #ifndef APP-PLUS
		prevPage.custemOnReady(); //调用列表页面方法
		// #endif
	},

	//发起支付
	async requestPayment(order_no, payment, attach = null) {
		let page = this;
		if (Cf.Environment == 'Dev' || Cf.Environment == 'Test' || Cf.Environment == 'Pre') {
			payment = 0.01;
		}
		let payPamas = await Http.api({
			modular: 'basics',
			url: 'getPayParams',
			method: 'GET',
			data: {
				order_no: order_no,
				payment: payment,
				attach: attach,
			}
		}).catch(err => {
			throw err;
		});
		/*let payType = 'toutiao';
		let payTypes = await page.getProvider('payment');
		if (!Fn.isContain(payTypes.provider, payType)) {
			throw payType + ' 该支付方式不存在';
		}*/
		// #ifdef MP-TOUTIAO
		let res = await page.toutiaoPay(payPamas).catch(err => {
			throw err;
		});
		return res;
		// #endif
	},

	//头条支付
	toutiaoPay(payPamas) {
		return new Promise((resolve, reject) => {
			uni.requestPayment({
				provider: 'toutiao',
				orderInfo: payPamas.orderInfo,
				service: payPamas.service,
				//_debug: 1,
				getOrderStatus(res) {
					//微信支付会走该逻辑不断发起请求重复验证支付状态
					//let { out_order_no } = res;
					return new Promise(function(resolve, reject) {
						Http.api({
							modular: 'basics',
							url: 'getPayStatus',
							method: 'GET',
							data: {
								order_no: payPamas.order_no,
							},
						}).then(res => {
							let trade = res.trade;
							if (trade.status == 2) {
								resolve({
									code: 0
								});
							} else {
								resolve({
									code: 9
								});
							}
						}).catch(err => {
							reject(err)
						});
					});
				},
				success: function(res) {
					//0：支付成功 1：支付超时 2：支付失败 3：支付关闭 4：支付取消 9：订单状态开发者自行获取
					if (res.code == 0) {
						// 支付成功处理逻辑，只有res.code=0时，才表示支付成功
						// 但是最终状态要以商户后端结果为准
						resolve({
							code: res.code,
							msg: '支付成功',
						});
					} else if (res.code == 1) {
						resolve({
							code: res.code,
							msg: '支付超时',
						});
					} else if (res.code == 2) {
						resolve({
							code: res.code,
							msg: '支付失败',
						});
					} else if (res.code == 3) {
						resolve({
							code: res.code,
							msg: '支付关闭',
						});
					} else if (res.code == 4) {
						resolve({
							code: res.code,
							msg: '支付取消',
						});
					} else {
						resolve({
							code: res.code,
							msg: '未知的支付状态',
						});
					}
				},
				fail: function(err) {
					reject('支付失败');
				}
			});
		})
	},

	//操作系统剪切板的内容 type:set(设置)/get(获取),data:内容
	clipboardData(type = 'get', data = '') {
		return new Promise(function(resolve, reject) {
			if (type == 'set') {
				uni.setClipboardData({
					data: data,
					success: res => {
						uni.showToast({
							title: '已复制',
							duration: 1000,
						})
						resolve();
					}
				})
			} else {
				uni.getClipboardData({
					success: res => {
						resolve(res.data);
					}
				})
			}
		})
	},

	//在新页面中全屏预览图片 data:图片路径数组集合
	previewImage(data) {
		let urls = [];
		let current = 0;
		if (Fn.getParamType(data) == 'object') {
			for (let i in obj) {
				urls.push(obj[i]);
			}
		} else if (Fn.getParamType(data) == 'array') {
			urls = data;
		} else if (Fn.getParamType(data) == 'string') {
			urls.push(data)
		} else {
			return;
		}
		uni.previewImage({
			urls: urls, // 需要预览的图片http链接列表
			current: current // 当前显示图片的索引
		})
	},

	//扫一扫
	scanCode() {
		return new Promise(function(resolve, reject) {
			uni.scanCode({
				success(res) {
					console.log('扫码返回结果');
					console.log(res);
					resolve(res);
				}
			})
		})
	},

}
