function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

class Topic {
    constructor(name, posts) { 
        this.name = name
        this.posts = posts
    }

    addPost(post) {
        this.posts.push(post);
    }
}

class Post {
    constructor(title, body, user, upvotes, downvotes, comments) { 
        this.title = title
        this.body = body
        this.user = user
        this.upvotes = upvotes
        this.downvotes = downvotes
        this.comments = comments
    }

    addComment(comment) {
        this.comments.push(comment)
    }

    upvote(user) {
        let index = this.downvotes.indexOf(user)
        if(!this.upvotes.includes(user)){
            this.upvotes.push(user)
        }
        if(index !== -1){
            this.downvotes.splice(index, 1);
        }
    }

    downvote(user) {
        let index = this.upvotes.indexOf(user)
        if(!this.downvotes.includes(user)){
            this.downvotes.push(user)        
        }
        if(index !== -1){
            this.upvotes.splice(index, 1);
        }
    }

    getPoints() {
        if(this.upvotes.length > 0 && this.downvote.length > 0)
            return this.upvotes.length - this.downvotes.length
        else
            return 0
    }
}

class Comment {
    constructor(body, user, upvotes, downvotes) { 
        this.body = body
        this.user = user
        this.upvotes = upvotes
        this.downvotes = downvotes
    }

    upvote(user) {
        this.upvotes.push(user)
    }

    downvote(user) {
        this.downvotes.push(user)
    }
}

class User {
    constructor(name, email, password, points, postCount, commentCount, topics) { 
        this.name = name
        this.password = password
        this.email = email
        this.points = points
        this.postCount = postCount
        this.commentCount = commentCount
        this.topics = topics
    }

    subscribe(topic) {
        if(!this.topics.includes(topic))
            this.topics.push(topic)
    }

    unsubscribe(topic) {
        let index = this.topics.indexOf(topic)
        if(this.topics.includes(topic) && index !== -1)
            this.topics.splice(index, 1);
    }
}

topic_se = new Topic("Software engineering", [])
topic_hci = new Topic("Human-computer interaction", [])
topic_fb = new Topic("Football", [])
topic_t = new Topic("Tennis", [])
topic_mma = new Topic("MMA", [])
topic_bb = new Topic("Bodybuilding", [])
topic_vg = new Topic("Video games", [])

samirS = new User("samirS", "samirS@gmail.com", "passwordexample1", 4, 1, 1, [topic_se, topic_bb, topic_vg, topic_hci])
Vselma = new User("Vselma", "Vselma@gmail.com", "passwordexample1", 2, 1, 0, [topic_hci, topic_t])
GenericUser1 = new User("GenericUser1", "GenericUser1@gmail.com", "passwordexample1", 0, 0, 0, [topic_mma, topic_bb, topic_vg])
robert_smith = new User("robert_smith", "robert_smith@gmail.com", "passwordexample1", 0, 0, 0, [topic_mma, topic_vg])
jackS = new User("jackS", "jackS@gmail.com", "passwordexample1", 0, 0, 0, [topic_se, topic_hci])
gameLover00 = new User("gameLover00", "gameLover00@gmail.com", "passwordexample1", 0, 0, 0, [])
sampleUsername = new User("sampleUsername", "sampleUsername@gmail.com", "passwordexample1", 0, 0, 0, [topic_se, topic_hci, topic_t])
nekoooooo = new User("nekoooooo", "nekoooooo@gmail.com", "passwordexample1", 0, 0, 0, [topic_t, topic_hci])
yesyesyes = new User("yesyesyes", "yesyesyes@gmail.com", "passwordexample1", 0, 0, 0, [topic_bb, topic_vg])

topic_se_posts = [
    new Post(
        "Software engineering as a science",
        "Software engineering is the branch of computer science that deals with the design, development, testing, and maintenance of software applications. \
        Software engineers apply engineering principles and knowledge of programming languages to build software solutions for end users.",
        samirS,
        [ samirS, jackS, sampleUsername ],
        [],
        [
            new Comment(
                "Very interesting topic!",
                jackS,
                [ samirS, jackS ],
                [ sampleUsername ]
            )
        ]
    ),
    new Post(
        "Difference Between Software Engineering and Computer Science",
        "Software engineering is defined as a process of analyzing user requirements and then designing, building, and testing software applications. \
        Computer science is a discipline that involves the design and understanding of computers and computational processes.",
        jackS,
        [ jackS ],
        [ sampleUsername ],
        []
    )
]
topic_hci_posts = [
    new Post(
        "What is Human-Computer Interaction (HCI)?",
        "Human-computer interaction (HCI) is a multidisciplinary field of study focusing on the design of computer technology and, in particular, the \
        interaction between humans (the users) and computers. While initially concerned with computers, HCI has since expanded to cover almost all forms of \
        information technology design.",
        Vselma,
        [ nekoooooo, sampleUsername ],
        [],
        [
            new Comment(
                "Sounds cool!",
                sampleUsername,
                [ Vselma, sampleUsername ],
                []
            ),
            new Comment(
                "Interesting topic!",
                samirS,
                [ Vselma ],
                []
            )
        ]
    ),
]
topic_fb_posts = []
topic_t_posts = []
topic_mma_posts = []
topic_bb_posts = []
topic_vg_posts = []

