var postsData = require('../../data/posts-data.js')
Page({
  data: {
    postList: []
  },
  onLoad: function() {
    // 生命周期函数--页面渲染后执行
    this.setData({
      postList: postsData.postList
    })
  },
  onSwiperTap: function(event) {
    console.log(event)
    const postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },
  onPostTap: function(event) {
    const postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  }

})