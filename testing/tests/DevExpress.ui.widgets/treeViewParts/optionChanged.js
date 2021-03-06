"use strict";

/* global DATA, initTree */

var $ = require("jquery");

QUnit.module("optionChanged");

QUnit.test("selectAllText", function(assert) {
    var treeView = initTree({
        showCheckBoxesMode: "selectAll",
        items: $.extend(true, [], DATA[5])
    }).dxTreeView("instance");

    treeView.option("selectAllText", "Select all items");
    assert.equal(treeView._$selectAllItem.dxCheckBox("instance").option("text"), "Select all items");
});

QUnit.test("selectAllEnabled", function(assert) {
    var treeView = initTree({
        showCheckBoxesMode: "selectAll",
        items: $.extend(true, [], DATA[5])
    }).dxTreeView("instance");

    treeView.option("showCheckBoxesMode", "normal");
    assert.equal(typeof treeView._$selectAllItem, "undefined");

    treeView.option("showCheckBoxesMode", "selectAll");
    assert.equal(treeView._$selectAllItem.length, 1);
});

QUnit.test("scrollDirection", function(assert) {
    var treeView = initTree({
        items: $.extend(true, [], DATA[5])
    }).dxTreeView("instance");

    treeView.option("scrollDirection", "both");
    assert.equal(treeView._scrollableContainer.option("direction"), "both");
});

QUnit.test("showCheckBoxes", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;
    var treeView = initTree({
        items: data,
    }).dxTreeView("instance");

    treeView.option("showCheckBoxesMode", "normal");
    assert.equal(treeView.$element().find(".dx-checkbox").length, 6);

    treeView.option("showCheckBoxesMode", "none");
    assert.equal(treeView.$element().find(".dx-checkbox").length, 0);
});

QUnit.test("searchValue from empty to value", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;

    var treeView = initTree({
            items: data,
        }).dxTreeView("instance"),
        $items = $(treeView.$element()).find(".dx-treeview-item");

    assert.equal($items.length, 6, "6 items were rendered");

    treeView.option("searchValue", "2");
    $items = $(treeView.$element()).find(".dx-treeview-item");

    assert.equal($items.length, 4, "4 items were rendered after filtration");
});

QUnit.test("searchValue from value to empty", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].expanded = true;

    var treeView = initTree({
            items: data,
            searchValue: "2"
        }).dxTreeView("instance"),
        $items = $(treeView.$element()).find(".dx-treeview-item");

    assert.equal($items.length, 4, "4 items were rendered");

    treeView.option("searchValue", "");
    $items = $(treeView.$element()).find(".dx-treeview-item");

    assert.equal($items.length, 6, "6 items were rendered after filtration");
});

QUnit.test("searchValue from value to empty - update selection", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].expanded = true;

    var treeView = initTree({
            items: data,
            showCheckBoxesMode: "normal",
            searchValue: "2"
        }).dxTreeView("instance"),
        $items = $(treeView.$element()).find(".dx-treeview-item"),
        $checkboxes = $(treeView.$element()).find(".dx-checkbox");

    assert.equal($items.length, 4, "4 items were rendered");
    $checkboxes.eq(2).trigger("dxclick");

    assert.equal($checkboxes.eq(0).dxCheckBox("instance").option("value"), true);
    assert.equal($checkboxes.eq(1).dxCheckBox("instance").option("value"), true);
    assert.equal($checkboxes.eq(2).dxCheckBox("instance").option("value"), true);

    treeView.option("searchValue", "");

    $checkboxes = $(treeView.$element()).find(".dx-checkbox");
    assert.equal($checkboxes.eq(0).dxCheckBox("instance").option("value"), undefined);
    assert.equal($checkboxes.eq(1).dxCheckBox("instance").option("value"), false);
    assert.equal($checkboxes.eq(2).dxCheckBox("instance").option("value"), undefined);
    assert.equal($checkboxes.eq(3).dxCheckBox("instance").option("value"), false);
    assert.equal($checkboxes.eq(4).dxCheckBox("instance").option("value"), true);
    assert.equal($checkboxes.eq(5).dxCheckBox("instance").option("value"), false);

    $items = $(treeView.$element()).find(".dx-treeview-item");

    assert.equal($items.length, 6, "6 items were rendered after filtration");
});

