let auth_token = "";
const backend_url = "http://localhost:3000" 
const username = ""

function saveAuthToken(authToken){

    sessionStorage.authToken = authToken
}

function onAccountLoad(){
    console.log("does this even run")
    let route = "/api/users/" + sessionStorage.username

    if (sessionStorage.authToken == undefined){
        console.log("unloaded authtoken??")
        return;
    }

    httpRequest = new XMLHttpRequest();
    if (httpRequest.overrideMimeType) {
        httpRequest.overrideMimeType('text/xml');
    }

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE && this.status == 200){
            let username = document.getElementById("acc_username")
            console.log(username)
            let first_name = document.getElementById("acc_fullname")
            let age = document.getElementById("acc_age")
            let email = document.getElementById("acc_email")
            let profession = document.getElementById("acc_profession")
            let roadmap = document.getElementById("acc_roadmap")
            // window.location.href = "test/greeting.html"
            username.innerHTML = httpRequest.response.username;
            first_name.innerHTML = httpRequest.response.first_name;
            age.innerHTML = httpRequest.response.age;
            email.innerHTML = httpRequest.response.email;
            profession.innerHTML = "not implemented.";
            roadmap.innerHTML = httpRequest.response.roadmap;


        } 
    };
    httpRequest.open('GET', backend_url + route, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    
    httpRequest.setRequestHeader("authorization", "Bearer " + sessionStorage.accessToken);
    httpRequest.send()
}

/**
 * Tries contacting backend to log in to an existing account.
 * Sends a POST request to /api/users/login
 */
function tryLogIn(){
    const route = "/api/users/login/"
    let httpRequest = false;

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    httpRequest = new XMLHttpRequest();
    if (httpRequest.overrideMimeType) {
        httpRequest.overrideMimeType('text/xml');
    }

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE && this.status == 200){
            sessionStorage.username = username;
            saveAuthToken(httpRequest.response.accessToken) 
            // window.location.href = "test/greeting.html"
        } 
    };
    httpRequest.open('POST', backend_url + route, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    
    httpRequest.send( JSON.stringify({ username: username, password: password }) );

    

}

function tryGetUserInfo() {
    const route = "/api/users/"
}

function tryRegister(){
    const route = "/api/users/"
    let httpRequest = false;

    let username = document.getElementById("username").value
    console.log(username)
    let first_name = document.getElementById("first_name").value
    let last_name = document.getElementById("last_name").value
    let age = document.getElementById("age").value
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    httpRequest = new XMLHttpRequest();
    if (httpRequest.overrideMimeType) {
        httpRequest.overrideMimeType('text/xml');
    }

    console.log(backend_url + route)

    httpRequest.open('POST', backend_url + route, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send( JSON.stringify({ username: username, password: password, email: email, age: age, last_name: last_name, first_name: first_name }) )

    httpRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            window.location.href = "./index.html"

        } else {
            console.log(JSON.parse(this.response).detail)
            document.getElementById("registerError").innerText = JSON.parse(this.response).detail
        }
    };
    

}