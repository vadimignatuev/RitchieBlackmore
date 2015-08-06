$(document).ready(function () {

    grid = $("#jqg"),

    grid.jqGrid({
        url: 'Products/GetProductsList',
        datatype: "json",
        mtype: 'POST',
        jsonReader: {
            page: "page",
            total: "total",
            records: "records",
            root: "rows",
            repeatitems: false
        },
        colNames: ['','Название', 'Цена', ""],
        colModel: [
            { name: '_Id', index: '_Id', hidden:true },
            { name: '_Name', index: '_Name', width: 150, stype: 'text', editable: true },
            { name: '_Price', index: '_Price', width: 50, sortable: true, editable: true },
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
        sortname: 'Name', // сортировка по умолчанию по столбцу Id
        //sortorder: "asc", // порядок сортировки
        viewrecords: true,
        editurl: "Products/SaveChange",
        //onSelectRow: function (id) {
        //    console.log(id);
        //    if (id && id != lastsel) {
        //        jQuery('#jqg').restoreRow(lastsel);
        //        jQuery('#jqg').editRow(id, true);
        //        lastsel2 = id;
        //    }
        //},
        gridComplete: function(){}
        
    });

    $("#createNewProductForm").click(function () {
        var urlAct = $("#createNewProductForm").data('createproductUrl')
        console.log(urlAct);

        var name = $("#newProductName").val();
        var price = $("#newProductPrice").val();
        var parStr = 'name=' + name + '&price=' + price;

        
        $.ajax({
            type: "POST",
            url: urlAct,
            data: parStr,
            success: function () {
                $("#createNewProductForm").clearForm();
            }
        });
    });

    
});

function getHtmlNavigationCell(id) {
    return   "<button class=\"ver3_statusbutton\" onclick=\"motionProduct(" + id + ")\">" + "Движение товара</button>" +
               "<button class=\"ver3_statusbutton\" onclick=\"editRow(" + id + ")\">" + "Редактировать" + "</button>" +
               "<button class=\"ver3_statusbutton\" onclick=\"deleteColumn(" + id + ")\">" + "Удалить" + "</button>" +
                "<button class=\"ver3_statusbutton\" onclick=\"statisticsProduct(" + id + ")\">" + "Окно статистики</button>" 
           
} 
    
function motionProduct(id) {
   
    var rowData = grid.getRowData(id);
    var strTitle = "Приход/расход " + rowData._Name;
    
    var href = $("#sectProductGrid").data('createoperationUrl') + "?id=" + id;
    console.log(href);

    $("<div></div>")
                .addClass("dialog")
                .appendTo("body")
                .dialog({
                    title: strTitle,
                    close: function () { $(this).remove() },
                    //modal: true
                })
                .load(href);
      //$('#formsMotionsProduct').dialog({
      //  width: 'auto',
      //  height: 'auto'
    //});
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
    list = jQuery("#jqg").getRowData(id)._Id;
    console.log(list);
    grid.saveRow(id
        //{
        //    successfunc: function () {
        //        //return jQuery("#jqg").rowList[id];
        //    }
        //},
        //{
        //    extraparam: { _Id : jQuery("#jqg").rowList[id]._Id }
            
        //}
        //aftersavefunc,
        //errorfunc,
        //afterrestorefunc
        );
    
}

function backEdit(id)
{
    grid.restoreRow(id);
    $("#cellNavigationRowNumber" + id).html(getHtmlNavigationCell);

}

function statisticsProduct(options) {
    initStatistikGrid(1);
    $('#formsStatisticsProduct').dialog({
        width: 'auto',
        height: 'auto'
    });
}

function deleteColumn(id) {
    $('#deleteDialogForm').dialog();
    grid.delRowData(id);
}
 

function status_button_maker_v3(rowId, options, rowObject) {
    return "<div id=\"cellNavigationRowNumber" + options.rowId + "\">" +
            getHtmlNavigationCell(options.rowId) +
        "</div>"
}

function clicBebebe() {
    console.log("I am clict");
    rowid = grid.getGridParam('selrow');
    console.log(rowid);
}


function initStatistikGrid(rowId) {

    $("#gridStatistics").jqGrid({
        url: 'Products/GetStatisticProduct',
        datatype: "json",
        mtype: 'POST',
        jsonReader: {
            page: "page",
            total: "total",
            records: "records",
            root: "rows",
            repeatitems: false
        },
        colNames: ['Оператор', 'Тип операции', "Количество товара", "Количество товара"],
        colModel: [
            { name: '_OperatorName', index: '_OperatorName', width: 150, sortable: true, stype: 'text' },
            { name: '_OperationName', index: '_OperationName', width: 50, sortable: true },
            { name: '_Quantity', index: '_Quantity', width: 50, sortable: true },
            { name: '_DateOperation', index: '_DateOperation', width: 100, sortable: true },
        ],
        rownumbers: true,
        viewrecords: true,
        width: 1100,
        height: "100%",
        pager: '#gridStatisticsPager',
        rowNum: 10,
        rowList: [10, 25, 50, 100],
        //rowNum: 20, // число отображаемых строк
        loadonce: false, // загрузка только один раз
        //sortname: '_OperatorName', // сортировка по умолчанию по столбцу Id
        //sortorder: "asc", // порядок сортировки
        viewrecords: true,
        
    });
}



