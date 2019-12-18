var app = getApp(), Toptips = require("../../libs/zanui/toptips/index");

Page({
  data: {
    receiver: null,
    hasReceiver: !1,
    remarkOrder: {
      placeholder: "选填",
      inputCount: 0,
      maxlength: 100,
      inputValue: ""
    },
    showOpenSetting: !1
  },
  onLoad: function (e) {
    var t = this, a = wx.getStorageSync("loading_img");
    a && t.setData({
      loadingImg: a
    });
    var i = e.id, n = e.type;
    n && "wechat" == n && t.setData({
      wechatPay: !0
    }), app.util.request({
      url: "entry/wxapp/item",
      cachetime: "0",
      data: {
        act: "detail",
        id: i,
        m: "superman_hand2"
      },
      success: function (e) {
        e.data.errno ? t.showIconToast(e.data.errmsg) : t.setData({
          itemDetail: e.data.data.item,
          completed: !0
        });
      },
      fail: function (e) {
        t.setData({
          completed: !0
        }), t.showIconToast(e.data.errmsg);
      }
    });
  },
  setAddress: function () {
    var t = this;
    wx.chooseAddress({
      success: function (e) {
        t.setData({
          receiver: e,
          hasReceiver: !0
        });
      },
      fail: function (e) {
        console.log(e), t.data.showOpenSetting || t.setData({
          showOpenSetting: !0
        });
      }
    });
  },
  hideOpenSetting: function () {
    this.data.showOpenSetting && this.setData({
      showOpenSetting: !1
    });
  },
  confirmOpenSetting: function () {
    this.data.showOpenSetting && this.setData({
      showOpenSetting: !1
    });
  },
  submitOrder: function (e) {
    var a = this;
    if (a.data.hasReceiver) {
      var t = a.data.receiver.provinceName + a.data.receiver.cityName + a.data.receiver.countyName + a.data.receiver.detailInfo, i = e.detail.formId;
      app.util.request({
        url: "entry/wxapp/notice",
        cachetime: "0",
        data: {
          act: "formid",
          formid: i,
          m: "superman_hand2"
        },
        success: function (e) {
          0 == e.data.errno ? console.log("formid已添加") : console.log(e.data.errmsg);
        },
        fail: function (e) {
          console.log(e.data.errmsg);
        }
      }), app.util.request({
        url: "entry/wxapp/item",
        data: {
          m: "superman_hand2",
          act: "submit",
          itemid: a.data.itemDetail.id,
          mobile: a.data.receiver.telNumber,
          address: t,
          name: a.data.receiver.userName,
          formId: i,
          payType: a.data.wechatPay ? "wechat" : "credit",
          reply: a.data.remarkOrder.inputValue ? a.data.remarkOrder.inputValue : ""
        },
        fail: function (e) {
          console.log(e), 20 == e.data.errno ? wx.showModal({
            title: "系统提示",
            content: e.data.errmsg + "(" + e.data.errno + ")",
            confirmText: "去赚积分",
            success: function (e) {
              e.confirm && wx.redirectTo({
                url: "../get_credit/index"
              });
            }
          }) : wx.showModal({
            title: "系统提示",
            content: e.data.errmsg + "(" + e.data.errno + ")"
          });
        },
        success: function (e) {
          if (a.data.wechatPay) {
            var t = {
              timeStamp: e.data.data.timeStamp,
              nonceStr: e.data.data.nonceStr,
              package: e.data.data.package,
              signType: e.data.data.signType,
              paySign: e.data.data.paySign
            };
            a.payment(t);
          } else wx.showToast({
            title: "兑换成功"
          }), setTimeout(function () {
            wx.redirectTo({
              url: "../my_order/index?type=buy"
            });
          }, 1e3);
        }
      });
    } else Toptips("未设置收货地址");
  },
  payment: function (e) {
    wx.requestPayment({
      timeStamp: e.timeStamp,
      nonceStr: e.nonceStr,
      package: e.package,
      signType: e.signType,
      paySign: e.paySign,
      success: function (e) {
        wx.showToast({
          title: "支付成功"
        }), setTimeout(function () {
          wx.redirectTo({
            url: "../my_order/index?type=buy"
          });
        }, 1e3);
      },
      fail: function (e) {
        console.log(e);
      }
    });
  },
  bindChangeRemarkOrder: function (e) {
    var t = e.detail.detail.value, a = t.length;
    this.setData({
      "remarkOrder.inputValue": t,
      "remarkOrder.inputCount": a
    });
  }
});