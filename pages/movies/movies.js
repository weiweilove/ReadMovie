const app = getApp();
const utils = require('../../utils/utils.js');

Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false,
  },

  onLoad: function() {
    const inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters' + "?start=0&count=3";
    const comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    const top25Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top25Url, "top250", "豆瓣Top250");
  },
  getMovieListData: function (url, settedKey, categoryTitle) {
    const that = this;
    wx.request({
      url: url,
      data: {}, // 请求的参数
      header: {
        "Content-Type": "json"
      },
      method: 'GET',
      success: function(res) {
        that.getDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function(fail) {
        console.log(fail)
      }
    })
  },
  getDoubanData(moviesData, settedKey, categoryTitle) {
    // console.log(moviesData)
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
    // console.log(movies)
    var tempData = {};
    tempData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(tempData)
    // console.log(this.data)
  },
  onMoreTap: function(event) {
    const categoryTitle = event.currentTarget.dataset.categorytitle;
    wx.navigateTo({
      url: 'more-movie/more-movie?categoryTitle=' + categoryTitle
    })
  },
  onSearchFoucs: function() {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  onSearchConfirm: function(event) {
    const searchText = event.detail.value;
    const searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + searchText;
    this.getMovieListData(searchUrl, "searchResult", "");
  },
  onCancelTap: function() {
    this.setData({
      containerShow: true,
      searchPanelShow: false
    });
    this.data.searchResult = {}
  },
  onMovieTap: function(option) {
    const movieId = option.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?movieId=' + movieId
    })
  }

})