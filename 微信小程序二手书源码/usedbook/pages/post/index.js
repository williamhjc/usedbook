function _defineProperty(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var qqmapsdk, app = getApp(), Toast = require("../../libs/zanui/toast/toast"), Toptips = require("../../libs/zanui/toptips/index"), QQMapWX = require("../../libs/qqmap-wx-jssdk.js");

Page({
    data: {
        first: !0,
        cancelWithMask: !0,
        showConfirm: !1,
        placeholder: "点击获取定位",
        isAgree: !0,
        play: !1,
        manual: !1,
        video: [],
        album: [],
        thumb: [],
        book_field: "",
        recycle: {
            open: !1,
            style: []
        },
        unitIndex: 0,
        onlinePay: !0,
        isSetTop: !1
    },
    onLoad: function(t) {
        var a = this;
       
        var e = wx.getStorageSync("loading_img");
        e && a.setData({
            loadingImg: e
        }), t.id && a.setData({
            item_id: t.id
        }),  a.checkPlugin(), a.getBasicInfo();
    },
    closeAuth: function() {
        this.setData({
            showAuth: !1
        });
    },
    showScanItems: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            cid: a,
            showAction: !0,
            actions: [ {
                name: "扫码上传",
                subname: "扫图书背面条形码"
            }, {
                name: "手动上传",
                subname: "手动填写图书内容"
            } ]
        });
    },
    closeActionSheet: function() {
        this.setData({
            showAction: !1
        });
    },
    clickAction: function(t) {
        for (var n = this, a = n.data.cid, e = n.data.category, i = 0; i < e.length; i++) if (e[i].id == a) {
            n.setData({
                cateIndex: i
            });
            break;
        }
        0 == t.detail.index ? wx.scanCode({
            scanType: [ "barCode" ],
            success: function(t) {
                if ("EAN_13" == t.scanType) {
                    var a = t.result;
                    n.setData({
                        bookCode: a
                    }), wx.request({
                        url: "https://douban.uieee.com/v2/book/isbn/" + a,
                        header: {
                            "content-type": "application/text"
                        },
                        success: function(t) {
                            if (n.setData({
                                showAction: !1
                            }), t.data) {
                                var a = t.data;
                                if (a.code && 6e3 == a.code) return void n.showIconToast("图书未找到，请扫描正版图书");
                                var e = a.title ? a.title : "", i = a.summary ? a.summary : "", o = [];
                                if (a.author && 0 < a.author.length) for (var s = 0; s < a.author.length; s++) o.push(a.author[s]); else o.push(a.origin_title);
                                n.setData({
                                    detail: {
                                        title: e,
                                        summary: i
                                    },
                                    book_field: {
                                        author: encodeURIComponent(o),
                                        publisher: encodeURIComponent(a.publisher),
                                        pubdate: a.pubdate,
                                        pages: a.pages,
                                        rating: a.rating && a.rating.average ? a.rating.average : 0,
                                        book_url: encodeURIComponent(a.alt),
                                        comment_url: encodeURIComponent(a.alt + "collections"),
                                        subtitle: encodeURIComponent(a.subtitle),
                                        price: a.price
                                    },
                                    first: !1
                                });
                            } else n.setData({
                                first: !1
                            }), Toptips("扫码获取内容失败，请手动填写内容");
                        }
                    });
                } else n.setData({
                    showAction: !1
                }), Toptips("请扫描图书后面的条形码，暂不支持其他类型条码");
            }
        }) : n.setData({
            showAction: !1,
            first: !1,
            manual: !0
        });
    },
    showPostPage: function() {
        this.setData({
            first: !1
        });
    },
   
    
    getBasicInfo: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/home",
            cachetime: "0",
            data: {
                m: "superman_hand2"
            },
            success: function(t) {
                t.data.errno ? a.showIconToast(t.data.errmsg) : 1 == t.data.data.auth_phone && "" == wx.getStorageSync("userInfo").memberInfo.mobile ? wx.showModal({
                    title: "",
                    content: "",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "../my/index"
                        });
                    }
                }) : a.getMoreInfo();
            }
        });
    },
    getMoreInfo: function() {
        var l = this;
        app.util.request({
            url: "entry/wxapp/item",
            cachetime: "0",
            data: {
                act: "get",
                m: "superman_hand2"
            },
            success: function(t) {
                if (t.data.errno) l.showIconToast(t.data.errmsg); else {
                    var a = t.data.data;
                    if (console.log(a), !l.data.item_id) {
                        var e = a.add_fields || [];
                        if (e) for (var i = 0; i < e.length; i++) if ("radio" == e[i].type || "checkbox" == e[i].type) {
                            for (var o = e[i].extra.option, s = [], n = 0; n < o.length; n++) s[n] = new Object(), 
                            s[n].value = o[n], s[n].checked = !1;
                            e[i].extra.option = s;
                        } else "single_select" == e[i].type && (e[i].extra.value = "");
                        l.setData({
                            form_field: e
                        });
                    }
                    var r = [];
                    if (0 == a.default_unit ? (r = [ {
                        type: 0,
                        title: "元"
                    }, {
                        type: -1,
                        title: "积分"
                    } ], l.data.wechatPlugin && l.setData({
                        open_wechat: !0
                    })) : r = [ {
                        type: -1,
                        title: "积分"
                    }, {
                        type: 0,
                        title: "元"
                    } ], a.unit_list) for (var d = 0; d < a.unit_list.length; d++) {
                        var c = {
                            type: a.unit_list[d].type,
                            title: a.unit_list[d].title
                        };
                        r.push(c);
                    }
                    l.setData({
                        video_switch: a.video_switch,
                        category: a.category,
                        district: a.district,
                        rule: a.rule,
                        notice: a.notice,
                        auditType: a.audit_type,
                        books_on: !!a.book_status,
                        notice_switch: 1 == a.post_notice,
                        first: 0 != a.book_status || 0 != a.post_notice,
                        set_top: 1 == a.set_top,
                        unitList: r
                    }), l.data.item_id ? l.getEditData(l.data.item_id) : l.setData({
                        completed: !0
                    });
                }
            },
            fail: function(t) {
                l.setData({
                    completed: !0
                }), l.showIconToast(t.data.errmsg);
            }
        });
    },
    goNext: function(t) {
        var a = t.detail.formId;
        app.util.request({
            url: "entry/wxapp/notice",
            cachetime: "0",
            data: {
                act: "formid",
                formid: a,
                m: "superman_hand2"
            },
            success: function(t) {
                0 == t.data.errno ? console.log("formid已添加") : console.log(t.data.errmsg);
            },
            fail: function(t) {
                console.log(t.data.errmsg);
            }
        }), this.setData({
            first: !1
        });
    },
    showPopup: function() {
        this.setData({
            showBottomPopup: !0
        });
    },
    toggleBottomPopup: function() {
        this.setData({
            showBottomPopup: !this.data.showBottomPopup
        });
    },
    getEditData: function(t) {
        var r = this;
        app.util.request({
            url: "entry/wxapp/item",
            cachetime: "0",
            data: {
                act: "edit",
                id: t,
                m: "superman_hand2"
            },
            success: function(t) {
                if (t.data.errno) r.showIconToast(t.data.errmsg); else {
                    var a = t.data.data;
                    console.log(a);
                    for (var e = r.data.category, i = 0; i < e.length; i++) if (e[i].id == a.cid) {
                        r.setData({
                            cateIndex: i
                        });
                        break;
                    }
                    var o = a.video || [];
                    r.setData({
                        first: !1,
                        detail: a,
                        album: a.album,
                        thumb: a.thumb,
                        video: o,
                        price: 0 == a.buy_type ? a.price : a.credit,
                        address: a.address,
                        open_wechat: 0 == a.unit,
                        onlinePay: 1 == a.wechatpay,
                        form_field: a.add_fields,
                        lat: a.lat,
                        lng: a.lng,
                        finish: !0,
                        completed: !0
                    });
                    for (var s = r.data.unitList, n = 0; n < s.length; n++) if (s[n].type == a.unit) {
                        r.setData({
                            unitIndex: n
                        });
                        break;
                    }
                }
            }
        });
    },
    getAddress: function() {
        var d = this;
        d.data.item_id || (d.setData({
            placeholder: "正在定位中..."
        }), qqmapsdk = new QQMapWX({
            key: "7M4BZ-FDEK3-JC737-YXQ5O-V3IO3-E5FH5"
        }), wx.getLocation({
            type: "gcj02",
            success: function(t) {
                var a = t.latitude, e = t.longitude;
                d.setData({
                    lat: a,
                    lng: e
                }), qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: a,
                        longitude: e
                    },
                    get_poi: 1,
                    poi_options: "address_format=short;radius=2000;policy=1;category=房产小区,住宅区,住宅小区",
                    success: function(t) {
                        console.log(t);
                        var a = t.result.address_component.city;
                        if (-1 !== a.indexOf("市") && (a = a.slice(0, a.indexOf("市"))), console.log(a), d.setData({
                            city: a
                        }), t.result.formatted_addresses) {
                            var e = t.result.formatted_addresses.recommend, i = d.data.district;
                            if (0 == i.length) d.setData({
                                address: e
                            }); else {
                                for (var o = t.result.pois, s = 0; s < i.length; s++) for (var n = 0; n < o.length; n++) if (o[n].title.match(i[s].title)) {
                                    d.setData({
                                        address: i[s].title
                                    });
                                    break;
                                }
                                d.data.address || d.setData({
                                    address: e
                                });
                            }
                        } else if (t.result.address_component) {
                            var r = t.result.address_component;
                            d.setData({
                                address: r.locality + r.street
                            });
                        }
                    },
                    fail: function(t) {
                        Toptips(t.data.errmsg);
                    }
                });
            },
            fail: function() {
                Toptips("自动定位失败，请手动填写所在地址"), d.setData({
                    placeholder: "请填写所在地址"
                });
            }
        }));
    },
    showCategory: function(t) {
        this.setData({
            cateIndex: t.detail.value
        });
    },
    changeUnit: function(t) {
        var a = t.detail.value, e = this.data.wechatPlugin;
        this.setData({
            unitIndex: a,
            open_wechat: !!e && 0 == this.data.unitList[a].type,
            onlinePay: 0 == this.data.unitList[a].type
        });
    },
    setOnlinePay: function(t) {
        this.setData({
            onlinePay: t.detail.value
        });
    },
    setItemTop: function(t) {
        this.setData({
            isSetTop: t.detail.value
        });
    },
    bindAgreeChange: function(t) {
        this.setData({
            isAgree: !!t.detail.value.length
        });
    },
    chooseVideo: function() {
        var a = this;
        wx.chooseVideo({
            success: function(t) {
                a.uploadVideo(t.tempFilePath);
            },
            fail: function(t) {
                Toptips(t.errMsg);
            }
        });
    },
    uploadVideo: function(t) {
        var i = this, a = app.util.url("entry/wxapp/item", {
            act: "upload",
            m: "superman_hand2"
        });
        wx.showLoading({
            title: "上传中"
        }), wx.uploadFile({
            url: a,
            filePath: t,
            name: "videoData",
            fail: function(t) {
                Toptips(t.errMsg);
            },
            complete: function() {
                wx.hideLoading();
            },
            success: function(t) {
                var a = JSON.parse(t.data);
                if (0 == a.errno) {
                    var e = i.data.video;
                    e.push(a.data), i.setData({
                        video: e
                    });
                } else Toptips(a.errmsg);
            }
        });
    },
    deleteVideo: function(t) {
        var e = this, i = t.currentTarget.dataset.index;
        wx.showModal({
            title: "提示",
            content: "确定要删除该视频吗？",
            success: function(t) {
                if (t.confirm && e.data.video) {
                    var a = e.data.video;
                    a.splice(i, 1), e.setData({
                        video: a
                    });
                }
            }
        });
    },
    chooseImage: function(t) {
        var i = this;
        wx.chooseImage({
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(t) {
                var a = t.tempFilePaths.length, e = app.util.url("entry/wxapp/item", {
                    act: "upload",
                    m: "superman_hand2"
                });
                i.uploadImg(t.tempFilePaths, 0, a, e);
            }
        });
    },
    uploadImg: function(o, s, n, r) {
        var d = this;
        wx.showLoading({
            title: "上传中"
        }), wx.uploadFile({
            url: r,
            filePath: o[s],
            name: "imgData",
            complete: function() {
                wx.hideLoading();
            },
            success: function(t) {
                s++;
                var a = JSON.parse(t.data);
                if (0 == a.errno) {
                    var e = d.data.album, i = d.data.thumb;
                    e.push(a.data.orignal), i.push(a.data.thumb), d.setData({
                        album: e,
                        thumb: i
                    });
                } else Toptips(a.errmsg);
                s != n && d.uploadImg(o, s, n, r);
            },
            fail: function(t) {
                var a = JSON.parse(t.data);
                Toptips(a.errmsg);
            }
        });
    },
    deleteImg: function(t) {
        var i = this, o = t.currentTarget.dataset.index;
        wx.showModal({
            title: "提示",
            content: "确定要删除该图片吗？",
            success: function(t) {
                if (t.confirm && i.data.album) {
                    var a = i.data.album, e = i.data.thumb;
                    e && 0 < e.length && e.splice(o, 1), a.splice(o, 1), i.setData({
                        album: a,
                        thumb: e
                    });
                }
            }
        });
    },
    radioChange: function(t) {
        for (var a = this.data.form_field, e = a[t.currentTarget.dataset.index].extra.option, i = 0; i < e.length; i++) e[i].value == t.detail.value ? e[i].checked = !0 : e[i].checked = !1;
        this.setData({
            form_field: a
        });
    },
    checkboxChange: function(t) {
        for (var a = this.data.form_field, e = a[t.currentTarget.dataset.index].extra.option, i = t.detail.value, o = 0; o < e.length; o++) {
            e[o].checked = !1;
            for (var s = 0; s < i.length; s++) if (e[o].value == i[s]) {
                e[o].checked = !0;
                break;
            }
        }
        this.setData({
            form_field: a
        });
    },
    bindPickChange: function(t) {
        var a = this.data.form_field, e = t.currentTarget.dataset.index, i = a[e].extra.option, o = t.detail.value;
        a[e].extra.value = i[o], this.setData({
            form_field: a
        });
    },
    formSubmit: function(t) {
        var o = this;
        if (o.data.btnDisabled) return !1;
        o.setData({
            btnDisabled: !0
        });
        var a = t.detail.value, e = a.address, i = t.detail.formId, s = o.data.cateIndex, n = o.data.category, r = o.data.album, d = o.data.thumb;
        r && (r = app.util.base64Encode(JSON.stringify(r))), d && (d = app.util.base64Encode(JSON.stringify(d)));
        var c = o.data.video;
        c && (c = app.util.base64Encode(JSON.stringify(c)));
        var l = o.data.city;
        null == l && "全国" == (l = wx.getStorageSync("local_city")) && (l = "");
        var u = o.data.unitIndex, p = o.data.unitList[u].type, f = o.data.unitList[u].title, h = "";
        "" != o.data.book_field && (h = app.util.base64Encode(JSON.stringify(o.data.book_field)));
        var m = "";
        if (o.data.item_id && (m = o.data.item_id), !a.title) return Toptips("请填写标题"), void o.setData({
            btnDisabled: !1
        });
        if (null == s) return Toptips("请选择分类"), void o.setData({
            btnDisabled: !1
        });
        if (!e) return Toptips("请自动定位或手动填写所在地址"), void o.setData({
            btnDisabled: !1
        });
        
        void o.setData({
            btnDisabled: !1
        });
        void o.setData({
            btnDisabled: !1
        });
        var g = o.data.form_field, v = [];
        if (g && 0 < g.length) {
            for (var b = 0; b < g.length; b++) {
                var y = g[b].title;
                if (1 == g[b].required && "" == a[y]) return Toptips(y + "不能为空"), void o.setData({
                    btnDisabled: !1
                });
                var _ = encodeURIComponent(a[y]);
                v.push(_);
            }
            v = app.util.base64Encode(JSON.stringify(v));
        }
        app.util.request({
            url: "entry/wxapp/notice",
            cachetime: "0",
            data: {
                act: "formid",
                formid: i,
                m: "superman_hand2"
            },
            success: function(t) {
                0 == t.data.errno ? console.log("formid已添加") : console.log(t.data.errmsg);
            },
            fail: function(t) {
                console.log(t.data.errmsg);
            }
        }), app.util.request(_defineProperty({
            url: "entry/wxapp/item",
            cachetime: "0",
            method: "POST",
            data: {
                act: "post",
                id: m,
                isbn: o.data.bookCode ? o.data.bookCode : "",
                title: a.title,
                description: null != a.description ? a.description : "",
                summary: null != a.summary ? a.summary : "",
                book_field: h,
                album: r,
                thumb: d,
                city: l,
                video: c,
                cid: n[s].id,
                address: e,
                buy_type: 0 <= p ? 0 : 1,
                price: p < 0 ? 0 : a.price,
                unit_type: p,
                unit_title: f,
                credit: p < 0 ? a.price : 0,
                formid: i,
                wechatpay: o.data.onlinePay ? 1 : 0,
                lat: o.data.lat,
                lng: o.data.lng,
                add_field: v,
                m: "superman_hand2"
            },
            fail: function(t) {
                o.setData({
                    btnDisabled: !1
                }), Toptips(t.data.errmsg);
            },
            success: function(t) {
                if (o.setData({
                    btnDisabled: !1
                }), t.data.errno) Toptips(t.data.errmsg); else {
                    var a = "发布成功", e = 0, i = "../detail/index?id=" + t.data.data.itemid + "&share=1";
                    t.data.data.upload && (e += parseFloat(t.data.data.upload.credit)), t.data.data.category && (e += parseFloat(t.data.data.category.credit)), 
                    1 == o.data.auditType ? (a += "，请等待管理员审核", i = "../home/index") : !m && 0 < e && (a = a + ", 积分+" + e), 
                    o.data.isSetTop && (i = "../set_top/index?post=1&id=" + t.data.data.itemid, a += "，即将跳转至置顶付费页..."), 
                    o.showIconToast(a, "success"), setTimeout(function() {
                        wx.redirectTo({
                            url: i
                        });
                    }, 1500);
                }
            }
        }, "fail", function(t) {
            Toptips(t.data.errmsg);
        }));
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