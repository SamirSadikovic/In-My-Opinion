var CommentService = {

    load: function(comment_id) {
        var token = localStorage.getItem("token");
        if (!token)
            window.location.replace("login.html");

        let poster;

        $.ajax({
            url: "../api/posts/comments/" + comment_id,
            type: "GET",
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function(data) {
                $("#commentContainer").html("");
                var html = "";
                for(let i = 0; i < data.length; i++){
                $.ajax({
                    async: false,
                    url: "../api/accounts/" + data[i].account_id,
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
                html += `
                <div class="mt-3 border-bottom">
                    <h5 class="username"><a href="profile.html?id=` + poster.id + `" class="text-decoration-none username"><strong>` + poster.username + `</strong></a></h5>
                    <div class="d-flex">
                        <span>` + data[i].body + `</span>
                    </div>
                    <div class="d-flex flex-row align-items-center">
                        <a id="commentUpvote` + data[i].id + `" onclick="CommentService.like(` + data[i].id + `)" href="#" class="text-decoration-none m-1 upvote` + ((data[i].voteByUser == 1) ? ' upvoted' : ' text-dark') + `">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-up-circle " viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                            </svg>
                        </a>
                        <span id="commentPoints` + data[i].id + `" class="m-1">` + data[i].votes + `</span>
                        <a id="commentDownvote` + data[i].id + `" onclick="CommentService.dislike(` + data[i].id + `)" href="#" class="text-decoration-none m-1 downvote` + ((data[i].voteByUser == -1) ? ' downvoted' : ' text-dark') + `">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                `;
                }
                $("#commentContainer").html(html);
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest.responseJSON.message);
                AccountService.logout();
            }
        });
    },
    
    create: function(entity) {
        $.ajax({
            url: '../api/comments/create',
            type: 'POST',
            data: JSON.stringify(entity),
            contentType: "application/json",
            dataType: "json",
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function(data) {
                newCommentHtml = `
                <div class="mt-3 border-bottom">
                    <h5 class="username"><a href="profile.html?id=user" class="text-decoration-none username"><strong>` + data.username + `</strong></a></h5>
                    <div class="d-flex">
                        <span>` + data.body + `</span>
                    </div>
                    <div class="d-flex flex-row align-items-center">
                        <a id="commentUpvote` + data.id + `" onclick="CommentService.like(` + data.id + `)" href="#" class="text-decoration-none m-1 upvote upvoted">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-up-circle " viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                            </svg>
                        </a>
                        <span id="commentPoints` + data.id + `" class="m-1">1</span>
                        <a id="commentDownvote` + data.id + `" onclick="CommentService.dislike(` + data.id + `)" href="#" class="text-dark text-decoration-none m-1 downvote">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                `;
                html = newCommentHtml;
                html += $("#commentContainer").html();
                $("#commentContainer").html(html);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                toastr.error(XMLHttpRequest.responseJSON.message);
            }
        });
    },

    like: function(comment_id) {
        $.ajax({
            url: "../api/comments/vote/" + comment_id,
            type: "POST",
            data: JSON.stringify({"type": 1}),
            contentType: "application/json",
            dataType: "json",
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function() {
                if($('#commentUpvote' + comment_id).hasClass('upvoted'))
                    return;

                let current = parseInt($('#commentPoints' + comment_id).text());
                //apply upvote to point count
                current++;

                if($('#commentDownvote' + comment_id).hasClass('downvoted')){
                    $('#commentDownvote' + comment_id).addClass("text-dark");
                    $('#commentDownvote' + comment_id).removeClass("downvoted");
                    //if comment was previously downvoted, remove that downvote too
                    current++;
                }

                $('#commentUpvote' + comment_id).addClass("upvoted");
                $('#commentUpvote' + comment_id).removeClass("text-dark");
                $('#commentPoints' + comment_id).text(current.toString());
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest.responseJSON.message);
                AccountService.logout();
            }
        });
    },

    dislike: function(comment_id) {
        $.ajax({
            url: "../api/comments/vote/" + comment_id,
            type: "POST",
            data: JSON.stringify({"type": -1}),
            contentType: "application/json",
            dataType: "json",
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function() {
                if($('#commentDownvote' + comment_id).hasClass('downvoted'))
                    return;
                    

                let current = parseInt($('#commentPoints' + comment_id).text());
                //apply downvote to point count
                current--;

                if($('#commentUpvote' + comment_id).hasClass('upvoted')){
                    $('#commentUpvote' + comment_id).addClass("text-dark");
                    $('#commentUpvote' + comment_id).removeClass("upvoted");
                    //if comment was previously upvoted, remove that upvote too
                    current--;
                }

                $('#commentDownvote' + comment_id).addClass("downvoted");
                $('#commentDownvote' + comment_id).removeClass("text-dark");
                $('#commentPoints' + comment_id).text(current.toString());
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest.responseJSON.message);
                AccountService.logout();
            }
        });
    }
}
  