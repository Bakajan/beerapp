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
    view: view,
    mine: [],
    getMine: function (callback) {
      this.models.Beers.fetch(null, function (data) {
        callback(data);
      });
    },
    getBeers: function () {
      var that = this;
      this.models.Beers.find({action: 'beers', term: $('#search-bar').val()}, function (data) {
        var beers = {};
        if(data) {
          var json = JSON.parse(data);
          if(json.data)
            beers = json.data;
        }
        if(beers) {
          that.view.showBeers(beers, that.mine);
        }
      });
    },
    rateBeer: function (selectedStar, selectedCard) {
      var star = this.view.getSelectedStar(selectedStar);
      var beer_id = this.view.getBeerID(selectedCard);

      if(star) {
        this.view.alterRating(selectedStar, selectedCard, 'select');

        this.models.Beers.edit({action: 'edit', beer: beer_id, field: 'rating', value: star}, function (data) {
          console.log(data);
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
      });
    },
    editImpression: function (selectedCard) {
      var beer_id = this.view.getBeerID(selectedCard);
      var impression = this.view.getImpression(selectedCard);
      console.log(impression);

      this.models.Beers.edit({action: 'edit', beer: beer_id, field: 'impression', value: impression}, function (data) {
        console.log(data);
      });
    }
  };

  controller.getMine(function (data) {
    controller.mine = data;
  });

  return controller;
}