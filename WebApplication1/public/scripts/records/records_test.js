

describe('myApp.records', function () {

    beforeEach(module('myApp.records'));


    describe('records controller', function () {
        it('simple record', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            http.createRecord({
                amount: -100,
                name: 'test',
                paid: true,
                time: new Date(),

            });
            http.createRecord({
                amount: 1,
                name: 'test',
                paid: false,
                time: new Date(),

            });
            http.createRecord({
                amount: 1,
                name: 'test',
                paid: true,
                time: new Date(),

            });
            http.createRecord({
                amount: 1,
                name: 'test',
                paid: true,
                time: new Date(2011),

            });

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
            http.createGroup({
                amount: 1,
                name: 'test',
                time: new Date(),

            });
            http.createGroup({
                amount: 1,
                name: 'test',
                time: new Date(2011),

            });


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

            var group = http.createGroup({
                amount: 111,
                name: 'test',
                time: new Date(),

            });
            http.createGroup({
                amount: 1,
                name: 'test',
                time: new Date(2011),

            });

            http.createRecord({
                amount: 100,
                name: 'testRecord',
                paid: true,
                time: new Date(),
                groupid: group.id,

            });
            http.createRecord({
                amount: 2,
                name: 'test2',
                paid: true,
                time: new Date(2011),
                groupid: group.id,
            });

            

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
                time: new Date(2011,1,1),
                group: true
            });
            http.createSequence({
                amount: 1,
                name: 'test3',
                time: new Date(2100,1,1),
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

            http.createGroup({

                amount: 1,
                name: 'test',
                time: new Date(),

            });
            http.createGroup({
                amount: 1,
                name: 'test',
                time: new Date(2011),

            });

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
            http.createGroup({
                amount: 1,
                name: 'test',
                time: new Date(),

            });
            http.createGroup({
                amount: 1,
                name: 'test',
                time: new Date(2011),

            });

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