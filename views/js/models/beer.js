function Beer (data) {
  var params = data;

  var beer = {
      model: Model(),
      beers: [],
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
        for(var a = 0; a != this.beers.length; a++) {
            if(this.beers[a].id) {
                if(this.beers[a].id = id)
                    return this.beers[a];
            }
        }
      },
      setBeer: function (id, property, data) {
        if(this.getBeer(a).property)
          this.getBeer(a).property = data;
      },
      clearMine: function (id) {
        for(var a = 0; a != this.beers.length; a++) {
          if(this.beers[a].id) {
            if(this.beers[a].id = id) {
              for(var b = 0; b != this.attrs.length; b++) {
                delete this.beers[a][this.attrs[b]];
              }
              break;
            }
          }
        }
      }
  };

  return beer;
}