QUnit.test("searchValue - cut value - update selection", function(assert) {
    var data = $.extend(true, [], DATA[6]);

    var treeView = initTree({
            items: data,
            showCheckBoxesMode: "normal",
            searchValue: "item 1"
        }).dxTreeView("instance"),
        $items = $(treeView.$element()).find(".dx-treeview-item"),
        $checkboxes = $(treeView.$element()).find(".dx-checkbox");

    assert.equal($items.length, 6, "6 items were rendered");
    $checkboxes.eq(2).trigger("dxclick");

    assert.strictEqual($checkboxes.eq(0).dxCheckBox("instance").option("value"), true);
    assert.strictEqual($checkboxes.eq(1).dxCheckBox("instance").option("value"), true);
    assert.strictEqual($checkboxes.eq(2).dxCheckBox("instance").option("value"), true);

    treeView.option("searchValue", "item");

    $checkboxes = $(treeView.$element()).find(".dx-checkbox");
    assert.equal($checkboxes.eq(0).dxCheckBox("instance").option("value"), undefined);
    assert.equal($checkboxes.eq(1).dxCheckBox("instance").option("value"), undefined);
    assert.equal($checkboxes.eq(2).dxCheckBox("instance").option("value"), true);
    assert.equal($checkboxes.eq(3).dxCheckBox("instance").option("value"), false);
    assert.equal($checkboxes.eq(4).dxCheckBox("instance").option("value"), false);
    assert.equal($checkboxes.eq(5).dxCheckBox("instance").option("value"), false);
    assert.equal($checkboxes.eq(6).dxCheckBox("instance").option("value"), false);
    assert.equal($checkboxes.eq(7).dxCheckBox("instance").option("value"), false);

    $items = $(treeView.$element()).find(".dx-treeview-item");

    assert.equal($items.length, 8, "8 items were rendered after filtration");
});

QUnit.test("searchValue with the same text in items", function(assert) {
    var data = [
        { id: "1", parentId: 0, text: "Item 1" },
        { id: "11", parentId: "1", text: "Item 11" },
        { id: "12", parentId: "1", text: "Item 555" },
        { id: "2", parentId: 0, text: "Item 2" },
        { id: "21", parentId: "2", text: "Item 25" },
        { id: "22", parentId: "2", text: "Item 22" }
    ];

    var treeView = initTree({
            items: data,
            dataStructure: "plain",
            showCheckBoxesMode: "normal"
        }).dxTreeView("instance"),
        $checkboxes;

    treeView.option("searchValue", "25");
    $checkboxes = $(treeView.$element()).find(".dx-checkbox");
    $checkboxes.eq(1).trigger("dxclick");

    assert.equal($checkboxes.eq(0).dxCheckBox("instance").option("value"), true);
    assert.equal($checkboxes.eq(1).dxCheckBox("instance").option("value"), true);

    treeView.option("searchValue", "");
    $checkboxes = $(treeView.$element()).find(".dx-checkbox");
    assert.equal($checkboxes.eq(0).dxCheckBox("instance").option("value"), false);
    assert.equal($checkboxes.eq(1).dxCheckBox("instance").option("value"), undefined);
    assert.equal($checkboxes.eq(2).dxCheckBox("instance").option("value"), true);
    assert.equal($checkboxes.eq(3).dxCheckBox("instance").option("value"), false);

    treeView.option("searchValue", "5");
    $checkboxes = $(treeView.$element()).find(".dx-checkbox");
    assert.equal($checkboxes.eq(0).dxCheckBox("instance").option("value"), false);
    assert.equal($checkboxes.eq(1).dxCheckBox("instance").option("value"), false);
    assert.equal($checkboxes.eq(2).dxCheckBox("instance").option("value"), true);
    assert.equal($checkboxes.eq(3).dxCheckBox("instance").option("value"), true);

    treeView.option("searchValue", "55");
    $checkboxes = $(treeView.$element()).find(".dx-checkbox");
    $checkboxes.eq(1).trigger("dxclick");
    assert.equal($checkboxes.eq(0).dxCheckBox("instance").option("value"), true);
    assert.equal($checkboxes.eq(1).dxCheckBox("instance").option("value"), true);

    treeView.option("searchValue", "");
    $checkboxes = $(treeView.$element()).find(".dx-checkbox");
    assert.equal($checkboxes.eq(0).dxCheckBox("instance").option("value"), undefined);
    assert.equal($checkboxes.eq(1).dxCheckBox("instance").option("value"), false);
    assert.equal($checkboxes.eq(2).dxCheckBox("instance").option("value"), true);
    assert.equal($checkboxes.eq(3).dxCheckBox("instance").option("value"), undefined);
    assert.equal($checkboxes.eq(4).dxCheckBox("instance").option("value"), true);
    assert.equal($checkboxes.eq(5).dxCheckBox("instance").option("value"), false);
});

