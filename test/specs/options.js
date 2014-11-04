module("options");

test("firstItem", function () {
  var f = f12, vf = vf12,
      d = moment([1984, 1, 28]),
      e = $('<input data-format="'+f+'" value="'+d.format(f)+'">').appendTo('#qunit-fixture').combodate({ firstItem: 'name' });

  equal(e.siblings('.combodate').find('.day').find('option').eq(0).text(), 'day', 'firstItem name ok');

  $('#qunit-fixture').empty();
  e = $('<input data-format="'+f+'" value="'+d.format(f)+'">').appendTo('#qunit-fixture').combodate({ firstItem: 'empty' }),
  equal(e.siblings('.combodate').find('.day').find('option').eq(0).text(), '', 'firstItem empty ok');

  $('#qunit-fixture').empty();
  e = $('<input data-format="'+f+'" value="'+d.format(f)+'">').appendTo('#qunit-fixture').combodate({ firstItem: 'none' });
  equal(e.siblings('.combodate').find('.day').find('option').eq(0).text(), '1', 'firstItem none ok');

});

test("minYear, maxYear, yearDescending", function () {
  var f = f12, vf = vf12,
      d = moment([2010, 1, 28]),
      e = $('<input data-format="'+f+'" value="'+d.format(f)+'">').appendTo('#qunit-fixture').combodate({
        minYear: 2010,
        maxYear: 2012,
        yearDescending: false
      });

  equal(e.siblings('.combodate').find('.year').find('option').length, 4, 'years length ok');
  equal(e.siblings('.combodate').find('.year').find('option').eq(1).text(), 2010, 'years order ok');

});

test("roundTime: false", function () {
  var f = f24, vf = vf24,
      d = moment([1984, 4, 15, 20, 22, 39]),
      e = $('<input data-format="'+f+'" data-template="'+vf+'" value="'+d.format(f)+'">')
      .appendTo('#qunit-fixture')
      .combodate({
          minuteStep: 5,
          secondStep: 5,
          roundTime: false
      });

  equal(e.siblings('.combodate').find('.minute').val(), null, 'minutes ok');
  equal(e.siblings('.combodate').find('.second').val(), null, 'seconds ok');
});

test("roundTime: true", function () {
  var f = f24, vf = vf24,
      d = moment([1984, 4, 15, 20, 22, 39]),
      e1 = $('<input data-format="'+f+'" data-template="'+vf+'" value="'+d.format(f)+'">')
    .appendTo('#qunit-fixture')
    .combodate({
          minuteStep: 5,
          secondStep: 5,
          roundTime: true
      });

  equal(e1.siblings('.combodate').find('.minute').val(), 20, 'minutes ok');
  equal(e1.siblings('.combodate').find('.second').val(), 40, 'seconds ok');
});

test("smartDays: change days count for different months", function () {
  var f = f24, vf = vf24, d, e;
  var opts = {
    firstItem: 'none', smartDays: true
  };

  // April, 15 => 30
  d = moment([1984, 3, 15, 20, 5, 10]),
  e = $('<input data-format="'+f+'" data-template="'+vf+'" value="'+d.format(f)+'">').appendTo('#qunit-fixture').combodate(opts);
  equal(e.siblings('.combodate').find('.day > option').length, 30, '30 ok');

  // Feb, 15 => 29
  $('#qunit-fixture').empty();
  d = moment([2000, 1, 15, 20, 5, 10]);
  e = $('<input data-format="'+f+'" data-template="'+vf+'" value="'+d.format(f)+'">').appendTo('#qunit-fixture').combodate(opts);
  equal(e.siblings('.combodate').find('.day > option').length, 29, '29 ok');

  // Feb, 15 => 31 (smartDays: off)
  $('#qunit-fixture').empty();
  d = moment([2000, 1, 15, 20, 5, 10]);
  e = $('<input data-format="'+f+'" data-template="'+vf+'" value="'+d.format(f)+'">').appendTo('#qunit-fixture').combodate({
    firstItem: 'none',
    smartDays: false
  });
  equal(e.siblings('.combodate').find('.day > option').length, 31, '31 ok (smartDays off)');

  // null => 31
  $('#qunit-fixture').empty();
  d = '';
  e = $('<input data-format="'+f+'" data-template="'+vf+'" value="">').appendTo('#qunit-fixture').combodate(opts);
  equal(e.siblings('.combodate').find('.day > option').length, 31, '31 ok (empty value)');

  // May, 15 => 31
  $('#qunit-fixture').empty();
  d = moment([1984, 4, 31, 20, 5, 10]);
  e = $('<input data-format="'+f+'" data-template="'+vf+'" value="'+d.format(f)+'">').appendTo('#qunit-fixture').combodate(opts);
  equal(e.siblings('.combodate').find('.day > option').length, 31, '31 ok');

  // change month via combo: june
  e.siblings('.combodate').find('.month').val(5).trigger('change');
  equal(e.siblings('.combodate').find('.day > option').length, 30, 'change via combo');

  // change month via setValue: Feb, 2001
  e.combodate('setValue', moment([2001, 1, 15, 20, 5, 10]));
  equal(e.siblings('.combodate').find('.day > option').length, 28, 'setValue ok');
});