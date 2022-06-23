$(document).ready(function(){
    $("button").click(function() {
        $.get("https://in-my-opinion-imo.herokuapp.com/api/accounts/topics/number/2", function(data, status){
            alert("Data: " + data + "\nStatus: " + status);
          });
    })
})