const backend_url = "http://localhost:3000" 

const jobs = {
    'Software Developer':
        [
            'Computer Science SL',
            'Mathematics AA HL',
            'Physics HL',
            'Digital Societies HL',
            'English A SL',
            'Russian A SL'
        ],

    'Medical Doctor':
        [
            'Biology HL',
            'Chemistry HL',
            'Russian A SL',
            'Mathematics AA SL',
            'Antropology HL',
            'English A SL'
        ],

    'Data Scientist':
        [
            'English B HL',
            'Computer Science SL',
            'Physics SL',
            'Mathematics AI HL',
            'Digital Societies HL',
            'Russian A SL'
        ],

    'Financial Analyst':
        [
            'Mathematics AI SL',
            'Business and Management HL',
            'Economics HL',
            'English B HL',
            'Russian A SL',
            'Digital Societiy SL'
        ],

    'Marketing Manager':
        [
            'Business and Management HL',
            'Economics SL',
            'Mathematics AA SL',
            'English B HL',
            'Russian A SL',
            'Digital Society HL'
        ],

    'Civil Engineer':
        [
            'Physics HL',
            'Computer science SL',
            'Mathematics AA HL',
            'English B HL',
            'Digital societies SL',
            'Russian A SL'
        ],

    'Cybersecurity Specialist':
        [
            'Computer Science SL',
            'Mathematics AA HL',
            'Russian A SL',
            'Digital Societies HL',
            'Business and Management HL',
            'English A SL'
        ],

    'Pharmacist':
        [
            'Biology HL',
            'Chemistry HL',
            'Mathematics AA SL',
            'English A SL',
            'Business and Management HL',
            'Russian A SL'
        ],

    'Attorney':
        [
            'English A SL',
            'History HL',
            'Business and Management HL',
            'Economics SL',
            'Geography HL',
            'Russian A SL'
        ],

    'Environmental Scientist':
        [
            'Biology HL',
            'Chemistry HL',
            'Antropology HL',
            'Geography SL',
            'Mathematics AI SL',
            'Russian A SL'
        ],

    'Surgeon':
        [
            'Biology HL',
            'Chemistry HL',
            'Physics SL',
            'Mathematics AA SL',
            'English B HL',
            'Russian A SL'
        ],

    'Human Resources Manager':
        [
            'Business and Management HL',
            'Antropology HL',
            'Russian A SL',
            'English B HL',
            'Mathematics AA SL',
            'Geography SL'
        ],

    'Mechanical Engineer':
        [
            'Physics HL',
            'Mathematics AA HL',
            'Chemistry SL',
            'Computer Science SL',
            'Russian A SL',
            'English B HL'
        ],

    'Registered Nurse':
        [
            'Biology HL',
            'Chemistry HL',
            'Russian A SL',
            'Mathematical AA SL',
            'English B HL',
            'Antropology SL'
        ],

    'Psychiatrist':
        [
            'Biology HL',
            'Antropology HL',
            'Chemistry HL',
            'Mathematics AA SL',
            'English A SL',
            'Russian A SL'
        ],

    'Teacher':
        [
            'English B HL',
            'Antropology HL',
            'Geography HL',
            'Russian A SL',
            'Mathematics AA SL',
            'Economics SL'
        ],

    'Graphic Designer':
        [
            'Visual Arts HL',
            'Russian A SL',
            'Computer Science SL',
            'English B HL',
            'Mathematical AA SL',
            'Antropology HL'
        ],

    'Director':
        [
            'Digital Society SL',
            'Geography SL',
            'Business and Management HL',
            'English B HL',
            'Antropology HL',
            'Russian A SL'
        ],

    'Actor':
        [
            'Antropology HL',
            'English A SL',
            'Visual Arts SL',
            'Geography HL',
            'Digital Society HL',
            'Russian A SL'
        ]
    ,
    'Biomedical Researcher':
        [
            'Biology HL',
            'Chemistry HL',
            'Physics SL',
            'Mathematics AA HL',
            'Russian A SL',
            'Antropology SL'
        ]
}

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


const dev = false; // true if in development environment. disables test for lazy

function loadIntoResults(){
    const prof = document.querySelector('#results_profession')
    const roadmap = document.querySelector('#results_roadmap')
    const dp = document.querySelector("#results_dp");

    const regExpProf = new RegExp(String.raw`Profession: (\w+(\s*\w*)+)`);
    const regExpRoadmap = new RegExp(String.raw`(Roadmap:)([\S\s]*)`);

    const regExProfResult = regExpProf.exec(sessionStorage.gptResponse)
    const regExpRoadmapResult = regExpRoadmap.exec(sessionStorage.gptResponse)
    
    console.log(regExpRoadmapResult)
    prof.innerHTML = regExProfResult[1];
    roadmap.innerHTML = regExpRoadmapResult[2];
    dp.innerHTML = jobs[prof.innerHTML];
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
