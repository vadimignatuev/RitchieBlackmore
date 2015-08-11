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
        colNames: ['Id','Название', 'Цена', ""],
        colModel: [
            { name: 'Id', index: 'Id', hidden: true, editable: true },
            { name: 'Name', index: 'Name', width: 150, stype: 'text', editable: true },
            { name: 'Price', index: 'Price', width: 50, sortable: true, editable: true },
            {
                name: 'status', index: status, formatter: status_button_maker_v3
            }
        ],
        rownumbers: true,
        viewrecords: true,
        width: 1100,
        height: "100%",
        pager: '#jqgPager',
        rowNum: 10,
        rowList: [10, 25, 50, 100],
        //rowNum: 20, // число отображаемых строк
        loadonce: false, // загрузка только один раз
        sortname: 'Id', // сортировка по умолчанию по столбцу Id
        sortorder: "asc", // порядок сортировки
        viewrecords: true,
        editurl: "Products/SaveChange",
        onSelectRow: function (rowid, status, e) {
            console.log("work clickProductStatisticLink");
            $("#productStatistic").css('display', 'block');
            console.log($("#productStatistic").css('display'));
            var Id = grid.getRowData(rowid).Id;
            //clickProductStatisticLink(Id, e);
            getProductStatistic(Id);
        },
        gridComplete: function(){}
        
    });

});

function getHtmlNavigationCell(id) {
    return "<button class=\"ver3_statusbutton\" onclick=\"motionProduct(" + id + ")\">" + "Движение товара</button>" +
               "<button class=\"ver3_statusbutton\" onclick=\"editRow(" + id + ")\">" + "Редактировать" + "</button>" +
               "<button class=\"ver3_statusbutton\" onclick=\"deleteRow(" + id + ")\">" + "Удалить" + "</button>" +
                "<button class=\"ver3_statusbutton\" onclick=\"statisticsProduct(" + id + ")\">" + "Окно статистики</button>"
           
}

function updateProductStatistic()
{
    selRowId = $("#jqg").getGridParam("selrow");
    console.log("update "+selRowId);

}
    
function motionProduct(id) {

    var rowData = grid.getRowData(id);
    var strTitle = "Приход/расход " + rowData._Name;
    var productId = grid.getRowData(id).Id;
    var href = $("#sectProductGrid").data('createoperationUrl') + "?id=" + productId;
    console.log(href);

    var dialog = $("<div></div>")
                .addClass("dialog")
                .appendTo("body")
                .dialog({
                    title: strTitle,
                    close: function () { $(this).remove() },
                    modal: true
                 })                
                .load(href);
    
    dialog.attr('id', 'motionDialog');
}

function successNewOperatin()
{
    $("#motionDialog").dialog('close');
    grid.trigger("reloadGrid", [{ current: true }]);
    updateProductStatistic();
}

function editRow(id) {

    grid.restoreRow(id);
    grid.editRow(id, true);
    changeViewSelRow(id);
}

function changeViewSelRow(id) {
    var mydiv = $("#cellNavigationRowNumber" + id);
    console.log("That is some " + mydiv)
    $("#cellNavigationRowNumber" + id).html("<button class=\"ver3_statusbutton\" onclick=\"saveChange(" + id + ")\">" + "Сохранить</button>" +
        "<button class=\"ver3_statusbutton\" onclick=\"backEdit(" + id + ")\">" + "Отменить</button>");
}

function saveChange(id)
{
    console.log("saveChange");
    var Id = grid.getRowData(id).Id;
    console.log(Id);
    grid.saveRow(id,
        {
            successfunc: function () {
                grid.restoreRow(id);
                backEdit(id);
                return true;
            }
        }
        //    {
        //        extraparam: { _Id: list }

        //    }
            //aftersavefunc,
            //errorfunc,
            //afterrestorefunc
    );
    
}

function backEdit(id)
{
    grid.restoreRow(id);
    $("#cellNavigationRowNumber" + id).html(getHtmlNavigationCell(id));

}

