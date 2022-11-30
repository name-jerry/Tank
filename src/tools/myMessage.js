
const defaultOptions = {
	duration:2000,
	showClose:true
};
const MyMessage = (options = {},type='info') => {
	if(typeof options =='string') options={message:options};
	const _options=Object.assign(defaultOptions,options);
	return ElMessage[type](_options);
	
}
export default MyMessage;
