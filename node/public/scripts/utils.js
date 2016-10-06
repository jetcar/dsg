/**
 * Created by KRUG020 on 11.08.2016.
 */
function addMonths(date, amount) {
    var month = date.getMonth() + amount;
    var year = date.getFullYear();
    return new Date(year, month, date.getDate());
}


function logError(data) {
    console.log(data);
}


function sortRecords(records) {
    return records.sort(function(a, b) {

        if (a.paid === b.paid) {
            if (a.time - b.time === 0) {
                return a.name.localeCompare(b.name);
            }
            return a.time - b.time;
        }
        if (!a.paid && b.paid)
            return -1;

        if (!b.paid && a.paid)
            return 1;


        if (a.time - b.time === 0) {
            return a.name.localeCompare(b.name);
        }
        return a.time - b.time;

    });
}

function addSequencesToRecords(sequences, records, date) {
    var sequenceDict = {}
    var newRecords = [];
    for (var i = 0; i < records.length; i++)
        newRecords.push(records[i]);

    sequences.map(function (item) {
        sequenceDict[item.id] = item;
    });
    records.map(function (item) {
        if (item.hasOwnProperty('sequenceid'))
            item.sequence = sequenceDict[item.sequenceid];
        return item;
    });

        for (var i = 0; i < sequences.length; i++) {
            var seq = sequences[i];
            if (!containsSequenceRecord(records, seq, date)) {
                newRecords.push({
                    id:-1,
                    amount: seq.amount,
                    name: seq.name,
                    time: new Date(date.getFullYear(), date.getMonth(), seq.time.getDate()),
                    sequence: seq,
                    group: seq.group,
                    repeat:true,
                    sequenceid:seq.id

                });
            }
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
        if (!records[i].paid && records[i].amount > 0)
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

function calculateLeft(records, groups) {
    var result = 0;
    for (var i = 0; i < records.length; i++) {
            result += records[i].amount;
    }
    if (groups) {

        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            result += group.amount;
        }

    }

    return -1 * result;
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

function calculateCurrentForFuture(records, groups) {
    var result = 0;
    for (var i = 0; i < records.length; i++) {
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
function removeItem(id, array) {
    var result = array.filter(function (item) {
        if (item.id === id)
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
