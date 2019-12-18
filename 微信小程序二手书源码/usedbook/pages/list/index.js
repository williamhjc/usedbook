var app = getApp(), Toast = require("../../libs/zanui/toast/toast");

Page({
    data: {
        autoplay: !0,
        interval: 3e3,
        duration: 500,
        category: [],
        selectedId: "",
        scroll: !0,
        fixed: !0,
        cate_height: 45,
        // display: [ {
        //     id: 0,
        //     title: "默认排序"
        // }, {
        //     id: 1,
        //     title: "离我最近"
        // }, {
        //     id: 2,
        //     title: "人气最高"
        // } ],
        orderId: 0,
        od_height: 35,
        pages: 1,
        hide: !0,
        more: !0,
        refresh: !0,
        showCategoryPopup: !1,
        recycle: {
            open: !1,
            style: []
        }
    },
    onLoad: function(t) {
        var a = this, e = wx.getStorageSync("loading_img"), o = wx.getStorageSync("cube_open"), s = wx.getStorageSync("post_open");
        if (e && a.setData({
            loadingImg: e
        }), o && a.setData({
            showCube: !0
        }), s) {
            var r = wx.getStorageSync("post_btn_data");
            a.setData({
                showPostBtn: !0,
                post_appid: r.appid,
                post_url: r.url,
                post_img: r.thumb
            });
        }
        
        var n = t.id, i = wx.getStorageSync("local_city"), l = wx.getStorageSync("lat"), c = wx.getStorageSync("lng");
        "全国" == i && (i = ""), n && (a.setData({
            selectedId: n
        }), a.getList(n, i, l, c)), app.util.footer(a)
       
         ;
    },
    getList: function(t) {
        var a = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "", e = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "", o = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : "", s = this;
        app.util.request({
            url: "entry/wxapp/item",
            cachetime: "0",
            data: {
                cid: t,
                act: "list",
                city: a,
                lat: e,
                lng: o,
                m: "superman_hand2"
            },
            success: function(t) {
                if (t.data.errno) s.showIconToast(t.data.errmsg); else {
                    console.log(t.data.data);
                    var a = t.data.data;
                    s.setData({
                        category: a.category,
                        list: a.list,
                        listAd: a.banner,
                        total: a.list ? a.list.length : 0,
                        thumb_open: 1 == a.thumb,
                        completed: !0
                    });
                }
            },
            fail: function(t) {
                s.setData({
                    completed: !0
                }), s.showIconToast(t.data.errmsg);
            }
        });
    },
    handleTabChange: function(e) {
        var o = this, t = wx.getStorageSync("local_city"), a = wx.getStorageSync("lat"), s = wx.getStorageSync("lng");
        "全国" == t && (t = ""), app.util.request({
            url: "entry/wxapp/item",
            cachetime: "0",
            data: {
                cid: e.detail,
                act: "list",
                city: t,
                lat: a,
                lng: s,
                m: "superman_hand2"
            },
            success: function(t) {
                if (t.data.errno) o.showIconToast(t.data.errmsg); else {
                    var a = t.data.data.list;
                    o.setData({
                        list: a,
                        selectedId: e.detail
                    }), 0 == a.length && o.setData({
                        more: !0
                    });
                }
            },
            fail: function(t) {
                o.showIconToast(t.data.errmsg);
            }
        });
    },
    displayOrderChange: function(t) {
        var o = this, a = t.detail, s = wx.getStorageSync("local_city"), e = wx.getStorageSync("lat"), r = wx.getStorageSync("lng");
        "全国" == s && (s = ""), o.setData({
            orderId: a,
            pages: 1,
            more: !0,
            refresh: !0
        }), 0 == a ? o.getList(o.data.selectedId, s, e, r) : 1 == a ? wx.getLocation({
            type: "gcj02",
            success: function(t) {
                var a = t.latitude, e = t.longitude;
                o.setData({
                    lat: a,
                    lng: e
                }), app.util.request({
                    url: "entry/wxapp/item",
                    cachetime: "0",
                    data: {
                        lat: a,
                        lng: e,
                        op: "location",
                        cid: o.data.selectedId,
                        city: s,
                        m: "superman_hand2"
                    },
                    success: function(t) {
                        if (t.data.errno) o.showIconToast(t.data.errmsg); else {
                            var a = t.data.data.list;
                            o.setData({
                                list: a,
                                total: a ? a.length : 0
                            });
                        }
                    },
                    fail: function(t) {
                        o.showIconToast(t.data.errmsg);
                    }
                });
            }
        }) : app.util.request({
            url: "entry/wxapp/item",
            cachetime: "0",
            data: {
                op: "popular",
                cid: o.data.selectedId,
                city: s,
                m: "superman_hand2"
            },
            success: function(t) {
                if (t.data.errno) o.showIconToast(t.data.errmsg); else {
                    var a = t.data.data.list;
                    o.setData({
                        list: a,
                        total: a ? a.length : 0
                    });
                }
            },
            fail: function(t) {
                o.showIconToast(t.data.errmsg);
            }
        });
    },
    goTop: function() {
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 500
        });
    },
    onReachBottom: function() {
        var s = this;
        if (s.data.refresh) if (s.data.total < 10) s.setData({
            more: !1
        }); else {
            s.setData({
                hide: !1
            });
            var t = wx.getStorageSync("local_city"), a = wx.getStorageSync("lat"), e = wx.getStorageSync("lng");
            "全国" == t && (t = "");
            var r = s.data.pages + 1, o = "";
            1 == s.data.orderId ? (o = "location", a = s.data.lat, e = s.data.lng) : 2 == s.data.orderId && (o = "popular"), 
            app.util.request({
                url: "entry/wxapp/item",
                cachetime: "0",
                data: {
                    page: r,
                    op: o,
                    lat: a,
                    lng: e,
                    cid: s.data.selectedId,
                    city: t,
                    m: "superman_hand2"
                },
                success: function(t) {
                    if (s.setData({
                        hide: !0
                    }), 0 == t.data.errno) {
                        var a = t.data.data.list;
                        if (0 < a.length) {
                            var e = s.data.list;
                            s.setData({
                                total: e.length
                            });
                            var o = e.concat(a);
                            s.setData({
                                list: o,
                                pages: r
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
    toggleCategoryPopup: function() {
        this.setData({
            category: wx.getStorageSync("category") ? wx.getStorageSync("category") : [],
            showCategoryPopup: !this.data.showCategoryPopup
        });
    },
    jumpToPage: function(t) {
        var a = t.currentTarget.dataset.url;
        -1 != a.indexOf("http") ? wx.navigateTo({
            url: "../ad/index?path=" + encodeURIComponent(a)
        }) : wx.navigateTo({
            url: a
        });
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