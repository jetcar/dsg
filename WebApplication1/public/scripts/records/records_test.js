

describe('myApp.records', function () {

    beforeEach(module('myApp.records'));


    describe('records controller', function () {
        it('parse json', inject(function ($rootScope, $controller) {
            //spec body

            var time = new Date('2016-09-01T21:00:00.000Z');

            expect(time.getDate()).toBe(2);


        }));


        it('simple record', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var record = http.createRecord('test', -100, true, new Date());
            var record2 = http.createRecord('test2', 1, false, new Date());
            var record3 = http.createRecord('test3', 1, true, new Date());
            http.createRecord('test', 1, true, addMonths(new Date(), 1));


            //act
            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });


            expect(scope.currentRecords.length).toBe(3);
            expect(scope.currentRecords[0].id).toBe(record.id);
            expect(scope.currentRecords[1].id).toBe(record2.id);
            expect(scope.currentRecords[2].id).toBe(record3.id);
            expect(scope.currentRecords[0].amount).toBe(-100);
            expect(scope.currentRecords[0].name).toBe('test');
            expect(scope.currentRecords[0].paid).toBe(true);
            expect(scope.currentRecords[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentRecords[0].time.getMonth()).toBe(new Date().getMonth());

            expect(scope.expectedExpences).toBe(1);
            expect(scope.currentAmount).toBe(99);
            expect(scope.leftAmount).toBe(98);


        }));

        it('simple group', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();

            var http = new myHttp([], [], []);
            var group = http.createGroup('test', 1, new Date());
            http.createGroup('test', 1, addMonths(new Date(), 1));



            //act
            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].id).toBe(group.id);
            expect(scope.currentGroups[0].amount).toBe(1);
            expect(scope.currentGroups[0].leftAmount).toBe(1);
            expect(scope.currentGroups[0].name).toBe('test');
            expect(scope.currentGroups[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentGroups[0].time.getMonth()).toBe(new Date().getMonth());

            expect(scope.expectedExpences).toBe(1);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(-1);

        }));

        it('group with records', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();

            var http = new myHttp([], [], []);

            var group = http.createGroup('test', 111, new Date());
            http.createGroup('test', 1, addMonths(new Date(), 1));

            var record = http.createRecord('testRecord', 100, true, new Date(), group.id);
            http.createRecord('test2', 2, true, addMonths(new Date(), 1), group.id);




            //act
            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });



            expect(scope.currentRecords.length).toBe(0);


            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].id).toBe(group.id);
            expect(scope.currentGroups[0].amount).toBe(111);
            expect(scope.currentGroups[0].name).toBe('test');
            expect(scope.currentGroups[0].leftAmount).toBe(11);
            expect(scope.currentGroups[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentGroups[0].time.getMonth()).toBe(new Date().getMonth());
            expect(scope.currentGroups[0].records.length).toBe(1);
            expect(scope.currentGroups[0].records[0].id).toBe(record.id);
            expect(scope.currentGroups[0].records[0].name).toBe('testRecord');
            expect(scope.currentGroups[0].records[0].amount).toBe(100);

            expect(scope.expectedExpences).toBe(11);
            expect(scope.currentAmount).toBe(-100);
            expect(scope.leftAmount).toBe(-111);


        }));

        it('simple record sequence', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();



            var http = new myHttp([], [], []);
            var sequence = http.createSequence('test', 1, new Date());
            http.createSequence('test', 1, addMonths(new Date(), 1));


            //act
            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });


            expect(scope.currentRecords.length).toBe(1);
            expect(scope.currentRecords[0].id).toBe(-1);
            expect(scope.currentRecords[0].amount).toBe(1);
            expect(scope.currentRecords[0].sequence.id).toBe(sequence.id);
            expect(scope.currentRecords[0].sequenceid).toBe(sequence.id);
            expect(scope.currentRecords[0].name).toBe('test');
            expect(scope.currentRecords[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentRecords[0].time.getMonth()).toBe(new Date().getMonth());

            expect(scope.expectedExpences).toBe(1);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(-1);

        }));

        it('simple record sequence back to current', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();



            var http = new myHttp([], [], []);
            var sequence = http.createSequence('test', 1, new Date());
            http.createSequence('test', 1, addMonths(new Date(), 1));



            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.next();
            scope.current();

            expect(scope.currentRecords.length).toBe(1);
            expect(scope.currentRecords[0].id).toBe(-1);
            expect(scope.currentRecords[0].amount).toBe(1);
            expect(scope.currentRecords[0].sequence.id).toBe(sequence.id);
            expect(scope.currentRecords[0].name).toBe('test');
            expect(scope.currentRecords[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentRecords[0].time.getMonth()).toBe(new Date().getMonth());

            expect(scope.expectedExpences).toBe(1);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(-1);

        }));

        it('simple record sequence move forward', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();



            var http = new myHttp([], [], []);
            var sequence = http.createSequence('test', 1, new Date(2001,1,1));
            http.createSequence('test2', 2, addMonths(new Date(2001,1,1), 1));



            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.next();


            expect(scope.currentRecords.length).toBe(3);
            expect(scope.currentRecords[0].id).toBe(-1);
            expect(scope.currentRecords[0].amount).toBe(1);
            expect(scope.currentRecords[0].sequenceid).toBe(sequence.id);
            expect(scope.currentRecords[0].sequence.id).toBe(sequence.id);
            expect(scope.currentRecords[0].name).toBe('test');
            expect(scope.currentRecords[0].time.getDate()).toBe(1);
            expect(scope.currentRecords[0].time.getMonth()).toBe(addMonths(new Date(), 1).getMonth());

            expect(scope.expectedExpences).toBe(3);
            expect(scope.currentAmount).toBe(-3);
            expect(scope.leftAmount).toBe(-6);

        }));


        it('forward calculate prevMonths', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();



            var http = new myHttp([], [], []);

            http.createRecord('test', -100, true, new Date());
            var sequence = http.createSequence('test', 50, new Date());


            http.createGroup('test', 50, new Date());


            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.next();

            expect(scope.currentRecords.length).toBe(2);
            expect(scope.expectedExpences).toBe(50);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(-50);

            scope.next();


            expect(scope.currentRecords.length).toBe(2);
            expect(scope.expectedExpences).toBe(50);
            expect(scope.currentAmount).toBe(-50);
            expect(scope.leftAmount).toBe(-100);

        }));

        it('simple record sequence move back', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();



            var http = new myHttp([], [], []);
            var sequence = http.createSequence('test', 1, new Date());
            http.createSequence('test', 1, addMonths(new Date(), 1));



            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.prev();


            expect(scope.currentRecords.length).toBe(0);

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(0);

        }));


        it('simple record sequence sorting', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();



            var http = new myHttp([], [], []);

            http.createSequence('gtest', 1, new Date(),true);
            http.createSequence('g1', 1, new Date(),true);
            http.createSequence('gtest3', 1, new Date(), true);

            http.createSequence('test', 1, new Date());
            http.createSequence('1', 1, new Date());
            http.createSequence('test3', 1, new Date());

            http.createSequence('zp', -10, new Date());



            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });
            scope.editRecord(scope.currentRecords[3]);
            scope.editableRecord.paid = true;
            scope.save();
            //act

            expect(scope.expectedExpences).toBe(6);
            expect(scope.currentAmount).toBe(10);
            expect(scope.leftAmount).toBe(4);


            scope.next();

            expect(scope.currentRecords.length).toBe(5);
            expect(scope.currentRecords[0].name).toBe('1');
            expect(scope.currentRecords[1].name).toBe('test');
            expect(scope.currentRecords[2].name).toBe('test3');
            expect(scope.currentRecords[3].name).toBe('zp');
            //expect(scope.currentRecords[4].name).toBe('test3');

            expect(scope.currentGroups[0].name).toBe('g1');
            expect(scope.currentGroups[1].name).toBe('gtest');
            expect(scope.currentGroups[2].name).toBe('gtest3');

            expect(scope.expectedExpences).toBe(6);
            expect(scope.currentAmount).toBe(4);
            expect(scope.leftAmount).toBe(8);
            scope.next();

            expect(scope.expectedExpences).toBe(6);
            expect(scope.currentAmount).toBe(8);
            expect(scope.leftAmount).toBe(12);




        }));


        it('prev monthExpences', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();



            var http = new myHttp([], [], []);

            http.createSequence('gtest', 1, new Date(),true);
            http.createSequence('g1', 1, new Date(),true);
            http.createSequence('gtest3', 1, new Date(), true);

            http.createSequence('test', 1, new Date());
            http.createSequence('1', 1, new Date());
            http.createSequence('test3', 1, new Date());

            http.createSequence('zp', -10, new Date());



            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });
            scope.editRecord(scope.currentRecords[3]);
            scope.editableRecord.paid = true;
            scope.save();
            //act
            scope.next();

            expect(scope.currentRecords.length).toBe(5);
            expect(scope.currentRecords[0].name).toBe('1');
            expect(scope.currentRecords[1].name).toBe('test');
            expect(scope.currentRecords[2].name).toBe('test3');
            expect(scope.currentRecords[3].name).toBe('zp');
            //expect(scope.currentRecords[4].name).toBe('test3');

            expect(scope.currentGroups[0].name).toBe('g1');
            expect(scope.currentGroups[1].name).toBe('gtest');
            expect(scope.currentGroups[2].name).toBe('gtest3');

            expect(scope.expectedExpences).toBe(6);
            expect(scope.currentAmount).toBe(4);
            expect(scope.leftAmount).toBe(8);
            scope.next();

            expect(scope.expectedExpences).toBe(6);
            expect(scope.currentAmount).toBe(8);
            expect(scope.leftAmount).toBe(12);




        }));

        it('simple group sequence', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var sequence = http.createSequence('test', 1, new Date(),true);
            http.createSequence('test2', 2, addMonths(new Date(), -1),true);
            http.createSequence('test3', 3, addMonths(new Date(), 1),true);



            //act
            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });


            expect(scope.currentGroups.length).toBe(2);
            expect(scope.currentGroups[0].id).toBe(-1);
            expect(scope.currentGroups[0].amount).toBe(1);
            expect(scope.currentGroups[0].leftAmount).toBe(1);
            expect(scope.currentGroups[0].name).toBe('test');
            expect(scope.currentGroups[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentGroups[0].time.getMonth()).toBe(new Date().getMonth());

            expect(scope.currentGroups[1].id).toBe(-1);
            expect(scope.currentGroups[1].amount).toBe(2);
            expect(scope.currentGroups[1].leftAmount).toBe(2);
            expect(scope.currentGroups[1].name).toBe('test2');
            expect(scope.currentGroups[1].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentGroups[1].time.getMonth()).toBe(new Date().getMonth());



            expect(scope.expectedExpences).toBe(3);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(-3);

        }));

        it('create group sequence', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var sequence = http.createSequence('test', 1, new Date(2000,1,1));
            http.createSequence('test2', 2, new Date(2000,1,2));



            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            scope.editableRecord.amount = 10;
            scope.editableRecord.name = "new group sequence";
            scope.editableRecord.day = 6;
            scope.editableRecord.repeat = true;
            scope.editableRecord.group = true;
            //act
            scope.save();

            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].id).toBe(-1);
            expect(scope.currentGroups[0].amount).toBe(10);
            expect(scope.currentGroups[0].leftAmount).toBe(10);
            expect(scope.currentGroups[0].name).toBe('new group sequence');
            expect(scope.currentGroups[0].time.getDate()).toBe(6);
            expect(scope.currentGroups[0].time.getMonth()).toBe(new Date().getMonth());



            expect(scope.expectedExpences).toBe(13);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(-13);

        }));


        it('add record to group', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();

            var http = new myHttp([], [], []);

            var mygroup = http.createGroup('test', 1, new Date());

            http.createGroup('test2', 1, addMonths(new Date(), 1));



            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            var group = scope.currentGroups[0];
            group.recordAmount = 1;
            group.recordName = "name";
            group.recordDay = 1;
            group.recordPaid = true;


            //act
            scope.saveFromFroup(group);

            expect(scope.currentRecords.length).toBe(0);
            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].id).toBe(mygroup.id);
            expect(scope.currentGroups[0].amount).toBe(1);
            expect(scope.currentGroups[0].leftAmount).toBe(0);
            expect(scope.currentGroups[0].name).toBe('test');
            expect(scope.currentGroups[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentGroups[0].time.getMonth()).toBe(new Date().getMonth());

            expect(scope.currentGroups[0].records.length).toBe(1);
            expect(scope.currentGroups[0].records[0].id).toBe(mygroup.id);
            expect(scope.currentGroups[0].records[0].name).toBe('name');
            expect(scope.currentGroups[0].records[0].amount).toBe(1);


            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(-1);
            expect(scope.leftAmount).toBe(-1);


        }));

        it('add record to group sequence', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();

            var http = new myHttp([], [], []);

            http.createSequence('test', 1, new Date(),true);

            http.createGroup('test', 1, addMonths(new Date(), 1));



            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            var group = scope.currentGroups[0];
            group.recordAmount = 1;
            group.recordName = "name";
            group.recordDay = 1;
            group.recordPaid = true;


            //act
            scope.saveFromFroup(group);

            expect(scope.currentRecords.length).toBe(0);
            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].id).toBe(2);
            expect(scope.currentGroups[0].amount).toBe(1);
            expect(scope.currentGroups[0].leftAmount).toBe(0);
            expect(scope.currentGroups[0].name).toBe('test');
            //expect(scope.currentGroups[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentGroups[0].time.getMonth()).toBe(new Date().getMonth());

            expect(scope.currentGroups[0].records.length).toBe(1);
            expect(scope.currentGroups[0].records[0].id).toBe(1);
            expect(scope.currentGroups[0].records[0].name).toBe('name');
            expect(scope.currentGroups[0].records[0].amount).toBe(1);


            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(-1);
            expect(scope.leftAmount).toBe(-1);


        }));

        it('add record', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);
            http.createGroup('test', 1, new Date());

            http.createGroup('test', 1, addMonths(new Date(), 1));

            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            scope.editableRecord.amount = 1;
            scope.editableRecord.name = "name";
            scope.editableRecord.day = 1;
            scope.editableRecord.paid = true;


            //act
            scope.save();

            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].id).toBe(1);
            expect(scope.currentGroups[0].amount).toBe(1);
            expect(scope.currentGroups[0].leftAmount).toBe(1);
            expect(scope.currentGroups[0].name).toBe('test');
            expect(scope.currentGroups[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentGroups[0].time.getMonth()).toBe(new Date().getMonth());

            expect(scope.currentRecords.length).toBe(1);
            expect(scope.currentRecords[0].id).toBe(1);
            expect(scope.currentRecords[0].name).toBe('name');
            expect(scope.currentRecords[0].amount).toBe(1);

            expect(scope.editableRecord.amount).toBe(undefined);
            expect(scope.editableRecord.group).toBe(undefined);
            expect(scope.editableRecord.repeat).toBe(undefined);
            expect(scope.editableRecord.name).toBe(undefined);
            expect(scope.editableRecord.paid).toBe(undefined);
            expect(scope.editableRecord.day).toBe(undefined);


            expect(scope.expectedExpences).toBe(1);
            expect(scope.currentAmount).toBe(-1);
            expect(scope.leftAmount).toBe(-2);


        }));


        it('add group', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();

            var groups = [
                {
                    id: 1,
                    amount: 1,
                    name: 'test',
                    time: new Date(),

                }
                ,
                {
                    id: 2,
                    amount: 1,
                    name: 'test',
                    time: new Date(2011),

                }
            ];

            var http = new myHttp([], groups, []);


            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            scope.editableRecord.amount = 1;
            scope.editableRecord.name = "name";
            scope.editableRecord.day = 1;
            scope.editableRecord.paid = true;


            //act
            scope.save();

            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].id).toBe(1);
            expect(scope.currentGroups[0].amount).toBe(1);
            expect(scope.currentGroups[0].leftAmount).toBe(1);
            expect(scope.currentGroups[0].name).toBe('test');
            expect(scope.currentGroups[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentGroups[0].time.getMonth()).toBe(new Date().getMonth());

            expect(scope.currentRecords.length).toBe(1);
            expect(scope.currentRecords[0].id).toBe(1);
            expect(scope.currentRecords[0].name).toBe('name');
            expect(scope.currentRecords[0].amount).toBe(1);


            expect(scope.expectedExpences).toBe(1);
            expect(scope.currentAmount).toBe(-1);
            expect(scope.leftAmount).toBe(-2);


        }));


        it('add sequence', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();

            var groups = [
                {
                    id: 1,
                    amount: 1,
                    name: 'test',
                    time: new Date(),

                }
                ,
                {
                    id: 2,
                    amount: 1,
                    name: 'test',
                    time: new Date(2011),

                }
            ];

            var http = new myHttp([], groups, []);


            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            scope.editableRecord.amount = 1;
            scope.editableRecord.name = "name";
            scope.editableRecord.day = 1;
            scope.editableRecord.paid = true;
            scope.editableRecord.repeat = true;


            //act
            scope.save();

            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].id).toBe(1);
            expect(scope.currentGroups[0].amount).toBe(1);
            expect(scope.currentGroups[0].leftAmount).toBe(1);
            expect(scope.currentGroups[0].name).toBe('test');
            expect(scope.currentGroups[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentGroups[0].time.getMonth()).toBe(new Date().getMonth());

            expect(scope.currentRecords.length).toBe(1);
            expect(scope.currentRecords[0].id).toBe(-1);
            expect(scope.currentRecords[0].name).toBe('name');
            expect(scope.currentRecords[0].amount).toBe(1);
            expect(scope.currentRecords[0].sequence.id).toBeGreaterThan(0);


            expect(scope.expectedExpences).toBe(2);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(-2);


        }));

    });
});