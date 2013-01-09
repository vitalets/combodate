/**
* Combodate - 1.0.0
* Combobox datetime picker.
* Turns text input into several comboboxes to pick day, month, year, hour, minute and second.
* Uses momentjs as datetime library http://momentjs.com.
* For i18n include corresponding file from https://github.com/timrwood/moment/tree/master/lang 
*
* Author: Vitaliy Potapov
* Project page: http://github.com/vitalets/combodate
* Copyright (c) 2012 Vitaliy Potapov. Released under MIT License.
**/
(function ($) {

    var Combodate = function (element, options) {
        this.$element = $(element);
        if(!this.$element.is('input')) {
            $.error('Combodate should be applied to INPUT element');
            return;
        }
        this.options = $.extend({}, $.fn.combodate.defaults, options, this.$element.data());
        this.init();  
     };

    Combodate.prototype = {
        constructor: Combodate, 
        init: function () {
            this.$widget = $('<span class="combodate"></span>');
            this.$element.after(this.$widget).hide();
                      
            this.initDay();
            this.initMonth();
            this.initYear();
            this.initHour();
            this.initMinute();
            this.initSecond();
            this.initAmpm();
            
            //update original input on change 
            this.$widget.on('change', $.proxy(function(){
                this.$element.val(this.getValue());
            }, this));
            
            this.$widget.find('select').css('width', 'auto');
                                       
            //hide original input and insert widget                                       
            this.$element.hide().after(this.$widget);
            
            //set initial value
            this.setValue(this.$element.val() || this.options.value);
        },

        /*
        Init day
        */
        initDay: function() {
            if(this.options.format.indexOf('D') !== -1) {
                var values = [];
                
                this.firstItem(values, 'd');
                
                for(var i=1; i<=31; i++) {
                    values.push([i, i]);
                }        
                
                this.$day = $('<select class="day"></select>').html(this.getItems(values));
                this.$widget.append(this.$day);          
            }
        },
        
        /*
        Init month
        */
        initMonth: function() {
            if(this.options.format.indexOf('M') !== -1) {
                var values = [], name, header,
                    longNames = this.options.format.indexOf('MMMM') !== -1,
                    shortNames = this.options.format.indexOf('MMM') !== -1;
                
                this.firstItem(values, 'M');
                
                for(var i=0; i<=11; i++) {
                    if(longNames) {
                        name = moment.months[i];
                    } else if(shortNames) {
                        name = moment.monthsShort[i];
                    } else {
                        name = i+1;
                    }
                    
                    values.push([i, name]);
                } 

                this.$month = $('<select class="month"></select>').html(this.getItems(values));          
                if(this.$day) {
                   this.$widget.append(this.options.dateSep);
                }
                this.$widget.append(this.$month);
            }
        },  
        
        /*
        Init year
        */
        initYear: function() {
            if(this.options.format.indexOf('Y') !== -1) {
                var values = [];
                
                this.firstItem(values, 'y');
                
                for(var i=this.options.maxYear; i>=this.options.minYear; i--) {
                    values.push([i, i]);
                }    
                              
                this.$year = $('<select class="year"></select>').html(this.getItems(values));          
                if(this.$month) {
                   this.$widget.append(this.options.dateSep);
                }
                this.$widget.append(this.$year);                    
            }
        },    
        
        /*
        Init hour
        */
        initHour: function() {
            var h12 = this.options.format.indexOf('h') !== -1,
                h24 = this.options.format.indexOf('H') !== -1,
                leadZero, max, values;
                
            if(h12 || h24) {
                values = [];
                
                this.firstItem(values, 'h');
                
                leadZero = this.options.format.toLowerCase().indexOf('hh') !== -1;
                max = h12 ? 12 : 23;
                
                for(var i=0; i<=max; i++) {
                    values.push([i, leadZero && i <= 9 ? '0'+i : i]);
                }    
                              
                this.$hour = $('<select class="hour"></select>').html(this.getItems(values));          
                this.$widget.append(this.$hour);                    
                if(this.$year) {
                   this.$hour.css('margin-left', 20);
                }                     
            }
        },    
        
        /*
        Init minute
        */
        initMinute: function() {
            if(this.options.format.indexOf('m') !== -1) {
                var values = [];
                
                this.firstItem(values, 'm');
                
                for(var i=0; i<=59; i+= this.options.minuteStep) {
                    values.push([i, i <= 9 ? '0'+i : i]);
                }    
                              
                this.$minute = $('<select class="minute"></select>').html(this.getItems(values));
                this.$widget.append(this.options.timeSep, this.$minute);                              
            }
        },  
        
        /*
        Init second
        */
        initSecond: function() {
            if(this.options.format.indexOf('s') !== -1) {
                var values = [];
                
                this.firstItem(values, 's');
                
                for(var i=0; i<=59; i+= this.options.secondStep) {
                    values.push([i, i <= 9 ? '0'+i : i]);
                }    
                              
                this.$second = $('<select class="second"></select>').html(this.getItems(values));
                this.$widget.append(this.options.timeSep, this.$second);                              
            }
        },  
        
        /*
        Init ampm
        */
        initAmpm: function() {
            var ampmL = this.options.format.indexOf('a') !== -1,
                ampmU = this.options.format.indexOf('A') !== -1;            
            
            if(ampmL || ampmU) {
                var values = [
                  ['am', ampmL ? 'am' : 'AM'],
                  ['pm', ampmL ? 'pm' : 'PM']
                ];
                              
                this.$ampm = $('<select class="ampm"></select>').html(this.getItems(values)).css('margin-left', 10);
                this.$widget.append(this.$ampm);                              
            }
        },                                       
        
        /*
         Returns current date value. 
         If format not specified - `options.format` used.
         If format = `null` - Date object returned.
        */
        getValue: function(format) {
            var dt, 
                notSelected = false,
                values = {
                    //some combobox may be not visible and we use dummy values to get correct date
                    d: this.$day ? parseInt(this.$day.val(), 10) : 1,
                    m: this.$month ? parseInt(this.$month.val(), 10) : 0,
                    y: this.$year ? parseInt(this.$year.val(), 10) : 0,
                    h: this.$hour ? parseInt(this.$hour.val(), 10) : 0,
                    mm: this.$minute ? parseInt(this.$minute.val(), 10) : 0,
                    s: this.$second ? parseInt(this.$second.val(), 10) : 0
                };
            
            //if something not selected, return empty string
            $.each(values, function(k, v) {
                if(isNaN(v)) {
                   notSelected = true;
                   return false; 
                }
            });
            if(notSelected) {
               return '';
            }
            
            //convert hours if 12h format
            if(this.$ampm) {
               values.h = this.$ampm.val() === 'am' ? values.h : values.h+12;
               if(values.h === 24) {
                   values.h = 0;
               }  
            }    
            
            dt = moment([values.y, values.m, values.d, values.h, values.mm, values.s]);
            
            //highlight invalid date
            if(!dt.isValid()) {
               if(this.options.errorClass) {
                   this.$widget.addClass(this.options.errorClass);
               } else {
                   //store original border color
                   if(!this.borderColor) {
                      this.borderColor = this.$widget.find('select').css('border-color'); 
                   }
                   this.$widget.find('select').css('border-color', 'red');
               } 
            } else {
               if(this.options.errorClass) {
                   this.$widget.removeClass(this.options.errorClass);
               } else {
                   this.$widget.find('select').css('border-color', this.borderColor);
               }  
            }
                              
            format = format === undefined ? this.options.format : format;
            if(format === null) {
               return dt.isValid() ? dt.toDate() : null; 
            } else {
               return dt.isValid() ? dt.format(format) : ''; 
            }           
        },
        
        setValue: function(value) {
            if(!value) {
                return;
            }
            
            var dt = typeof value === 'string' ? moment(value, this.options.format) : moment(value),
                that = this;
            
            if(dt.isValid()) {
               $.each({
                 '$day':    dt.date(),   
                 '$month':  dt.month(),   
                 '$year':   dt.year(),   
                 '$hour':   dt.hours(),   
                 '$minute': dt.minutes(),   
                 '$second': dt.seconds(),   
                 '$ampm':   dt.hours()   
               }, function(k, v) {
                   if(that[k]) {
                       that[k].val(v);                       
                   }
               });
            }
            
            this.$element.val(dt.format(this.options.format));            
        },
        
        getItems: function(values) {
            var items = [];
            for(var i=0; i<values.length; i++) {
                items.push('<option value="'+values[i][0]+'">'+values[i][1]+'</option>');                
            }
            return items.join("\n");
        },
        
        firstItem: function(values, key) {
            if(this.options.firstItem === 'name') {
                var header = typeof moment.relativeTime[key] === 'function' ? moment.relativeTime[key](1, true, key, false) : moment.relativeTime[key];
                //take last entry 
                header = header.split(' ').reverse()[0];                
                values.push(['', header]);
            } else if(this.options.firstItem === 'empty') {
                values.push(['', '']);
            }
        }
                    
    };

    $.fn.combodate = function ( option ) {
        var d, args = Array.apply(null, arguments);
        args.shift();

        return this.each(function () {
            var $this = $(this),
            data = $this.data('combodate'),
            options = typeof option == 'object' && option;
            if (!data) {
                $this.data('combodate', (data = new Combodate(this, options)));
            }
            if (typeof option == 'string' && typeof data[option] == 'function') {
                data[option].apply(data, args);
            }
        });
    };  
    
    $.fn.combodate.defaults = {
        format: 'DD-MM-YYYY HH:mm',
        value: new Date(), //initial value 
        minYear: 1970,
        maxYear: 2015,
        minuteStep: 5,
        secondStep: 1,
        firstItem: 'name', //'name', 'empty', 'none'
        errorClass: null,
        dateSep: ' / ',
        timeSep: ' : '
    };

}(window.jQuery));