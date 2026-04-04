// edit users Bio
function editUserDetails() {
    const editBtn = document.getElementById("editBioBtn");
    const bioEl = document.getElementById("userBio");

    if (editBtn.innerText === "Save") {
        profileUser.bio = document.getElementById("bioInput").value || profileUser.bio;

        bioEl.innerHTML = profileUser.bio;

        editBtn.innerText = "Edit Bio";
    } else {
        bioEl.innerHTML = `<input type="text" id="bioInput" value="${profileUser.bio}" style="width:200px">`;

        editBtn.innerText = "Save";
    }
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