const backend_url = "http://localhost:3000" 



function navigateToNextBranch(nextPage, key) {

    sessionStorage[key] = document.getElementById(key).value;

    console.log(sessionStorage[key])
}

function postData() {
    const route = "/api/test"
    let httpRequest = false;

    httpRequest = new XMLHttpRequest();
    if (httpRequest.overrideMimeType) {
        httpRequest.overrideMimeType('text/xml');
    }

    httpRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            saveAuthToken(httpRequest) 
            window.location.href = "test/greeting.html"
        } 
    };
    httpRequest.open('POST', backend_url + route, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send( JSON.stringify(
        {
            education: sessionStorage.education,
            skills: sessionStorage.skills,
            interests: sessionStorage.interests,
            workExperience: sessionStorage.workExperience,
            values: sessionStorage.values,
            env: sessionStorage.env,
            goals: sessionStorage.goals,
            geo: sessionStorage.geo,
            lifestyle: sessionStorage.lifestyle,
            challenges: sessionStorage.challenges,
        }
    ) );
}
