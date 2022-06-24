var ProfileService = {
    init: function(){
        var token = localStorage.getItem("token");
        if (!token){
        window.location.replace("login.html");
        }

        var account_id = getUrlParameter('id');
        console.log(account_id);
        if(account_id == 'user'){
            $('#yourProfileHead').removeClass("d-none");
            $('#profileNavLink').addClass("active");
        } else {
            $('#yourProfileHead').addClass("d-none");
            $('#profileNavLink').removeClass("active");
        }
            
        $.ajax({
        url: "../api/profile/" + account_id,
        type: "GET",
        beforeSend: function(xhr){
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
        },
        success: function(data) {
            $('#usernameDisplay').text(data['username']);
            $('#pointsDisplay').text(data['points']);
            $('#topicCountDisplay').text(data['topics']);
            $('#postCountDisplay').text(data['posts']);
            $('#commentCountDisplay').text(data['comments']);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            toastr.error(XMLHttpRequest.responseJSON.message);
            AccountService.logout();
        }
        });
    },

    view: function(id){
        window.location.replace("profile.html?id=" + id);
    },
  }
  