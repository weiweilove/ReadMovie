var postsData = require('../../../data/posts-data.js');
var app = getApp();
const backgroundAudioManager = wx.getBackgroundAudioManager();
const postsCollected = {}

Page({
  data: {
    isPlayingMusic: false,
    currentPostId: ''
  },
  onLoad: function(event) {
    var postId = event.id;
    this.data.currentPostId = postId;
    this.setData({
      postData: postsData.postList[postId]
    });
    
    // 初始化收藏
    if (postsCollected[postId]) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      postsCollected[postId] = false
      wx.setStorageSync('posts_collected', postsCollected)
    }
    // 当前页面播放id未解决
    console.log(app.globalData.g_currentMusicPostId)
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }

    // 音乐播放
    this.setMusicMonitor()
    
  },
  // 监听音乐播放状态:
  setMusicMonitor: function() {
    const that = this;
    backgroundAudioManager.onPlay(function() {
      console.log('开始')
    });
    backgroundAudioManager.onPause(function () {
      console.log('暂停')
    })
  },
  // 点击收藏时候得代码:
  onCollectedTap: function(event) {
    var getPostsCollected = wx.getStorageSync('posts_collected')
    var postCollected = getPostsCollected[this.data.currentPostId]
    postCollected = !postCollected
    getPostsCollected[this.data.currentPostId] = postCollected
    this.showModal(getPostsCollected, postCollected )
  },
  // 点击分享
  onShareTap: function(event) {
    var itemList = [
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function(res) {
        // res.tapIndex 用户点击得按钮序号
        wx.showModal({
          title: '用户' + itemList[res.tapIndex]
        })
      }
    })
  },
  showModal(getPostsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章' : '取消收藏?',
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', getPostsCollected)
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },
  onMusicTap: function() {
    const isPlayingMusic = this.data.isPlayingMusic;
    const currentPostId = this.data.currentPostId;
    const postData = postsData.postList[currentPostId]

    // 设置了src后会自动播放
    if (isPlayingMusic) {
      backgroundAudioManager.pause()
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
    } else {
      backgroundAudioManager.src = postData.music.url;
      backgroundAudioManager.title = postData.music.title;
      backgroundAudioManager.coverImgUrl = postData.music.coverImg;
      backgroundAudioManager.play()
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true
      app.globalData.g_currentMusicPostId = currentPostId
    }
   
  },
  /**
   *  定义页面分享函数
   */
  onShareAppMessage: function() {
    return {
      title: '分享该文章',
      desc: '分享给好朋友看一看',
      path: '/pages/posts/post-detail/post-detail?id=' + this.data.currentPostId
    }
  }
})