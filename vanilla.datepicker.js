(function(window, document) {
    currentDatepicker = null;

    datepicker = function( query, options ) {
        if (!(this instanceof datepicker))
            return new datepicker( query, options );

        currentDatepicker = self = this;
        self.options = extend({}, datepicker.defaults, options);
        self.query = query;

        self.__init__();
        
    }

    datepicker.prototype = {
        constructor: datepicker,

        __init__: function(){
            // Bind display on click
            document.removeEventListener('click', self.bindCalendar, false);
            document.addEventListener('click', self.bindCalendar, false);
        },

        matchesReferers: function( elm ){
            self.referers = document.querySelectorAll( self.query );
            for (var i=0; i< self.referers.length; i++) {
                if (elm === self.referers[i]) return true;
            }
            return false;
        },

        close: function(){
            delete self.current;
            delete self.target;
            if (self.picker) self.picker.remove();
        },

        show: function( target ){
            self.target = typeof target != typeof undefined ? target : self.target;
            if (target || typeof self.current == typeof undefined) {
                var current = new Date();
                if (target) self.selected = null;
                if (target && target.value) {
                    var ts = Date.parse( target.value.toLowerCase() );
                    current = new Date( ts );
                    self.selected = {
                        year: current.getFullYear(),
                        month: current.getMonth(),
                        day: current.getDate() 
                    }
                }
                self.current = {
                    year: current.getFullYear(),
                    month: current.getMonth()
                }
            }
            self.cleanPicker();
            self.drawPicker();
        },

        cleanPicker: function(){
            var picker = document.querySelector('.vanilla-datepicker');
            if (picker) picker.remove();
        },

        drawPicker: function(){
            var position = {
                x:self.target.offsetLeft,
                y:self.target.offsetTop + self.target.offsetHeight
            };
            self.picker = document.createElement('div');
            self.picker.classList.add('vanilla-datepicker');
            self.picker.style.left = position.x + 'px';
            self.picker.style.top = position.y + 'px';
            self.picker.appendChild( self.drawNavigation() );
            self.picker.appendChild( self.drawWeekHeader() );
            var weeks = self.getWeeks();
            for (var i=0; i<weeks.length; i++) {
                self.picker.appendChild( weeks[i] );
            }

            self.target.parentNode.insertBefore( self.picker, self.target.nextSibling );
        },

        drawNavigation: function(){
            var nav = document.createElement('div');
            nav.classList.add('title-nav');

            if (self.options.navigateYear) {
                previousYear = document.createElement('div');
                previousYear.classList.add('year-navigate');
                previousYear.classList.add('previous');
                previousYear.innerHTML = '<<';

                nextYear = document.createElement('div');
                nextYear.classList.add('year-navigate');
                nextYear.classList.add('next');
                nextYear.innerHTML = '>>';
            }
            previousMonth = document.createElement('div');
            previousMonth.classList.add('month-navigate');
            previousMonth.classList.add('previous');
            previousMonth.innerHTML = '<';

            currentMonth = document.createTextNode( 
                self.options.months.long[self.current.month] + ' ' + self.current.year
                );

            nextMonth = document.createElement('div');
            nextMonth.classList.add('month-navigate');
            nextMonth.classList.add('next');
            nextMonth.innerHTML = '>';
            //nextMonth.addEventListener('click', self.getNextMonth, false);

            if (self.options.navigateYear) nav.appendChild( previousYear );
            nav.appendChild( previousMonth );
            nav.appendChild( currentMonth );
            nav.appendChild( nextMonth );
            if (self.options.navigateYear) nav.appendChild( nextYear );

            return nav;
        },

        getPreviousYear: function() {
            var current = new Date( self.current.year -1, self.current.month);
            self.current = {
                year: current.getFullYear(),
                month: current.getMonth()
            };
            self.show();
        },

        getNextYear: function() {
            var current = new Date( self.current.year + 1, self.current.month);
            self.current = {
                year: current.getFullYear(),
                month: current.getMonth()
            };
            self.show();
        },

        getPreviousMonth: function() {
            var current = new Date( self.current.year, self.current.month - 1);
            self.current = {
                year: current.getFullYear(),
                month: current.getMonth()
            };
            self.show();
        },

        getNextMonth: function() {
            var current = new Date( self.current.year, self.current.month + 1);
            self.current = {
                year: current.getFullYear(),
                month: current.getMonth()
            };
            self.show();
        },

        drawWeekHeader: function(){
            var weekdays = self.options.weekdays.short.slice(self.options.firstDayOfWeek)
                .concat(self.options.weekdays.short.slice(0, self.options.firstDayOfWeek));
            var weekHeader = document.createElement('div');
            weekHeader.classList.add('week-header');
            for (var i=0; i<7; i++) {
                var dayOfWeek = document.createElement('div');
                dayOfWeek.innerHTML = weekdays[i];
                weekHeader.appendChild( dayOfWeek );
            }
            return weekHeader;
        },

        getWeeks: function(){
            // Get week days according to options
            var weekdays = self.options.weekdays.short.slice(self.options.firstDayOfWeek)
                .concat(self.options.weekdays.short.slice(0, self.options.firstDayOfWeek));
            // Get first day of month and update acconding to options
            var firstOfMonth = new Date(self.current.year, self.current.month, 1).getDay();
            firstOfMonth = firstOfMonth < self.options.firstDayOfWeek ? 7+(firstOfMonth - self.options.firstDayOfWeek ) : firstOfMonth - self.options.firstDayOfWeek;

            var daysInPreviousMonth = new Date(self.current.year, self.current.month, 0).getDate();
            var daysInMonth = new Date(self.current.year, self.current.month+1, 0).getDate();

            var days = [],
                weeks = [];
            // Define last days of previous month if current month does not start on `firstOfMonth`
            for (var i=firstOfMonth-1; i>=0; i--) {
                var day = document.createElement('div');
                day.classList.add( 'no-select' );
                day.innerHTML = daysInPreviousMonth - i;
                days.push( day );
            }
            // Define days in current month
            for (var i=0; i<daysInMonth; i++) {
                if (i && (firstOfMonth+i)%7 === 0) {
                    weeks.push( self.addWeek( days ) );
                    days = [];
                }
                var day = document.createElement('div');
                day.classList.add('day');
                if (self.selected && self.selected.year == self.current.year && self.selected.month == self.current.month && self.selected.day == i+1) {
                    day.classList.add('selected');
                }
                day.innerHTML = i+1;
                days.push( day );
            }
            // Define days of next month if last week is not full
            if (days.length) {
                var len = days.length;
                for (var i=0; i<7-len; i++) {
                    var day = document.createElement('div');
                    day.classList.add( 'no-select' );
                    day.innerHTML = i+1;
                    days.push( day );
                }
                weeks.push( self.addWeek( days ) );
            }
            return weeks;
        },

        addWeek: function( days ) {
            var week = document.createElement('div');
            week.classList.add('week');
            for (var i=0; i<days.length; i++) {
                week.appendChild( days[i] );
            }
            return week;
        },

        setDate: function( day ) {
            var dayOfWeek = new Date(self.current.year, self.current.month, day).getDay();
            var date = self.options.outputFormat
                .replace('%a', self.options.weekdays.short[dayOfWeek] )
                .replace('%A', self.options.weekdays.long[dayOfWeek] )
                .replace('%d', ('0' + day).slice(-2) )
                .replace('%e', day )
                .replace('%b', self.options.months.short[self.current.month] )
                .replace('%B', self.options.months.long[self.current.month] )
                .replace('%m', ('0' + (self.current.month+1)).slice(-2) )
                .replace('%w', dayOfWeek )
                .replace('%Y', self.current.year );
            self.target.value = date;
        },

        bindCalendar: function(event) {
            var target = event.target;
            if (target.className == 'month-navigate next') {
                self.getNextMonth();
            } else if (target.className == 'month-navigate previous') {
                self.getPreviousMonth();
            } else if (target.className == 'year-navigate next') {
                self.getNextYear();
            } else if (target.className == 'year-navigate previous') {
                self.getPreviousYear();
            } else if (target.className == 'day') {
                self.setDate( target.innerHTML );
                self.close();
            } else {
                while (target && !self.matchesReferers( target ) && target.className != 'vanilla-datepicker') {
                    target = target.parentNode;
                }
                if (target && self.matchesReferers( target )) self.show(target);
                if (!target) self.close();
            }
        }
    };

    datepicker.defaults = {
        firstDayOfWeek: 0,
        months: {
            short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        navigateYear: true,
        outputFormat:'%Y-%m-%d',
        weekdays: {
            short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        }
    };

    // utils
    var camelCase = function( string ){
        return  string.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    };

    var extend = function(out) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i])
                continue;
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
            }
        }

        return out;
    };

    var is = function( el, query ) {
        return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, query);
    }
}) (window, document);