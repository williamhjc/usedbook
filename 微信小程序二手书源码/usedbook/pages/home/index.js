var _map = require("../../libs/map.js"), _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}

var app = getApp(), Toast = require("../../libs/zanui/toast/toast");

Page({
    data: {
      
        noticeDots: !1,
        showCube: !1,
        autoplay: !0,
        interval: 3e3,
        duration: 500,
        vertical: !0,
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
        selectedId: 0,
        fixed: !0,
        height: 45,
        pages: 1,
        hide: !0,
        more: !0,
        refresh: !0,
        recycle: {
            open: !1,
            style: []
        },
        showCategoryPopup: !1,
        showOfficialAccount: !0
    },
    onLoad: function() {
        this.setData({
            showOfficialAccount: !wx.getStorageSync("show_official_account")
            
        })
        , this.getLoadingImgAndCitySwitch()
        ;
    },
  getCityInfo: function (e) {
    var a = this, t = wx.getStorageSync("local_city"), o = wx.getStorageSync("lat"), n = wx.getStorageSync("lng");
    t && o && n ? (a.setData({
      city: t
    }), a.getIndexData("", e, t, o, n)) : new _map2.default().getLocateInfo().then(function (t) {
      wx.showModal({
        title: "提示",
        content: "系统已为您定位到" + t + ",将自动展示" + t + "内的物品",
        showCancel: !1
      }), -1 !== t.indexOf("市") && (t = t.slice(0, t.indexOf("市"))), wx.setStorageSync("local_city", t),
        o = wx.getStorageSync("lat"), n = wx.getStorageSync("lng"), a.setData({
          city: t
        }), a.getIndexData("", e, t, o, n);
    });
  },
    getLoadingImgAndCitySwitch: function() {
        var a = this, o = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/home",
            cachetime: "0",
            data: {
                act: "get_base_info",
                m: "superman_hand2"
            },
            success: function(t) {
                if (t.data.data.loading_img ? (a.setData({
                    loadingImg: t.data.data.loading_img
                }), wx.setStorageSync("loading_img", t.data.data.loading_img)) : a.setData({
                    loadingImg: "../../libs/images/loading.gif"
                }), a.setData({
                    location_open: t.data.data.location_open
                }), o && o.memberInfo) {
                    var e = o.memberInfo.uid;
                    1 == a.data.location_open ? (a.setData({
                        showCity: !0
                    })
                    , a.getCityInfo(e)) : (wx.getStorageSync("local_city") && (wx.setStorageSync("local_city", ""), 
                    wx.setStorageSync("lat", ""), wx.setStorageSync("lng", "")), a.getIndexData("", e, ""));
                } 
                else a.setData({
                    showLogin: !0
                });
            }
        });
    },
   
    getUserInfo: function(t) {
        var a = this;
        "getUserInfo:ok" == t.detail.errMsg ? (a.setData({
            showLogin: !1
        }), app.util.getUserInfo(function(t) {
            var e = t.memberInfo.uid;
            1 == a.data.location_open ? (a.setData({
                showCity: !0
            }), a.getCityInfo(e)) : a.getIndexData("", e, "");
        }, t.detail)) : a.setData({
            showLogin: !0
        });
    },
    closeLogin: function() {
        this.setData({
            showLogin: !1
        });
    },
    closeOfficialAccount: function() {
        wx.setStorageSync("show_official_account", "1"), this.setData({
            showOfficialAccount: !1
        });
    },
    getIndexData: function() {
        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "", e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "", a = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "", o = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : "", n = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : "", i = this;
        "全国" == a && (a = ""), app.util.request({
            url: "entry/wxapp/home",
            cachetime: "0",
            data: {
                uid: e,
                kw: t,
                city: a,
                lat: o,
                lng: n,
                m: "superman_hand2"
            },
            success: function(t) {
                if (app.util.footer(i), t.data.errno) i.showIconToast(t.data.errmsg); else {
                    var e = t.data.data;
                    console.log(e), e.credit_setting && 1 == e.credit_setting.open && 0 == e.credit_setting.login_tip && i.setData({
                        firstLogin: !0,
                        credit_img: e.credit_setting.credit_img,
                        loginCredit: e.credit_setting.login_credit
                    }), e.credit_setting && 1 == e.credit_setting.open && 1 == e.credit_setting.day_login && !i.data.firstLogin && i.showIconToast("每日登录积分+" + e.credit_setting.day, "success"), 
                    e.credit_setting && 1 == e.credit_setting.day_login 
                    && app.util.request({
                        url: "entry/wxapp/stat",
                        cachetime: "0",
                        data: {
                            dau: "yes",
                            m: "superman_hand2"
                        },
                        success: function() {
                            console.log("dau +1");
                        }
                    }),
                     e.title && (i.setData({
                        topTitle: e.title
                    }), wx.setNavigationBarTitle({
                        title: e.title
                    })), wx.setStorageSync("recycle_open", !(!e.recycle || !e.recycle.open)), wx.setStorageSync("recycle_style", e.recycle && e.recycle.style ? e.recycle.style : ""), 
                    e.cube && 1 == e.cube.open ? (i.setData({
                        showCube: !0,
                        cubeList: e.cube.data,
                        post_img: e.cube.post_img ? e.cube.post_img : "../../images/post.png"
                    }), wx.setStorageSync("cube_open", !0), wx.getStorageSync("category") || wx.setStorageSync("category", e.category)) : wx.setStorageSync("cube_open", !1), 
                    e.post_btn && 1 == e.post_btn.open ? (i.setData({
                        showPostBtn: !0,
                        post_appid: e.post_btn.data.appid,
                        post_url: e.post_btn.data.url,
                        post_img: e.post_btn.data.thumb ? e.post_btn.data.thumb : "../../images/post.png"
                    }), wx.setStorageSync("post_open", !0), wx.setStorageSync("post_btn_data", e.post_btn.data)) : wx.setStorageSync("post_open", !1), 
                  
                      i.setData({
                        slide: e.slide,
                        switch: e.cate_switch,
                        notice_type: e.notice_type,
                        category: e.category,
                        notice: e.notice,
                        list: e.items ? e.items : [],
                        total: e.items ? e.items.length : 0,
                        thumb_open: 1 == e.thumb,
                        completed: !0
                    }), e.plugin_notice && i.setData({
                        plugin_notice: 1 == e.plugin_notice.switch,
                        askId: e.plugin_notice.askid
                    });
                    var a = wx.getSystemInfoSync().version;
                    a = parseInt(a.split(".").join("")), !wx.getStorageSync("addMyWxapp") && 671 <= a && (i.setData({
                        addMyWxapp: !0
                    }), wx.setStorageSync("addMyWxapp", "1"));
                }
            },
            fail: function(t) {
                i.setData({
                    completed: !0
                }), i.showIconToast(t.data.errmsg);
            }
        });
    },
  
    doSearch: function(t) {
        var a = this, e = t.detail.value,  n = wx.getStorageSync("lat"), i = wx.getStorageSync("lng");
        a.setData({
            keyword: e
        }), app.util.request({
            url: "entry/wxapp/home",
            cachetime: "0",
            data: {
                kw: e,
               
                lat: n,
                lng: i,
                m: "superman_hand2"
            },
            success: function(t) {
                if (t.data.errno) a.showIconToast(t.errmsg); else {
                    var e = t.data.data.items;
                    a.setData({
                        selectedId: 0,
                        list: e,
                        total: e ? e.length : 0
                    }), 0 == a.data.total && a.data.plugin_notice && a.setData({
                        showStockNotice: !0
                    });
                }
            }
        });
    },
    goTop: function() {
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 500
        });
    },
    closeModal: function() {
        this.setData({
            showAuth: !1
        });
    },
    closeMask: function() {
        this.setData({
            addMyWxapp: !1
        });
    },
    handleTabChange: function(t) {
        var o = this, e = t.detail, n = o.data.keyword, i = wx.getStorageSync("local_city"), a = wx.getStorageSync("lat"), s = wx.getStorageSync("lng");
        n || (n = ""), "全国" == i && (i = ""), o.setData({
            selectedId: e,
            pages: 1,
            more: !0,
            refresh: !0
        }), 0 == e ? o.getIndexData(n, "", i, a, s) : 1 == e ? wx.getLocation({
            type: "gcj02",
            success: function(t) {
                var e = t.latitude, a = t.longitude;
                o.setData({
                    lat: e,
                    lng: a
                }), app.util.request({
                    url: "entry/wxapp/home",
                    cachetime: "0",
                    data: {
                        lat: e,
                        lng: a,
                        op: "location",
                        kw: n,
                        city: i,
                        m: "superman_hand2"
                    },
                    success: function(t) {
                        if (t.data.errno) o.showIconToast(t.errmsg); else {
                            var e = t.data.data.items;
                            o.setData({
                                list: e,
                                total: e ? e.length : 0
                            });
                        }
                    }
                });
            },
            fail: function() {
                o.showIconToast("获取地理位置失败");
            }
        }) : app.util.request({
            url: "entry/wxapp/home",
            cachetime: "0",
            data: {
                op: "popular",
                kw: n,
                city: i,
                m: "superman_hand2"
            },
            success: function(t) {
                if (t.data.errno) o.showIconToast(t.errmsg); else {
                    var e = t.data.data.items;
                    o.setData({
                        list: e,
                        total: e ? e.length : 0
                    });
                }
            }
        });
    },
    onReachBottom: function() {
        var o = this;
        if (o.data.refresh && 0 != o.data.list.length) if (o.data.total < 10) o.setData({
            more: !1
        }); else {
            o.setData({
                hide: !1
            });
            var t = wx.getStorageSync("local_city"), e = wx.getStorageSync("lat"), a = wx.getStorageSync("lng");
            "全国" == t && (t = "");
            var n = o.data.pages + 1, i = "", s = "";
            o.data.keyword && (s = o.data.keyword), 1 == o.data.selectedId ? (i = "location", 
            e = o.data.lat, a = o.data.lng) : 2 == o.data.selectedId && (i = "popular"), app.util.request({
                url: "entry/wxapp/home",
                cachetime: "0",
                data: {
                    page: n,
                    op: i,
                    lat: e,
                    lng: a,
                    kw: s,
                    city: t,
                    m: "superman_hand2"
                },
                success: function(t) {
                    if (o.setData({
                        hide: !0
                    }), 0 == t.data.errno) {
                        var e = t.data.data.items;
                        if (0 < e.length) {
                            var a = o.data.list.concat(e);
                            o.setData({
                                total: e.length,
                                list: a,
                                pages: n
                            });
                        } else o.setData({
                            more: !1,
                            refresh: !1
                        });
                    } else o.showIconToast(t.errmsg);
                }
            });
        }
    },
    onPullDownRefresh: function() {
        var t = wx.getStorageSync("local_city"), e = wx.getStorageSync("lat"), a = wx.getStorageSync("lng");
        this.getIndexData("", "", t, e, a), wx.stopPullDownRefresh();
    },
    onShareAppMessage: function() {
        return {
            title: that.data.topTitle ? that.data.topTitle : "首页",
            path: "/pages/home/index"
        };
    },
    toggleCategoryPopup: function() {
        this.setData({
            showCategoryPopup: !this.data.showCategoryPopup
        });
    },
    viewAdd: function(e) {
        var t = 1, a = this;
        if (0 != t) {
            t = 0;
            var o = e.currentTarget.dataset.id;
            app.util.request({
                url: "entry/wxapp/home",
                cachetime: "0",
                data: {
                    act: "page_view",
                    id: o,
                    m: "superman_hand2"
                },
                success: function(t) {
                    t.data.errno || (console.log("点击量+1"), a.jumpToPage(e));
                },
                complete: function() {
                    t = 1;
                }
            });
        }
    },
    jumpToPage: function(t) {
        var e = t.currentTarget.dataset.url;
        -1 != e.indexOf("http") ? wx.navigateTo({
            url: "../ad/index?path=" + encodeURIComponent(e)
        }) : wx.navigateTo({
            url: e
        });
    },
    showIconToast: function(t) {
        var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "fail";
        Toast({
            type: e,
            message: t,
            selector: "#zan-toast"
        });
    }
});