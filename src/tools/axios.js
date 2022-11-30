import axios from 'axios'
// let token;
// let url = 'http://122.112.236.72:8889/api';
// let defaultOptions = {
// 	method: "get",
// 	headers: {
// 		// 'Content-Type': "application/json",
// 		token,
// 	}
// }

const MyAxios = (options = {}) => {
	let _options
	let token;
	let url = 'http://122.112.236.72:8889/api';
	let defaultOptions = {
		method: "get",
		headers: {
			// 'Content-Type': "application/json",
			token,
		}
	}
	
	//获取本地的token
	if (window.sessionStorage.getItem('main')) {
		token = JSON.parse(window.sessionStorage.getItem('main')).token
	};
	defaultOptions.headers.token = token;
	//识别字符串
	if (typeof options == 'string') {
		defaultOptions.url=url+options
		_options=defaultOptions;
	} else {
		//覆盖选项
		_options = Object.assign(defaultOptions, options);
		_options.url = url + _options.url
		//get时修改data
		if(_options.method=='get'){
			let append='?';
			if(_options.data){
			Object.entries(_options.data).forEach(item => append+=(item[0]+'='+item[1]+'&'));
			_options.url+=append.substr(0,append.length-1)
			delete _options.data
			// console.log('append',_options.url);
			}
		}
	}
	//判断数据
	// console.log("axios{url:" + _options.url + ',token:' + _options.token + '}');
	console.log("axios发送", _options);
	return axios(_options);
}
export default MyAxios;
