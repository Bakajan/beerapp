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

        <div id="cards-container"></div>

        <div id="footer" >
         <p>
            <img src="http://s3.amazonaws.com/brewerydb/Powered-By-BreweryDB.png" style="width: 300px;">
            This product uses the BreweryDB API but is not endorsed or certified by PintLabs
         </p>
        </div>

        <script src="/beerapp/views/js/models/model.js"></script>
        <script src="/beerapp/views/js/models/beer.js"></script>
        <script src="/beerapp/views/js/controllers/beercontroller.js"></script>
        <script src="/beerapp/views/js/views/beerview.js"></script>
        <script>
            var BeerController = beerController('{cardtemplate}');
            var timeout;

            $(document).ready(function() {
              $('#search-form').submit(function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                BeerController.getBeers();

                return false;
              });

              $('#search-btn').submit(function (e) {
                BeerController.view.addCard(BeerController.view.card, '1');
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
                var el = this;
                el.style.cssText = 'height:auto; padding:0';
                el.style.cssText = 'height:' + el.scrollHeight + 'px'
              });

              $(document).bindDelay('keyup', '.beer-impression', function(e) {
                if($(e.target).hasClass('beer-impression'))
                  BeerController.editImpression(e.target);
              }, 1000);
            });
        </script>
    </body>
</html>
