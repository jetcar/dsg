

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

            http.createRecord('test', -100, true, new Date());
            http.createRecord('test', 1, false, new Date());
            http.createRecord('test', 1, true, new Date());
            http.createRecord('test', 1, true, addMonths(new Date(), 1));


            //act
            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });


            expect(scope.currentRecords.length).toBe(3);
            expect(scope.currentRecords[0].id).toBe(1);
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
            http.createGroup('test', 1, new Date());
            http.createGroup('test', 1, addMonths(new Date(), 1));



            //act
            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].id).toBe(1);
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

            http.createRecord('testRecord', 100, true, new Date(), group.id);
            http.createRecord('test2', 2, true, addMonths(new Date(), 1), group.id);




            //act
            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });



            expect(scope.currentRecords.length).toBe(0);


            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].id).toBe(1);
            expect(scope.currentGroups[0].amount).toBe(111);
            expect(scope.currentGroups[0].name).toBe('test');
            expect(scope.currentGroups[0].leftAmount).toBe(11);
            expect(scope.currentGroups[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentGroups[0].time.getMonth()).toBe(new Date().getMonth());
            expect(scope.currentGroups[0].records.length).toBe(1);
            expect(scope.currentGroups[0].records[0].id).toBe(1);
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
            var sequence = http.createSequence(
           {
               amount: 1,
               name: 'test',
               time: new Date(),

           });

            http.createSequence(
           {
               amount: 1,
               name: 'test',
               time: addMonths(new Date(), 1)

           });

            //act
            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });


            expect(scope.currentRecords.length).toBe(1);
            expect(scope.currentRecords[0].id).toBe(undefined);
            expect(scope.currentRecords[0].amount).toBe(1);
            expect(scope.currentRecords[0].sequence.id).toBe(sequence.id);
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
            var sequence = http.createSequence(
           {
               amount: 1,
               name: 'test',
               time: new Date(),

           });

            http.createSequence(
           {
               amount: 1,
               name: 'test',
               time: addMonths(new Date(), 1)

           });

            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.next();
            scope.current();

            expect(scope.currentRecords.length).toBe(1);
            expect(scope.currentRecords[0].id).toBe(undefined);
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
            var sequence = http.createSequence(
           {
               amount: 1,
               name: 'test',
               time: new Date(),

           });

            http.createSequence(
           {
               amount: 1,
               name: 'test',
               time: addMonths(new Date(), 1)

           });

            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.next();


            expect(scope.currentRecords.length).toBe(3);
            expect(scope.currentRecords[0].id).toBe(undefined);
            expect(scope.currentRecords[0].amount).toBe(1);
            expect(scope.currentRecords[0].sequence.id).toBe(sequence.id);
            expect(scope.currentRecords[0].name).toBe('test');
            expect(scope.currentRecords[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentRecords[0].time.getMonth()).toBe(addMonths(new Date(), 1).getMonth());

            expect(scope.expectedExpences).toBe(2);
            expect(scope.currentAmount).toBe(-2);
            expect(scope.leftAmount).toBe(-4);

        }));


        it('forward calculate prevMonths', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();



            var http = new myHttp([], [], []);

            http.createRecord('test', -100, true, new Date());
            http.createSequence(
           {
               amount: 50,
               name: 'test',
               time: new Date(),

           });
            http.createGroup('test', 50, new Date());


            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.next();

            expect(scope.currentRecords.length).toBe(2);
            expect(scope.expectedExpences).toBe(50);
            expect(scope.currentAmount).toBe(50);
            expect(scope.leftAmount).toBe(0);

            scope.next();


            expect(scope.currentRecords.length).toBe(2);
            expect(scope.expectedExpences).toBe(50);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(-50);

        }));

        it('simple record sequence move back', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();



            var http = new myHttp([], [], []);
            var sequence = http.createSequence(
           {
               amount: 1,
               name: 'test',
               time: new Date(),

           });

            http.createSequence(
           {
               amount: 1,
               name: 'test',
               time: addMonths(new Date(), 1)

           });

            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.prev();


            expect(scope.currentRecords.length).toBe(0);

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(0);

        }));

        it('simple group sequence', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);
            http.createSequence({
                amount: 1,
                name: 'test1',
                time: new Date(),
                group: true
            });
            http.createSequence({
                amount: 2,
                name: 'test2',
                time: addMonths(new Date(),-1),
                group: true
            });
            http.createSequence({
                amount: 1,
                name: 'test3',
                time: new Date(2100, 1, 1),
                group: true
            });

            //act
            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });


            expect(scope.currentGroups.length).toBe(2);
            expect(scope.currentGroups[0].id).toBe(undefined);
            expect(scope.currentGroups[0].amount).toBe(1);
            expect(scope.currentGroups[0].leftAmount).toBe(1);
            expect(scope.currentGroups[0].name).toBe('test1');
            expect(scope.currentGroups[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentGroups[0].time.getMonth()).toBe(new Date().getMonth());

            expect(scope.currentGroups[1].id).toBe(undefined);
            expect(scope.currentGroups[1].amount).toBe(2);
            expect(scope.currentGroups[1].leftAmount).toBe(2);
            expect(scope.currentGroups[1].name).toBe('test2');
            expect(scope.currentGroups[1].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentGroups[1].time.getMonth()).toBe(new Date().getMonth());



            expect(scope.expectedExpences).toBe(3);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(-3);

        }));


        it('add record to group', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();

            var http = new myHttp([], [], []);

            http.createGroup('test', 1, new Date());

            http.createGroup('test', 1, addMonths(new Date(), 1));



            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            var group = scope.groups[0];
            group.recordAmount = 1;
            group.recordName = "name";
            group.recordDay = 1;
            group.recordPaid = true;


            //act
            scope.saveFromFroup(group);

            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].id).toBe(1);
            expect(scope.currentGroups[0].amount).toBe(1);
            expect(scope.currentGroups[0].leftAmount).toBe(0);
            expect(scope.currentGroups[0].name).toBe('test');
            expect(scope.currentGroups[0].time.getDate()).toBe(new Date().getDate());
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

            scope.amount = 1;
            scope.name = "name";
            scope.day = 1;
            scope.paid = true;


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

            expect(scope.amount).toBe(undefined);
            expect(scope.group).toBe(false);
            expect(scope.repeat).toBe(false);
            expect(scope.name).toBe(undefined);
            expect(scope.paid).toBe(false);
            expect(scope.day).toBe(new Date().getDate());


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

            scope.amount = 1;
            scope.name = "name";
            scope.day = 1;
            scope.paid = true;


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

            scope.amount = 1;
            scope.name = "name";
            scope.day = 1;
            scope.paid = true;
            scope.repeat = true;


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
            expect(scope.currentRecords[0].id).toBe(undefined);
            expect(scope.currentRecords[0].name).toBe('name');
            expect(scope.currentRecords[0].amount).toBe(1);


            expect(scope.expectedExpences).toBe(2);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(-2);


        }));

    });
});