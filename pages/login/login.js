const { request } = require('../../utils/request');

Page({
  data: { username: 'pickup', password: '123456', loading: false },
  onShow() {
    if (wx.getStorageSync('token')) {
      wx.reLaunch({ url: '/pages/index/index' });
    }
  },
  onUsername(event) {
    this.setData({ username: event.detail.value });
  },
  onPassword(event) {
    this.setData({ password: event.detail.value });
  },
  submit() {
    if (this.data.loading) return;
    this.setData({ loading: true });
    request({
      url: '/api/pickup/auth/login',
      method: 'POST',
      data: { username: this.data.username, password: this.data.password }
    }).then((data) => {
      wx.setStorageSync('token', data.accessToken);
      wx.reLaunch({ url: '/pages/index/index' });
    }).finally(() => {
      this.setData({ loading: false });
    });
  }
});
