let auth_token = "";
const backend_url = "http://localhost:3000" 

function saveAuthToken(authToken){
    auth_token = authToken
}

/**
 * Tries contacting backend to log in to an existing account.
 * Sends a POST request to /api/users/login
 */
function tryLogIn(){
    const route = "/api/users/login/"
    let httpRequest = false;

    let username = document.getElementById("username").value;
    console.log(username)

    let password = document.getElementById("password").value;
    console.log(password)
    
    httpRequest = new XMLHttpRequest();
    if (httpRequest.overrideMimeType) {
        httpRequest.overrideMimeType('text/xml');
        // Читайте ниже об этой строке
    }

    httpRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            saveAuthToken(httpRequest) 
        } 
    };
    httpRequest.open('POST', backend_url + route, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send( JSON.stringify({ username: username, password: password }) );

    

}