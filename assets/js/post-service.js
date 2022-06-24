var PostService = {
    topic_id: "",

    init: function(){
        var token = localStorage.getItem("token");
        if (!token)
            window.location.replace("login.html");

        topic_id = getUrlParameter('topic');
        let poster;

        $.ajax({
            url: "../api/topics/" + topic_id,
            type: "GET",
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function(data) {
                $("#topicNameHeader").text(data['name']);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                toastr.error(XMLHttpRequest.responseJSON.message);
                AccountService.logout();
            }
        });

        $.ajax({
            url: "../api/topics/posts/" + topic_id,
            type: "GET",
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function(data) {
                $("#topicPostContainer").html("");
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
                <div class="pt-4">
                    <div class="card">
                        <div class="card-body d-flex align-items-center justify-content-center justify-content-lg-start">
                            <div class="d-flex flex-wrap align-items-center col-1">
                                <div class="col-12 text-center">
                                    <a id="upvote` + data[i].id + `" onclick="PostService.like(` + data[i].id + `)" href="#" class="text-decoration-none upvote` + ((data[i].voteByUser == 1) ? ' upvoted' : ' text-dark') + `"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-up-circle" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                                        </svg>
                                    </a>
                                </div>
                                <div class="col-12 text-center">
                                    <h5 id="points` + data[i].id + `" class="pb-2 pt-1" style="margin: 0 !important;">` + data[i].votes + `</h5>
                                </div>
                                <div class="col-12 text-center">
                                    <a id="downvote` + data[i].id + `" onclick="PostService.dislike(` + data[i].id + `)" href="#" class="text-decoration-none downvote` + ((data[i].voteByUser == -1) ? ' downvoted' : ' text-dark') + `"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div class="col-11">
                                <h5 class="card-title"><a href="post.html?post=` + data[i].id + `" class="text-dark text-decoration-none">` + data[i].title + `</a></h5>
                                <p class="card-text">by: <a href="profile.html?id=` + poster.id + `" class="text-decoration-none username">` + poster.username + `</a></p>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                }
                $("#topicPostContainer").html(html);
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest.responseJSON.message);
                AccountService.logout();
            }
        });

        $.ajax({
            url: "../api/accounts/subscriptions/list",
            type: "GET",
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function(data) {
                $("#yourTopicsList").html("");
                var html = "";
                let idList = [];
                for(let i = 0; i < data.length; i++){
                    idList.push(data[i].id);
                    html += `<a href="index.html?topic=` + data[i].id + `" class="list-group-item list-group-item-action" id="` + data[i].id + `">` + data[i].name + `</a>`;
                }

                if(idList.includes(parseInt(topic_id))){
                    $('#createPostContainer').removeClass("d-none");
                    $('#leaveButton').removeClass("d-none");
                    $('#joinButton').addClass("d-none");
                } else {
                    $('#createPostContainer').addClass("d-none");
                    $('#leaveButton').addClass("d-none");
                    $('#joinButton').removeClass("d-none");
                }
                $("#yourTopicsList").html(html);
                //set the current topic as active
                $('#' + topic_id).addClass("active");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                toastr.error(XMLHttpRequest.responseJSON.message);
                AccountService.logout();
            }
        });

        $('#submitPostForm').validate({
            submitHandler: function(form) {
                var entity = Object.fromEntries((new FormData(form)).entries());
                entity['topic_id'] = topic_id;

                $('#postTitle').val("");
                $('#postBody').val("");

                PostService.create(entity);
            }
        });
    },

    create: function(entity) {
        $.ajax({
            url: '../api/posts/create',
            type: 'POST',
            data: JSON.stringify(entity),
            contentType: "application/json",
            dataType: "json",
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function(data) {
                newPostHtml = `
                <div class="pt-4">
                    <div class="card">
                        <div class="card-body d-flex align-items-center justify-content-center justify-content-lg-start">
                            <div class="d-flex flex-wrap align-items-center col-1">
                                <div class="col-12 text-center">
                                    <a id="upvote` + data.id + `" onclick="PostService.like(` + data.id + `)" href="#" class="text-decoration-none upvote upvoted"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-up-circle" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                                        </svg>
                                    </a>
                                </div>
                                <div class="col-12 text-center">
                                    <h5 id="points` + data.id + `" class="pb-2 pt-1" style="margin: 0 !important;">1</h5>
                                </div>
                                <div class="col-12 text-center">
                                    <a id="downvote` + data.id + `" onclick="PostService.dislike(` + data.id + `)" href="#" class="text-dark text-decoration-none downvote"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div class="col-11">
                                <h5 class="card-title"><a href="post.html?post=` + data[i].id + `" class="text-dark text-decoration-none">` + data.title + `</a></h5>
                                <p class="card-text">by: <a href="profile.html?id=user" class="text-decoration-none username">` + data.username + `</a></p>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                html = newPostHtml;
                html += $("#topicPostContainer").html();
                $("#topicPostContainer").html(html);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                toastr.error(XMLHttpRequest.responseJSON.message);
            }
        });
    },

    subscribe: function() {
        TopicService.join(topic_id);
        $('#createPostContainer').removeClass("d-none");
        $('#leaveButton').removeClass("d-none");
        $('#joinButton').addClass("d-none");
    },

    unsubscribe: function() {
        TopicService.leave(topic_id);
        $('#createPostContainer').addClass("d-none");
        $('#leaveButton').addClass("d-none");
        $('#joinButton').removeClass("d-none");
    },

    like: function(post_id) {
        $.ajax({
            url: "../api/posts/vote/" + post_id,
            type: "POST",
            data: JSON.stringify({"type": 1}),
            contentType: "application/json",
            dataType: "json",
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function() {
                let current = parseInt($('#points' + post_id).text());
                //apply upvote to point count
                current++;

                if($('#downvote' + post_id).hasClass('downvoted')){
                    $('#downvote' + post_id).addClass("text-dark");
                    $('#downvote' + post_id).removeClass("downvoted");
                    //if post was previously downvoted, remove that downvote too
                    current++;
                }
                $('#upvote' + post_id).addClass("upvoted");
                $('#upvote' + post_id).removeClass("text-dark");
                $('#points' + post_id).text(current.toString());
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest.responseJSON.message);
                AccountService.logout();
            }
        });
    },

    dislike: function(post_id) {
        $.ajax({
            url: "../api/posts/vote/" + post_id,
            type: "POST",
            data: JSON.stringify({"type": -1}),
            contentType: "application/json",
            dataType: "json",
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function() {
                let current = parseInt($('#points' + post_id).text());
                //apply downvote to point count
                current--;

                if($('#upvote' + post_id).hasClass('upvoted')){
                    $('#upvote' + post_id).addClass("text-dark");
                    $('#upvote' + post_id).removeClass("upvoted");
                    //if post was previously upvoted, remove that upvote too
                    current--;
                }
                $('#downvote' + post_id).addClass("downvoted");
                $('#downvote' + post_id).removeClass("text-dark");
                $('#points' + post_id).text(current.toString());
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest.responseJSON.message);
                AccountService.logout();
            }
        });
    }
  }
  