/**
 * Created by KRUG020 on 11.08.2016.
 */
function addMonths(date, amount) {
    var month = date.getMonth() + amount;
    var year = date.getFullYear();
    return new Date(year, month, 1);
}
function addRecordFromPrevMonths(records, date) {
    var currentTime = new Date();
    var prevMonthsRecords = filter(records, new Date(currentTime.getFullYear(),currentTime.getMonth()), date);
    var prevExpences = calculateExpences(prevMonthsRecords);
    var prevCurrent = calculateCurrent(prevMonthsRecords);
    var prevLeftAmount = prevCurrent - prevExpences;
    var result = [];
    for (var i = 0; i < records.length; i++) {
        result.push(records[i]);
    }
    if (prevLeftAmount > 0) {
        result.push({
            amount: prevLeftAmount * -1,
            name: 'from prev month',
            paid: true,
            time: date,
        })
    }
    return result;
}
function setCurrentRecords(records, currentDate) {
    var nextMonth = addMonths(currentDate, 1);
    var recordsWithPrevValues = addRecordFromPrevMonths(records, currentDate);
    var currentMonthRecords = filter(recordsWithPrevValues, currentDate, nextMonth);
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
function filter(records, from, to) {
    var result = [];
    for (var i = 0; i < records.length; i++) {
        if (records[i].time >= from && records[i].time < to)
            result.push(records[i]);
    }
    return result;
}
