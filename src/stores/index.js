import { defineStore } from 'pinia'
//判断是否有值
export const useStore = defineStore('mian',{
	state:()=>{
		// //判断是否有值
		if(sessionStorage.getItem('main')){ return JSON.parse(sessionStorage.getItem('main'))}
		return{
			data:'',
			optionData:'',
			formData:'',
			login:false,
			user:{},
			token:'',
		}
	},
	//持久化
	persist: {
	  //这里存储默认使用的是session
	    enabled: true,
	    strategies: [
	      {
	        //key的名称
	        key: 'main',
	        //更改默认存储，我更改为localStorage
	        // storage: localStorage,
	        // 可以选择哪些进入local存储，这样就不用全部都进去存储了
	        // 默认是全部进去存储
	        // paths: ['list']
	      }
	    ]
	  },
	getters:{
		// getDataList:(state)=>{
		// 	return state.data.list;
		// }
	},
	actions:{}
})