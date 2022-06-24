var TopicService = {
    init: function(){
        var token = localStorage.getItem("token");
        if (!token)
            window.location.replace("login.html");

        $.ajax({
            url: "../api/accounts/subscriptions/list",
            type: "GET",
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function(data) {
                $("#topicTableBody").html("");
                var html = "";
                for(let i = 0; i < data.length; i++){
                html += `
                <tr>
                    <td>
                        <a href="index.html?topic=` + data[i].id + `" class="text-decoration-none topic-name">
                            <h5 style="margin: 0 !important;">` + data[i].name + `</h5>
                        </a>
                    </td>
                </tr>
                `;
                }
                $("#topicTableBody").html(html);
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest.responseJSON.message);
                AccountService.logout();
            }
        });
    },

    join: function(topic_id){
        $.ajax({
            url: "../api/topics/subscribe/" + topic_id,
            type: "POST",
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function(XMLHttpRequest) {
                toastr.success(XMLHttpRequest.message);
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest.responseJSON.message);
                AccountService.logout();
            }
        });
    },

    leave: function(){
        $.ajax({
            url: "../api/topics/unsubscribe/" + topic_id,
            type: "DELETE",
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest.message);
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest.responseJSON.message);
                AccountService.logout();
            }
        });
    }
  }
  