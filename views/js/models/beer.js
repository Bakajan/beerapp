function Beer (data) {
  var params = data;

  var beer = {
      model: Model(),
      models: {
        mine: 'mine',
        beers: 'beers'
      },
      data: {
        sort: {
          type: '',
          state: ''
        },
        beers: [],
        mine: [],
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
        for(var a = 0; a !== this.data.beers.length; a++) {
          if(this.data.beers[a].id) {
            if(this.data.beers[a].id === id) {
              for(var b = 0; b !== this.attrs.length; b++) {
                delete this.data.beers[a][this.attrs[b]];
              }
              break;
            }
          }
        }
        for(var b = this.data.mine.length - 1; b >= 0; b--) {
          if(this.data.mine[b].beer_id) {
            if(this.data.mine[b].beer_id === id) {
              this.data.mine.splice(b,1);
              break;
            }
          }
        }
      }
  };

  return beer;
}