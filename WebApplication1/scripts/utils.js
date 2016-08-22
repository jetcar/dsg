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
    var prevMonthsRecords = filterByDate(records, new Date(currentTime.getFullYear(), currentTime.getMonth()), date);
    var prevExpences = calculateExpences(prevMonthsRecords);
    var prevCurrent = calculateCurrent(prevMonthsRecords);
    var prevLeftAmount = prevCurrent - prevExpences;

    var result = records.map(function (item) { return item; });

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


function processSequences(sequences, records, date) {
    var currentTime = new Date();
    var currentMonth = new Date(currentTime.getFullYear(), currentTime.getMonth());

    var newRecords = records.map(function (item) { return item; });

    do {
        for (var i = 0; i < sequences.length; i++) {

            if (!sequences[i].hasOwnProperty('endDate') && sequences[i].time <= date) {
                newRecords.push({
                    amount: sequences[i].amount,
                    name: sequences[i].name,
                    time: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), sequences[i].time.getDate()),
                    sequence: sequences[i].id,
                });
            } else if (sequences[i].endDate > date && sequences[i].time <= date) {
                newRecords.push({
                    amount: sequences[i].amount,
                    name: sequences[i].name,
                    time: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), sequences[i].time.getDate()),
                    sequence: sequences[i].id,

                });
            }
        }
        currentMonth = addMonths(currentMonth, 1);
    } while (currentMonth <= date);
    return newRecords;
}

function setCurrentRecords(records, currentDate) {
    var nextMonth = addMonths(currentDate, 1);
    var recordsWithPrevValues = addRecordFromPrevMonths(records, currentDate);
    var currentMonthRecords = filterByDate(recordsWithPrevValues, currentDate, nextMonth);
    var recordsWithutGroups = currentMonthRecords.filter(function (item) {
        if (item.groupId > 0)
            return false;
        return true;
    });
    return recordsWithutGroups;
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
function filterByDate(records, from, to) {
    var result = records.filter(function (item) {
        if (item.time >= from && item.time < to)
            return true;
        return false;

    });

    return result;
}
