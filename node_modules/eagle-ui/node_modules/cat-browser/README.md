# cat-browser

基于cat的浏览器使用情况统计工具

## 使用
	
-	基于cat实现的浏览器使用情况统计工具，可以在cat上输入对应的模块名查看浏览器的使用率	     
    统计信息包括：     
      1、Module：当前模块名称     
      2、Agent：浏览器信息   
      3、Detail： 当前访问的url   
	基于cookie来判断是否有效时间内第一次登录，默认一天过期。可手动设置cookie过期时间    
	[点击转到cat查看统计情况](http://cat.dp/cat/r/browser?op=jsError)转到统计图表查看    
	  
- 	实例如下：   

	```
		import { CatBrowser } from '../../src/index.js';
        
        (()=>{
            let a = new CatBrowser({
                moduleName:'test2'
            });
        })();
	
	```
-	参数说明：  

	```
	
		 /**
          * 项目名称，即在cat上输入的模块名
          * */
          moduleName:'cat-browser',
          /**
          	* cookie过期时间，以天为单位
            * */
          expiresTime:1
          
	```

## update

- 0.1.2 统计信息改为当前页面url  
- 0.1.1 init组件

## Command

```
	#测试	
	npm run test	
	#打包	
	npm run build	
	#例子演示	
	npm run demo	
```


