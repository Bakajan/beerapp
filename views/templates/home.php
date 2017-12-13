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
          </div>
        </form>

        {filters}

        <div id="results">
          <div id="total"></div>
          <div id="filters-used"></div>
          <div id="sortedby"></div>
        </div>

        <div id="cards-container"></div>

        <div id="footer" >
         <p>
            <img src="http://s3.amazonaws.com/brewerydb/Powered-By-BreweryDB.png">
            This product uses the BreweryDB API but is not endorsed or certified by PintLabs
         </p>
        </div>

        <script>
          {model}
          {beermodel}
          {beerview}
          {beercontroller}

            var BeerController = beerController('{cardtemplate}');
            var timeout;

            $(document).ready(function() {
              $(document).click( function (e) {
               BeerController.view.hideList(e);
              });

              $('#search-form').submit(function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                BeerController.getBeers();

                return false;
              });

              $('#search-btn').click(function (e) {
                BeerController.getBeers();
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

              $(document).bindDelay('keyup', '.beer-impression', function(e) {
                if($(e.target).hasClass('beer-impression'))
                  BeerController.editImpression(e.target);
              }, 1000);
            });
        </script>
    </body>
</html>
