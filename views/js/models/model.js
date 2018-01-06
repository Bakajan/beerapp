function Model () {
    var model = {
        baseUrl: "/beerapp/controller/",
        call: function (path, action, params, callback) {
          if(!params) params = {};
            params.action = action;

            $.ajax({
                url: this.baseUrl + path,
                data: params,
                method: "POST",
                dataType: 'json',
                success: function (data) {
                    callback(data);
                },
                error: function (xhr, status, err) {
                    var error = {
                      type: 'failure',
                      message: status + ': ' + xhr + ': ' + err
                    };
                    callback(error);
                }
            });
        }
    };

    return model;
}