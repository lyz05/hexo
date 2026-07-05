/*myWorker.js,每隔1s随机产生10个100以内的2位整数*/
var tenIntger=new Array();//定义保存随机2位整数的数组
function createTenIntger(){
	for (var j=0;j<10;j++){//利用数学函数随机产生10~99之间的整数
		tenIntger[j]=Math.floor(Math.random()*90+10);
	}
	postMessage(tenIntger.sort());
	setTimeout("createTenIntger()",1000);
}
createTenIntger();