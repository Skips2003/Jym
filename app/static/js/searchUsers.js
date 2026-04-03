// Debounce function
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

async function searchByUsername(){

    var userSearchTable = document.getElementById("userSearchTable");

    usernameSearch = document.getElementById("searchUsername").value

    userSearchTable.innerHTML = `
    <tr>
        <th>Users!</th>
    </tr>
`;

    // if not working check api/users/username/ - probably not correct way of creating this route
    const responseUser = await fetch('api/users/username/' + usernameSearch, {
        method: 'GET',
        headers:{ 
            'Content-Type': 'application/json',
            'X-CSRFToken': document.getElementById("csrf-token").content
        },
    });

    const dataUser = await responseUser.json();
    console.log("usersFound", dataUser);

    dataUser.forEach(user => {
        userSearchTable.insertRow(-1).innerHTML = `
        <td>
            <a href="${profileUrlBase}/${user.username}">${user.username}</a>
        </td>
    `;
    });
}

// Create a debounced version of the search function
const debouncedSearchByUsername = debounce(searchByUsername, 350);