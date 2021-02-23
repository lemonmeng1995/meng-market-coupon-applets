/**
 * 配置文件
 */

const Environment = 'Prod'; //环境 Prod:正式，Pre:预发布，Test:测试，Dev:本地

let BasePath = ''; //域名

//本地环境切换
if (Environment == 'Dev') {
	BasePath = "https://test-coupon-applets-api.sqqmall.com";
	// BasePath = 'http://10.10.3.168:8068'
}
//测试环境切换
if (Environment == 'Test') {
	BasePath = "https://test-coupon-applets-api.sqqmall.com";
}
//预发布环境切换
if (Environment == 'Pre') {
	BasePath = "https://pre-coupon-applets-api.sqqmall.com";
	
}
//正式环境切换
if (Environment == 'Prod') {
	BasePath = "https://coupon-applets-api.sqqmall.com";
}
//路由列表
const UrlList = {

	//活动信息页面
	pages: {
		weixinsAuth: BasePath + '/weixins/wx-auth', //获取用户的openid\昵称
		weixinLogin: BasePath + '/v1/auth/login', // 登录 
		weixinCouponInfo: BasePath + '/v1/coupon/info', // 获取活动信息
		couponPageConfig: BasePath + '/v1/coupon/page-config', //页面配置
		sendSmsApi: BasePath + '/v1/common/send_sms', //发送短信
		couponCardList: BasePath + '/v1/coupon/card-list', //立减金卡类型
		userVerifyMobile: BasePath + '/v1/user/verify-mobile', //白名单校验手机号
		quickList: BasePath + '/v1/quick/quick-list', //灵活活动信息
		userMyInfo: BasePath + '/v1/user/my-info', //我的页面
		authOpenid: BasePath + '/v1/auth/openid', //获取公众号openid
		quanyiLogin: BasePath + '/v1/quanyi/login', //权益登录
		getQuanyi: BasePath + '/v1/quanyi/get-quanyi', //支付权益
		userPayment: BasePath + '/v1/user/payment', //普通活动支付
		quickPayment: BasePath + '/v1/quick/payment',
		merchantList: BasePath + '/v1/quick/merchant-list', // 获取门店列表
		openidCoupon: BasePath + '/v1/user/openidcoupon',
		getCouponInfoList: BasePath + '/v1/user/coupon-info', // 获取我的立减金
		wxDecryptData: BasePath + '/v1/weixin/decrypt-data', //解密获取微信手机号
		userBangMobile: BasePath + '/v1/user/bang-mobile', //手机绑定
		orderQuery: BasePath + '/v1/order/query', //订单查询
		quickOrderQuery: BasePath + '/v1/order/quick-query', //灵活订单查询

		//1.0.1ui改版
		couponIndexBanner: BasePath + '/v1/coupon/index-banner',
		couponNewList: BasePath + '/v1/quick/new-list',
		couponNewDetail: BasePath + '/v1/quick/new-detail',
		couponBrushBanner: BasePath + '/v1/brush/banner-list',
		couponBrushActivityList: BasePath + '/v1/brush/activity-list',
		couponOrderCancel: BasePath + '/v1/order/order-cancel'

	}
}
const configData = {
	code: '', 
	isIPX: false,
	activity_id: 6,
	activityInfo: {}
}
export default {
	Environment: Environment,
	UrlList: UrlList,
	configData
};
