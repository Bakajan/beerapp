<html>
    {header}
    <body>
        <form id="search-form">
          <div id="search-wrapper">
            <div id="search-container">
                <input type="search" id="search-bar" />
                <span data-icon="&#xe000;" aria-hidden="true" id="search-span">
                  <input type="submit" id="search-btn" value="" />
                </span>
            </div>
            {filters}
			  <hr />
            <div id="results">
              <div id="total" class="result-label"></div>
              <div id="filters-used" class="result-label"></div>
              <div id="sortedby" class="result-label"></div>
            </div>
        </div>
          </div>
        </form>

        <div id="cards-container"></div>

        <div id="footer" >
         <p>
            <img src="http://s3.amazonaws.com/brewerydb/Powered-By-BreweryDB.png">
            This product uses the BreweryDB API but is not endorsed or certified by PintLabs
         </p>
        </div>

        <div id="popup-wrapper"></div>
        <img src="{{load-icon}}" style="display: none" class="loading-icon">

        <a href="#"><div id="mobile_takeToTop_button">&#9651;</div></a>
        
        <script>
          {model}
          {beermodel}
          {beerview}
          {beercontroller}

            var BeerController = beerController({card: '{cardtemplate}', popup: '{popup}'});
            var timeout;

          $.holdReady( true );
          BeerController.getMine( function (myBeers) {
            $.holdReady(false);
          });

          BeerController.view.buildFilters();

            $(document).ready(function() {
              $('#search-form').submit(function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                $(BeerController.view.cardsContainer).html('');
                BeerController.getBeers();

                return false;
              });

              $(document).on('click', '.tried-marker', function () {
                BeerController.selectBeer(this);
              });

              $(document).on('click', '.beer-rating', function (e) {
                BeerController.rateBeer(e.target, this);
              });

              $(document).on('mouseover', '.beer-rating', function (e) {
                BeerController.view.alterRating(e.target, this, 'hover')
              });
              $(document).on('mouseleave', '.beer-rating', function (e) {
                BeerController.view.clearStars();
              });

              $(document).on('keydown', '.beer-impression', function () {
                BeerController.view.updateImpression($(this));
              });

              $(document).on('click', '.filter', function (e) {
                BeerController.filterBeers(e);
              });

              $(document).on('click', '.sort', function (e) {
                BeerController.sortBeers($(e.target).attr('data-sortable'));
              });

              $(document).on('click', BeerController.view.clearBtn, function (e) {
                BeerController.clearBeer(e);
              });

              $(document).on('click', '.my-beers', function (e) {
                BeerController.getMyBeers(e);
              });

              $(document).bindDelay('keyup', '.beer-impression', function(e) {
                if($(e.target).hasClass('beer-impression'))
                  BeerController.editImpression(e.target);
              }, 1000);

              $(document).on('click', BeerController.view.menu, function (e) {
                BeerController.view.hideMenus(e);
              });

              $(document).on('click', function (e) {
                BeerController.view.hideMenus(e);
              });

              $(document).on('scroll', function (e) {
                BeerController.handleScroll(e);
              })
            });
        </script>
    </body>
</html>
