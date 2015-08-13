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
        width: 1200,
        height: 'auto',
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
            $("#productDetails").css('display', 'block');
            var Id = grid.getRowData(rowid).Id;
            clickProductDetailsLink(Id, e);
            //getProductDetails(Id);
        },
        gridComplete: function(){}
        
    });

});

function getHtmlNavigationCell(id) {
    return "<button class=\"ver3_statusbutton small-button\" onclick=\"motionProduct(" + id + ")\"><span class=\"mif-wrench\">" + " MoshionProduct</button>" +
               "<button class=\"ver3_statusbutton small-button\" onclick=\"editRow(" + id + ")\"><span class=\"mif-pencil\">" + " Edit" + "</button>" +
               "<button class=\"ver3_statusbutton small-button\" onclick=\"deleteRow(" + id + ")\"><span class=\"mif-cross\">" + " Delete" + "</button>" +
                "<button class=\"ver3_statusbutton small-button\" onclick=\"statisticsProduct(" + id + ")\"><span class=\"mif-list\">" + "</button>"
           
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
                  })).then(successDelete(id));
                },
            "No": function () {
                $(this).dialog('close');
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
    return "<div id=\"cellNavigationRowNumber" + options.rowId + "\" class = \"bg-white\">" +
            getHtmlNavigationCell(options.rowId) +
        "</div>"
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

    e.preventDefault();
}

function saccessCreateNewProduct() {
    $("#createNewProduct").trigger('reset');
    grid.trigger("reloadGrid", [{ current: true }]);
}

function statisticsProduct(id) {

    var productId = grid.getRowData(id).Id;
    var href = $("#statisticOperationLink").data('statisticoperationproductUrl') + "?productId=" + productId;
    $("<div></div>").dialog({
        width: 'auto',
        height: 'auto',
     })
    .load(href);
    
}


//	var jqgrid_data = [{
//	    id : "1",
//	    date : "2014-10-01",
//	    name : "Test 1",
//	    note : "Note 1",
//	    amount : "150.00",
//	    tax : "15.00",
//	    total : "210.00"
//	}, {
//	    id : "2",
//	    date : "2014-10-02",
//	    name : "Test 2",
//	    note : "Note 2",
//	    amount : "220.00",
//	    tax : "22.00",
//	    total : "320.00"
//	}, {
//	    id : "3",
//	    date : "2014-09-01",
//	    name : "Test 3",
//	    note : "Note 3",
//	    amount : "40.00",
//	    tax : "4.00",
//	    total : "430.00"
//	}, {
//	    id : "4",
//	    date : "2014-10-04",
//	    name : "Test 4",
//	    note : "Note 4",
//	    amount : "510.00",
//	    tax : "51.00",
//	    total : "210.00"
//	}, {
//	    id : "5",
//	    date : "2014-10-05",
//	    name : "Test 5",
//	    note : "Note 5",
//	    amount : "210.00",
//	    tax : "21.00",
//	    total : "320.00"
//	}, {
//	    id : "6",
//	    date : "2014-09-06",
//	    name : "Test 6",
//	    note : "Note 6",
//	    amount : "70.00",
//	    tax : "7.00",
//	    total : "430.00"
//	}, {
//	    id : "7",
//	    date : "2014-10-04",
//	    name : "Test 7",
//	    note : "Note 7",
//	    amount : "80.00",
//	    tax : "10.00",
//	    total : "210.00"
//	}, {
//	    id : "8",
//	    date : "2014-10-03",
//	    name : "Test 8",
//	    note : "Note 8",
//	    amount : "300.00",
//	    tax : "10.00",
//	    total : "320.00"
//	}, {
//	    id : "9",
//	    date : "2014-09-01",
//	    name : "Test 9",
//	    note : "Note 9",
//	    amount : "90.00",
//	    tax : "10.00",
//	    total : "430.00"
//	}, {
//	    id : "10",
//	    date : "2014-10-01",
//	    name : "Test 10",
//	    note : "Note 10",
//	    amount : "200.00",
//	    tax : "20.00",
//	    total : "210.00"
//	}, {
//	    id : "11",
//	    date : "2014-10-02",
//	    name : "Test 11",
//	    note : "Note 11",
//	    amount : "77.00",
//	    tax : "9.00",
//	    total : "320.00"
//	}, {
//	    id : "12",
//	    date : "2014-09-01",
//	    name : "Test 12",
//	    note : "Note 12",
//	    amount : "56.00",
//	    tax : "8.00",
//	    total : "430.00"
//	}, {
//	    id : "13",
//	    date : "2014-10-04",
//	    name : "Test 13",
//	    note : "Note 13",
//	    amount : "554.00",
//	    tax : "10.00",
//	    total : "210.00"
//	}, {
//	    id : "14",
//	    date : "2014-10-05",
//	    name : "Test 14",
//	    note : "Note 14",
//	    amount : "265.00",
//	    tax : "2.00",
//	    total : "320.00"
//	}, {
//	    id : "15",
//	    date : "2014-09-06",
//	    name : "Test 15",
//	    note : "Note 15",
//	    amount : "765.00",
//	    tax : "3.00",
//	    total : "430.00"
//	}, {
//	    id : "16",
//	    date : "2014-10-04",
//	    name : "Test 16",
//	    note : "Note 16",
//	    amount : "89.00",
//	    tax : "1.00",
//	    total : "210.00"
//	}, {
//	    id : "17",
//	    date : "2014-10-03",
//	    name : "Test 17",
//	    note : "Note 17",
//	    amount : "99.00",
//	    tax : "2.00",
//	    total : "320.00"
//	}, {
//	    id : "18",
//	    date : "2014-09-01",
//	    name : "Test 18",
//	    note : "Note 18",
//	    amount : "49.00",
//	    tax : "3.00",
//	    total : "430.00"
//	}];