for (let i = 0; i < topic_se_posts.length; i++) {
    topic_se.addPost(topic_se_posts[i])
}

for (let i = 0; i < topic_hci_posts.length; i++) {
    topic_hci.addPost(topic_hci_posts[i])
}

users = [
    samirS,
    Vselma,
    GenericUser1,
    robert_smith,
    jackS,
    gameLover00,
    sampleUsername,
    nekoooooo,
    yesyesyes
]

topics = [
    topic_se,
    topic_hci,
    topic_fb,
    topic_t,
    topic_mma,
    topic_bb,
    topic_vg
]

function validateRegister(f) {
    let emailEntered = f.registerUsernameInput.value
    let passwordEntered = f.registerPasswordInput.value
    let username = f.registerUsernameInput.value

    user = new User(username, emailEntered, passwordEntered, 0, 0, 0, [topic_hci] )
    users.push(user)

    createCookie("sessionCookie", user.name, 1)
    window.location = "../index.html";
    for(let i = 0; i < 999999999; i++){}
}

function validateLogIn(f) {
    let emailEntered = f.logInEmailInput.value
    let passwordEntered = f.logInPasswordInput.value
    let user = null;

    for (let i = 0; i < users.length; i++)
        if(emailEntered == users[i].email && passwordEntered == users[i].password)
            user = users[i]

    if(user != null){
        createCookie("sessionCookie", user.name, 1)
        window.location = "../index.html";
    }
    else{
        console.log("not successful")
    }
    for(let i = 0; i < 999999999; i++){}
}

function submitPost(f) {
    let title = f.postTitle.value
    let body = f.postBody.value
    let user, topic

    let name = readCookie("sessionCookie")
    for (let i = 0; i < users.length; i++)
        if(name == users[i].name)
            user = users[i]

    let topicName = readCookie("topicCookie")
    for (let i = 0; i < topics.length; i++)
        if(topicName == topics[i].name)
            topic = topics[i]

    console.log(topic.name)
    for(let i = 0; i < 999999999; i++){}
    topic.addPost(new Post(title, body, user, 0, 0, []))
    let container = document.getElementById("topicPostContainer")
    loadPosts(user, topic, container)
}

function loadPosts(user, topic, container) {
        container.innerHTML = ""
        let posts = topic.posts
        
        for (let i = 0; i < posts.length; i++){
            let upvoteIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" fill=\"currentColor\" class=\"bi bi-arrow-up-circle\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z\"/></svg>"
            let downvoteIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" fill=\"currentColor\" class=\"bi bi-arrow-down-circle\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z\"/></svg>"
            let first, second, third, fourth, fifth1, fifth2, fifth3, sixth
            let upvoteLink, downvoteLink, points, usernameLink, titleLink, titleWrapper, usernameWrapper
    
            first = document.createElement('div')
            first.classList.add('pt-4');
    
            second = document.createElement('div')
            second.classList.add('card');
    
            third = document.createElement('div')
            third.classList.add('card-body', 'd-flex', 'align-items-center', 'justify-content-center', 'justify-content-lg-start');
    
            fourth = document.createElement('div')
            fourth.classList.add('d-flex', 'flex-wrap', 'align-items-center', 'col-1');
    
            fifth1 = document.createElement('div')
            fifth1.classList.add('col-12', 'text-center');
            fifth2 = document.createElement('div')
            fifth2.classList.add('col-12', 'text-center');
            fifth3 = document.createElement('div')
            fifth3.classList.add('col-12', 'text-center');
    
            sixth = document.createElement('div')
            sixth.classList.add('col-11');
    
            points = document.createElement('h5')
            points.classList.add('pt-1')
            points.style.margin = '0 !important;'
            points.innerHTML = posts[i].getPoints()
    
            upvoteLink = document.createElement('a')
            upvoteLink.innerHTML = upvoteIcon
            upvoteLink.classList.add('text-dark', 'text-decoration-none', 'upvote');
            upvoteLink.href = '#'
            upvoteLink.onclick = function() {
                posts[i].upvote(user)
                points.innerHTML = posts[i].getPoints()
            }
    
            downvoteLink = document.createElement('a')
            downvoteLink.innerHTML = downvoteIcon
            downvoteLink.classList.add('text-dark', 'text-decoration-none', 'downvote')
            downvoteLink.href = '#'
            downvoteLink.onclick = function() {
                posts[i].downvote(user)
                points.innerHTML = posts[i].getPoints()
            }
    
            titleWrapper = document.createElement('h5')
            titleWrapper.classList.add('card-title')
    
            usernameWrapper = document.createElement('p')
            usernameWrapper.classList.add('card-text')
    
            titleLink = document.createElement('a')
            titleLink.classList.add('text-dark', 'text-decoration-none')
            titleLink.href = "pages/post.html"
            titleLink.innerHTML = posts[i].title
    
            usernameLink = document.createElement('a')
            usernameLink.classList.add('text-decoration-none', 'username')
            usernameLink.href = "pages/profile.html"
            usernameLink.innerHTML = posts[i].user.name
    
            //appending
            titleWrapper.appendChild(titleLink)
            usernameWrapper.appendChild(usernameLink)
    
            sixth.appendChild(titleWrapper)
            sixth.appendChild(usernameWrapper)
    
            fifth3.appendChild(downvoteLink)
            fifth2.appendChild(points)
            fifth1.appendChild(upvoteLink)
            
            fourth.appendChild(fifth1)
            fourth.appendChild(fifth2)
            fourth.appendChild(fifth3)
    
            third.appendChild(fourth)
            third.appendChild(sixth)
    
            second.appendChild(third)
    
            first.appendChild(second)
    
            container.appendChild(first)
        }
}

