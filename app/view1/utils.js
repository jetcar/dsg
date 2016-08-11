/**
 * Created by KRUG020 on 11.08.2016.
 */


function addMonths (date, amount) {
    var month = date.getMonth() + amount;
    var year = date.getFullYear();
    if (month > 11) {
        year += month % 11;
    }
    return new Date(year, month, 1);
}

function addRecordFromPrevMonths(records, year, month) {
    var currentMonth = new Date().getMonth();
    var currentYear = new Date().getFullYear();
    var prevMonthsRecords = filter(records, currentYear, currentMonth, year, month);
    var prevExpences = calculateExpences(prevMonthsRecords);
    var prevCurrent = calculateCurrent(prevMonthsRecords);
    var prevLeftAmount = prevCurrent - prevExpences;
    var result = [];
    for (var i = 0; i < records.length; i++) {
        result.push(records[i]);
    }
    if(prevLeftAmount > 0)
    {
    result.push({
        amount: prevLeftAmount * -1,
        name: 'from prev month',
        paid: true,
        time: new Date(year, month, 1),
    })
    }

    return result;


}

function setCurrentRecords(records, currentDate) {
    var nextMonth = addMonths(currentDate, 1);
    var recordsWithPrevValues = addRecordFromPrevMonths(records, currentDate.getFullYear(), currentDate.getMonth());
    var currentMonthRecords = filter(recordsWithPrevValues, currentDate.getFullYear(), currentDate.getMonth(), nextMonth.getFullYear(), nextMonth.getMonth());
    return recordsWithoutGroups(currentMonthRecords);
}

function assignRecordsIntoGroups(records, groups) {
    var groupsDict = {};
    for (var i = 0; i < groups.length; i++) {
        groupsDict[groups[i].id] = groups[i];
        groups[i].records = [];
        groups[i].leftAmount = groups[i].amount;
        groups[i].recordDay = new Date().getDate();
    }
    var result = [];
    for (var i = 0; i < records.length; i++) {
        if (records[i].groupId > 0) {

            groupsDict[records[i].groupId].records.push(records[i]);
            if (records[i].paid)
                groupsDict[records[i].groupId].leftAmount -= records[i].amount;
        }
    }
    return groups;
}

function recordsWithoutGroups(records) {
    var result = [];
    for (var i = 0; i < records.length; i++) {
        if (!(records[i].groupId > 0))
            result.push(records[i]);
    }
    return result;
}

function calculateExpences(records) {
    var result = 0;
    for (var i = 0; i < records.length; i++) {
        if (!records[i].paid)
            result += records[i].amount;
    }
    return result;
}

function calculateCurrent(records) {
    var result = 0;
    for (var i = 0; i < records.length; i++) {
        if (records[i].paid)
            result += (-records[i].amount);
    }
    return result;
}

function removeItem(item, array) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i] != item)
            result.push(array[i]);
    }
    return result;
}

function filter(records, fromyear, frommonth, toyear, tomonth) {
    var result = [];
    for (var i = 0; i < records.length; i++) {
        if (fromyear == toyear && records[i].time.getMonth() >= frommonth && records[i].time.getFullYear() >= fromyear, records[i].time.getMonth() < tomonth)
            result.push(records[i]);
        else if (records[i].time.getMonth() >= frommonth && records[i].time.getFullYear() >= fromyear, records[i].time.getMonth() < tomonth && records[i].time.getFullYear() < toyear)
            result.push(records[i]);
    }
    return result;
}
