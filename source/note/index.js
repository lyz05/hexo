// 声明 class
var objid = '5df3844ab7166d000836de12';
function post()
{
	var Todo = AV.Object.extend('Todo');
	//获取当前时间
	var date = new Date();

	// 构建新对象
	var todo = new Todo();	
	// 为属性赋值
	todo.set('time', date);
	todo.set('content', '周二两点，全体成员');

	// 将对象保存到云端
	todo.save().then(function (todo) {
	  // 成功保存之后，执行其他逻辑
	  console.log('保存成功。objectId：' + todo.id);
	}, function (error) {
	  // 异常处理
	  
	});
}

function get()
{
	var query = new AV.Query('Todo');
	query.get(objid).then(function (todo) {
		// todo 就是 objectId 为 5df3844ab7166d000836de12 的 Todo 实例
		var time    = todo.get('time');
		var content = todo.get('content');
		console.log('查询成功。time：' + time + ',content:'+content);
		$("#content").val(content);
		keyup();
	});
}

function update()
{
	var todo = AV.Object.createWithoutData('Todo', objid);
	var content = $("#content").val();
	todo.set('content', content);
	todo.save().then(function (todo) {
	  // 成功保存之后，执行其他逻辑
	  console.log('修改成功。objectId：' + todo.id);
	}, function (error) {
	  // 异常处理
	  
	});
}
function keyup()
{
	var limitNum = 500;
    var pattern = '还可以输入' + limitNum + '字符';
	//初始化
	var remain = $('#content').val().length;
    if(remain > 500){
		pattern = "字数超过限制！";
	}else{
		var result = limitNum - remain;
		pattern = '还可以输入' + result + '字符';
	}
	$('#contentwordage').html(pattern);
	console.log(pattern);
	console.log("keyup");
}
//按下某些按键
$(document).ready(function(){
    $('#content').keyup(
		function(){
			keyup();
			update();
        }
    );
});

get();