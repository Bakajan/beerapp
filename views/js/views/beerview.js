  function BeerView (templates) {
  var card = templates.card;
  var popup = templates.popup;

  var view = {
    card: card,
    popup: popup,
    cardsContainer: '#cards-container',
    cards: '.card',
    menu: '[name="menu"]',
    star: {
      solid: '&#9733;',
      empty: '&#9734;'
    },
    impression: '.beer-impression',
    triedMarker: '.select-asterisk',
    clearBtn: '.clear-btn',
    footer: {
      selector: '#footer',
      toggleFixed: function (toggle) {
        if (window.innerHeight < $(document).height())
          $(this.selector).removeClass('fix-bottom');
        else
          $(this.selector).addClass('fix-bottom');
      }
    },

    getBeer: function (selectedCard) {
      var beer = {};
      if($(selectedCard).hasClass('card')) {
        beer.beer_id = $(selectedCard).attr('id');
        var asterisk = $(selectedCard).find('.select-asterisk').html();
        beer.tried = (asterisk === '*');
        beer.rating = $(selectedCard).find('.selected-star').length;
        beer.impression = $(selectedCard).find('.beer-impression').val();
        beer.icon = $(selectedCard).find('.beer-icon').find('img').attr('src');
        beer.name = $(selectedCard).find('.beer-name').html();
        beer.style = $(selectedCard).find('.beer-style').html();
        beer.description = $(selectedCard).find('.beer-desc').html();
        beer.abv = $(selectedCard).find('.beer-abv').html();
      }

      return beer;
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
    showBeers: function (beers) {
      if(beers.beers.length > 0) {
        $(this.cardsContainer).html('');

        var that = this;

        beers.beers.forEach( function (beer) {
          var id = (beer.beer_id) ? beer.beer_id : beer.id;
          var style = (beer.style.shortName) ? beer.style.shortName : beer.style;

          var cardSelector = $(that.cards + '#' + id);
          that.addCard(that.card, id);

          $(that.cards + '#' + id).find('.beer-name').html(beer.name);

          if(beer.available)
            $(that.cards + '#' + id).find('.beer-avail').html(beer.available.name);

          if(beer.style)
            $(that.cards + '#' + id).find('.beer-style').html(style);

          $(that.cards + '#' + id).find('.abv-container').find('.beer-abv').html(beer.abv);

          if(beer.labels || beer.images) {
            var icon = (beer.labels) ? 'labels' : 'images';
            $(that.cards + '#' + id).find('.beer-icon img').attr('src', beer[icon].icon);
          }
          else if (beer.icon)
            $(that.cards + '#' + id).find('.beer-icon img').attr('src', beer.icon);

          var desc = beer.description || beer.style.description || '';
          $(that.cards + '#' + id).find('.beer-desc').html(desc);

          that.updateMine(beer, id);
        });

        that.updateResults(beers.total);
      }
      else {
        $(this.cardsContainer).html('').append('No Results');
      }
    },
    updateMine: function (beer, id) {
      var that = this;
      var beerSelector = $('#' + id);

      if(beer.tried == '1')
        $('#' + id).find('.select-asterisk').html('*');

      beerSelector.find('.star').each( function (index) {
        var next = index + 1;
        if(next <= beer.rating)
          $(this).html(that.star.solid).addClass('selected-star');
      });

      beerSelector.find('.beer-impression').val(beer.impression);
      this.updateImpression(beerSelector.find('.beer-impression'));
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
        if($(this).hasClass('selected-star'))
          $(this).html(that.star.solid);
        else
          $(this).html(that.star.empty);
        $(this).removeClass('hovered-star');
      });
    },
    emptyStars: function () {
      var that = this;

      $('.star').each( function () {
        $(this).html(that.star.empty);
        $(this).removeClass('hovered-star');
        $(this).removeClass('selected-star');
      });
    },
    addCard: function (card, id) {
      $(this.cardsContainer).append(card);
      $(this.cards).last().attr('id', id);

      /* If content larger than screen, send footer to bottom */
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
    },
    toggleFilter: function (filterBtn) {
      if($(filterBtn.target).closest('.filter').hasClass('selected-filter')) {
        $(filterBtn.target).closest('.filter').removeClass('selected-filter');
      }
      else {
        $(filterBtn.target).closest('.filter').addClass('selected-filter');
      }
    },
    getSelectedFilters: function () {
      var selectedFilters = [];
      $('.filter').each( function (filter) {
        if($(this).hasClass('selected-filter')) {
          selectedFilters.push($(this).find('[data-filter]').attr('data-filter'));
        }
      });

      return selectedFilters;
    },
    updateImpression: function (el) {
      $(el).css('height', 'auto');
      $(el).css('padding', '0');
      $(el).css('height', el[0].scrollHeight + 'px');
    },
    filterBeers: function (filteredBeers, total) {
      $(this.cards).each( function () {
        if(!filteredBeers.includes($(this).attr('id')))
          $(this).hide();
        else
          $(this).show();
      });

      this.updateResults(total);
    },
    hideMenus: function (e) {
      $('[name="menu"]').each( function () {
        if(!$(e.target).is($(this)))
          $(this).prop('checked', false);
      });

      return false;
    },
    clearBeer: function (card, model, models) {
      if(model === models.mine) {
        $('#' + $(card).closest(this.cards).attr('id')).remove();
      }
      else {
        this.emptyStars(card);
        $(this.impression).val('');
        $(this.triedMarker).html('');
      }
    },
    sortButtons: function (sortType, sortState) {
      var sortable = $('[data-sortable="' + sortType + '"]');

      $('.sort-arrow').html('');

      if(sortState) {
        sortable.find('.sort-arrow').html('&uarr;')
      }
      else {
        sortable.find('.sort-arrow').html('&darr;')
      }
    },
    isScrollBottom: function () {
      var y = (window.scrollY) ? window.scrollY : document.documentElement.scrollTop;

      return (window.innerHeight + y) >= document.body.offsetHeight;
    },
    updateResults: function (fullTotal) {
      var total = $(this.cards).length;
      var shown = $(this.cards + ':visible').length;
      var selectedFilters = [];
      $('.selected-filter').find('a').each( function () {
          selectedFilters.push($(this).attr('data-filter'));
      });

      $('#total').html('Results: ' + total);
      if(total !== shown)
        $('#total').append('<div id="shown">' + '(' + shown + ')' + '</div>');
      else
        $('#shown').remove();
      $('#total').append(' - ' + fullTotal);

      $('#filters-used').html('Filters: ' + selectedFilters.join(','));

      $('.sort-arrow').each( function () {
        if($(this).text().length > 0) {
          var dir = ( $(this).closest('[data-sortable]').find('.sort-arrow').html() === '↑') ? 'ASC' : 'DESC';
          $('#sortedby').html('Sort By: ' + $(this).closest('[data-sortable]').attr('data-sortable') + ' ' + dir);
        }
      });
    },
    addPopup: function (type, message) {
      var type = (type) ? type : 'failure';
      var message = (message) ? message : 'No data!';
      message = (Array.isArray(message)) ? message.join('<br />') : message;

      $('#popup-wrapper').append(this.popup);
      $('.popup').addClass(type);
      $('.popup').find('.message').html(message);

      $('#popup-wrapper').children('div').each(function (index) {
        $(this).delay(2000 + (2000 * index)).fadeOut(400, function () {
          $(this).remove();
        });
      });
    }
  };

  view.footer.toggleFixed();

  return view;
}