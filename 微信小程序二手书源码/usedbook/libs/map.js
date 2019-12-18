Object.defineProperty(exports, "__esModule", {
    value: !0
});

var _createClass = function() {
    function o(e, t) {
        for (var n = 0; n < t.length; n++) {
            var o = t[n];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), 
            Object.defineProperty(e, o.key, o);
        }
    }
    return function(e, t, n) {
        return t && o(e.prototype, t), n && o(e, n), e;
    };
}();

function _classCallCheck(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}

var wxqqmap = require("./qqmap-wx-jssdk.js"), qqwxmap = new wxqqmap({
    key: "7M4BZ-FDEK3-JC737-YXQ5O-V3IO3-E5FH5"
}), qqmap = function() {
    function e() {
        _classCallCheck(this, e);
    }
    return _createClass(e, [ {
        key: "getLocateInfo",
        value: function() {
            var o = this;
            return new Promise(function(t, n) {
                o.location().then(function(e) {
                    wx.setStorageSync("lat", e.latitude), wx.setStorageSync("lng", e.longitude), qqwxmap.reverseGeocoder({
                        location: {
                            latitude: e.latitude,
                            longitude: e.longitude
                        },
                        success: function(e) {
                            t(e.result.address_component.city);
                        },
                        fail: function(e) {
                            n(e);
                        }
                    });
                }, 
                function(e) {
                    wx.showModal({
                        title: "",
                        content: "自动定位需要授权地理定位选项",
                        confirmText: "去授权",
                        success: function(e) {
                            e.confirm && wx.openSetting({
                                success: function(e) {
                                    console.log(e), o.getLocateInfo();
                                }
                            });
                        }
                    });
                });
            });
        }
    }, {
        key: "getCityList",
        value: function() {
            return new Promise(function(t, e) {
                qqwxmap.getCityList({
                    success: function(e) {
                        t(e.result[1]);
                    }
                });
            });
        }
    }, {
        key: "location",
        value: function() {
            return new Promise(function(t, n) {
                wx.getLocation({
                    altitude: !0,
                    success: function(e) {
                        t(e);
                    },
                    fail: function(e) {
                        n(e);
                    }
                });
            });
        }
    } ]), e;
}();

exports.default = qqmap;