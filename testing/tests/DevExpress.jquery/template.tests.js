"use strict";

var $ = require("jquery"),
    Template = require("ui/widget/jquery.template"),
    setTemplateEngine = require("ui/set_template_engine"),
    errors = require("core/errors");

window.doT = require("../../../vendor/template-engines/doT.min.js");
require("../../../vendor/template-engines/handlebars.min.js");
require("../../../vendor/template-engines/hogan-2.0.0.js");
require("../../../vendor/template-engines/jquery.tmpl.min.js");
require("../../../vendor/template-engines/jsrender.min.js");
window.Mustache = require("../../../vendor/template-engines/mustache.min.js");
window._ = require("../../../vendor/template-engines/underscore-min.js");

if(QUnit.urlParams["nojquery"]) {
    return;
}

QUnit.module("custom template rendering", {
    beforeEach: function() {
        this.originalLog = errors.log;
    },
    afterEach: function() {
        errors.log = this.originalLog;
    }
});

var createMarkup = function(content, tag) {
    return $("<" + tag + ">").html(content);
};

var renderTemplate = function(engine, element, data, assert) {
    setTemplateEngine(engine);
    var template = new Template(element);
    var container = $('<div>');

    var result = template.render({ model: data, container: container });

    assert.notEqual(typeof result, "string", "correct result type");

    return container;
};

var checkTemplateEngine = function(engine, string, assert) {
    var log;
    errors.log = function() { log.push($.makeArray(arguments)); };

    // empty
    log = [];
    renderTemplate(engine, $(), { text: '123' }, assert);
    assert.equal(log.length, 0);

    // script
    log = [];
    errors.log = function() { log.push($.makeArray(arguments)); };
    var container = renderTemplate(engine, createMarkup(string, 'script type="text/html"'), { text: '123' }, assert);
    assert.equal(container.text(), '123');
    assert.equal(log.length, 0);
};

QUnit.module("predefined templates");

QUnit.test("jquery-tmpl", function(assert) {
    checkTemplateEngine('jquery-tmpl', '${text}', assert);
});

QUnit.test("jsrender", function(assert) {
    checkTemplateEngine('jsrender', '{{:text}}', assert);
});

QUnit.test("mustache", function(assert) {
    checkTemplateEngine('mustache', '{{text}}', assert);
});

QUnit.test("doT", function(assert) {
    checkTemplateEngine('doT', '{{=it.text}}', assert);
});

QUnit.test("hogan", function(assert) {
    checkTemplateEngine('hogan', '{{text}}', assert);
});

QUnit.test("underscore", function(assert) {
    checkTemplateEngine('underscore', '<%=text%>', assert);
});

QUnit.test("handlebars", function(assert) {
    checkTemplateEngine('handlebars', '{{text}}', assert);
});


QUnit.module("user template engine");

var customUserTemplate = {
    compile: function(element) {
        element = $(element);
        if(element[0].nodeName.toLowerCase() !== "script") {
            element = $("<div>").append(element);
        }

        var text = element.html();

        return text.split('$');
    },
    render: function(template, data, index) {
        var i;
        var result = template.slice(0);
        for(i = 0; i < template.length; i++) {
            if(template[i] in data) {
                result[i] = data[template[i]];
            }
            if(template[i] === "@index") {
                result[i] = index;
            }
        }
        return result.join('');
    }
};

QUnit.test("custom user template engine for div template", function(assert) {
    setTemplateEngine(customUserTemplate);

    var template = new Template($('<div>$text$</div>'));
    var container = $('<div>');

    //act
    template.render({ model: { text: 123 }, container: container });

    //assert
    assert.equal(container.children().length, 1);
    assert.equal(container.children().text(), '123');
});

QUnit.test("custom user template engine for script template", function(assert) {
    setTemplateEngine(customUserTemplate);

    var template = new Template($("<script type='text/html'>Text: <b>$text$</b><\/script>"));
    var container = $('<div>');

    //act
    template.render({ model: { text: 123 }, container: container });

    //assert
    assert.equal(container.children("b").length, 1);
    assert.equal(container.text().replace('\r\n', ''), 'Text: 123');
});

QUnit.test("custom user template engine has access to item index", function(assert) {
    setTemplateEngine(customUserTemplate);

    var template = new Template($("<div>$text$, ($@index$)</div>"));
    var container = $('<div>');

    //act
    template.render({ model: { text: 123 }, container: container, index: 1 });

    //assert
    assert.equal(container.children().text(), '123, (1)');
});

QUnit.test("removing div template from document on creation", function(assert) {
    setTemplateEngine(customUserTemplate);

    var template = new Template($('<div>$text$</div>'));
    var container = $('<div>');

    //act
    template.render({ model: { text: 123 }, container: container });

    //assert
    assert.equal(container.children().length, 1);
    assert.equal(container.children().text(), '123');
});

QUnit.test("template render result", function(assert) {
    //act
    setTemplateEngine(customUserTemplate);

    var template = new Template($('<div>$text$</div>'));
    var container = $('<div>');

    //act
    var result = template.render({ model: { text: 123 }, container: container });

    result = $(result);

    //assert
    assert.equal(result.length, 1);
    assert.equal(result[0].tagName.toLowerCase(), 'div');
    assert.equal(result.text(), '123');
});
