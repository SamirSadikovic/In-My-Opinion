var PostDetailService = {
    post_id: "",

    init: function(){
        var token = localStorage.getItem("token");
        if (!token)
            window.location.replace("login.html");

        post_id = getUrlParameter('post');
        let poster

        $.ajax({
            url: "../api/posts/" + post_id,
            type: "GET",
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function(data) {
                $.ajax({
                    async: false,
                    url: "../api/accounts/" + data.account_id,
                    type: "GET",
                    beforeSend: function(xhr){
                        xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
                    },
                    success: function(data) {
                        poster = data;
                    },
                    error: function(XMLHttpRequest) {
                        toastr.error(XMLHttpRequest.responseJSON.message);
                        AccountService.logout();
                    }
                });

                var html = `
                <div class="d-flex flex-column flex-grow-0 align-items-center pt-3">
                    <a id="upvote` + data.id + `" onclick="PostService.like(` + data.id + `)" href="#" class="text-decoration-none upvote` + ((data.voteByUser == 1) ? ' upvoted' : ' text-dark') + `">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-up-circle" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                        </svg>
                    </a>
                    <h5 id="points` + data.id + `" class="pb-1 pt-1" style="margin: 0 !important;">` + data.votes + `</h5>
                    <a id="downvote` + data.id + `" onclick="PostService.dislike(` + data.id + `)" href="#" class="text-decoration-none downvote` + ((data.voteByUser == -1) ? ' downvoted' : ' text-dark') + `">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                        </svg>
                    </a>
                    <a href="profile.html?id=` + poster.id + `" class="text-decoration-none username pt-2">` + poster.username + `</a>
                </div>
                <div class="d-flex flex-column ml-3 p-3">
                    <div class="d-flex flex-row post-title border-bottom">
                        <h5 class="pb-2" style="margin: 0 !important;">` + data.title + `</h5>
                    </div>
                    <div class="d-flex flex-row post-title pt-2">
                        <span>` + data.body + `</span>
                    </div>
                </div>
                `;
                $("#postContainer").html(html);
                CommentService.load(post_id);      
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                toastr.error(XMLHttpRequest.responseJSON.message);
                AccountService.logout();
            }
        });

        $('#submitCommentForm').validate({
            submitHandler: function(form) {
                var entity = Object.fromEntries((new FormData(form)).entries());
                entity['post_id'] = post_id;

                $('#commentBody').val("");
                
                CommentService.create(entity);
            }
        });  
    }
  }
  