QUnit.test("searchEnabled", function(assert) {
    var $treeView = initTree({
            items: $.extend(true, [], DATA[1]),
            searchEnabled: true
        }),
        instance = $treeView.dxTreeView("instance");

    instance.option("searchEnabled", false);

    assert.notOk($treeView.find(".dx-treeview-search").length, "hasn't search editor");

    instance.option("searchEnabled", true);

    assert.ok($treeView.children().first().hasClass("dx-treeview-search"), "has search editor");
});

QUnit.test("searchMode", function(assert) {
    var $treeView = initTree({
            items: $.extend(true, [], DATA[1]),
            searchValue: "item 2"
        }),
        instance = $treeView.dxTreeView("instance"),
        $items = $treeView.find(".dx-treeview-item");

    assert.strictEqual($items.length, 3, "count item");

    instance.option("searchMode", "startswith");

    $items = $treeView.find(".dx-treeview-item");
    assert.strictEqual($items.length, 1, "count item");
});

QUnit.test("current expansion should be saved after searchMode option was changed", function(assert) {
    var $treeView = initTree({
            items: [{
                id: "1",
                items: [{ id: "1_1", expanded: true, items: [{ id: "1_1_1" }] }]
            }, {
                id: "2",
                items: [{ id: "2_1", expanded: true, items: [{ id: "2_1_1" }] }]
            }]
        }),
        instance = $treeView.dxTreeView("instance"),
        items;

    instance.collapseItem("1");
    instance.collapseItem("2");

    instance.option("searchMode", "startswith");
    items = instance.option("items");

    assert.notOk(items[0].expanded, "item is collapsed");
    assert.notOk(items[1].expanded, "item is collapsed");
});

QUnit.test("searchExpr", function(assert) {
    var $treeView = initTree({
            items: [
                { key: 1, text: "Item 1", value: "test 3" },
                { key: 2, text: "Item 2", value: "test 3" },
                { key: 3, text: "Item 3", value: "test 1" }
            ],
            searchValue: "3"
        }),
        instance = $treeView.dxTreeView("instance"),
        $items = $treeView.find(".dx-treeview-item");

    assert.strictEqual($items.length, 1, "count item");
    assert.strictEqual($items.text(), "Item 3", "text of the first item");

    instance.option("searchExpr", "value");

    $items = $treeView.find(".dx-treeview-item");
    assert.strictEqual($items.length, 2, "count item");
    assert.strictEqual($items.first().text(), "Item 1", "text of the first item");
    assert.strictEqual($items.last().text(), "Item 2", "text of the second item");
});

