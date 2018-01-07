function beerController (templates) {
  var models = {
    Beers: Beer()
  };
  var view = BeerView(templates);

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
        for(var a = 0; a != this.models.Beers.data.allBeers.beers.length; a++) {
          if(data.beer === this.models.Beers.data.allBeers.beers[a].id) {
            if(!this.models.Beers.data.allBeers.beers[a]['date_submitted'])
              this.models.Beers.data.allBeers.beers[a]['date_submitted'] = data.date_submitted;
            break;
          }
        }
        var edited = false;
        for(var a = 0; a != this.models.Beers.data.myBeers.beers.length; a++) {
          if(data.beer.beer_id === this.models.Beers.data.myBeers.beers[a].beer_id) {
            this.models.Beers.data.myBeers.beers[a] = data.beer;
            edited = true;
            break;
          }
        }
        if(!edited) {
          this.models.Beers.data.myBeers.beers.push(data.beer);
          this.models.Beers.data.myBeers.total = this.models.Beers.data.myBeers.beers.length;
        }

        this.view.addPopup(data.type, data.message);
      }
    },
    getMine: function (callback) {
      var that = this;
      this.models.Beers.fetch(null, function (data) {
        that.models.Beers.data.myBeers.beers = data;
        that.models.Beers.data.myBeers.total = data.length;
        callback(data);
      });
    },
    getBeers: function () {
      this.models.Beers.data.allBeers.resetBeers();
      this.models.Beers.data.selectedModel = this.models.Beers.models.beers;
      var that = this;
      that.models.Beers.find({action: 'beers', term: $('#search-bar').val()}, function (data) {
        if(data) {
          if(data.result) {
            if(data.result === 'failure') {
              that.view.addPopup(data.result, data.message);
            }
            else {
              if(data.data) {
                var json = JSON.parse(data.data);
                if(json.data) {
                  that.models.Beers.data.allBeers.setBeers(json.totalResults, json.data, json.currentPage, json.numberOfPages);
                }
              }
            }
          }
        }
        if(that.models.Beers.data.allBeers.beers) {
          that.models.Beers.data.allBeers.beers.forEach( function (beer, i, a) {
            for(var b = 0; b !== that.models.Beers.data.myBeers.beers.length; b++) {
              if(that.models.Beers.data.myBeers.beers[b].beer_id === beer.id) {
                if (that.models.Beers.data.myBeers.beers[b].rating) a[i].rating = that.models.Beers.data.myBeers.beers[b].rating;
                if (that.models.Beers.data.myBeers.beers[b].impression) a[i].impression = that.models.Beers.data.myBeers.beers[b].impression;
                if (that.models.Beers.data.myBeers.beers[b].tried) a[i].tried = that.models.Beers.data.myBeers.beers[b].tried;
                if (that.models.Beers.data.myBeers.beers[b].date_submitted) a[i].date_submitted = that.models.Beers.data.myBeers.beers[b].date_submitted;

                break;
              }
            }
          });
          that.view.showBeers(that.models.Beers.data[that.models.Beers.data.selectedModel]);
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

      this.models.Beers.data[model].beers.forEach( function (beer) {
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

      this.view.filterBeers(filteredBeers, this.models.Beers.data[this.models.Beers.data.selectedModel].total);
    },
    clearBeer: function (e) {
      var that = this;
      this.models.Beers.clearMine($(e.target).closest(this.view.cards).attr('id'), function (data) {
        that.view.addPopup(data.type, data.message);
        that.view.clearBeer(e.target, that.models.Beers.data.selectedModel, that.models.Beers.models);
        that.view.updateResults(that.models.Beers.data[that.models.Beers.data.selectedModel].total);
      });
    },
    sortBeers: function (sortBy) {
      var model = this.models.Beers.data.selectedModel;

      if(this.models.Beers.data[model].beers) {
        this.models.Beers.setSort(sortBy);
        this.models.Beers.data[model].beers = this.keysort(this.models.Beers.data[model].beers, sortBy, this.models.Beers.data.sort.state);
        this.view.sortButtons(sortBy, this.models.Beers.data.sort.state);
        this.view.showBeers(this.models.Beers.data[model]);
        this.filter();
      }
    },
    getMyBeers: function () {
      this.models.Beers.data.selectedModel = this.models.Beers.models.mine;
      this.view.showBeers(this.models.Beers.data[this.models.Beers.data.selectedModel]);
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