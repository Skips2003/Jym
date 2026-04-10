
async function getString(apiString, infoString){

    if (infoString !== undefined){
        apiString = apiString + infoString
    }

    const response = await fetch(apiString, {
        method: 'GET',
        headers:{ 
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById("csrf-token").content
        },
    });

    const data = await response.json();
    console.log("Data Found:", data);
    return data
}

async function postString(apiString, infoString, bodyInfo){

    if (infoString !== undefined){
        apiString = apiString + infoString
    }

    const response = await fetch(apiString, {
        method: 'POST',
        headers:{ 
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById("csrf-token").content
        },
        body: JSON.stringify(bodyInfo)
    });

    const data = await response.json();
    console.log("Insert Completed:", data);
    return data
}

async function putString(apiString, infoString, bodyInfo){

    if (infoString !== undefined){
        apiString = apiString + infoString
    }

    const response = await fetch(apiString, {
        method: 'PUT',
        headers:{ 
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById("csrf-token").content
        },
        body: JSON.stringify(bodyInfo)
    });

    const data = await response.json();
    console.log("Update Complete:", data);
}

async function deleteString(apiString, infoString){
    if (infoString !== undefined){
        apiString = apiString + infoString
    }
    
    const response = await fetch(apiString, {
        method: 'DELETE',
        headers:{ 
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById("csrf-token").content
        },
    });
    
    const data = await response.json();
    console.log("Deletion Complete:", data);
}