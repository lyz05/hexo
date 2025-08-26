// 声明 class
var objid = '5e33b120ff02830008194823';
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

$(document).ready(function() {
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