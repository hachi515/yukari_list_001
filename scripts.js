function searchTable() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toLowerCase();
    table = document.getElementById("fileTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
    updateFileCount();
}

function filterByYear() {
    var year, table, tr, td, i, txtValue;
    year = document.getElementById("yearFilter").value;
    table = document.getElementById("fileTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.startsWith(year) || year === "") {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
    updateFileCount();
}

function updateFileCount() {
    var table, tr, i, count = 0;
    table = document.getElementById("fileTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        if (tr[i].style.display !== "none") {
            count++;
        }
    }
    document.getElementById("fileCount").innerText = "表示されているファイル数: " + count;
}
