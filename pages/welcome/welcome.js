Page({
  data: {
    moto: 'hello world'
  },
  // 时间处理函数
  bindViewTap: function(event) {
    // 保留当前页面，跳转到应用内的某个页面。但是不能跳转到tabbar页面。使用wx.navigateBack可以返回到原页面。小程序中页面栈最多5层
    wx.navigateTo({
      url: '../posts/post',
      success: function(res) {
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // 接口调用结束的回调函数（调用成功、失败都会执行）
      }
    })
  },
  startLeave: function() {
    console.log('startLeave')
  },
  onHide: function() {
    // 当页面隐藏
    console.log('onHide')
  },
  onUnload: function() {
    // 当页面关闭,当点击的时候执行wx.redirectTo时会让welcome页面关闭，因为没有返回的按钮
    console.log('onUnload')
  }
  
})