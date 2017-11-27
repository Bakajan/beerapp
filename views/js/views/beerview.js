function BeerView (template) {
  var card = template;

  var view = {
    card: card,
    cardsContainer: '#cards-container',
    cards: '.card',
    star: {
      solid: '&#9733;',
      empty: '&#9734;'
    },
    footer: {
      selector: '#footer',
      toggleFixed: function (toggle) {
        if (window.innerHeight < $(document).height())
          $(this.selector).removeClass('fix-bottom');
        else
          $(this.selector).addClass('fix-bottom');
      }
    },

    getBeerID: function (selectedCard) {
      if($(selectedCard).hasClass('card'))
        $(selectedCard).attr('id');
      else
        return $(selectedCard).closest('.card').attr('id');
    },
    getSelectedStar: function (selectedStar) {
      return $(selectedStar).attr('data-star');
    },
    getStars: function (selectedCard) {
      return $(selectedCard).find('.star')
    },
    getImpression: function (selectedCard) {
      if($(selectedCard).hasClass('beer-impression'))
        return $(selectedCard).val();
      else
        return $(selectedCard).find('.beer-impression').val();
    },
    showBeers: function (beers, myBeers) {
      $(this.cardsContainer).html('');
      
      for(var index in beers) {
        var id = beers[index].id;
        this.addCard(this.card, id);


        $(this.cards + '#' + id).find('.beer-name').html(beers[index].name);

        if(beers[index].available)
          $(this.cards + '#' + id).find('.beer-avail').html(beers[index].available.name);

        if(beers[index].style)
          $(this.cards + '#' + id).find('.beer-style').html(beers[index].style.shortName);

        $(this.cards + '#' + id).find('.abv-container').find('.beer-abv').html(beers[index].abv);

        if(beers[index].labels || beers[index].images) {
          var icon = (beers[index].labels) ? 'labels' : 'images';
          $(this.cards + '#' + id).find('.beer-icon img').attr('src', beers[index][icon].icon);
        }

        var desc = beers[index].description || beers[index].style.description || '';
        $(this.cards + '#' + id).find('.beer-desc').html(desc);

        var that = this;
        for(var a = 0; a != myBeers.length; a++) {
          if(id === myBeers[a].beer_id) {
            if(myBeers[a].tried)
              $('#' + id).find('.select-asterisk').html('*');
            $('#' + id).find('.star').each( function (index) {
              var next = index + 1;
              if(next <= myBeers[a].rating) {
                $(this).html(that.star.solid).addClass('selected-star');
              }
            });

            $('#' + id).find('.beer-impression').val(myBeers[a].impression);
          }
        }
      }
    },
    alterRating: function (selectedStar, selectedCard, how) {
      var star = this.getSelectedStar(selectedStar);
      var stars = this.getStars(selectedCard);
      var method = (how.indexOf('hover') !== -1) ? 'hovered-star' : (how.indexOf('select') !== -1) ? 'selected-star' : '';

      if(star) {
        var that = this;
        stars.each(function (index, value) {
          var next = index + 1;
          if (next <= star)
            $(this).html(that.star.solid).addClass(method);
          else
            $(this).html(that.star.empty).removeClass(method);
        });
      }
    },
    clearStars: function () {
      var that = this;
      $('.star').each( function () {
        if(!$(this).hasClass('selected-star'))
          $(this).html(that.star.empty);
        $(this).removeClass('hovered-star');
      });
    },
    addCard: function (card, id) {
      $(this.cardsContainer).append(card);
      $(this.cards).last().attr('id', id);

      // If content larger than screen, send footer to bottom //
      if (window.innerHeight < $(document).height()) {
        this.footer.toggleFixed();
      }
    },
    toggleSelectedBeer: function (clickedCard) {
      var asterisk =  $(clickedCard).find('.select-asterisk');
      if( asterisk.html() === '*')
        asterisk.html('');
       else
        asterisk.html('*');
    }
  };

  view.footer.toggleFixed();

  return view;
}