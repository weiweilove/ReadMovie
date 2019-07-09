const app = getApp();
import { Movie } from 'class/Movie.js';

Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    const movieId = options.movieId;
    const movieDetailUrl = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    const movie = new Movie(movieDetailUrl)
    // 由于getDoubanData里面包含一个异步的请求，所以只能用回调函数的方式去获取数据
    movie.getDoubanData((movie) => {
      this.setData({
        movie: movie
      })
    })
  },
  previewImgTap: function(option) {
    const url = option.currentTarget.dataset.src;
    wx.previewImage({
      urls: [url],
      current: url   // 多张图片时可用
    })
  }
})