////enable datepicker
//function pickDate( cellvalue, options, cell ) {
//    setTimeout(function(){
//        jQuery(cell) .find('input[type=text]')
//                .datepicker({format:'yyyy-mm-dd' , autoclose:true}); 
//    }, 0);
//}


//grid.jqGrid('inlineNav', "#jqgPager");

///* Add tooltips */
//jQuery('.navtable .ui-pg-button').tooltip({
//    container : 'body'
//});

//// Get Selected ID's
//jQuery("a.get_selected_ids").bind("click", function() {
//    s = grid.jqGrid('getGridParam', 'selarrrow');
//    alert(s);
//});

//// Select/Unselect specific Row by id
//jQuery("a.select_unselect_row").bind("click", function() {
//    grid.jqGrid('setSelection', "13");
//});

//// Select/Unselect specific Row by id
//jQuery("a.delete_row").bind("click", function() {
//    var su = grid.jqGrid('delRowData', 1);
//    if(su) alert("Succes. Write custom code to delete row from server"); else alert("Already deleted or not in list");
//});


//// On Resize
//jQuery(window).resize(function() {

//    if(window.afterResize) {
//        clearTimeout(window.afterResize);
//    }

//    window.afterResize = setTimeout(function() {

//        /**
//            After Resize Code
//            .................
//        **/

//        grid.jqGrid('setGridWidth', jQuery(".ui-jqgrid").parent().width());

//    }, 500);

//});

//// ----------------------------------------------------------------------------------------------------

///**
//    @STYLING
//**/
//jQuery(".ui-jqgrid").removeClass("ui-widget ui-widget-content");
//jQuery(".ui-jqgrid-view").children().removeClass("ui-widget-header ui-state-default");
//jQuery(".ui-jqgrid-labels, .ui-search-toolbar").children().removeClass("ui-state-default ui-th-column ui-th-ltr");
//jQuery(".ui-jqgrid-pager").removeClass("ui-state-default");
//jQuery(".ui-jqgrid").removeClass("ui-widget-content");

//jQuery(".ui-jqgrid-htable").addClass("table table-bordered table-hover");
//jQuery(".ui-pg-div").removeClass().addClass("btn btn-sm btn-primary");
//jQuery(".ui-icon.ui-icon-plus").removeClass().addClass("fa fa-plus");
//jQuery(".ui-icon.ui-icon-pencil").removeClass().addClass("fa fa-pencil");
//jQuery(".ui-icon.ui-icon-trash").removeClass().addClass("fa fa-trash-o");
//jQuery(".ui-icon.ui-icon-search").removeClass().addClass("fa fa-search");
//jQuery(".ui-icon.ui-icon-refresh").removeClass().addClass("fa fa-refresh");
//jQuery(".ui-icon.ui-icon-disk").removeClass().addClass("fa fa-save").parent(".btn-primary").removeClass("btn-primary").addClass("btn-success");
//jQuery(".ui-icon.ui-icon-cancel").removeClass().addClass("fa fa-times").parent(".btn-primary").removeClass("btn-primary").addClass("btn-danger");

//jQuery( ".ui-icon.ui-icon-seek-prev" ).wrap( " " );
//	jQuery(".ui-icon.ui-icon-seek-prev").removeClass().addClass("fa fa-backward");

//jQuery( ".ui-icon.ui-icon-seek-first" ).wrap( "" );
//	jQuery(".ui-icon.ui-icon-seek-first").removeClass().addClass("fa fa-fast-backward");		  	

//jQuery( ".ui-icon.ui-icon-seek-next" ).wrap( "" );
//	jQuery(".ui-icon.ui-icon-seek-next").removeClass().addClass("fa fa-forward");

//jQuery( ".ui-icon.ui-icon-seek-end" ).wrap( "" );
//	jQuery(".ui-icon.ui-icon-seek-end").removeClass().addClass("fa fa-fast-forward");




