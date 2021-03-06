var AccountService = {
    init: function(){
      var token = localStorage.getItem("token");
      if (token)
        window.location.replace("index.html?topic=1");

      $('#loginForm').validate({
        submitHandler: function(form) {
          var entity = Object.fromEntries((new FormData(form)).entries());
          AccountService.login(entity);
        }
      });

      $('#registerForm').validate({
        submitHandler: function(form) {
          var entity = Object.fromEntries((new FormData(form)).entries());
          AccountService.register(entity);
        }
      });
    },

    register: function(entity){
      $.ajax({
          url: '../api/register',
          type: 'POST',
          data: JSON.stringify(entity),
          contentType: "application/json",
          dataType: "json",
          success: function(result) {
              localStorage.setItem("token", result.token);
              window.location.replace("index.html?topic=1");
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
              toastr.error(XMLHttpRequest.responseJSON.message);
          }
          });
      },

    login: function(entity){
    $.ajax({
        url: '../api/login',
        type: 'POST',
        data: JSON.stringify(entity),
        contentType: "application/json",
        dataType: "json",
        success: function(result) {
            localStorage.setItem("token", result.token);
            window.location.replace("index.html?topic=1");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            toastr.error(XMLHttpRequest.responseJSON.message);
        }
        });
    },
  
    logout: function(){
      localStorage.clear();
      window.location.replace("login.html");
    },
  }
  