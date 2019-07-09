const app = getApp();
const utils = require('../../../utils/utils.js');

Page({
  data: {
    categoryTitle: '',
    movies: {},
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },

  onLoad: function (options) {
    const categoryTitle = options.categoryTitle;
    let dataUrl = ''
    this.data.categoryTitle = categoryTitle;

    switch (categoryTitle) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }

    this.data.requestUrl = dataUrl
    wx.showNavigationBarLoading();
    utils.http(dataUrl, 'get', this.getDoubanData);

  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.categoryTitle
    });
  },

  onMovieTap: function (option) {
    const movieId = option.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?movieId=' + movieId
    })
  },

  scrollToLower() {
    // 下滑加载更多
    const nextRequestUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    wx.showNavigationBarLoading();
    utils.http(nextRequestUrl, 'get', this.getDoubanData);
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    // var refreshUrl = this.data.requestUrl +
    //   "?star=0&count=20";
    // this.data.movies = {};
    // this.data.isEmpty = true;
    // this.data.totalCount = 0;
    // wx.startPullDownRefresh();
    // utils.http(refreshUrl, this.getDoubanData);
  },

  getDoubanData(moviesData) {
    const movies = []
    for (let i in moviesData.subjects) {
      const subject = moviesData.subjects[i];
      let title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...';
      }
      const tempMovies = {
        stars: utils.starsToArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(tempMovies)
    }

    let totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }

    this.data.totalCount += 20;
    
    this.setData({
      movies: totalMovies
    })

    wx.hideNavigationBarLoading();
    // wx.stopPullDownRefresh();
    console.log(this.data)
  }

})