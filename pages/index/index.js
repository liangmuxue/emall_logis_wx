const { request } = require('../../utils/request');

Page({
  data: {
    statusBarHeight: 20,
    tab: 'home',
    filter: '待自提',
    code: '',
    pointName: '自提点',
    address: '',
    waiting: 0,
    picked: 0,
    waitingOrders: [],
    listed: []
  },
  onLoad() {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight || 20 });
  },
  onShow() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.reLaunch({ url: '/pages/login/login' });
      return;
    }
    this.load();
  },
  load() {
    request({ url: '/api/pickup/orders' }).then((board) => {
      this.orders = board.orders || [];
      this.setData({
        pointName: board.pointName || '自提点',
        address: board.address || '',
        waiting: board.waiting || 0,
        picked: board.picked || 0,
        waitingOrders: this.orders.filter((item) => item.status === 'READY_PICKUP')
      });
      this.applyFilter();
    }).catch(() => {});
  },
  applyFilter() {
    const filter = this.data.filter;
    this.setData({
      listed: (this.orders || []).filter((item) => item.statusName === filter)
    });
  },
  onCode(event) {
    this.setData({ code: event.detail.value });
  },
  search() {
    const code = (this.data.code || '').replace(/\s/g, '');
    if (code.length !== 6) {
      wx.showToast({ title: '请输入 6 位取件码', icon: 'none' });
      return;
    }
    request({ url: '/api/pickup/orders/lookup', method: 'POST', data: { code } }).then((order) => {
      wx.navigateTo({ url: '/pages/detail/detail?id=' + order.id });
    }).catch(() => {});
  },
  open(event) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + event.currentTarget.dataset.id });
  },
  showOrders(event) {
    this.setData({ tab: 'orders', filter: event.currentTarget.dataset.filter });
    this.applyFilter();
  },
  setFilter(event) {
    this.setData({ filter: event.currentTarget.dataset.filter });
    this.applyFilter();
  },
  switchTab(event) {
    this.setData({ tab: event.currentTarget.dataset.tab });
  },
  logout() {
    request({ url: '/api/pickup/auth/logout', method: 'POST' }).finally(() => {
      wx.removeStorageSync('token');
      wx.reLaunch({ url: '/pages/login/login' });
    });
  }
});
