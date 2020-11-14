// 声明 class
var objid = '5e33b120ff02830008194823';

function post() {
    var Note = AV.Object.extend('Note');
    //获取当前时间
    var date = new Date();

    // 构建新对象
    var Note = new Note();
    // 为属性赋值
    Note.set('time', date);
    Note.set('content', '周二两点，全体成员');

    // 将对象保存到云端
    Note.save().then(function(Note) {
        // 成功保存之后，执行其他逻辑
        console.log('保存成功。objectId：' + Note.id);
    }, function(error) {
        // 异常处理

    });
}

function get() {
    var query = new AV.Query('Note');
    query.get(objid).then(function(Note) {
        // Note 就是 objectId 为 5df3844ab7166d000836de12 的 Note 实例
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
    Note.save().then(function(Note) {
        // 成功保存之后，执行其他逻辑
        //console.log('修改成功。objectId：' + Note.id);
        $('#footer').html('修改成功');
    }, function(error) {
        // 异常处理
        $('#footer').html('修改失败');
    });
}

$(document).ready(function() {
    // LeanCloud - 初始化 - 将这里的 APP_ID 和 APP_KEY 替换成自己的应用数据
    // https://leancloud.cn/docs/sdk_setup-js.html#初始化
    var APP_ID = 'sAHleptFhDA3fhiv6ybjMd7b-9Nh9j0Va';
    var APP_KEY = '1ylHrs5cgBkYyw7QtP5cL0S0';
    AV.init({
        appId: APP_ID,
        appKey: APP_KEY,
        serverURL: 'https://sahleptf.lc-cn-e1-shared.com'
    });
    get();
    $('#content').keyup(
        function() {
            update();
        }
    );
});