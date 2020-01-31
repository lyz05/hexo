//ajax请求相关操作
// 发送ajax请求，成功跳转href链接
function ajaxRequest(type, url, data, href, func) {
	$.ajax({
		url : url,
		type : type,
		dataType : "json",
		data : data,
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success : function(result, testStatus) {
			if (result.code == "200") {
				// 命令执行成功跳转
				alertjs(result);
				if (href != null)
					window.location.href = href;
			}
			if (result.code == "605" && href != null)
				window.location.href = href;
			if (result.code == "403") {
				// 命令执行失败，或有错误消息需要显示
				alertjs(result);
			}
			if (result.code == "601" || result.code == "602") {
				// 未登录或非法访问
				alert(result.message);
				//window.location.href = './';
			}
			if (func != null)
				func(result);
		},
		error : function(xhr, errorMessage, e) {
			alert(xhr.statusText);
			//window.location.href = './';
			// alert("发送请求失败，请检查网络状态");
		}
	});
}
// 回调函数
function callBack(result) {
	if (result.code == 200) {
		search();
	}
}
function callBackReset(result) {
	if (result.code == 200) {
		$('#form1')[0].reset();
		$('#savebtn').hide();
		$('#searchbtn').addClass('btn-primary');
		$('#savebtn').removeClass('btn-primary');
		search();
	}
}
// 登出
function logout() {
	ajaxRequest("get", "http://earth.home999.cc/book/api/logout", null, "index.html", null);
}
// alert弹窗 需要在网页中添加alert组件
function alertjs(result) {
	scrollTo(0, 0); // 回到顶部
	var fadetimes = 300, showtimes = 3000;
	$("#alert").removeClass("alert-success");
	$("#alert").removeClass("alert-info");
	$("#alert").removeClass("alert-warning");
	$("#alert").removeClass("alert-danger");
	if (result.code == 200)
		$("#alert").addClass("alert-success");
	else if (result.code == 403)
		$("#alert").addClass("alert-danger");
	else
		$("#alert").addClass("alert-info");

	$("#alert").text(result.message);
	$("#alert").show(fadetimes);
	setTimeout(function() {
		$("#alert").hide(fadetimes);
	}, showtimes);
}
// 封装好的视图切换方法
function setDataCardView(id) {
	var options = $(id).bootstrapTable('getOptions');
	if ($(window).width() < 768) {
		if (options.cardView === false) {
			$(id).bootstrapTable('toggleView');
		}
	} else {
		if (options.cardView === true) {
			$(id).bootstrapTable('toggleView');
		}
	}
}
function tableresize() {
	for (var i = 0; i < arguments.length; i++) {
		setDataCardView(arguments[i]);
	}
}

// 窗口缩放时调用
$(window).resize(function() {
	tableautoresize();
});

function crossorigin(){
	var options={ 
		xhrFields: {        //跨域
				withCredentials: true
		},
			crossDomain: true
	};
	return options;
}