const { request } = require('../../utils/request');

Page({
  data: { order: null, asking: false },
  onLoad(query) {
    this.id = query.id;
  },
  onShow() {
    request({ url: '/api/pickup/orders/' + this.id }).then((order) => {
      this.setData({ order });
    }).catch(() => {});
  },
  ask() {
    this.setData({ asking: true });
  },
  close() {
    this.setData({ asking: false });
  },
  noop() {},
  confirm() {
    const order = this.data.order;
    request({
      url: '/api/pickup/orders/' + this.id + '/confirm',
      method: 'POST',
      data: { code: order.pickupCode }
    }).then((next) => {
      this.setData({ order: next, asking: false });
      wx.showToast({ title: '已确认自提', icon: 'none' });
    }).catch(() => {
      this.setData({ asking: false });
    });
  }
});
