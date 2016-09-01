/**
 * Created by KRUG020 on 11.08.2016.
 */
function addMonths(date, amount) {
    var month = date.getMonth() + amount;
    var year = date.getFullYear();
    return new Date(year, month, 1);
}
function recordWithPrevMonthsMoney(records, groups, date) {
    var currentTime = new Date();
    var currentRecords = filterByDate(records, new Date(currentTime.getFullYear(), currentTime.getMonth()), date);
    var currentGroups = filterByDate(groups, new Date(currentTime.getFullYear(), currentTime.getMonth()), date);
    var money = 0;
    for (var i = 0; i < currentRecords.length; i++) {
        var record = currentRecords[i];
        money += record.amount;
    }
    for (var i = 0; i < currentGroups.length; i++) {
        var record = currentGroups[i];
        money += record.amount;
    }


    return {
        amount: money,
        name: 'from prev month',
        paid: true,
        time: date,
    };
}

function logError(data) {
    console.log(data);
}


function processSequences(sequences, records, date) {
    var currentTime = new Date();
    var currentMonth = new Date(currentTime.getFullYear(), currentTime.getMonth());
    var sequenceDict = {}
    sequences.map(function (item) {
        sequenceDict[item.id] = item;
    });
    var newRecords = records.map(function (item) {
        if (item.hasOwnProperty('sequenceid'))
            item.sequence = sequenceDict[item.sequenceid];
        return item;
    });

    while (currentMonth <= date) {
        for (var i = 0; i < sequences.length; i++) {
            var seq = sequences[i];
            if (!containsSequenceRecord(newRecords, seq, currentMonth)) {
                newRecords.push({
                    amount: seq.amount,
                    name: seq.name,
                    time: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), seq.time.getDate()),
                    sequence: seq,

                });
            }
        }
        currentMonth = addMonths(currentMonth, 1);
    }
    return newRecords;
}

function containsSequenceRecord(records, sequence, date) {
    var result = records.find(function (item) {
        if (!item.sequence)
            return false;
        return item.sequence.id === sequence.id &&
            item.time.getMonth() === date.getMonth() &&
            item.time.getFullYear() === date.getFullYear();
    });

    return result;
}

function setCurrentRecords(records, currentDate) {
    var nextMonth = addMonths(currentDate, 1);
    var currentMonthRecords = filterByDate(records, currentDate, nextMonth);
    var recordsWithutGroups = currentMonthRecords.filter(function (item) {
        if (item.groupid > 0)
            return false;
        return true;
    });
    return recordsWithutGroups;
}


function assignRecordsIntoGroups(records, groups) {
    var groupsDict = {};
    groups.map(function (group) {
        groupsDict[group.id] = group;
        group.records = [];
        group.leftAmount = group.amount;
        group.recordDay = new Date().getDate();
    });


    records.map(function (item) {
        if (item.groupid > 0 && groupsDict.hasOwnProperty(item.groupid)) {
            groupsDict[item.groupid].records.push(item);
            if (item.paid)
                groupsDict[item.groupid].leftAmount -= item.amount;
        }
        else if (item.groupid > 0 && !groupsDict.hasOwnProperty(item.groupid)) {
            groups.push({
                name: "unassigned",
                records: [item]
            });
        }
    });


    return groups;
}

function calculateExpences(records, groups) {
    var result = 0;
    for (var i = 0; i < records.length; i++) {
        if (!records[i].paid)
            result += records[i].amount;
    }
    if (groups) {

        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            result += group.amount;
            for (var j = 0; j < group.records.length; j++) {
                var record = group.records[j];
                if (record.paid)
                    result -= record.amount;
            }
        }

    }

    return result;
}
function calculateCurrent(records, groups) {
    var result = 0;
    for (var i = 0; i < records.length; i++) {
        if (records[i].paid)
            result += -records[i].amount;
    }
    if (groups) {

        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            for (var j = 0; j < group.records.length; j++) {
                var record = group.records[j];
                if (record.paid)
                    result -= record.amount;
            }
        }

    }

    return result;
}
function removeItem(removable, array) {
    var result = array.filter(function (item) {
        if (item.id === removable.id)
            return false;
        return true;
    });

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
