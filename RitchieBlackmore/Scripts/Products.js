$(document).ready(function () {

    grid = $("#jqg"),

    grid.jqGrid({
        url: "Products/GetProductsList",
        datatype: "json",
        mtype: 'POST',
        jsonReader: {
            page: "page",
            total: "total",
            records: "records",
            root: "rows",
            repeatitems: false
        },
        colNames: ['Id','Name', 'Price', ""],
        colModel: [
            { name: 'Id', index: 'Id', hidden: true, editable: true },
            { name: 'Name', index: 'Name', width: 150, stype: 'text', editable: true, editoptions : { maxlength: 50} },
            { name: 'Price', index: 'Price', width: 50, sortable: true, editable: true },
            {
                name: 'status', index: status, formatter: status_button_maker_v3
            }
        ],
        rownumbers: true,
        viewrecords: true,
        width: 1000,
        height: 'auto',
        pager: '#jqgPager',
        rowNum: 10,
        rowList: [10, 25, 50, 100],
        loadonce: false, 
        sortname: 'Id', 
        sortorder: "asc",
        viewrecords: true,
        editurl: "Products/SaveChange",
        onSelectRow: function (rowid, status, e) {
            $("#productDetails").css('display', 'block');
            var Id = grid.getRowData(rowid).Id;
            clickProductDetailsLink(Id, e);
            updatePosition(rowid);
        },
        gridComplete: function(){}
        
    });

});

function status_button_maker_v3(rowId, options, rowObject) {
    return "<div id=\"cellNavigationRowNumber" + options.rowId + "\" class = \"\">" +
        "<div class=\"\">" +
            getHtmlNavigationCell(options.rowId) +
        "</div></div>"
}

function getHtmlNavigationCell(id) {
    return "<button class=\"ver3_statusbutton button small-button primary\" onclick=\"motionProduct(" + id + ")\"><span class=\"mif-wrench\"></button>" +
               "<button class=\"ver3_statusbutton button small-button success\" onclick=\"editRow(" + id + ")\"><span class=\"mif-pencil\"></button>" +
               "<button class=\"ver3_statusbutton button small-button danger\" onclick=\"deleteRow(" + id + ")\"><span class=\"mif-cross\"></button>" +
                "<button class=\"ver3_statusbutton button small-button info\" onclick=\"statisticsProduct(" + id + ")\"><span class=\"mif-list\"></button>"
           
}

function changeViewSelRow(id) {
    var mydiv = $("#cellNavigationRowNumber" + id);
    console.log("That is some " + mydiv)
    $("#cellNavigationRowNumber" + id).html("<button class=\"ver3_statusbutton button small-button success\" onclick=\"saveChange(" + id + ")\"><span class=\"mif-floppy-disk\"></button>" +
        "<button class=\"ver3_statusbutton button small-button primary\" onclick=\"backEdit(" + id + ")\"><span class=\"mif-arrow-right\"></button>");
}


function updateProductStatistic()
{
    selRowId = $("#jqg").getGridParam("selrow");
    console.log("update "+selRowId);
}
    
function motionProduct(id) {
    var rowData = grid.getRowData(id);
    var strTitle = "Operation  " + rowData.Name;
    var productId = grid.getRowData(id).Id;
    var href = $("#sectProductGrid").data('createoperationUrl') + "?id=" + productId;
    console.log(href);

    var dialog = $("<div></div>")
                .addClass("dialog")
                .appendTo("body")
                .dialog({
                    //height: 350,
                    //width: 400,
                    title: strTitle,
                    close: function () { $(this).remove() },
                    modal: true
                 })                
                .load(href);
    
    dialog.attr('id', 'motionDialog');
}

function successNewOperatin(response)
{
    $("#motionDialog").dialog('close');
    grid.trigger("reloadGrid", [{ current: true }]);
    updateProductStatistic();
    parseIsErrorResponse(response);
}

