export const sortTable = (n) => {
    const col = document.getElementById("colMixSearch");
    const col2 = document.getElementById("colNumSearch");
    const col3 = document.getElementById("colStyleSearch");
    const col4 = document.getElementById("colNameSearch");

    switch (n) {
        case 0:
            col2.className='';
            col3.className='';
            col4.className='';
            if (col.className === "headerSortDown"){
                col.className = "headerSortUp"
            }
            else {
                col.className = "headerSortDown";
            }
            break;
        
        case 1:
            col.className='';
            col3.className='';
            col4.className='';
            if (col2.className === "headerSortDown"){
                col2.className = "headerSortUp"
            }
            else {
                col2.className = "headerSortDown";
            }
            break;
        case 2:
            col.className='';
            col2.className='';
            col4.className='';
            if (col3.className === "headerSortDown"){
                col3.className = "headerSortUp"
            }
            else {
                col3.className = "headerSortDown";
            }
            break;

        case 3:
            col.className='';
            col2.className='';
            col3.className='';
            if (col4.className === "headerSortDown"){
                col4.className = "headerSortUp"
            }
            else {
                col4.className = "headerSortDown";
            }
            break;
    
        default:
            break;
    }

    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("tableSearch");
    switching = true;
    dir = "asc"; 
    while (switching) {
        switching = false;
        rows = table.getElementsByTagName('tr');
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName('td')[n];
            y = rows[i + 1].getElementsByTagName('td')[n];
            if (dir === "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }  
                else if (dir === "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++; 
        }
        else {
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
        }
    }
}
}