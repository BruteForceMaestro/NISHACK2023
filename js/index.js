
const backend_url = "http://localhost:3000" 
const username = ""

function saveAuthToken(authToken){

    sessionStorage.authToken = authToken
}

function onAccountLoad(){
    console.log("does this even run")
    let route = "/api/users/" + sessionStorage.username

    console.log(route)

    if (sessionStorage.authToken == undefined){
        console.log("unloaded authtoken??")
        return;
    }

    httpRequest = new XMLHttpRequest();
    if (httpRequest.overrideMimeType) {
        httpRequest.overrideMimeType('text/xml');
    }

    
    httpRequest.open('GET', backend_url + route, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.setRequestHeader("authorization", "Bearer " + sessionStorage.authToken);
    httpRequest.send();

    httpRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            let username = document.getElementById("acc_username")
            let first_name = document.getElementById("acc_fullname")
            let age = document.getElementById("acc_age")
            let email = document.getElementById("acc_email")
            let profession = document.getElementById("acc_profession")
            let roadmap = document.getElementById("acc_roadmap")
            console.log(httpRequest.response)
            // window.location.href = "test/greeting.html"
            let userObject = JSON.parse(httpRequest.response)
            username.innerHTML = userObject.username;
            first_name.innerHTML = userObject.first_name;
            age.innerHTML = userObject.age;
            email.innerHTML = userObject.email;
            profession.innerHTML = "not implemented.";
            roadmap.innerHTML = userObject.roadmap;


        } 
    };
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

    httpRequest.open('POST', backend_url + route, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    
    httpRequest.send( JSON.stringify({ username: username, password: password }) );

    
    httpRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            let resp = JSON.parse(httpRequest.response);
            console.log(resp.accessToken)
            sessionStorage.username = username;
            saveAuthToken(resp.accessToken) 
            // window.location.href = "test/greeting.html"
        } 
    };
    

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