export const sortTable2 = (n) => {
    const col = document.getElementById("colNombre");
    const col2 = document.getElementById("colEstado");

    switch (n) {
        case 0:
            col2.className='';
            if (col.className === "headerSortDown"){
                col.className = "headerSortUp"
            }
            else {
                col.className = "headerSortDown";
            }
            break;
        
        case 1:
            col.className='';
            
            if (col2.className === "headerSortDown"){
                col2.className = "headerSortUp"
            }
            else {
                col2.className = "headerSortDown";
            }
            break;
    
        default:
            break;
    }

    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("tableMixes");
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