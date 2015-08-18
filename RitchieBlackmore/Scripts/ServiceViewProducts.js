
function showCharm(id) {
    var charm = $(id).data("charm");
    if (charm.element.data("opened") === true) {
        charm.close();
    } else {
        charm.open();
    }
}

function clickSaccessAddProduct() {
    clickHreh("#idSubmitNewProduct");
}


function clickSaccessAddOperation() {
    clickHreh("#idSubmitNewOperation");
}

function updatePosition(rowid) {
    rowNumber = $(grid).getGridParam("rowNum");
    var strId = "";

    if (rowid <= (rowNumber - 4)) {
        strId = "#cellNavigationRowNumber" + rowid;
    }
    else {
        strId = "#cellNavigationRowNumber" + (rowNumber - 4);
    }
    var pos = $(strId).offset();
    var left = $("#productDetails").offset().left;
    $("#productDetails").offset({ top: pos.top, left: left });
}
