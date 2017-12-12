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

        this.updateMine(beers[index], id);
      }
    },
    updateMine: function (beer, id) {
      var that = this;
      if(beer.tried)
        $('#' + beer.id).find('.select-asterisk').html('*');

      $('#' + beer.id).find('.star').each( function (index) {
        var next = index + 1;
        if(next <= beer.rating)
          $(this).html(that.star.solid).addClass('selected-star');
      });

      $('#' + beer.id).find('.beer-impression').val(beer.impression);
      this.updateImpression($('#' + beer.id).find('.beer-impression'));
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
    filterBeers: function (filteredBeers) {
      $(this.cards).each( function () {
        if(!filteredBeers.includes($(this).attr('id')))
          $(this).hide();
        else
          $(this).show();
      });
    },
    hideList: function (e) {
      if($(e.target).attr('id') !== 'check01' && $(e.target).tagName !== 'A') {
        $('#check01').prop('checked', false);
      }
      if($(e.target).attr('id') !== 'check02' && $(e.target).tagName !== 'A') {
        $('#check02').prop('checked', false);
      }
    },
    clearBeer: function (card) {
      this.emptyStars(card);
      $(this.impression).val('');
      $(this.triedMarker).html('');
    },
    sortButtons: function (sortType, sortState) {
      $('.sort-arrow').html('');

      var sortable = $('[data-sortable="' + sortType + '"]');
      if(sortState) {
        sortable.find('.sort-arrow').append('&uarr;')
      }
      else {
        sortable.find('.sort-arrow').append('&darr;')
      }
    },
    updateResults: function () {
      var total = $(this.cards).length;
      var shown = $(this.cards + ':visible').length;
      var selectedFilters = [];
      $('.selected-filter').find('a').each( function () {
          selectedFilters.push($(this).attr('data-filter'));
      });
      $('#total').html(total);
      if(total !== shown)
        $('#shown').html(shown);
      $('#sortedBy').html(selectedFilters.join(','));

      $('.sort-arrow').each( function () {
        if($(this).text().length > 0) {
          $('#sortedBy').html($(this).closest('[data-sortable]').attr('data-sortable'));
        }
      })
    }
  };

  view.footer.toggleFixed();

  return view;
}