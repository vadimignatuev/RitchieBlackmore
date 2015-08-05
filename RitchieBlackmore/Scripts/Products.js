$(document).ready(function () {
    
    $("#jqg").jqGrid({
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
        colNames: ['Название', 'Цена', ""],
        colModel: [
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
        onSelectRow: function (id) {
            console.log(id);
            if (id && id !== lastSel) {
                jQuery('#jqg').restoreRow(lastsel);
                jQuery('#jqg').editRow(id, true);
                lastsel2 = id;
            }
        },
        gridComplete: function(){}
        
    });

    $("#jqg").jqGrid('navButtonAdd', '#jqgPager',
    {
        caption: ""/*"Show"*/, buttonicon: "", title: "Show Link",
        onClickButton: function () {
            var grid = $("#jqg");
            var rowid = grid.jqGrid('getGridParam', 'selrow');
            window.location = grid.jqGrid('getCell', rowid, 'dataUrl');
        }
    });

});
    
function motionProduct(options) {
      $('#formsMotionsProduct').dialog({
        width: 'auto',
        height: 'auto'
    });
}

function editRow(id) {

    jQuery('#jqg').restoreRow(id);
    jQuery('#jqg').editRow(id, true);
    changeViewSelRow(id);
}

function changeViewSelRow(id) {
    var mydiv = $("#cellNavigationRowNumber" + id);
    console.log("That is some " + mydiv)
    $("#cellNavigationRowNumber" + id).html("<button class=\"ver3_statusbutton\">Сохранить</button>");
}

function statisticsProduct(options) {
    initStatistikGrid(1);
    $('#formsStatisticsProduct').dialog({
        width: 'auto',
        height: 'auto'
    });
}
 

    function status_button_maker_v3(rowId, options, rowObject) {
        return "<div id=\"cellNavigationRowNumber"+options.rowId+"\">"+
               "<button class=\"ver3_statusbutton\" onclick=\"motionProduct(" + options.rowId + ")\">" + "Движение товара</button>" +
               "<button class=\"ver3_statusbutton\" onclick=\"editRow(" + options.rowId + ")\">" + "Редактировать" + "</button>" +
               "<button class=\"ver3_statusbutton\" >" + "Удалить" + "</button>" +
                "<button class=\"ver3_statusbutton\" onclick=\"statisticsProduct(" + rowObject._Id + ")\">" + "Окно статистики</button>" +
            "</div>"
    }

    function clicBebebe() {
        console.log("I am clict");
        rowid = $("#jqg").getGridParam('selrow');
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



