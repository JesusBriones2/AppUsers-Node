fetch('/getdatausers')
.then(res => {
    return res.json();
})
.then(res => {
    showUsers(res);
})



const table = document.querySelector('.table');


function showUsers(res) {
    let html = '';

    for (let i of Object.keys(res)) {

        html += 
        `
        <div class="table__item" id="${res[i].id}">
            <span class="table__item-data">${res[i].id}</span>
            <span class="table__item-data">${res[i].username}</span>
            <span class="table__item-data">${res[i].password}</span>
            <span class="table__item-data" id="cta-delete">delete</span>
        </div>
        `
    }

    table.innerHTML = html;


    table.addEventListener('click', (e) => {
        if (e.target.id == 'cta-delete') {
            fetch('/delete', {
                method: 'DELETE',
                body: `{"id": ${e.target.parentElement.id}}`
            })
            .then(res => {
                return res.json();
            })
            .then(res => {
                if (res.delete) {
                    table.removeChild(e.target.parentElement)
                }
            })
        }
    })
}