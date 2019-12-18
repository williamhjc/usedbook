var app = getApp(), Toast = require("../../libs/zanui/toast/toast");

Page({
    data: {},
    onLoad: function(a) {
        var t = wx.getStorageSync("loading_img");
        t && this.setData({
            loadingImg: t
        });
        var e = a.id;
        this.getNoticeDetail(e);
    },
    getNoticeDetail: function(a) {
        var e = this;
        app.util.request({
            url: "entry/wxapp/notice",
            cachetime: "0",
            data: {
                id: a,
                m: "superman_hand2"
            },
            success: function(a) {
                if (a.data.errno) e.showIconToast(a.data.errmsg); else {
                    console.log(a.data.data);
                    var t = a.data.data.content;
                    require("../../libs/wxParse/wxParse.js").wxParse("article", "html", t, e, 5), e.setData({
                        detail: a.data.data,
                        completed: !0
                    });
                }
            },
            fail: function(a) {
                e.setData({
                    completed: !0
                }), e.showIconToast(a.data.errmsg);
            }
        });
    },
    showIconToast: function(a) {
        var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "fail";
        Toast({
            type: t,
            message: a,
            selector: "#zan-toast"
        });
    }
});