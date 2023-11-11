const backend_url = "http://localhost:3000" 

const default_aspects = {
    education: "High school",
    skills: "Programming",
    interests: "Programming",
    workExperience: "None",
    values: "Money",
    env: "High pace",
    goals: "Money",
    geo: "United States",
    lifestyle: "Night Owl",
    challenges: "None",
}

const dev = true; // true if in development environment. disables test for lazy

function loadIntoResults(){
    let prof = document.querySelector('#results_profession')
    const regExp = new RegExp(String.raw`Profession: (\w+(\s*\w*)+)`)
    const regExpResult = regExp.exec(sessionStorage.gptResponse)
    console.log(sessionStorage.gptResponse)
    console.log(regExpResult)
    prof.innerHTML = regExpResult[1];
}

function navigateToNextBranch(nextPage, key) {
    if (dev){
        postData(true)
        return
    }

    sessionStorage[key] = document.getElementById(key).value;
    console.log(sessionStorage[key])
    if (nextPage == "../result.html"){
        postData(false)
    } else {
        window.location.href = nextPage;
    }
    
}

function postData(lazy) {
    const route = "/api/test"
    let httpRequest = false;

    httpRequest = new XMLHttpRequest();
    if (httpRequest.overrideMimeType) {
        httpRequest.overrideMimeType('text/xml');
    }

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE){
            if (this.status == 200){
                //redirect
                let res = JSON.parse(httpRequest.response)
                sessionStorage.gptResponse = res.receivedData
                window.location.href = "../result.html"
                
            } else {
                console.log("Critical error when contacting backend.")
            }
        }
        
    };
    httpRequest.open('POST', backend_url + route, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    if (lazy) {
        httpRequest.send ( JSON.stringify(default_aspects) )
    }
    else {
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
}
