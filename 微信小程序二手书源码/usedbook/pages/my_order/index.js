var app = getApp(), Toptips = require("../../libs/zanui/toptips/index");

Page({
    data: {
        confirmBar: !1,
        pages: 1,
        hide: !0,
        more: !0,
        refresh: !0
    },
    onLoad: function(t) {
        var e = this, a = wx.getStorageSync("loading_img");
        a && e.setData({
            loadingImg: a
        });
        var o = wx.getStorageSync("userInfo");
        e.setData({
            uid: o.memberInfo.uid,
            type: t.type
        }), e.getOrderList(t.type);
    },
    getOrderList: function(t) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/order",
            cachetime: "0",
            data: {
                type: t,
                m: "superman_hand2"
            },
            success: function(t) {
                var e = "";
                "sell" == a.data.type ? e = "卖出" : "buy" == a.data.type && (e = "买到"), wx.setNavigationBarTitle({
                    title: "我" + e + "的"
                }), t.data.errno ? wx.showModal({
                    title: "系统提示",
                    content: t.data.errmsg + "(" + t.data.errno + ")"
                }) : (console.log(t.data.data), a.setData({
                    list: t.data.data,
                    completed: !0
                }));
            },
            fail: function(t) {
                a.setData({
                    completed: !0
                }), wx.showModal({
                    title: "系统提示",
                    content: t.data.errmsg + "(" + t.data.errno + ")"
                });
            }
        });
    },
   
    deleteOrder: function(t) {
        var e = this, a = t.currentTarget.dataset.id, o = t.detail.formId, r = wx.getStorageSync("userInfo").memberInfo.uid;
        app.util.request({
            url: "entry/wxapp/notice",
            cachetime: "0",
            data: {
                act: "formid",
                formid: o,
                m: "superman_hand2"
            },
            success: function(t) {
                0 == t.data.errno ? console.log("formid已添加") : console.log(t.data.errmsg);
            },
            fail: function(t) {
                console.log(t.data.errmsg);
            }
        }), wx.showModal({
            title: "系统提示",
            content: "确认要删除该订单？",
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/order",
                    cachetime: "0",
                    data: {
                        act: "delete",
                        orderid: a,
                        uid: r,
                        m: "superman_hand2"
                    },
                    success: function(t) {
                        t.data.errno ? wx.showModal({
                            title: "系统提示",
                            content: t.data.errmsg + "(" + t.data.errno + ")"
                        }) : wx.showToast({
                            title: "删除成功",
                            icon: "success",
                            success: function() {
                                e.getOrderList(e.data.type);
                            }
                        });
                    },
                    fail: function(t) {
                        wx.showModal({
                            title: "系统提示",
                            content: t.data.errmsg + "(" + t.data.errno + ")"
                        });
                    }
                });
            }
        });
    },
    
    closeModal: function() {
        this.setData({
            showModal: !1
        });
    },
    onPullDownRefresh: function() {
        this.getOrderList(this.data.type), wx.stopPullDownRefresh();
    },
    
    onReachBottom: function() {
        var o = this;
        if (o.data.refresh) if (o.data.total < 20) o.setData({
            more: !1
        }); else {
            o.setData({
                hide: !1
            });
            var r = o.data.pages + 1;
            app.util.request({
                url: "entry/wxapp/message",
                cachetime: "0",
                data: {
                    act: "list",
                    page: r,
                    m: "superman_hand2"
                },
                success: function(t) {
                    if (o.setData({
                        hide: !0
                    }), 0 == t.data.errno) {
                        var e = t.data.data;
                        if (0 < e.length) {
                            var a = o.data.list.concat(e);
                            o.setData({
                                total: e.length,
                                list: a,
                                pages: r
                            });
                        } else o.setData({
                            more: !1,
                            refresh: !1
                        });
                    } else o.showIconToast(t.errmsg);
                }
            });
        }
    }
});