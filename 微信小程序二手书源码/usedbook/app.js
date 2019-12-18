function _defineProperty(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

App({
    data: {
      version: "1.0.1"
    },
     util: require("we7/resource/js/util.js"),
   
    tabBar: {
        color: "#707070",
        selectedColor: "#f60",
        borderStyle: "#eee",
        backgroundColor: "#fff",
        height: "110rpx",
        list: [ {
            pagePath: "/pages/home/index",
            iconPath: "/we7/resource/icon/home.png",
            selectedIconPath: "/we7/resource/icon/homeselect.png",
            text: "首页"
        }, {
            pagePath: "/pages/post/index",
            iconPath: "/we7/resource/icon/pub.png",
            selectedIconPath: "/we7/resource/icon/pubselect.png",        
            text: "发布"
        }, {
            pagePath: "/pages/my/index",
            iconPath: "/we7/resource/icon/my.png",
            selectedIconPath: "/we7/resource/icon/myselect.png",
            redDot: !1,
            text: "我的"
        } ]
    },
  
    siteInfo: require("siteinfo.js")
});