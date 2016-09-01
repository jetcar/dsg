

describe('myApp.records', function () {

    beforeEach(module('myApp.records'));


    describe('records2 controller', function () {
        it('start edit record', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var record = http.createRecord('test', -100, true, new Date());
            http.createRecord('test2', 1, false, new Date());
            http.createRecord('test3', 1, true, new Date());
            http.createRecord('test4', 1, true, addMonths(new Date(),1));
         

            //act
            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });
            scope.editRecord(scope.records[0]);

            expect(scope.currentRecords.length).toBe(3);
            expect(scope.id).toBe(record.id);
            expect(scope.amount).toBe(-100);
            expect(scope.repeat).toBe(undefined);
            expect(scope.hideEdit).toBe(true);
            expect(scope.name).toBe('test');
            expect(scope.paid).toBe(true);
            expect(scope.day).toBe(record.time.getDate());

            expect(scope.expectedExpences).toBe(1);
            expect(scope.currentAmount).toBe(99);
            expect(scope.leftAmount).toBe(98);


        }));

        it('save edit record', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var record = http.createRecord('test', -100, true, new Date());
            http.createRecord('test2', 1, false, new Date());
            http.createRecord('test3', 1, true, new Date());
            http.createRecord('test4', 1, false, addMonths(new Date(),1));


            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });
            scope.editRecord(scope.records[0]);
            scope.amount = -10;
            scope.name = 'new name';
            scope.paid = false;
            scope.day = 1;

            //act
            scope.save();
            scope.save();


            expect(scope.currentRecords.length).toBe(3);
            expect(scope.currentRecords[0].id).toBe(record.id);
            expect(scope.currentRecords[0].amount).toBe(-10);
            expect(scope.currentRecords[0].name).toBe('new name');
            expect(scope.currentRecords[0].paid).toBe(false);
            expect(scope.currentRecords[0].time.getDate()).toBe(1);
            expect(scope.currentRecords[0].time.getMonth()).toBe(new Date().getMonth());
            expect(scope.id).toBe(undefined);

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(-1);
            expect(scope.leftAmount).toBe(8);


        }));

        
        it('start edit group', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var group = http.createGroup('test', -100, new Date());

            

            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.editRecord(scope.groups[0],true);



            expect(scope.currentGroups.length).toBe(1);
            expect(scope.id).toBe(group.id);
            expect(scope.amount).toBe(-100);
            expect(scope.group).toBe(true);
            expect(scope.repeat).toBe(undefined);
            expect(scope.hideEdit).toBe(true);
            expect(scope.name).toBe('test');
            expect(scope.paid).toBe(undefined);
            expect(scope.day).toBe(1);

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(100);


        }));

        it('save edit group', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

           var group = http.createGroup({
                amount: -100,
                name: 'test',
                time: new Date(),

            });
            

            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });
            scope.editRecord(scope.groups[0], true);
            scope.name = "new Name";
            scope.amount = -10;
            //act
            scope.save();
            scope.save();



            expect(scope.currentRecords.length).toBe(0);
            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].id).toBe(group.id);
            expect(scope.currentGroups[0].amount).toBe(-10);
            expect(scope.currentGroups[0].name).toBe('new Name');
            expect(scope.currentGroups[0].paid).toBe(undefined);
            expect(scope.currentGroups[0].time.getDate()).toBe(1);
            expect(scope.currentGroups[0].time.getMonth()).toBe(new Date().getMonth());
            expect(scope.id).toBe(undefined);

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(10);



        }));

        it('start edit sequence', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var sequence = http.createSequence({
                amount: -100,
                name: 'test',
                time: new Date(),

            });


            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.edit();
            scope.editSequence(scope.currentRecords[0]);



            expect(scope.currentRecords.length).toBe(1);
            expect(scope.id).toBe(sequence.id);
            expect(scope.amount).toBe(-100);
            expect(scope.group).toBe(undefined);
            expect(scope.repeat).toBe(true);
            expect(scope.name).toBe('test');
            expect(scope.paid).toBe(undefined);
            expect(scope.day).toBe(1);
            expect(scope.hideEdit).toBe(true);

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(100);


        }));

        it('start edit sequence Record notSaved', inject(function ($rootScope, $controller) {
            //spec body 
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var sequence = http.createSequence({
                amount: -100,
                name: 'test',
                time: new Date(),

            });


            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.edit();
            scope.editRecord(scope.currentRecords[0]);



            expect(scope.currentRecords.length).toBe(1);
            expect(scope.id).toBe(undefined);
            expect(scope.amount).toBe(-100);
            expect(scope.group).toBe(undefined);
            expect(scope.repeat).toBe(undefined);
            expect(scope.name).toBe('test');
            expect(scope.paid).toBe(undefined);
            expect(scope.day).toBe(1);
            expect(scope.hideEdit).toBe(true);

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(100);


        }));

        it('save edit sequence', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var group = http.createSequence({
                amount: -100,
                name: 'test',
                time: new Date(),

            });


            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });
            scope.editSequence(scope.currentRecords[0]);
            scope.name = "new Name";
            scope.amount = -10;
            //act
            scope.save();
            scope.save();



            expect(scope.currentRecords.length).toBe(1);
            expect(scope.currentGroups.length).toBe(0);
            expect(scope.currentRecords[0].id).toBe(undefined);
            expect(scope.currentRecords[0].amount).toBe(-10);
            expect(scope.currentRecords[0].name).toBe('new Name');
            expect(scope.currentRecords[0].paid).toBe(undefined);
            expect(scope.currentRecords[0].time.getDate()).toBe(1);
            expect(scope.currentRecords[0].time.getMonth()).toBe(new Date().getMonth());
            expect(scope.id).toBe(undefined);

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(10);



        }));


    });
});