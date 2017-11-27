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
                    if(data.status === 'failure') {
                        console.log(JSON.stringify(data));
                    }
                    else
                        callback(data);
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                    console.log(status);
                    console.log(error);
                }
            });
        }
    };

    return model;
}