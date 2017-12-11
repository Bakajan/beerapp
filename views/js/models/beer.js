function Beer (data) {
  var params = data;

  var beer = {
      model: Model(),
      data: {
        sort: {
          type: '',
          state: ''
        },
        beers: []
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
      getBeer: function (id) {
        for(var a = 0; a != this.data.beers.length; a++) {
            if(this.data.beers[a].id) {
                if(this.data.beers[a].id = id)
                    return this.data.beers[a];
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
      clearMine: function (id) {
        for(var a = 0; a != this.data.beers.length; a++) {
          if(this.data.beers[a].id) {
            if(this.data.beers[a].id = id) {
              for(var b = 0; b != this.attrs.length; b++) {
                delete this.data.beers[a][this.attrs[b]];
              }
              break;
            }
          }
        }
      }
  };

  return beer;
}