module("api");

test("getValue", function () {
  var f = f12, vf = vf12,
      d = moment([1984, 4, 15, 20, 5, 10]),
      e = $('<input data-format="'+f+'" data-template="'+vf+'" value="'+d.format(f)+'">').appendTo('#qunit-fixture').combodate();

  equal(e.combodate('getValue'), d.format(f), 'getValue ok');
  equal(e.combodate('getValue', null).format(f), d.format(f), 'getValue as object ok');
});

test("setValue", function () {
  var f = f12, vf = vf12,
      d = moment([1984, 4, 15, 20, 5, 10]),
      d2 = moment([1985, 4, 16, 5, 2, 10]),
      d3 = moment([1986, 4, 17, 7, 4, 10]),
      change_counter = 0, i = 0,
      e = $('<input data-format="'+f+'" value="'+d.format(f)+'">')
      .appendTo('#qunit-fixture')
      .combodate();

  e.on('change', function() {
    change_counter++;
  });

  //set incorrect value
  e.combodate('setValue', 'incorrect date');
  equal(e.val(), d.format(f), 'value ok (incorrect)');
  equal(change_counter, i, 'input change not called');

  //set date by string
  e.combodate('setValue', d2.format(f));
  equal(e.val(), d2.format(f), 'value ok (string)');
  i++;
  equal(change_counter, i, 'input change called');

  //set date by object
  e.combodate('setValue', d3.toDate());
  equal(e.val(), d3.format(f), 'value ok (object)');
  i++;
  equal(change_counter, i, 'input change called');

  //todo: set empty date
  //e.combodate('setValue', 'incorrect date');
  //equal(e.val(), d.format(f), 'value ok (incorrect)');
  //equal(change_counter, i, 'input change not called');
});