function editRow(id) {
    var rowData = grid.getRowData(id);
    $.ajax({
        url: '@Url.Action("StartEditRow", "Products")',
        type: 'POST',
        data: { 'productId': rowData.Id, "productName": rowData.Name, "price": rowData.Price }
    });
    grid.restoreRow(id);
    grid.editRow(id, true);
    changeViewSelRow(id);
}

function backEdit(id) {
    grid.restoreRow(id);
    $("#cellNavigationRowNumber" + id).html(getHtmlNavigationCell(id));

}

function saveChange(id)
{
    console.log("saveChange");
    var Id = grid.getRowData(id).Id;
    console.log(Id);
    var responseEdit;
    grid.saveRow(id,
        {
            successfunc: function (response) {
                responseEdit = response;
                grid.restoreRow(id);
                backEdit(id);
                return true;
            },
        }
    );
    parseIsErrorResponse(responseEdit);
}

function parseIsErrorResponse(response) {
    console.log("responce before pars " + response);
    if (response.responseJSON != null) {
        var respObj = $.parseJSON(response.responseJSON.replace(/(\r\n|\n|\r)/gm, ""));
    }
    else {
        var respObj = $.parseJSON(response.replace(/(\r\n|\n|\r)/gm, ""));
    }
    
    console.log(respObj);
    if (respObj.success == false) {
        $('#ErrorText').html("<ul>" + respObj.errors + "</ul>");
        errorServerMassege();
        return true;
    }
    return false;
};

function errorServerMassege(response) {
    $("#dialogError").dialog({
        resizable: false,
    });
}

function deleteRow(id) {
        
    $("#dialog-confirm").dialog({
        resizable: false,
        modal: true,
        height: 250,
        width: 400,
        buttons: {
            "Yes": function () {
                $(this).dialog('close');
                var url = $("#deleteDialogForm").data('deleteproductUrl');
                console.log(url);
                var productId = grid.getRowData(id).Id;
                console.log("No async");
                var errorDel;
                $.when($.ajax({
                    url: url,
                    type: 'POST',
                    data: { 'id': productId },
                    async: false,
                    success: function (response) {
                        errorDel = parseIsErrorResponse(response);
                }
                })).then(function () {
                    if (!errorDel) {
                        successDelete(id)
                    }
                });
            },
            "No": function () {
                $(this).dialog('close');
            }
        }
    });
    
}

function successDelete(id) {
    console.log("successDelete in then");
    grid.trigger("reloadGrid", [{ current: true }]);
}

function getProductDetails(id) {
    var url = $("#productDetails").data('productdetailsUrl');
    $("#productStatistic").load(url + "?id=" + id);
}

function clickProductDetailsLink(id, e) {

    var href = $("#productDetails").data('productdetailsUrl');
    console.log(href);
    href = href + "?id=" + encodeURIComponent(id);
    console.log(href);
    $("#productDetailsLink").attr("href", href);
    clickHreh("#productDetailsLink", e);
}

function clickHreh(hrefId, e) {

    var link = $(hrefId)[0];
    var linkEvent = null;
    if (document.createEvent) {
        linkEvent = document.createEvent('MouseEvents');
        linkEvent.initEvent('click', true, true);
        link.dispatchEvent(linkEvent);
    }
    else if (document.createEventObject) {
        linkEvent = document.createEventObject();
        link.fireEvent('onclick', linkEvent);
    }
    if (e != null) {
        e.preventDefault();
    }
}

function saccessCreateNewProduct() {
    $("#createNewProduct").trigger('reset');
    grid.trigger("reloadGrid", [{ current: true }]);
}

function saccessCreateNewOperation() {
    $("#createNewOperation").trigger('reset');
    grid.trigger("reloadGrid", [{ current: true }]);
}

function statisticsProduct(id) {

    var productId = grid.getRowData(id).Id;
    var strTitle = "Statistic operation  " + grid.getRowData(id).Name;
    var href = $("#statisticOperationLink").data('statisticoperationproductUrl') + "?productId=" + productId;
    $("<div></div>").dialog({
        title: strTitle,
        width: 'auto',
        height: 'auto',
    })
    .load(href);
    
}


