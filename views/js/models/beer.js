function Beer (data) {
    var params = data;

    var beer = {
        model: Model(),
        url: 'beerController.php',
        find: function (params, callback) {
            this.model.call(this.url, 'beers', params, callback);
        },
        edit: function (params, callback) {
            this.model.call(this.url, 'edit', params, callback);
        },
        fetch: function (params, callback) {
          this.model.call(this.url, 'mine', params, callback);
        }
    };

    return beer;
}