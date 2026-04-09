// edit users Bio
async function saveUserDetails(UID) {
    let newUserInfo ={
        "id": UID,
        "private": document.getElementById("privacyBtn").value,
        "username": document.getElementById("username").value,
        "email": document.getElementById("email").value,
        "firstName": document.getElementById("firstName").value,
        "lastName": document.getElementById("lastName").value,
        "bio": document.getElementById("bio").value
    }

    console.log("Editing User Info: " + newUserInfo)

    await putString('/api/users', infoString=undefined, bodyInfo=newUserInfo);
}

function toggle() {
    privacyToggle = !privacyToggle

    let text = document.getElementById("privacyToggle")
    text.innerHTML = privacyToggle
} 

async function reportUser(UID, reporterID, reporterUsername) {
    jsonBody = {"reporterID": reporterID, "reporterUsername": reporterUsername, "reason": document.getElementById("reason").value}
    const response = await fetch('/api/reports/user/' + UID, {
        method: 'POST',
        headers:{ 
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById("csrf-token").content
        },
        body: JSON.stringify(jsonBody)
    });

    const data = await response.json();
    console.log("Report created", data);
}

// follow user
async function followUser(followerID, followedID){
    jsonBody = {"followerID": followerID, "followedID": followedID}
    const response = await fetch('/api/follow', {
        method: 'POST',
        headers:{ 
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById("csrf-token").content
        },
        body: JSON.stringify(jsonBody)
    });

    const data = await response.json();
    console.log("Follow created", data);

}

// unfollow user
async function unFollowUser(followerID, followedID){
    jsonBody = {"followerID": followerID, "followedID": followedID}
    const response = await fetch('/api/follow', {
        method: 'DELETE',
        headers:{
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById("csrf-token").content
        },
        body: JSON.stringify(jsonBody)
    });

    const data = await response.json();
    console.log("Follow Deleted", data);

}

// check if a connection exists between two users
async function checkFollow(userID, type){
    const title = document.getElementById("followersing");
    const table = document.getElementById("followersingTable");
    let data = undefined;

    if (type == 0){
        const response = await fetch('/api/followed/' + userID, {
            method: 'GET',
            headers:{ 
                'Content-Type': 'application/json',
                'X-CSRFToken': document.getElementById("csrf-token").content
            }
        });

        data = await response.json();
        console.log("Followers found", data);

        title.innerText = "Followers";

    }
    else{
        const response = await fetch('/api/follower/' + userID, {
            method: 'GET',
            headers:{ 
                'Content-Type': 'application/json',
                'X-CSRFToken': document.getElementById("csrf-token").content
            }
        });

        data = await response.json();
        console.log("Follows found", data);

        title.innerText = "Following";

    }

    data.forEach(user => {
        table.insertRow(-1).innerHTML = `
        <td>
            <a href="${profileUrlBase}/${user.username}">${user.username}</a>
        </td>
    `;
    });

}