/**
 * 公共方法封装

 */

let _lastTime = null; //函数节流参数：上次程序执行记录时间
let timeout = null; //函数防抖参数：延时器名称
// 手机校验
const phoneRegExp = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;;

export default {
	log(msg, msg1 = '', msg2 = '', msg3 = '') {
		if (process.env.VUE_APP_BASE_API == 'prod') {
			return false;
		}
		if (msg1 != '') {
			console.log(msg, msg1);
		} else if (msg2 != '') {
			console.log(msg, msg1, msg2);
		} else if (msg3 != '') {
			console.log(msg, msg1, msg2, msg3);
		} else {
			console.log(msg);
		}
	},
	// 手机校验
	phone(telephone) {
		return phoneRegExp.test(telephone)
	},
	//只能输入数字
	setOnlyNunber(e) {
		e = e.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, "");
		e = e.replace(/[^\d]/g, '');
		return e
	},
	//获取当前/指定日期 时间戳（秒）date:一般时间格式:2014-07-10 10:21:12
	getTimestamp(date = 0) {
		if (!this.isEmpty(date)) {
			date = date.toString().replace(/-/g, '/'); //因IOS是需要国际时间格式，故在此转化
			return (Date.parse(new Date(date))) / 1000;
		} else {
			return new Date().getTime() / 1000;
		}
	},

	//获取当前格式化时间 str: /(年/月/日) 或者 -(年-月-日)
	getCurrentData(str = '/') {
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let hour = date.getHours();
		let minute = date.getMinutes();
		let second = date.getSeconds();
		let formatNumber = (n) => {
			n = n.toString();
			return n[1] ? n : '0' + n;
		}
		return [year, month, day].map(formatNumber).join(str) + ' ' + [hour, minute, second].map(formatNumber).join(':');
	},

	//时间戳转化为年 月 日 时 分 秒 timeFormatDate(sjc,'Y/M/D h:m:s')
	//time: 传入时间戳
	//format：返回格式，支持自定义，但参数必须在formateArr中
	timeFormatDate(time, format) {
		let formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
		let returnArr = [];
		let date = new Date(time * 1000);
		let formatNumber = (n) => {
			n = n.toString();
			return n[1] ? n : '0' + n;
		}
		returnArr.push(date.getFullYear());
		returnArr.push(formatNumber(date.getMonth() + 1));
		returnArr.push(formatNumber(date.getDate()));
		returnArr.push(formatNumber(date.getHours()));
		returnArr.push(formatNumber(date.getMinutes()));
		returnArr.push(formatNumber(date.getSeconds()));
		for (var i in returnArr) {
			format = format.replace(formateArr[i], returnArr[i]);
		}
		return format;
	},

	//获取某月的总天数 year:年 month:月 
	getMonthDays(year, month) {
		let mydate = new Date(year, month, 0); //0的目的是获取某月的天数
		mydate = mydate.getDate();
		return mydate;
	},

	// 倒计时
	timeDown(endTime) {
		let page = this;
		//获取时间差
		let now = page.getTimestamp();
		let totalSeconds = parseInt((endTime - now));
		//天数
		var days = Math.floor(totalSeconds / (60 * 60 * 24));
		//取模（余数）
		var modulo = totalSeconds % (60 * 60 * 24);
		//小时数
		var hours = Math.floor(modulo / (60 * 60));
		modulo = modulo % (60 * 60);
		//分钟
		var minutes = Math.floor(modulo / 60);
		//秒
		var seconds = modulo % 60;
		//输出还剩多少时间
		return `${days}天 ${hours}小时 ${minutes}分 ${seconds}秒`
	},

	//参数类型判断
	getParamType(param) {
		switch (Object.prototype.toString.call(param)) {
			case "[object Object]": //对象
				return 'object';
			case "[object Array]": //数组
				return 'array';
			case "[object String]": //字符串
				return 'string';
			case "[object Number]": //数值
				return 'number';
			case "[object Function]": //函数
				return 'function';
			case "[object Boolean]": //布尔值
				return 'boolean';
			case "[object Undefined]": //空
				return false;
			default:
				return false;
		}
	},

	//判断是否存在 needle在haystack中是否存在
	isContain(haystack, needle) {
		let paramType = this.getParamType(haystack);
		if (paramType == 'object') {
			return haystack.hasOwnProperty(needle);
		} else if (paramType == 'array' || paramType == 'string') {
			return haystack.includes(needle) ? true : false;
		} else {
			return false;
		}
	},

	//判断是否为空，'0'和0都不为空
	isEmpty(param) {
		let paramType = this.getParamType(param);
		if (paramType == 'object') {
			return JSON.stringify(param) == '{}' ? true : false;
		} else if (paramType == 'array' || paramType == 'string') {
			if (param == 'undefined') {
				return true
			} else {
				return param.length == 0 ? true : false;
			}
		} else if (paramType == 'number') {
			return false;
		} else if (paramType == 'boolean') {
			return param ? false : true;
		} else {
			return true;
		}
	},

	//参数合并
	_assign(obj1, obj2) {
		let page = this;
		if (!obj1) return obj2;
		for (let key in obj2) {
			let def = obj2[key];
			if (obj1[key] == null) {
				if (def != null && typeof def === 'object') {
					obj1[key] = page._assign({}, def); // 深度匹配
				} else {
					obj1[key] = def;
				}
			} else {
				if (typeof obj1[key] === 'object') {
					page._assign(obj1[key], obj2[key]); // 深度匹配
				} else {
					if (def != null) {
						obj1[key] = def;
					}
				}
			}
		}
		return obj1;
	},

	//将URL中的参数解析成一个数组
	urlParamAnalysis(str) {
		let paramStr = decodeURIComponent(str);
		if (this.getParamType(paramStr) == 'string' && !this.isEmpty(paramStr)) {
			let paramArr = paramStr.split('&');
			if (!this.isEmpty(paramArr)) {
				let opts = {};
				for (let [key, val] of paramArr) {
					let arr = val.split('=');
					if (!this.isEmpty(arr) && !this.isEmpty(arr[0]) && !this.isEmpty(arr[1])) {
						opts[arr[0]] = arr[1];
					}
				}
				return opts;
			}
		}
		return null;
	},

	//浮点数保留几位小数 digit:保留位数
	formatFloat(val, digit = 2) {
		val = parseFloat(val);
		//pow(10,n) 为 10 的 n 次方
		let m = Math.pow(10, digit);
		return parseInt(val * m, 10) / m;
	},

	//四则运算 (char +加法，-减法，*乘法，/除法)
	arithmetic(num1, num2, char = '+') {
		let m = 0,
			n = 0,
			r1 = 0,
			r2 = 0,
			k1, k2;
		k1 = num1.toString();
		k2 = num2.toString();
		try {
			r1 = k1.split(".")[1].length;
		} catch (e) {
			r1 = 0;
		}
		try {
			r2 = k2.split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}
		if (char == '+' || char == '-') {
			m = Math.pow(10, Math.max(r1, r2));
			if (char == '+') { //加
				return (num1 * m + num2 * m) / m;
			} else { //减
				n = (r1 >= r2) ? r1 : r2;
				return ((num1 * m - num2 * m) / m).toFixed(n);
			}
		} else {
			if (char == '*') { //乘
				m = r1 + r2;
				return Number(k1.replace(".", "")) * Number(k2.replace(".", "")) / Math.pow(10, m);
			} else { //除
				m = Number(k1.toString().replace(".", ""))
				n = Number(k2.toString().replace(".", ""));
				return (m / n) * Math.pow(10, r2 - r1);
			}
		}
	},

	//获取随机数 length：几位
	getRandom(length = 6) {
		let s4 = () => {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		let random = '';
		for (let i = 0; i < length; i++) {
			random += s4();
		}
		return random;
	},

	//字符串截取，中英文都能用 英文1=2，中文1=1
	cutString(str, len) {
		len = len + len;
		let str_length = 0;
		let str_len = 0;
		let str_cut = new String();
		str_len = str.length;
		for (let val of str) {
			str_length++;
			if (escape(val).length > 4) { //中文字符的长度经编码之后大于4
				str_length++;
			}
			str_cut = str_cut.concat(val);
			if (str_length >= len) {
				str_cut = str_cut.concat("...");
				return str_cut;
			}
		}
		//如果给定字符串小于指定长度，则返回源字符串；  
		if (str_length < len) {
			return str;
		}
	},

	//移除字符串前后的空格
	strTrim(str) {
		return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
	},

	//JSON对象转JSON字符串(cb转换方式 ，支持 parse,eval)
	jsonEncode(obj, cb = '') {
		if (cb == 'toJSONString') {
			return obj.toJSONString();
		}
		return JSON.stringify(obj);
	},

	//JSON字符串转JSON对象(cb转换方式 ，支持 parse,eval)
	jsonDecode(json, cb = '') {
		if (cb == 'parse') { //需严格的JSON格式字符串
			return json.parseJSON();
		} else if (cb == 'eval') { //解析后会执行字符串中的JS代码
			return eval('(' + json + ')');
		}
		return JSON.parse(json);
	},

	//url解码
	urlDecode(data) {
		return decodeURI(data)
	},

	//url编码
	urlEncode(data) {
		return encodeURI(data);
	},

	//返回结果集
	returnResult(msg = '', code = 1, data = '') {
		let result;
		if (this.getParamType(msg) == 'object') {
			result = {
				code: msg.code,
				msg: msg.msg,
				data: msg.data,
			}
		} else if (this.getParamType(msg) == 'array') {
			result = {
				code: msg['code'],
				msg: msg['msg'],
				data: msg['data'],
			}
		} else {
			result = {
				code: code,
				msg: msg,
				data: data,
			}
		}
		return result;
	},

	//函数节流 （限制重复执行,立即执行第一次事件）gapTime:允许多久执行一次,单位毫秒
	throttle(fn, gapTime = 1000) {
		// 返回新的函数
		return function() {
			let _nowTime = +new Date();
			if (_nowTime - _lastTime > gapTime || !_lastTime) {
				fn.apply(this, arguments) //将this和参数传给原函数
				_lastTime = _nowTime
			}
		}
	},

	//函数防抖 （限制重复执行,延迟执行最后一次事件）wait:延迟多久后生效一次,单位毫秒
	debounce(fn, wait = 500) {
		return function(event) {
			if (timeout !== null) {
				clearTimeout(timeout); //清除延时器
			}
			timeout = setTimeout(() => {
				fn.call(this, event)
			}, wait);
		};
	},

	//函数节流+防抖 (限制重复执行,wait->延迟执行最后一次事件 gapTime->允许多久执行一次),单位毫秒
	throttle2(fn, wait = 500, gapTime = 1000) {
		_lastTime = new Date();
		return function() {
			let context = this,
				args = arguments,
				_nowTime = new Date();
			if (_nowTime - _lastTime >= gapTime) {
				if (timeout !== null) {
					clearTimeout(timeout);
				}
				timeout = setTimeout(function() {
					_lastTime = _nowTime;
					fn.apply(context, args);
				}, wait);
			}
		}
	},

	//将1个数组插入另1个数组 arr1原数组，arr2插入的数组
	concat(arr1, arr2) {
		return arr1.concat(arr2);
	},

	//得到元素的size
	getElSize(id) {
		return new Promise((res, rej) => {
			uni.createSelectorQuery().select('#' + id).fields({
				size: true,
				scrollOffset: true
			}, (data) => {
				res(data);
			}).exec();
		});
	},

	//OBJ对象按照ASCII字典正序排序
	sort_ASCII(obj) {
		let arr = new Array();
		let num = 0;
		for (let i in obj) {
			arr[num] = i;
			num++;
		}
		let sortArr = arr.sort();
		let sortObj = {};
		for (let i in sortArr) {
			sortObj[sortArr[i]] = obj[sortArr[i]];
		}
		return sortObj;
	},

	//删除字符串中的emoji表情
	removeEmoji(str) {
		let regStr =
			/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
		str = str.replace(regStr, "");
		return str;
	},

	imageResize(width = 750) {
		return '?x-oss-process=image/resize,w_' + width
	}
}
