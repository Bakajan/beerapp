function beerController (template) {
  var models = {
    Beers: Beer()
  };
  var view = BeerView(template);

  $.fn.bindDelay = function( eventType, eventData, handler, timer ) {
    if ( $.isFunction(eventData) ) {
      timer = handler;
      handler = eventData;
    }
    timer = (typeof timer === "number") ? timer : 300;
    var timeouts;
    $(this).bind(eventType, function(event) {
      var that = this;
      clearTimeout(timeouts);
      timeouts = setTimeout(function() {
        handler.call(that, event);
      }, timer);
    });
  };

  var controller = {
    models: models,
    beers: [],
    view: view,
    updateModel: function (data) {
      if(data.beer) {
        for(var a = 0; a != this.models.Beers.data.beers.length; a++) {
          if(data.beer === this.models.Beers.data.beers[a].id) {
            if(!this.models.Beers.data.beers[a]['date_submitted'])
              this.models.Beers.data.beers[a]['date_submitted'] = data.date_submitted;
            break;
          }
        }
        for(var a = 0; a != this.models.Beers.data.mine.length; a++) {
          if(data.beer.beer_id === this.models.Beers.data.mine[a].beer_id) {
            this.models.Beers.data.mine[a] = data.beer;
            break;
          }
        }
      }
    },
    getMine: function (callback) {
      this.models.Beers.fetch(null, function (data) {
        callback(data);
      });
    },
    getBeers: function () {
      this.models.Beers.data.selectedModel = this.models.Beers.models.beers;
      var that = this;
      that.models.Beers.find({action: 'beers', term: $('#search-bar').val()}, function (data) {
        if(data) {
          var json = JSON.parse(data);
          if(json.data)
            that.models.Beers.data.beers = json.data;
        }
        if(that.models.Beers.data.beers) {
          that.models.Beers.data.beers.forEach( function (beer, i, a) {
            for(var b = 0; b !== that.models.Beers.data.mine.length; b++) {
              if(that.models.Beers.data.mine[b].beer_id === beer.id) {
                if (that.models.Beers.data.mine[b].rating) a[i].rating = that.models.Beers.data.mine[b].rating;
                if (that.models.Beers.data.mine[b].impression) a[i].impression = that.models.Beers.data.mine[b].impression;
                if (that.models.Beers.data.mine[b].tried) a[i].tried = that.models.Beers.data.mine[b].tried;
                if (that.models.Beers.data.mine[b].date_submitted) a[i].date_submitted = that.models.Beers.data.mine[b].date_submitted;

                break;
              }
            }
          });
          that.view.showBeers(that.models.Beers.data.beers);
          that.filter();
        }
      });
    },
    editBeer: function (selectedCard, callback) {
      var beer = this.view.getBeer(selectedCard);

      if(beer) {
        this.models.Beers.edit({action: 'edit', beer: beer}, function (data) {
          if(callback)
            callback(data);
        });
      }
    },
    rateBeer: function (selectedStar, selectedCard) {
      var star = this.view.getSelectedStar(selectedStar);

      if(star) {
        this.view.alterRating(selectedStar, selectedCard, 'select');

        var card = $(selectedCard).closest(this.view.cards);
        var that = this;
        this.editBeer(card, function (data) {
          if(data)
            that.updateModel(data);
        });
      }
    },
    selectBeer: function (triedMarker) {
      var that = this;
      var clickedCard = $(triedMarker).closest(this.view.cards);

      that.view.toggleSelectedBeer(clickedCard);

      this.editBeer(clickedCard, function (data) {
        if(data)
          that.updateModel(data);
      });
    },
    editImpression: function (selectedCard) {
      var that = this;
      var card = $(selectedCard).closest(this.view.cards);

      this.editBeer(card, function (data) {
        if(data)
          that.updateModel(data);
      });
    },
    filterBeers: function (filterBtn) {
     this.view.toggleFilter(filterBtn);
     this.filter();
    },
    filter: function () {
      var filteredBeers = [];
      var filters = this.view.getSelectedFilters();
      var model = this.models.Beers.data.selectedModel;

      this.models.Beers.data[model].forEach( function (beer) {
        var beer_id = (beer.beer_id) ? beer.beer_id : beer.id;
        var style = (beer.style && beer.style.name) ? beer.style.name : beer.style;

        if(filters.includes('mine')) {
          if(beer.date_submitted) {
            if(filters.includes('stouts')) {
              if(style.toLowerCase().indexOf('stout') !== -1) {
                filteredBeers.push(beer_id);
              }
            }
            else {
              filteredBeers.push(beer_id);
            }
          }
        }
        else {
          if(filters.includes('stouts')) {
            if(style.toLowerCase().indexOf('stout') !== -1) {
              filteredBeers.push(beer_id);
            }
          }
          else {
            filteredBeers.push(beer_id);
          }
        }
      });

      this.view.filterBeers(filteredBeers);
    },
    clearBeer: function (e) {
      this.models.Beers.clearMine($(e.target).closest(this.view.cards).attr('id'));
      this.view.clearBeer(e.target);
    },
    sortBeers: function (sortBy) {
      var model = this.models.Beers.data.selectedModel;

      if(this.models.Beers.data[model]) {
        this.models.Beers.setSort(sortBy);
        var beers = [];
        beers = this.keysort(this.models.Beers.data[model], sortBy, this.models.Beers.data.sort.state);
        this.view.sortButtons(sortBy, this.models.Beers.data.sort.state);
        this.view.showBeers(beers);
        this.filter();
      }
    },
    getMyBeers: function () {
      this.models.Beers.data.selectedModel = this.models.Beers.models.mine;
      this.view.showBeers(this.models.Beers.data.mine);
      this.filter();
    },
    keysort: function (arr, keyArr, reverse) {
      var keyArr = keyArr.split('.');
      var sortOrder = 1;
      if(reverse)sortOrder = -1;
      return arr.sort(function(a, b) {
        var x=a,y=b;
        for (var i=0; i < keyArr.length; i++) {
          x = x[keyArr[i]];
          y = y[keyArr[i]];
        }
        return sortOrder * ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }
  };

  return controller;
}