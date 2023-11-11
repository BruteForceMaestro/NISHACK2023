
function navigateToNextBranch(nextPage, key) {

    sessionStorage[key] = document.getElementById(key).value;

    console.log(sessionStorage[key])
}

function postData() {
    fetch('/api/test', {
        method: 'POST',
        body: JSON.stringify({ professionAspects }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                // Parse the JSON response
                return response.json();
            } else {
                // Handle the case where the server returns an error
                throw new Error('Server response was not OK');
            }
        })
        .then(data => {
            // Handle the data received from the server
            console.log('Server response:', data);
        })
        .catch(error => {
            // Handle network errors or errors from the server
            console.error('Error:', error);
        });
}
