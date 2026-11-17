function request(options) {
  const app = getApp();
  const token = wx.getStorageSync('token');
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.base + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'content-type': 'application/json',
        Authorization: token ? 'Bearer ' + token : ''
      },
      success(res) {
        const body = res.data || {};
        if (body.code === 0) {
          resolve(body.data);
          return;
        }
        wx.showToast({ title: body.message || '请求失败', icon: 'none' });
        reject(body);
      },
      fail(error) {
        wx.showToast({ title: '网络异常', icon: 'none' });
        reject(error);
      }
    });
  });
}

module.exports = { request };
