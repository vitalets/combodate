module("actions");

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

test("values not if templates are loss", function () {
  var f = f24, vf = 'H', // show only hours combo
      d = moment([1984, 4, 15, 20, 5, 10]),
      newD = moment([1984, 4, 15, 21, 5, 10]),
      e = $('<input data-format="'+f+'" data-template="'+vf+'" value="'+d.format(f)+'">')
      .appendTo('#qunit-fixture')
      .combodate();

  var sel = e.siblings('.combodate').find('.hour');
  sel.val(21);
  sel.trigger('change');

  equal(e.val(), newD.format(f), 'combodate val ok');
  equal(e.combodate('getValue', f), newD.format(f), 'combodate getValue ok');
});