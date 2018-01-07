function Beer (data) {
  var params = data;

  var beer = {
      model: Model(),
      models: {
        mine: 'myBeers',
        beers: 'allBeers'
      },
      data: {
        sort: {
          type: '',
          state: ''
        },
        allBeers: {
          total: 0,
          beers: [],
          page: 0,
          pages: 0,
          resetBeers: function () {
            this.total = 0;
            this.beers = [];
            this.page = 0;
            this.pages = 0;
          },
          setBeers: function (total, beers, page, pages) {
            this.total = total;
            this.beers = beers;
            this.page = page;
            this.pages = pages;
          }
        },
        myBeers: {
          total: 0,
          beers: []
        },
        selectedModel: 'beers'
      },
      attrs: [
        'date_submitted',
        'tried',
        'rating',
        'impression'
      ],
      url: 'beerController.php',
      find: function (params, callback) {
          this.model.call(this.url, 'beers', params, callback);
      },
      edit: function (params, callback) {
          this.model.call(this.url, 'edit', params, callback);
      },
      fetch: function (params, callback) {
        this.model.call(this.url, 'mine', params, callback);
      },
      delete: function (beer_id, callback) {
        this.model.call(this.url, 'delete', {beerID: beer_id}, callback);
      },
      getBeer: function (id) {
        for(var a = 0; a != this.data.allBeers.beers.length; a++) {
            if(this.data.allBeers.beers[a].id) {
                if(this.data.allBeers.beers[a].id = id)
                    return this.data.allBeers.beers[a];
            }
        }
      },
      setBeer: function (id, property, data) {
        if(this.getBeer(id).property)
          this.getBeer(id).property = data;
      },
      setSort: function (sortType) {
        if(sortType === this.data.sort.type) {
          if(!this.data.sort.state)
            this.data.sort.state = true;
          else
            this.data.sort.state = false;
        }
        else {
          this.data.sort.type = sortType;
          this.data.sort.state = false;
        }
      },
      clearMine: function (id, callback) {
        for (var a = 0; a !== this.data.allBeers.beers.length; a++) {
          if (this.data.allBeers.beers[a].id) {
            if (this.data.allBeers.beers[a].id === id) {
              for (var b = 0; b !== this.attrs.length; b++) {
                delete this.data.allBeers.beers[a][this.attrs[b]];
              }
              break;
            }
          }
        }
        for (var b = this.data.myBeers.beers.length - 1; b >= 0; b--) {
          if (this.data.myBeers.beers[b].beer_id) {
            if (this.data.myBeers.beers[b].beer_id === id) {
              this.data.myBeers.beers.splice(b, 1);
              this.data.myBeers.total = this.data.myBeers.beers.length;
              break;
            }
          }
        }
        this.delete(id, function (data) {
          if (callback)
            callback(data);
        });
      }
  };

  return beer;
}