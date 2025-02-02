function init() {
    // LeanCloud - 初始化 - 将这里的 APP_ID 和 APP_KEY 替换成自己的应用数据
    // https://leancloud.cn/docs/sdk_setup-js.html#初始化
    var APP_ID = 'sAHleptFhDA3fhiv6ybjMd7b-9Nh9j0Va';
    var APP_KEY = '1ylHrs5cgBkYyw7QtP5cL0S0';
    AV.init({
        appId: APP_ID,
        appKey: APP_KEY,
        serverURL: 'https://sahleptf.lc-cn-e1-shared.com'
    });
}
init();