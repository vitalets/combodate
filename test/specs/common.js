var map = {
    day: 'date',
    month: 'month',
    year: 'year',
    hour: 'hours',
    minute: 'minutes',
    second: 'seconds',
    ampm: ''
};

var counts = {
    day: 31,
    month: 12,
    year: $.fn.combodate.defaults.maxYear - $.fn.combodate.defaults.minYear + 1,
    hour: 24,
    minute: 60 / $.fn.combodate.defaults.minuteStep,
    second: 60,
    ampm: 2
};

var f24 = 'DD-MM-YYYY HH:mm:ss';
var vf24 = 'DD / MM / YYYY H : mm : ss';
var f12 = 'DD-MM-YYYY hh:mm:ss A';
var vf12 = 'DD MM YYYY h : mm : ss   a';