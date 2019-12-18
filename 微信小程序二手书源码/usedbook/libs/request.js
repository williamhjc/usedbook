var DEBUG = !1, util = require("../we7/resource/js/util.js");

function ajax() {
    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "", a = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {
        m: "superman_hand2"
    }, t = arguments[2];
    DEBUG || util.request({
        url: e,
        cachetime: "0",
        data: a,
        success: function(e) {
            t(e);
        }
    });
}

module.exports = {
    ajax: ajax
};