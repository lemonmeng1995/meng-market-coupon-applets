/**
 * 微信HTTP请求封装
 */

import Fn from './function.js';
import Cf from './config.js';
import St from './system.js';
import MD5 from '../requireCom/md5.min.js';
import SHA1 from './sha1.js';
import Login from './login.js'

export default {
	//小程序API接口方法
	async api(args) {
		let page = this;
		let token = '';
		token = await St.storageOperation('get', 'token').catch(err => {});
		args = page.apiArgs(args);

		if (!token) {
			args['header']['TXB'] = 'TXB'
		} else {
			args['header']['TXB'] = 'TXB2'
			args['header']['Authorization'] = token
		}
		let errData = null;
		let data = await page.request(args).catch(err => {
			errData = err;
		});
		if (!data && errData !== null) {
			if (errData.code == '20_02_1_00006') { //登录超时，请重新登录！
				await St.storageOperation('remove', 'token').catch(err => {});
				uni.reLaunch({
					url: '/pages/index/index',
				})			
			} else {
				throw errData;
				return;
			}
		}
		return data;
	},

	//request接口
	request(args) {
		args = this.options(args); //系统参数组装
		return new Promise((resolve, reject) => {
			uni.request({
				url: args.url, //服务器接口地址
				data: args.data, //请求参数集合
				header: args.header, //请求的header参数集合
				method: args.method, //HTTP请求方法
				dataType: args.dataType, //返回的数据格式
				responseType: args.responseType, //响应的数据类型
				//sslVerify: false, //是否验证ssl证书
				success: (res) => {
					if (res.statusCode === 200) {
						if (res.data.success == true && (res.data.code == '0' || res.data.code == '20_02_1_00014')) {
							resolve(res.data);
						} else {
							reject({
								code: res.data.code,
								msg: res.data.message || res.data.msg,
							});
						}
					} else {
						reject({
							code: res.statusCode,
							msg: res.statusCode + ' 服务器接口请求错误！',
						});
					}
				},
				fail: (err) => {
					console.log('【http request fail】', err, args);
					reject({
						code: 500,
						msg: err.errMsg || '网络连接错误',
					});
				},
				complete: (ren) => {}
			})
		})
	},

	//应用参数组合
	apiArgs(args) {
		if (Fn.isEmpty(args['header'])) args['header'] = {};
		if (Fn.isEmpty(args['data'])) args['data'] = {};
		args['header']['TXB'] = '';
		if (!Fn.isContain(args.url, 'https://') && !Fn.isContain(args.url, 'http://')) {
			if (!Fn.isContain(args, 'modular') || Fn.isEmpty(args.modular)) {
				args.modular = 'pages'
			}
			args.url = Cf.UrlList[args.modular][args.url];
			delete args.modular;
		}
		// if (!Fn.isEmpty(args['data'])) {
		// 	let data = {};
		// 	for (let i in args['data']) {
		// 		if (args['data'][i] !== undefined && args['data'][i] !== null) {
		// 			data[i] = args['data'][i];
		// 		} else {
		// 			delete args['data'][i];
		// 		}
		// 	}
		// 	args['data'] = data;
		// }
		return args;
	},

	//系统参数组合
	options(args) {
		let page = this;
		args = Fn._assign({
			url: null, //服务器接口地址
			data: null, //请求参数集合
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			}, //请求的header参数集合
			method: 'POST', //HTTP请求方法
			dataType: 'json', //返回的数据格式
			responseType: null, //响应的数据类型
			success: null, //接口调用成功的回调函数
			fail: null, //接口调用失败的回调函数
			complete: null, //接口调用结束的回调函数（调用成功、失败都会执行）
		}, args);
		return args;
	},

	//获取签名
	getSign(params) {
		//签名步骤一：按照参数名ASCII字典序排序
		params = Fn.sort_ASCII(params);
		//签名步骤二:value不为空字符串,参数按照key=value的格式,key转换为小写
		let arr = [];
		for (let i in params) {
			if (params[i] !== "") {
				arr.push((i.toLowerCase() + "=" + params[i])); //参数名转小写
			}
		}
		let string = arr.join(("&"));
		//签名步骤三：在string后加入KEY
		if (string === '') {
			string = 'key=' + Cf.Autograph.key; //加密k值;
		} else {
			string = string + '&key=' + Cf.Autograph.key; //加密k值;
		}
		//签名步骤四：MD5/SHA1加密
		let sign = Cf.Autograph.type == 'SHA1' ? SHA1.sha1(string) : MD5.md5(string);
		//签名步骤五：所有字符转为大写
		sign = sign.toUpperCase();
		return sign;
	},
}