function deleteRow(id) {
    //$("#dialog-confirm").html("Confirm Dialog Box");
    //console.log("I in fnOpenNormalDialog");
    // Define the Dialog and its properties.
    $("#dialog-confirm").dialog({
        resizable: false,
        modal: true,
        title: "Modal",
        height: 250,
        width: 400,
        buttons: {
             "Yes": function () {
                $(this).dialog('close');
                var url = $("#deleteDialogForm").data('deleteproductUrl');
                console.log(url);
                var productId = grid.getRowData(id).Id;
                console.log("No async");
                $.when($.ajax({
                    url: url,
                    type: 'POST',
                    data: { 'id': productId },
                    async: false
                    //saccess: successDelete(id)
                })).then(successDelete(id));
                //grid.trigger("reloadGrid", [{ current: true }]);
                
                //callback(true);
            },
            "No": function () {
                $(this).dialog('close');
                //callback(false);
            }
        }
    });
    
}

function successDelete(id) {
    console.log("successDelete in then");
    //grid.delRowData(id); 
    grid.trigger("reloadGrid", [{ current: true }]);
}

function callback(value) {
    if (value) {
        alert("Confirmed");
    } else {
        alert("Rejected");
    }
}
 

function status_button_maker_v3(rowId, options, rowObject) {
    return "<div id=\"cellNavigationRowNumber" + options.rowId + "\">" +
            getHtmlNavigationCell(options.rowId) +
        "</div>"
}


function getProductStatistic(id) {
    console.log("get partial view");
    var url = $("#productStatistic").data('productstatisticUrl');
    $("#productStatistic").load(url + "?id=" + id);
    
    //$.post(url, { id: id })
    // .done(function (respone) {
    //     $("#listOfCustomers").html(response);
    // });

}

function clickProductStatisticLink(id, e) {

    var href = $("#productStatistic").data('productstatisticUrl');
    console.log(href);
    href = href + "?id=" + encodeURIComponent(id);
    console.log(href);
    $("#productStatisticsLink").attr("href", href);

    clickHreh("#productStatisticsLink", e);
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

    e.preventDefault();
}

function saccessCreateNewProduct() {
    $("#createNewProduct").trigger('reset');
    grid.trigger("reloadGrid", [{ current: true }]);
}

function statisticsProduct(id) {

    var productId = grid.getRowData(id).Id;
    //var gridStatistic = $("<div></div>").html(createDialogStatisticOperationProduct(productId))
    //console.log(gridStatistic);
    $("#gridStatistics").empty();
    $("#gridProductId").html(productId);
    initStatistikGrid(productId);
    $("#formsStatisticsProduct").dialog({
        modal:true, 
        width: 'auto',
        height: 'auto',
        close: function () {
            //$('#formsStatisticsProduct').empty();

        }
    });
    
}

function createDialogStatisticOperationProduct(productId) {
    return "<div id=\"tableProductId" + productId + "\">"+
            "<div id=\"gridProductId" + productId + "\">" + productId + "</div> " +
            "<table id=\"gridStatistics"+productId+"\"></table>" +
            "<div id=\"gridStatisticsPager" + productId + "\"></div> " +
        "</div> "
}

function initStatistikGrid(productId) {
    var pId = $("#gridProductId").text();
    console.log(pId);
    $("#gridStatistics").jqGrid({
        url: 'Products/GetStatisticProduct',
        datatype: "json",
        mtype: 'POST',
        postData: { 'productId': function () { return $("#gridProductId").text(); } },
        jsonReader: {
            page: "page",
            total: "total",
            records: "records",
            root: "rows",
            repeatitems: false,
            userdata: "userdata"
        },
        colNames: ['Оператор', 'Тип операции', "Количество товара", "Количество товара"],
        colModel: [
            { name: 'OperatorName', index: 'OperatorName', width: 150, sortable: true, stype: 'text' },
            { name: 'OperationName', index: 'OperationName', width: 50, sortable: true },
            { name: 'Quantity', index: 'Quantity', width: 50, sortable: true },
            { name: 'DateOperation', index: 'DateOperation', width: 100, sortable: true },
        ],
        userData: productId,
        rownumbers: true,
        viewrecords: true,
        width: 1100,
        height: "100%",
        pager: "#gridStatisticsPager",
        rowNum: 10,
        rowList: [10, 25, 50, 100],
        //rowNum: 20, // число отображаемых строк
        loadonce: false, // загрузка только один раз
        //sortname: '_OperatorName', // сортировка по умолчанию по столбцу Id
        //sortorder: "asc", // порядок сортировки
        viewrecords: true,
        onPaging: function (pgButton) {
            console.log(pgButton);
        }
        
    });
        
}




