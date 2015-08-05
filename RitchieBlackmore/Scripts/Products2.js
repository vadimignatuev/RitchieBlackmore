$(document).ready(function () {
        grid = $("#jqg"),
        getColumnIndexByName = function (grid, columnName) {
            var cm = grid.jqGrid('getGridParam', 'colModel'), i, l = cm.length;
            for (i = 0; i < l; i++) {
                if (cm[i].name === columnName) {
                    return i; // return the index
                }
            }
            return -1;
        },
        myDelOptions = {
            // because I use "local" data I don't want to send the changes to the server
            // so I use "processing:true" setting and delete the row manually in onclickSubmit
            onclickSubmit: function (rp_ge, rowid) {
                // reset the value of processing option to true to
                // skip the ajax request to 'clientArray'.
                rp_ge.processing = true;

                // we can use onclickSubmit function as "onclick" on "Delete" button
                // delete row
                grid.jqGrid('delRowData', rowid);
                $("#delmod" + grid[0].id).hide();

                if (grid[0].p.lastpage > 1) {
                    // reload grid to make the row from the next page visable.
                    // TODO: deleting the last row from the last page which number is higher as 1
                    grid.trigger("reloadGrid", [{ page: grid[0].p.page}]);
                }

                return true;
            },
            processing: true
        };

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
        colNames: ['Название', 'Цена', ''],
        colModel: [
            { name: '_Name', index: 'race', width: 240, editable: true },
            { name: '_Price', index: 'name', editable: true, width: 100, editrules: { required: true } },
            {
                name: 'act', index: 'act', width: 100, align: 'center', sortable: false, formatter: 'actions',
                formatoptions: {
                    keys: true, // we want use [Enter] key to save the row and [Esc] to cancel editing.
                    delOptions: myDelOptions
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 25, 50, 100],
        pager: '#jqgPager',
        gridview: true,
        rownumbers: true,
        ignoreCase: true,
        sortname: 'invdate',
        viewrecords: true,
        height: "100%",
        //editurl: 'clientArray',
        ondblClickRow: function (id) {
            // edit the row and save it on press "enter" key
            $(this).jqGrid('editRow', id, true, null, null, 'clientArray');
        },
        onSelectRow: function (id) {
            if (id && id !== lastSel) {
                // cancel editing of the previous selected row if it was in editing state.
                // jqGrid hold intern savedRow array inside of jqGrid object,
                // so it is safe to call restoreRow method with any id parameter
                // if jqGrid not in editing state
                if (typeof lastSel !== "undefined") {
                    $(this).jqGrid('restoreRow', lastSel);
                }
                lastSel = id;
            }
        },
        loadComplete: function () {
            var iCol = getColumnIndexByName(grid, 'act');
            $(this).find(">tbody>tr.jqgrow>td:nth-child(" + (iCol + 1) + ")")
                .each(function() {
                    $("<div>", {
                        title: "Custom",
                        mouseover: function() {
                            $(this).addClass('ui-state-hover');
                        },
                        mouseout: function() {
                            $(this).removeClass('ui-state-hover');
                        },
                        click: function(e) {
                            alert("'Custom' button is clicked in the rowis="+
                                $(e.target).closest("tr.jqgrow").attr("id") +" !");
                        }
                    }
                  ).css({"margin-right": "5px", float: "left", cursor: "pointer"})
                   .addClass("ui-pg-div ui-inline-custom")
                   .append('<span class="ui-icon ui-icon-document"></span>')
                   .prependTo($(this).children("div"));
                });
        }
    }).jqGrid('navGrid', '#Pager1', { add: true, edit: false }, {}, {},
              myDelOptions, { multipleSearch: true, overlay: false });
});
