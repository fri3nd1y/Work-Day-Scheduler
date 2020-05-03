var scheduleArr = [];
var scheduleObj = {};
var dateArr = [];
var dateObj = {};
var storedSch;
var saveSch;
var date = moment().format('LL');

var previous = 0;
var next = 0;
var day = 0;

$(document).ready(function() {
  init();

  function init() {
    storeDate();
    changeDay();
    updateTime();
    displaySch();
    focus();
    save();
    clear();
  }

  function storeDate() {
    saveSch = JSON.parse(localStorage.getItem(date));

    if (saveSch === null) {
      dateObj['date'] = date;
      dateArr.push(dateObj);
      localStorage.setItem(date, JSON.stringify(dateArr));
    }
  }

  function storeDiffDate() {
    var storage = JSON.parse(localStorage.getItem(date));

    if (storage !== null) {
      scheduleArr = storage;
    } 
    else {
      currentDateObj = {};
      currentDateArr = [];
      currentDateObj['date'] = date;
      currentDateArr.push(currentDateObj);
      localStorage.setItem(date, JSON.stringify(currentDateArr));
    }
  }

  function updateTime(differentDate) {
    if (differentDate !== date) {
      var currentDate = moment().format('dddd, MMMM Do');
      var currentYear = moment().format('YYYY');
      $('#currentDay').html(currentDate);
      $('#currentYear').html(currentYear);
      dynamicTime();
    }

    if (day < 0) {
      $('#currentDay').html(differentDate);
      $('#currentTime').html(
        'Your schedule today.'
      );
      $('#dynamicTime').hide();

      var dayOfYear = moment().dayOfYear();
      if (dayOfYear + day === 0) {
        currentYear = previousDate.format('YYYY');
        $('#currentYear').html(currentYear);
      }
    } 
    else if (day > 0) {
      currentYear = nextDate.format('YYYY');
      $('#currentDay').html(differentDate);
      $('#currentTime').html(
        'You schedule on this day.'
      );
      $('#currentYear').html(currentYear);
      $('#dynamicTime').hide();
    } 
    else {
      currentYear = moment().format('YYYY');
      $('#currentTime').html(
        'Your schedule for today. The current time is: '
      );
      $('#currentYear').html(currentYear);
      $('#dynamicTime').show();
      dynamicTime();
    }
  }

  function dynamicTime() {
    var currentTime = moment().format('HH:mm:ss');
    $('#dynamicTime').text(currentTime);
    setInterval(dynamicTime, 1000);
  }

  function focus() {
    var currentHourInt = parseInt(moment().format('HH'));

    var timeIDs = $('#schedule-table tr[id]')
      .map(function() {
        return this.id;
      })
      .get();

    if (day < 0) {
      $('.input-area').css('background-color', 'grey');
    } 
    else if (day > 0) {
      $('.input-area').css('background-color', 'lightblue');
    } 
    else {
      for (var i = 0; i < timeIDs.length; i++) {
        var timeIDsInt = parseInt(timeIDs[i]);
        if (timeIDsInt < currentHourInt) {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', 'lightgreen');
        } 
        else if (timeIDsInt === currentHourInt) {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', 'lightyellow');
        } 
        else {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', 'lightblue');
        }
      }
    }
  }

  function clear() {
    $('#clear-button').on('click', function() {
      scheduleObj = {};
      scheduleArr.length = 0;
      scheduleObj['date'] = date;
      scheduleArr.push(scheduleObj);

      localStorage.removeItem(date);
      $('.input-area').val('');

      localStorage.setItem(date, JSON.stringify(scheduleArr));
    });
  }

  function displaySch() {
    saveSch = JSON.parse(localStorage.getItem(date));
    $('.input-area').val('');
    for (var i = 0; i < saveSch.length; i++) {
      var getKey = Object.keys(saveSch[i]);
      var getValue = Object.values(saveSch[i]);
      $('#area-' + getKey).val(getValue[0]);
    }
  }

  function changeDay() {
    $('nav').on('click', function(e) {
      var dayButtonID = e.target.id;

      if (dayButtonID === 'previous-day') {
        day--;
        changeActive(dayButtonID);

        previousDate = moment().add(day, 'days');
        date = previousDate.format('LL');
        storeDiffDate();
        updateTime(previousDate.format('dddd, MMMM Do'));
        displaySch();
        focus();
        return date;
      }
       else if (dayButtonID === 'next-day') {
        day++;
        changeActive(dayButtonID);

        nextDate = moment().add(day, 'days');
        date = nextDate.format('LL');
        storeDiffDate();
        updateTime(nextDate.format('dddd, MMMM Do'));
        displaySch();
        focus();
        return date;
      }
       else {
        day = 0;
        dayButtonID = 'current-day';
        changeActive(dayButtonID);

        date = moment().format('LL');
        $('.input-area').val('');
        updateTime();
        displaySch();
        focus();
        return date;
      }
    });
  }

  function changeActive(page) {
    var activeClass = $('#change-div>nav>ul>li.active');

    scheduleArr.length = 0;
    activeClass.removeClass('active');
    $('#' + page).parent('li').addClass('active');
  }

  function save() {
    $('.save-button').on('click', function() {
      var trId = $(this).closest('tr').attr('id');
      var textVal = $(this).closest('tr').find('textarea').val().trim();

      storedSch = JSON.parse(localStorage.getItem(date));
      scheduleObj = {};

      scheduleObj[trId] = textVal;
      scheduleArr.push(scheduleObj);
      localStorage.setItem(date, JSON.stringify(scheduleArr));

      for (var i = 0; i < storedSch.length; i++) {
        if (storedSch[i].hasOwnProperty(trId)) {
          storedSch[i][trId] = textVal;
          scheduleArr = storedSch;
          localStorage.setItem(date, JSON.stringify(scheduleArr));
          return;
        }
      }
    });
  }
});

