const utils = require("../../../../utils/utils.js");

class Movie{
  constructor(url) {
    this.url = url
  }

  getDoubanData(cb) {
    this.cb = cb
    utils.http(this.url, 'get', this.processDoubanData.bind(this));
  }

  processDoubanData(data) {
    if (!data) {
      return;
    }
    const director = {
      avatar: '',
      name: '',
      id: ''
    }

    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    const movie = {
      movieImage: data.images ? data.images.large : '',
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentsCount: data.comments_count,
      year: data.year,
      genres: data.genres.join(','),
      stars: utils.starsToArray(data.rating.stars),
      average: data.rating.average,
      director: director,
      casts: utils.convertToCastString(data.casts),
      castsInfo: utils.convertToCastInfo(data.casts),
      summary: data.summary
    }
    // 由于movie是一个异步方法，不能直接return 出去，用回调函数给传出去
    this.cb(movie)
  }
}

export { Movie }