QUnit.test("searchEditorOptions", function(assert) {
    var $treeView = initTree({
            items: $.extend(true, [], DATA[1]),
            searchEnabled: true,
            searchEditorOptions: {
                placeholder: "Search"
            }
        }),
        searchEditorInstance = $treeView.children().first().dxTextBox("instance"),
        instance = $treeView.dxTreeView("instance");

    assert.strictEqual(searchEditorInstance.option("placeholder"), "Search", "placeholder of the search editor");

    instance.option("searchEditorOptions", { placeholder: "Test" });

    searchEditorInstance = $treeView.children().first().dxTextBox("instance"),
    assert.strictEqual(searchEditorInstance.option("placeholder"), "Test", "placeholder of the search editor");
});

QUnit.test("parentIdExpr should work correctly when it was dynamically changed", function(assert) {
    var $treeView = initTree({
            items: [{ text: "item 1", id: 1, parentId: 0, expanded: true }, { text: "item 11", id: 2, parentId: 1 }],
            dataStructure: "plain"
        }),
        instance = $treeView.dxTreeView("instance");

    instance.option("parentIdExpr", "parentId");
    var $node1 = $treeView.find(".dx-treeview-node").eq(0);

    assert.equal($node1.find(".dx-treeview-node").length, 1, "item 11 became a child of the item 1");
});


QUnit.module("Option changing for single item");

QUnit.test("node should have disabled class when it was disabled at runtime", function(assert) {
    var $treeView = initTree({
            items: [{ text: "item 1" }],
            dataStructure: "plain"
        }),
        instance = $treeView.dxTreeView("instance"),
        $item = $treeView.find(".dx-treeview-item").eq(0);

    instance.option("items[0].disabled", true);
    assert.ok($item.hasClass("dx-state-disabled"), "item should be disabled");

    instance.option("items[0].disabled", false);
    assert.notOk($item.hasClass("dx-state-disabled"), "item should not be disabled");
});

QUnit.test("checkbox should have disabled class when item was disabled at runtime", function(assert) {
    var $treeView = initTree({
            items: [{ text: "item 1" }],
            dataStructure: "plain",
            showCheckBoxesMode: "normal"
        }),
        instance = $treeView.dxTreeView("instance"),
        $checkbox = $treeView.find(".dx-checkbox").eq(0);

    instance.option("items[0].disabled", true);
    assert.ok($checkbox.hasClass("dx-state-disabled"), "checkbox should be disabled");

    instance.option("items[0].disabled", false);
    assert.notOk($checkbox.hasClass("dx-state-disabled"), "checkbox should not be disabled");
});

QUnit.test("node should have disabled class when it was disabled at runtime with expressions", function(assert) {
    var $treeView = initTree({
            items: [{ text: "item 1" }],
            disabledExpr: "disable",
            dataStructure: "plain"
        }),
        instance = $treeView.dxTreeView("instance"),
        $item = $treeView.find(".dx-treeview-item").eq(0);

    instance.option("items[0].disable", true);
    assert.ok($item.hasClass("dx-state-disabled"), "item should be disabled");

    instance.option("items[0].disable", false);
    assert.notOk($item.hasClass("dx-state-disabled"), "item should not be disabled");
});

QUnit.test("checkbox should have disabled class when item was disabled at runtime with expressions", function(assert) {
    var $treeView = initTree({
            items: [{ text: "item 1" }],
            dataStructure: "plain",
            disabledExpr: "disable",
            showCheckBoxesMode: "normal"
        }),
        instance = $treeView.dxTreeView("instance"),
        $checkbox = $treeView.find(".dx-checkbox").eq(0);

    instance.option("items[0].disable", true);
    assert.ok($checkbox.hasClass("dx-state-disabled"), "checkbox should be disabled");

    instance.option("items[0].disable", false);
    assert.notOk($checkbox.hasClass("dx-state-disabled"), "checkbox should not be disabled");
});