function indexLoad() {
    let name = readCookie("sessionCookie")
    let user, topic
    for (let i = 0; i < users.length; i++)
        if(name == users[i].name)
            user = users[i]

    let indexOf = window.location.href.indexOf("=")
    
    if(indexOf == -1){
        if(user.topics.length > 0)
            topic = user.topics[0]
        else
            topic = topics_hci
    } else {
        let topicToLoad = decodeURIComponent( window.location.href.substring(indexOf+1) );
        for (let i = 0; i < user.topics.length; i++){
            if(topicToLoad == user.topics[i].name)
                topic = user.topics[i]
        }
    }

    let container = document.getElementById("topicPostContainer")
    
    loadPosts(user, topic, container)

    let offcanvasContainer = document.getElementById("yourTopicsList")
    //create your topics offcanvas
    for (let i = 0; i < user.topics.length; i++){
        let topicLink = document.createElement('a')
        topicLink.innerHTML = user.topics[i].name
        topicLink.href = 'index.html?topic='.concat(user.topics[i].name)
        topicLink.classList.add('list-group-item', 'list-group-item-action');
        if(topic.name == user.topics[i].name)
            topicLink.classList.add('active');
        topicLink.onclick = function() { loadTopic(topic) }
        offcanvasContainer.appendChild(topicLink)
    }

    document.getElementById("topicNameHeader").textContent = topic.name

    let joinButton = document.getElementById('joinButton')
    let leaveButton = document.getElementById('leaveButton')

    joinButton.onclick = function() {
        user.subscribe(topic)
        this.classList.add('d-none');
        leaveButton.classList.remove('d-none');
        document.getElementById('createPostContainer').classList.remove('d-none');
    }

    leaveButton.onclick = function() {
        user.unsubscribe(topic)
        this.classList.add('d-none');
        joinButton.classList.remove('d-none');
        document.getElementById('createPostContainer').classList.add('d-none');
    }

    // console.log(user.topics.includes(topic))
    // for(let i = 0; i < 999999999; i++){}
    if(user.topics.includes(topic)){
        joinButton.classList.add('d-none');
        leaveButton.classList.remove('d-none');
        document.getElementById('createPostContainer').classList.remove('d-none');
    } else {
        leaveButton.classList.add('d-none');
        joinButton.classList.remove('d-none');
        document.getElementById('createPostContainer').classList.add('d-none');
    }
        

}

function topicsLoad() {
    let name = readCookie("sessionCookie")
    let user, topic, posts

    for (let i = 0; i < users.length; i++)
        if(name == users[i].name)
            user = users[i]

    if(user.topics.length > 0)
        topic = user.topics[0]
    else
        topic = topics_hci
    
    let tbody = document.getElementById("topicTableBody")
    for (let i = 0; i < user.topics.length; i++){
        let row = document.createElement('tr')
        let cell = document.createElement('td')
        let topicLinkCell = document.createElement('a')
        topicLinkCell.classList.add('topic-name', 'text-decoration-none');
        topicLinkCell.href = '../index.html?topic='.concat(user.topics[i].name)
        let topicLabel = document.createElement('h5')
        topicLabel.innerHTML = user.topics[i].name
        topicLabel.style.margin = '0 !important;'
        topicLinkCell.appendChild(topicLabel)
        cell.appendChild(topicLinkCell)
        row.appendChild(cell)
        tbody.appendChild(row)
    }


}

function postLoad() {
    let name = readCookie("sessionCookie")
    let user, post
    for (let i = 0; i < users.length; i++)
        if(name == users[i].name)
            user = users[i]

    let indexOf = window.location.href.indexOf("=")
    let postToLoad = decodeURIComponent( window.location.href.substring(indexOf+1) );
    for (let i = 0; i < user.posts.length; i++){
        if(postToLoad == user.posts[i].name)
            post = user.posts[i]
    }


}

function profileLoad() {
    let name = readCookie("sessionCookie")
    let user
    for (let i = 0; i < users.length; i++)
        if(name == users[i].name)
            user = users[i]

    document.getElementById('usernameDisplay').innerHTML = user.name
    document.getElementById('pointsDisplay').innerHTML = user.points
    document.getElementById('postCountDisplay').innerHTML = user.postCount
    document.getElementById('commentCountDisplay').innerHTML = user.commentCount
    document.getElementById('topicCountDisplay').innerHTML = user.topics.length
}