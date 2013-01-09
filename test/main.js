module("main");

test("should be defined on jquery object", function () {
  var e = $("<div></div>");
  ok(e.combodate, 'combodate method is defined');
});

test("should applied only on INPUT element", function () {
    var e = $('<div></div>');
    throws(
        function() {
            e.combodate();
        },
        'error occured'
    );

});

test("should return jquery object", function () {
  var e = $('<input>');
  ok(e.combodate() == e, 'jquery object returned');
});  

test("should expose defaults var for settings", function () {
  ok($.fn.combodate.defaults, 'default object exposed');
});    

test("should store instance in data object", function () {
  var e = $('<input>').combodate();
  ok(!!e.data('combodate'), 'instance exists in data');
});    

test("options via data-* attribute", function () {
  var e = $('<input data-format="D-M-YY">').combodate();
  equal(e.data('combodate').options.format, 'D-M-YY', 'format taken from data-* attribute');
});
