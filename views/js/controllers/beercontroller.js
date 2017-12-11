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
        for(var a = 0; a != this.models.Beers.beers.length; a++) {
          if(data.beer === this.models.Beers.beers[a].id) {
            if(!this.models.Beers.beers[a]['date_submitted'])
              this.models.Beers.beers[a]['date_submitted'] = data.date_submitted;
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
      var that = this;
      this.getMine( function (mine) {
        that.models.Beers.find({action: 'beers', term: $('#search-bar').val()}, function (data) {
          if(data) {
            var json = JSON.parse(data);
            if(json.data)
              that.models.Beers.beers = json.data;
          }
          if(that.models.Beers.beers) {
            that.models.Beers.beers.forEach( function (beer, i, a) {
              mine.forEach( function (myBeer) {
                if(myBeer.beer_id === beer.id) {
                  if (myBeer.rating) a[i].rating = myBeer.rating;
                  if (myBeer.impression) a[i].impression = myBeer.impression;
                  if (myBeer.tried) a[i].tried = myBeer.tried;
                  if (myBeer.date_submitted) a[i].date_submitted = myBeer.date_submitted;
                }
              });
            });
            that.view.showBeers(that.models.Beers.beers);
            that.filter();
          }
        });
      });
    },
    rateBeer: function (selectedStar, selectedCard) {
      var star = this.view.getSelectedStar(selectedStar);
      var beer_id = this.view.getBeerID(selectedCard);

      if(star) {
        this.view.alterRating(selectedStar, selectedCard, 'select');

        var that = this;
        this.models.Beers.edit({action: 'edit', beer: beer_id, field: 'rating', value: star}, function (data) {
          if(data)
            that.updateModel(data);
        });
      }
    },
    selectBeer: function (clickedCard) {
      var that = this;
      var beer_id = $(clickedCard).closest('.card').attr('id');
      var asterisk = $(clickedCard).find('.select-asterisk').html();
      var selected = (asterisk === '*') ? false : true;

      this.models.Beers.edit({action: 'edit', beer: beer_id, field: 'tried', value: selected}, function (data) {
          that.view.toggleSelectedBeer(clickedCard);
          if(data)
            that.updateModel(data);
      });
    },
    editImpression: function (selectedCard) {
      var beer_id = this.view.getBeerID(selectedCard);
      var impression = this.view.getImpression(selectedCard);
      var that = this;

      this.models.Beers.edit({action: 'edit', beer: beer_id, field: 'impression', value: impression}, function (data) {
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

      this.models.Beers.beers.forEach( function (beer) {
        if(filters.includes('mine')) {
          if(beer.date_submitted) {
            if(filters.includes('stouts')) {
              if(beer.style && beer.style.name.toLowerCase().indexOf('stout') !== -1) {
                filteredBeers.push(beer.id);
              }
            }
            else {
              filteredBeers.push(beer.id);
            }
          }
        }
        else {
          if(filters.includes('stouts')) {
            if(beer.style && beer.style.name.toLowerCase().indexOf('stout') !== -1) {
              filteredBeers.push(beer.id);
            }
          }
          else {
            filteredBeers.push(beer.id);
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
      if(this.models.Beers.beers) {
        var beers = [];
        beers = this.keysort(this.models.Beers.beers, sortBy);
        this.filter();
        this.view.showBeers(beers);
      }
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