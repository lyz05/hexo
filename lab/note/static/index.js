// 声明 class
var objid = '65a670d939456b6fd8d45ed7';
var lastupdate = 0;

function get() {
    var query = new AV.Query('Note');
    query.get(objid).then(function(Note) {
        var time = Note.get('time');
        var content = Note.get('content');
        $('#footer').html('查询成功');
        $("#content").val(content);
    }, function(error) {
        $('#footer').html('查询失败');
    });
}

function update() {
    var Note = AV.Object.createWithoutData('Note', objid);
    var content = $("#content").val();
    Note.set('content', content);
    lastupdate++;
    Note.save().then(function(Note) {
        $('#footer').html('修改成功');
    }, function(error) {
        // 异常处理
        $('#footer').html('修改失败');
    });
}

function livequery() {
    const query = new AV.Query('Note');
    query.subscribe().then((liveQuery) => {
        liveQuery.on('update', (Note) => {
            if (lastupdate > 0) {
                lastupdate--;
                return;
            }
            console.log(lastupdate);
            $("#content").val(Note.get('content'));
            $('#footer').html('获取到更新推送');
        });
    });
}

function init() {
    // LeanCloud - 初始化 - 将这里的 APP_ID 和 APP_KEY 替换成自己的应用数据
    // https://leancloud.cn/docs/sdk_setup-js.html#初始化
    var APP_ID = 'IOO0v6UWzOQE94hPLrgXiQhg-9Nh9j0Va';
    var APP_KEY = 'vBfyrsgGJnqg8qG3PD4MglR8';
    AV.init({
        appId: APP_ID,
        appKey: APP_KEY,
        serverURL: 'https://ioo0v6uw.lc-cn-n1-shared.com'
    });
}

$(document).ready(function() {
    init();
    get();
    livequery();
    $('#content').keyup(
        function() {
            update();
        }
    );
    // $(document).on('input propertychange', 'textarea', function() {
    //     update();
    // });
});