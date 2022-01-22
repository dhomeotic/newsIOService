const { SETTINGS } = require("../config/settings");
const datejs = require("datejs");

function getTimeBeforeStartCycle() {
  /**
   * We define once time the date time now var.
   * Because if our program take a little bit time to execute we can have a difference of time,
   * (day if the program start at 11:59pm) between now instance.
   */

  // 
  var now = new Date().set({ hour: 23, minute: 59 });
  console.log("Heure actuelle: " + now.toTimeString());

  var firstTime = new Date(now).set({
    hour: SETTINGS.TIME_REFRESH.FIRST_REFRESH,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  var secondTime = new Date(now).set({
    hour: SETTINGS.TIME_REFRESH.LAST_REFRESH,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  var timeBeforeCycle;

  // If now is not between firstTime and SecondTime
  if (now < firstTime || now > secondTime) {
    //If secondTime is before now, we need to to use the firstTime for the next day.
    if (now > secondTime) {
      firstTime.addDays(1);
      //Calculate the time range to see if we need to bypass the or not the firstTime of refresh.
      timeBeforeCycle = getTimeBeforeCycleWithTimeRangeFirstTime(
        firstTime,
        secondTime,
        now
      );
    } else {
      timeBeforeCycle = getTimeBeforeCycleWithTimeRangeFirstTime(
        firstTime,
        secondTime,
        now
      );
    }
  } else {
    //Second Time
    timeBeforeCycle = getTimeBeforeCycleWithTimeRangeSecondTime(
      secondTime,
      firstTime,
      now
    );
  }

  console.log(
    "Horaire de début de cycle: " +
      now.addMinutes(timeBeforeCycle).toTimeString()
  );
  console.log("Temps avant début du cycle (min): " + timeBeforeCycle);

  console.log("test   " +  minutesToMilliseconds(timeBeforeCycle))

  return minutesToMilliseconds(timeBeforeCycle);
}

function getTimeBeforeCycleWithTimeRangeSecondTime(secondTime, firstTime, now) {
  var timeRangeForRefresh = SETTINGS.TIME_REFRESH.TIME_BEFORE_REFRESH;
  var timeRange = new Date(secondTime).addHours(-timeRangeForRefresh);
  console.log("Time range: " + timeRange.toTimeString());
  if (timeRange > now) {
    timeBeforeCycle = diff_minutes(secondTime, now);
  } else {
    console.log("--- Dans la TimeRange ---");
    firstTime.addDays(1);
    timeBeforeCycle = diff_minutes(firstTime, now);
  }
  return timeBeforeCycle;
}

function getTimeBeforeCycleWithTimeRangeFirstTime(firstTime, secondTime, now) {
  var timeRangeForRefresh = SETTINGS.TIME_REFRESH.TIME_BEFORE_REFRESH;
  var timeRange = new Date(firstTime).addHours(-timeRangeForRefresh);
  console.log("Time range: " + timeRange.toTimeString());
  if (timeRange > now) {
    timeBeforeCycle = diff_minutes(firstTime, now);
  } else {
    console.log("--- Dans la TimeRange ---");
    timeBeforeCycle = diff_minutes(secondTime, now);
  }

  return timeBeforeCycle;
}

function diff_minutes(dt2, dt1) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(diff);
}

function minutesToMilliseconds(minutesTime) {
  return minutesTime * 60 * 1000;
}

function hoursToMilliseconds(minutesTime) {
  return minutesTime * 60 * 60 * 1000;
}

function getTimeCycle() {
  return hoursToMilliseconds(
    SETTINGS.TIME_REFRESH.LAST_REFRESH - SETTINGS.TIME_REFRESH.FIRST_REFRESH
  );
}
module.exports = { getTimeBeforeStartCycle, getTimeCycle };
