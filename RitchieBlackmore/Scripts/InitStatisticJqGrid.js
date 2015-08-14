function initStatisticOperationGrid(productId) {
    
   // var productId = $("#gridProductId").text();
    console.log("initStatisticOperationGrid test " + productId);
    $("#gridStatistics-" + productId).jqGrid({
        url: 'Products/GetStatisticProduct',
        datatype: "json",
        mtype: 'POST',
        postData: { 'productId': function () { return productId; } },
        jsonReader: {
            page: "page",
            total: "total",
            records: "records",
            root: "rows",
            repeatitems: false,
            userdata: "userdata"
        },
        colNames: ['Operator', 'Type operation', "Quantity product", "Date operation"],
        colModel: [
            { name: 'OperatorName', index: 'OperatorName', width: 150, sortable: true, stype: 'text' },
            { name: 'OperationName', index: 'OperationName', width: 50, sortable: true },
            { name: 'Quantity', index: 'Quantity', width: 50, sortable: true },
            { name: 'DateOperation', formatter: "date", index: 'DateOperation', width: 100, sortable: true },
        ],
        userData: productId,
        rownumbers: true,
        viewrecords: true,
        width: 1100,
        height: "100%",
        pager: "#gridStatisticsPager-" + productId,
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
