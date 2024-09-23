// app.js
App({
  globalData: {
    screenWidth: null, // 初始设为 null 或者不设置初始值
    screenHeight: null,
    statusHeight: null,
    contentHeight:null
  },
  onLaunch() {
    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.screenWidth = res.screenWidth;
        this.globalData.screenHeight = res.screenHeight;
        this.globalData.statusHeight = res.statusBarHeight;
        this.globalData.contentHeight = res.screenHeight - res.statusBarHeight - 80;
      }
    });
  }
});

