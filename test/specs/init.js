module("init");

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
  var e = $('<input data-format="D-M-YY" data-template="DD - MM - YYYY">').combodate();
  equal(e.data('combodate').options.format, 'D-M-YY', 'format taken from data-* attribute');
  equal(e.data('combodate').options.template, 'DD - MM - YYYY', 'template taken from data-* attribute');
});

test("should hide original input and show selects (24h)", function () {
  var e = $('<input data-template="'+vf24+'">').appendTo('#qunit-fixture').combodate({
      firstItem: 'name'
  });

  ok(!e.is(':visible'), 'input hidden');
  $.each(map, function(k, v) {
      if(k === 'ampm') return;
      var sel = e.siblings('.combodate').find('.'+k);
      ok(sel.is(':visible'), k+' shown');
      equal(sel.find('option').length, counts[k]+1, k+' options count ok');
  });
});

test("should hide original input and show selects (12h)", function () {
  var e = $('<input data-template="'+vf12+'">').appendTo('#qunit-fixture').combodate({
       firstItem: 'none'
  }),
  cnt = $.extend({}, counts, {hour: 12});

  ok(!e.is(':visible'), 'input hidden');
  $.each(map, function(k, v) {
      var sel = e.siblings('.combodate').find('.'+k);
      ok(sel.is(':visible'), k+' shown');
      equal(sel.find('option').length, cnt[k], k+' options count ok');
  });
});

test("should load value from input and save new values on change (24h)", function () {
  var f = f24, vf = vf24,
      d = moment([1984, 4, 15, 20, 5, 10]),
      change_counter = 0, i = 0,
      e = $('<input data-format="'+f+'" data-template="'+vf+'" value="'+d.format(f)+'">').appendTo('#qunit-fixture').combodate();

  e.on('change', function(){
    change_counter++;
  });

  //check values in combos
  $.each(map, function(k, v) {
      if(k === 'ampm') return;
      var sel = e.siblings('.combodate').find('.'+k);
      equal(sel.val(), d[v](), k+' ok');
  });

  //set new values
  $.each(map, function(k, v){
      if(k === 'ampm') return;
      var sel = e.siblings('.combodate').find('.'+k),
          newVal = parseInt(sel.val(), 10) + (k == 'minute' ? 5 : 1);

      sel.val(newVal);
      sel.trigger('change');
      d[v](newVal);

      equal(e.val(), d.format(f), 'input new value ok: '+k);

      i++;
      equal(change_counter, i, 'input chnage called');
  });
});

test("should load value from input and save new values on change (12h)", function () {
  var f = f12, vf = vf12,
      d = moment([1984, 4, 15, 20, 5, 10]),
      e = $('<input data-format="'+f+'" data-template="'+vf+'" value="'+d.format(f)+'">').appendTo('#qunit-fixture').combodate();

  //check values in combos
  $.each(map, function(k, v) {
      var sel = e.siblings('.combodate').find('.'+k),
          check_v;

          if(k === 'ampm') {
              check_v = 'pm';
          } else if(k === 'hour') {
              check_v = d[v]()-12;
          } else {
              check_v = d[v]();
          }

      equal(sel.val(), check_v, k+' ok');
  });

  //set new values
  $.each(map, function(k, v){
      var sel = e.siblings('.combodate').find('.'+k),
          newVal;

      if(k === 'ampm') {
         sel.val('am');
         d.subtract('hours', 12);
      } else if(k === 'hour') {
         newVal = parseInt(sel.val(), 10) + 1;
         sel.val(newVal);
         d[v](newVal+12);
      } else {
         newVal = parseInt(sel.val(), 10) + (k == 'minute' ? 5 : 1);
         sel.val(newVal);
         d[v](newVal);
      }

      sel.trigger('change');
      equal(e.val(), d.format(f), 'input new value ok: '+k);
  });

});

test("confusion at noon and midnight", function () {
  var f = f12, vf = vf12,
      d = moment([1984, 4, 15, 12, 00, 00]),
      d1 = moment([1984, 4, 15, 00, 00, 00]),
      e = $('<input data-format="'+f+'" data-template="'+vf+'" value="'+d.format(f)+'">').appendTo($('<div>').appendTo('#qunit-fixture')).combodate(),
      e1 = $('<input data-format="'+f+'" data-template="'+vf+'" value="'+d1.format(f)+'">').appendTo($('<div>').appendTo('#qunit-fixture')).combodate();

      equal(e.siblings('.combodate').find('.hour').val(), '12', '12 hours ok');
      equal(e.siblings('.combodate').find('.ampm').val(), 'pm', '12 ampm ok');

      equal(e1.siblings('.combodate').find('.hour').val(), '12', '00 hours ok');
      equal(e1.siblings('.combodate').find('.ampm').val(), 'am', '00 ampm ok');
});

test("empty value in input (select nothing)", function () {
  var f = f24, vf = vf24,
      e = $('<input data-format="'+f+'" data-template="'+vf+'">').appendTo('#qunit-fixture').combodate();

  $.each(map, function(k, v) {
      if(k === 'ampm') return;
      var sel = e.siblings('.combodate').find('.'+k);
      equal(sel.val(), '', k+' empty');
  });

});

test("empty value in input (use value from config)", function () {
  var  f = f24, vf = vf24, d = moment(),
       e = $('<input data-format="'+f+'" data-template="'+vf+'">').appendTo('#qunit-fixture').combodate({
           value: d.toDate(),
           minuteStep: 1
       });

  equal(e.val(), d.format(f), 'input value updated');

  //check values in combos
  $.each(map, function(k, v) {
      if(k === 'ampm') return;
      var sel = e.siblings('.combodate').find('.'+k);
      equal(sel.val(), d[v](), k+' ok');
  });

});

test("select incorrect date", function () {
  var f = f12, vf = vf12,
      d = moment([1984, 1, 28]),
      e = $('<input data-format="'+f+'" value="'+d.format(f)+'">').appendTo('#qunit-fixture').combodate({
          errorClass: 'error'
      });

  //incorrect date
  e.siblings('.combodate').find('.day').val(31).trigger('change');
  ok(e.siblings('.combodate').hasClass('error'), 'error class added');
  equal(e.val(),  '', 'value set empty');

  //set back correct date
  e.siblings('.combodate').find('.day').val(27).trigger('change');
  d.date(27);
  ok(!e.siblings('.combodate').hasClass('error'), 'error class removed');
  equal(e.val(), d.format(f), 'new value stored');
});

test("destroy", function () {
  var f = 'DD-MM-YYYY',
      d = moment([1984, 1, 28]),
      e = $('<input data-format="'+f+'" value="'+d.format(f)+'">').appendTo('#qunit-fixture').combodate();

  ok(e.siblings('.combodate').length, 'combodate exists');
  e.combodate('destroy');

  ok(!e.siblings('.combodate').length, 'combodate removed');
  ok(e.is(':visible'), 'element visible');
});

test("if input disabled, combodate should be disabled too", function () {
  var f = f24, vf = vf24,
      e = $('<input disabled="disabled" data-format="'+f+'" data-template="'+vf+'">')
      .appendTo('#qunit-fixture')
      .combodate();

  $.each(map, function(k, v) {
      if(k === 'ampm') return;
      var sel = e.siblings('.combodate').find('.'+k);
      ok(sel.prop('disabled'), k + ' disabled');
  });

});