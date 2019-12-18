var app = getApp(), Toast = require("../../libs/zanui/toast/toast");

Page({
    data: {
        pages: 1,
        hide: !0,
        more: !0,
        refresh: !0
    },
    onLoad: function(t) {
        var a = this, e = wx.getStorageSync("loading_img");
        e && a.setData({
            loadingImg: e
        }), t.type ? (a.setData({
            type: t.type
        }), a.getItemList()) : t.action ? (a.setData({
            action: t.action
        }), a.getItemList()) : a.showIconToast("参数错误");
    },
    getItemList: function() {
        var e = this;
        e.data.type ? app.util.request({
            url: "entry/wxapp/my",
            cachetime: "0",
            data: {
                act: "item_list",
                type: e.data.type,
                m: "superman_hand2"
            },
            success: function(t) {
                if (console.log(t.data.data), wx.setNavigationBarTitle({
                    title: "我发布的"
                }), t.data.errno) e.showIconToast(t.data.errmsg); else if (t.data.data.item) {
                    var a = t.data.data.item;
                    e.setData({
                        type: !0,
                        list: a,
                        canSetTop: 1 == t.data.data.pay_item,
                        completed: !0
                    });
                }
            },
            fail: function(t) {
                e.setData({
                    completed: !0
                }), e.showIconToast(t.data.errmsg);
            }
        }) : e.data.action && app.util.request({
            url: "entry/wxapp/my",
            cachetime: "0",
            data: {
                act: "item_list",
                action: e.data.action,
                m: "superman_hand2"
            },
            success: function(t) {
                var a = "";
                1 == e.data.action ? a = "点赞" : 2 == e.data.action && (a = "收藏"), wx.setNavigationBarTitle({
                    title: "我" + a + "的"
                }), t.data.errno ? e.showIconToast(t.data.errmsg) : e.setData({
                    list: t.data.data.item,
                    completed: !0
                });
            },
            fail: function(t) {
                e.setData({
                    completed: !0
                }), e.showIconToast(t.data.errmsg);
            }
        });
    },
    deleteItem: function(t) {
        var a = this, e = t.currentTarget.dataset.id;
        app.util.request({
            url: "entry/wxapp/my",
            cachetime: "0",
            data: {
                act: "delete",
                id: e,
                m: "superman_hand2"
            },
            success: function(t) {
                t.data.errno ? a.showIconToast(t.data.errmsg) : (a.showIconToast("删除成功", "success"), 
                a.getItemList());
            },
            fail: function(t) {
                a.showIconToast(t.data.errmsg);
            }
        });
    },
    stickItem: function(t) {
        var a = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../set_top/index?post=1&id=" + a
        });
    },
    checkLog: function(t) {
        var a = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../set_top/index?log=1&id=" + a
        });
    },
    onReachBottom: function() {
        var s = this;
        if (s.data.refresh) if (s.data.total < 20) s.setData({
            more: !1
        }); else {
            s.setData({
                hide: !1
            });
            var o = s.data.pages + 1, t = {
                act: "item_list",
                page: o,
                m: "superman_hand2"
            };
            s.data.action && (t.action = s.data.action), s.data.type && (t.type = s.data.type), 
            app.util.request({
                url: "entry/wxapp/my",
                cachetime: "0",
                data: t,
                success: function(t) {
                    if (s.setData({
                        hide: !0
                    }), 0 == t.data.errno) {
                        var a = t.data.data.item;
                        if (0 < a.length) {
                            var e = s.data.list.concat(a);
                            s.setData({
                                total: a.length,
                                list: e,
                                pages: o
                            });
                        } else s.setData({
                            more: !1,
                            refresh: !1
                        });
                    } else s.showIconToast(t.data.errmsg);
                },
                fail: function(t) {
                    s.showIconToast(t.data.errmsg);
                }
            });
        }
    },
    onPullDownRefresh: function() {
        this.getItemList(), wx.stopPullDownRefresh();
    },
    showIconToast: function(t) {
        var a = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "fail";
        Toast({
            type: a,
            message: t,
            selector: "#zan-toast"
        });
    }
});