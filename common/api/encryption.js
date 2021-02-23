/* eslint-disable */
import hex_md5 from '../requireCom/md5.min.js'
import cryptoJs from '../requireCom/crypto-js.js'
// import store from "../store";
// import router from "../router";
import * as helper from "../lib/function.js";

const apis = {
  api_key: 't@0A0KGCNaoEZ&wYjn0hbLRwmDj2IgUa',
  aes_key: 'l49ij@Dz0z3X$Gza',
  aes_iv: 'FdO!$8M4bbpTmzxw'
}
//get方法 rq参数加密

export default {
	//     // 验签
	ObjectSignature(a) {
	  if (typeof (a) == 'undefined') {
	    return
	  }
	  var f = apis.api_key
	  var d = Object.keys(a).sort()
	  var e = []
	  typeof a.except_field !== 'undefined' && (e = a.except_field.split(','))
	  var b = ''
	  for (const index in d) {
	    var c = d[index]
	    if (a[c] + '' != '') {
	      c != 'except_field' && String(e.indexOf(c)) == '-1' && (b != '' && (b += '&'), b += a[c])
	    }
	  }
	  b += '&' + f
	  a.sign = hex_md5(b);
	  return a
	},
	/**
	 * 加密对象
	 */
	aes_encryptObject(obj) {
	  var encryptStr = JSON.stringify(obj);
	  encryptStr = this.aes_encrypt(encryptStr);
	  return {
	    rq: encryptStr
	  };
	},
	
	// 加密
	 aes_encrypt(str) {
	  var key = cryptoJs.enc.Utf8.parse(apis.aes_key);
	  var iv = cryptoJs.enc.Utf8.parse(apis.aes_iv);
	  var encrypted = cryptoJs.AES.encrypt(str, key, { iv: iv, mode: cryptoJs.mode.CBC, padding: cryptoJs.pad.Pkcs7 });
	
	  return (encrypted.toString());
	  // return encodeURIComponent(encrypted.toString());
	},
	
	// 解密
	 aes_decrypt(str) {
	  // str = decodeURIComponent(str);
	  var key = cryptoJs.enc.Utf8.parse(apis.aes_key);
	  var iv = cryptoJs.enc.Utf8.parse(apis.aes_iv);
	  var decrypted = cryptoJs.AES.decrypt(str, key, { iv: iv, padding: cryptoJs.pad.Pkcs7 });
	  return decrypted.toString(cryptoJs.enc.Utf8);
	},
	
	
	/**
	 * 获取RQ并解析,主用于直接获取URL上的rq
	 */
	 getrq(rq) {
	  let obj = {};
	  rq = decodeURIComponent(rq);
	  var arr_url = this.aes_decrypt(rq);
	  // if(arr_url.indexOf('&')  == -1  && arr_url.indexOf('=')  == -1){
	  if (this.isJsonString(arr_url)) {
	    // {"a":"1","b":"2"}
	    obj = JSON.parse(arr_url);
	    return obj
	  } else {
	    //a=1&b=2
	    var arr2 = arr_url.split('&');
	    for (var i = 0; i < arr2.length; i++) {
	      var arr3 = arr2[i].split('=');
	      obj[arr3[0]] = arr3[1];
	    }
	    return obj;
	  }
	},
	
	/**
	 * 
	 * @param {*} str 
	 */
	 isJsonString(str) {
	  try {
	    if (typeof JSON.parse(str) == "object") {
	      return true;
	    }
	  } catch (e) {
	  }
	  return false;
	},
	
	/**
	 * 
	 * @param {*} path 
	 * @param {*} obj 
	 * @param {*} is_href  是否原生跳转
	 */
	 routerPush(query, path, obj = {}, is_href = false) {
	  let rq_query = query.rq || '';
	  let rq = getrq(rq_query);
	  //分享用户
	  let share_user_id = rq.share_user_id || '';
	  var params = {
	    activity_id: store.state.activeId
	  };
	  if (share_user_id != '') {
	    params = Object.assign(params, { share_user_id: share_user_id });
	  }
	  let paramsTarget = Object.assign(params, obj);
	  query = this.aes_encryptObject(paramsTarget);
	
	  if (is_href) {
	    //原生跳转，用于个别要重新加载才能分享
	    location.href = path + "?rq=" + query.rq
	  } else {
	    router.push({ path: path, query: query });
	  }
	
	},
	
	 parseTime(time, cFormat) {
	  if (arguments.length === 0) {
	    return null
	  }
	  const format = cFormat || '{y}/{m}/{d} {h}:{i}:{s}'
	  let date
	  if (typeof time === 'object') {
	    date = time
	  } else {
	    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
	      time = parseInt(time)
	    }
	    if (typeof time === 'number' && time.toString().length === 10) {
	      time = time * 1000
	    }
	    date = new Date(time)
	  }
	  const formatObj = {
	    y: date.getFullYear(),
	    m: date.getMonth() + 1,
	    d: date.getDate(),
	    h: date.getHours(),
	    i: date.getMinutes(),
	    s: date.getSeconds(),
	    a: date.getDay()
	  }
	  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
	    let value = formatObj[key]
	    // Note: getDay() returns 0 on Sunday
	    if (key === 'a') {
	      return ['日', '一', '二', '三', '四', '五', '六'][value]
	    }
	    if (result.length > 0 && value < 10) {
	      value = '0' + value
	    }
	    return value || 0
	  })
	  return timeStr
	},
	
	
	 imageResize(imgUrl, width = 750) {
	  return imgUrl + '?x-oss-process=image/resize,w_' + width
	},
	
}


