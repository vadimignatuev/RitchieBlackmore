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
            updatePosition(rowid);
            clickProductDetailsLink(Id, e);
        },
        gridComplete: function(){}
        
    });

});

var productBeforEdit;
var productAfterEdit;
var dialogChoiseSaveEdit;

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
    var productId = grid.getRowData(id).Id;
    var mydiv = $("#cellNavigationRowNumber" + id);
    console.log("That is some " + productId)
    $("#cellNavigationRowNumber" + id).html("<button class=\"ver3_statusbutton button small-button success\" onclick=\"saveChange(" + id + "," + productId + ")\"><span class=\"mif-floppy-disk\"></button>" +
        "<button class=\"ver3_statusbutton button small-button primary\" onclick=\"backEdit(" + id + "," + productId + ")\"><span class=\"mif-arrow-right\"></button>");
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
    console.log("rowData before Edit" + rowData);
    $.ajax({
        url: $("#idStartEdit").data('starteditrowUrl'),
        type: 'POST',
        data: { "productId": rowData.Id, "productName": rowData.Name, "price": rowData.Price }
    });
    changeViewSelRow(id);
    grid.restoreRow(id);
    grid.editRow(id, true);
    productBeforEdit = fixProductInEdit(id);
    console.log(productBeforEdit);
}


function fixProductInEdit(id) {

    var product = {};
    product.Id = $("#" + id + "_Id").val();
    product.Name = $("#" + id + "_Name").val();
    product.Price = $("#" + id + "_Price").val();
    product.Quantity = 0;
    product.TotalCost = 0;
    return product;
}


function backEdit(id, productId) {
    console.log("successSaveEdit backEdit");
    grid.restoreRow(id);
    $("#cellNavigationRowNumber" + id).html(getHtmlNavigationCell(id));

}

function saveChange(id, productId)
{
   productAfterEdit = fixProductInEdit(id);
   var responseEdit;
    
    $.when($.ajax({
        url: $("#idEndEditRow").data('endeditrowUrl'),
        type: 'POST',
        data: productBeforEdit,
        async: false,
        success: function (response) {
            responseEdit = response;
        }
    })).then(function () {
        if (!responseEdit.isChanges) {
            successSaveEdit(id, responseEdit, productId);
        }
        else {
            showSaveEditDialog(id, productId);
        }
    });
  
}


function successSaveEdit(id, response, productId) {
    var rowData = grid.getRowData(id);
    console.log("showSaveEditDialog " + rowData.Name);
    var name = $("#" + id + "_Name").val();
    console.log("input val " + name);
    console.log("successSaveEdit");
    //grid.editRow(id, true);
    grid.saveRow(id,
    {
        successfunc: function (response) {
            console.log("successSaveEdit successfunc");
            if (parseIsErrorResponse(response)) {
                console.log("successSaveEdit successfunc response");
                responseEdit = response;
                grid.restoreRow(id);
                backEdit(id, productId);
                return true;
            }
            else {
                backEdit(id, productId);
            }
        }
    });
    grid.trigger("reloadGrid", [{ current: true }]);
}

function showSaveEditDialog(id, productId) {
    var afterEdit = fixProductInEdit(id);
    var href = $("#idTableChangesProduct").data('tablechangesproductUrl') + "?" + JSON.stringify({ listProduct: listProduct });
    var listProduct = [productBeforEdit, afterEdit];
    var responseHtml;
    $.when($.ajax({
        type: "POST",
        async: false,
        contentType: "application/json",
        url: $("#idTableChangesProduct").data('tablechangesproductUrl'),
        data: JSON.stringify({ listProduct: listProduct }),
        success: function (response) {
            responseHtml = response;
        }
    })).then(function () {
        $("#dialogChooseSaveType").html(responseHtml);
        dialogChoiseSaveEdit = $("#dialogChooseSaveType")
            .dialog({
                width: 700,
                //title: "Product was change since you started editing",
                close: function () { $(this).remove() },
                modal: true
            });
     });
    
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

function savePresentMean() {
    closeDialogChoiseEdit();
    grid.trigger("reloadGrid", [{ current: true }]);
}

function saveMyProductBeforeEdit() {
    saveMyProduct(productBeforEdit);
}

function saveMyProductAfterEdit() {
    saveMyProduct(productAfterEdit);
}

function closeDialogChoiseEdit() {
    console.log(dialogChoiseSaveEdit);
    console.log();
    //dialogChoiseSaveEdit.close();
    jQuery('#dialogChooseSaveType').dialog('close');
}

function saveMyProduct(product) {
    var responseEdit;
    $.when($.ajax({
        url: $("#dialogChooseSaveType").data('savechangeUrl'),
        type: 'POST',
        data: { 'Id': product.Id, 'Name': product.Name, 'Price': product.Price },
        async: false,
        success: function (response) {
            responseEdit = response;
        }
    })).then(function () {
        closeDialogChoiseEdit();
        if (!parseIsErrorResponse(responseEdit)) {
            grid.trigger("reloadGrid", [{ current: true }]);
        }

    });
}

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
                        grid.trigger("reloadGrid", [{ current: true }]);
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
    
    if (!(id.indexOf('input') + 1)) {
        var href = $("#productDetails").data('productdetailsUrl');
        href = href + "?id=" + encodeURIComponent(id);
        console.log("clickProductDetailsLink href withiut input" + href);
        $("#productDetailsLink").attr("href", href);
        clickHreh("#productDetailsLink", e);
    }
        
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


