

describe('myApp.records', function () {

    beforeEach(module('myApp.records','ngCookies'));


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
            expect(scope.currentRecords[0].id).toBe(record.id);

            scope.editRecord(scope.currentRecords[0]);

            expect(scope.currentRecords.length).toBe(3);
            expect(scope.editableRecord.id).toBe(record.id);
            expect(scope.editableRecord.amount).toBe(-100);
            expect(scope.editableRecord.repeat).toBe(undefined);
            expect(scope.hideEdit).toBe(false);
            expect(scope.editableRecord.name).toBe('test');
            expect(scope.editableRecord.paid).toBe(true);
            expect(scope.editableRecord.day).toBe(record.time.getDate());

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

            expect(scope.currentRecords[0].id).toBe(record.id);

            scope.editRecord(scope.currentRecords[0]);
            scope.editableRecord.amount = -10;
            scope.editableRecord.name = 'new name';
            scope.editableRecord.paid = false;
            scope.editableRecord.day = 1;

            //act
            scope.save();
            expect(scope.currentRecords.length).toBe(3);

            scope.save();


            expect(scope.currentRecords.length).toBe(3);
            expect(scope.currentRecords[0].id).toBe(record.id);
            expect(scope.currentRecords[0].amount).toBe(-10);
            expect(scope.currentRecords[0].name).toBe('new name');
            expect(scope.currentRecords[0].paid).toBe(false);
            expect(scope.currentRecords[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentRecords[0].time.getMonth()).toBe(new Date().getMonth());
            expect(scope.id).toBe(undefined);

            expect(scope.expectedExpences).toBe(1);
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
            expect(scope.editableRecord.id).toBe(group.id);
            expect(scope.editableRecord.amount).toBe(-100);
            expect(scope.editableRecord.group).toBe(true);
            expect(scope.editableRecord.repeat).toBe(undefined);
            expect(scope.hideEdit).toBe(false);
            expect(scope.editableRecord.name).toBe('test');
            expect(scope.editableRecord.paid).toBe(undefined);
            expect(scope.editableRecord.day).toBe(new Date().getDate());

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(100);


        }));

        it('save edit group', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var group = http.createGroup('test', -100, new Date());



            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });
            scope.editRecord(scope.groups[0]);
            scope.editableRecord.name = "new Name";
            scope.editableRecord.amount = -10;
            //act
            scope.save();
            scope.save();



            expect(scope.currentRecords.length).toBe(0);
            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].id).toBe(group.id);
            expect(scope.currentGroups[0].amount).toBe(-10);
            expect(scope.currentGroups[0].name).toBe('new Name');
            expect(scope.currentGroups[0].paid).toBe(undefined);
            expect(scope.currentGroups[0].time.getDate()).toBe(new Date().getDate());
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


            var sequence = http.createSequence('test', -100, new Date());




            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.edit();
            scope.editSequence(scope.currentRecords[0]);



            expect(scope.currentRecords.length).toBe(1);
            expect(scope.editableRecord.id).toBe(sequence.id);
            expect(scope.editableRecord.amount).toBe(-100);
            expect(scope.editableRecord.group).toBe(undefined);
            expect(scope.editableRecord.repeat).toBe(true);
            expect(scope.editableRecord.name).toBe('test');
            expect(scope.editableRecord.paid).toBe(undefined);
            expect(scope.editableRecord.day).toBe(new Date().getDate());
            expect(scope.hideEdit).toBe(false);

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(100);


        }));

        it('edit saved sequence record', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);


            var sequence = http.createSequence('test', -100, new Date());




            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.edit();
            scope.editRecord(scope.currentRecords[0]);
            scope.save();
            scope.editRecord(scope.currentRecords[0]);
            scope.editableRecord.paid = true;
            scope.save();


            expect(scope.currentRecords.length).toBe(1);
            //expect(scope.editableRecord.id).toBe(sequence.id);
            expect(scope.currentRecords[0].amount).toBe(-100);
            expect(scope.currentRecords[0].repeat).toBe(true);
            expect(scope.currentRecords[0].name).toBe('test');
            expect(scope.currentRecords[0].paid).toBe(true);

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(100);
            expect(scope.leftAmount).toBe(100);


        }));

        it('start edit sequence Record notSaved', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var sequence = http.createSequence('test', -100, new Date());

            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.edit();
            scope.editRecord(scope.currentRecords[0]);

            expect(scope.currentRecords.length).toBe(1);
            expect(scope.editableRecord.id).toBe(-1);
            expect(scope.editableRecord.amount).toBe(-100);
            expect(scope.editableRecord.group).toBe(undefined);
            expect(scope.editableRecord.repeat).toBe(true);
            expect(scope.editableRecord.name).toBe('test');
            expect(scope.editableRecord.paid).toBe(undefined);
            expect(scope.editableRecord.day).toBe(new Date().getDate());
            expect(scope.hideEdit).toBe(false);

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(100);


        }));

        it('start edit sequence Group notSaved', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var sequence = http.createSequence('test', -100, new Date(),true);

            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.edit();
            scope.editRecord(scope.currentGroups[0],true);

            expect(scope.currentGroups.length).toBe(1);
            expect(scope.editableRecord.id).toBe(-1);
            expect(scope.editableRecord.amount).toBe(-100);
            expect(scope.editableRecord.group).toBe(true);
            expect(scope.editableRecord.repeat).toBe(true);
            expect(scope.editableRecord.name).toBe('test');
            expect(scope.editableRecord.sequenceid).toBe(sequence.id);
            expect(scope.editableRecord.paid).toBe(undefined);
            expect(scope.editableRecord.day).toBe(new Date().getDate());
            expect(scope.hideEdit).toBe(false);

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(100);


        }));

        it('save sequence Record', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var sequence = http.createSequence('test', -100, new Date());

            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            scope.edit();
            scope.editRecord(scope.currentRecords[0]);
            scope.editableRecord.name = "new Name";
            scope.editableRecord.amount = -10;
            scope.save();

            //act
            scope.editRecord(scope.currentRecords[0]);

            expect(scope.editableRecord.id).toBeGreaterThan(0);
            expect(scope.editableRecord.sequenceid).toBe(sequence.id);
            expect(scope.editableRecord.amount).toBe(-10);
            expect(scope.editableRecord.group).toBe(undefined);
            expect(scope.editableRecord.repeat).toBe(true);
            expect(scope.editableRecord.name).toBe("new Name");
            expect(scope.editableRecord.paid).toBe(undefined);
            expect(scope.editableRecord.day).toBe(new Date().getDate());
            expect(scope.hideEdit).toBe(false);


            scope.editableRecord.name = "new Name2";
            scope.editableRecord.amount = -11;
            scope.save();

            expect(scope.currentRecords.length).toBe(1);
            //expect(scope.currentRecords[0].id).toBe(sequence.id);
            expect(scope.currentRecords[0].sequenceid).toBe(sequence.id);
            expect(scope.currentRecords[0].amount).toBe(-11);
            expect(scope.currentRecords[0].name).toBe('new Name2');
            expect(scope.currentRecords[0].id).toBeGreaterThan(0);

            expect(scope.editableRecord.id).toBe(undefined);
            expect(scope.editableRecord.amount).toBe(undefined);
            expect(scope.editableRecord.group).toBe(undefined);
            expect(scope.editableRecord.repeat).toBe(undefined);
            expect(scope.editableRecord.name).toBe(undefined);
            expect(scope.editableRecord.paid).toBe(undefined);
            expect(scope.hideEdit).toBe(false);

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(11);


        }));

        it('save sequence group', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var sequence = http.createSequence('test', -100, new Date(),true);

            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            //act
            scope.edit();
            scope.editRecord(scope.currentGroups[0],true);
            scope.editableRecord.name = "new Name";
            scope.editableRecord.amount = -10;
            scope.save();

            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].id).toBeGreaterThan(0);
            expect(scope.currentGroups[0].sequenceid).toBe(sequence.id);
            expect(scope.currentGroups[0].amount).toBe(-10);
            expect(scope.currentGroups[0].name).toBe('new Name');

            expect(scope.editableRecord.id).toBe(undefined);
            expect(scope.editableRecord.amount).toBe(undefined);
            expect(scope.editableRecord.group).toBe(undefined);
            expect(scope.editableRecord.repeat).toBe(undefined);
            expect(scope.editableRecord.name).toBe(undefined);
            expect(scope.editableRecord.paid).toBe(undefined);
            expect(scope.hideEdit).toBe(false);

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(10);


        }));

        it('save saved sequence group', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var sequence = http.createSequence('test', -100, new Date(),true);

            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });

            scope.edit();
            scope.editRecord(scope.currentGroups[0]);
            scope.editableRecord.name = "new Name";
            scope.editableRecord.amount = -10;
            scope.save();

            //act
            scope.editRecord(scope.currentGroups[0]);
            scope.editableRecord.name = "new Name2";
            scope.editableRecord.amount = -11;
            scope.save();


            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].sequenceid).toBe(sequence.id);
            expect(scope.currentGroups[0].amount).toBe(-11);
            expect(scope.currentGroups[0].name).toBe('new Name2');
            expect(scope.currentGroups[0].id).toBeGreaterThan(0);

            expect(scope.editableRecord.id).toBe(undefined);
            expect(scope.editableRecord.amount).toBe(undefined);
            expect(scope.editableRecord.group).toBe(undefined);
            expect(scope.editableRecord.repeat).toBe(undefined);
            expect(scope.editableRecord.name).toBe(undefined);
            expect(scope.editableRecord.paid).toBe(undefined);
            expect(scope.hideEdit).toBe(false);
            expect(scope.sequenceid).toBe(undefined);

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(11);


        }));

        it('save edit sequence', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);


            var sequence = http.createSequence('test', -100, new Date());

            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });
            scope.editSequence(scope.currentRecords[0]);
            scope.editableRecord.name = "new Name";
            scope.editableRecord.amount = -10;
            //act
            scope.save();
            scope.save();

            expect(scope.currentRecords.length).toBe(1);
            expect(scope.currentGroups.length).toBe(0);
            expect(scope.currentRecords[0].sequence.id).toBe(sequence.id);
            expect(scope.currentRecords[0].id).toBe(-1);
            expect(scope.currentRecords[0].sequenceid).toBe(sequence.id);
            expect(scope.currentRecords[0].amount).toBe(-10);
            expect(scope.currentRecords[0].name).toBe('new Name');
            expect(scope.currentRecords[0].paid).toBe(undefined);
            expect(scope.currentRecords[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentRecords[0].time.getMonth()).toBe(new Date().getMonth());

            expect(scope.editableRecord.id).toBe(undefined);
            expect(scope.editableRecord.amount).toBe(undefined);
            expect(scope.editableRecord.group).toBe(undefined);
            expect(scope.editableRecord.repeat).toBe(undefined);
            expect(scope.editableRecord.name).toBe(undefined);
            expect(scope.editableRecord.paid).toBe(undefined);
            expect(scope.editableRecord.day).toBe(new Date().getDate());

            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(10);



        }));

        it('delete record', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            http.createRecord('test',1,true,new Date());


            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });
            scope.edit();
            scope.editRecord(scope.currentRecords[0]);
            //act
            scope.delete();

            expect(scope.currentRecords.length).toBe(0);
            expect(scope.currentGroups.length).toBe(0);
            expect(scope.id).toBe(undefined);

            expect(scope.editableRecord.id).toBe(undefined);
            expect(scope.editableRecord.amount).toBe(undefined);
            expect(scope.editableRecord.group).toBe(undefined);
            expect(scope.editableRecord.repeat).toBe(undefined);
            expect(scope.editableRecord.name).toBe(undefined);
            expect(scope.editableRecord.paid).toBe(undefined);
            expect(scope.editableRecord.day).toBe(new Date().getDate());
            expect(scope.hideEdit).toBe(false);
            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(0);



        }));

        it('delete saved sequence record', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            http.createSequence('name', 1, new Date());


            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http });
            scope.edit();
            scope.pay(scope.currentRecords[0]);
            scope.editRecord(scope.currentRecords[0]);
            //act
            scope.delete();

            expect(scope.currentRecords.length).toBe(0);
            expect(scope.currentGroups.length).toBe(0);
            expect(scope.id).toBe(undefined);

            expect(scope.editableRecord.id).toBe(undefined);
            expect(scope.editableRecord.amount).toBe(undefined);
            expect(scope.editableRecord.group).toBe(undefined);
            expect(scope.editableRecord.repeat).toBe(undefined);
            expect(scope.editableRecord.name).toBe(undefined);
            expect(scope.editableRecord.paid).toBe(undefined);
            expect(scope.editableRecord.day).toBe(new Date().getDate());
            expect(scope.hideEdit).toBe(false);
            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(0);



        }));

        it('delete group', inject(function ($rootScope, $controller,$cookies) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            http.createGroup('test',1,new Date());


            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http ,$cookies:$cookies});
            scope.edit();
            scope.editRecord(scope.currentGroups[0]);
            //act
            scope.delete();

            expect(scope.currentRecords.length).toBe(0);
            expect(scope.currentGroups.length).toBe(0);
            expect(scope.id).toBe(undefined);

            expect(scope.editableRecord.id).toBe(undefined);
            expect(scope.editableRecord.amount).toBe(undefined);
            expect(scope.editableRecord.group).toBe(undefined);
            expect(scope.editableRecord.repeat).toBe(undefined);
            expect(scope.editableRecord.name).toBe(undefined);
            expect(scope.editableRecord.paid).toBe(undefined);
            expect(scope.editableRecord.day).toBe(new Date().getDate());
            expect(scope.hideEdit).toBe(false);
            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(0);



        }));

        it('delete sequence', inject(function ($rootScope, $controller,$cookies) {
            //spec body
            var scope = $rootScope.$new();
            var http = new myHttp([], [], []);

            var sequence = http.createSequence('test', 1, new Date());

            var controller = $controller('RecordsCtrl', { $scope: scope, $http: http,$cookies:$cookies });
            scope.edit();
            scope.editSequence(scope.currentRecords[0]);
            //act
            scope.delete();



            expect(scope.currentRecords.length).toBe(0);
            expect(scope.currentGroups.length).toBe(0);
            expect(scope.id).toBe(undefined);

            expect(scope.editableRecord.id).toBe(undefined);
            expect(scope.editableRecord.amount).toBe(undefined);
            expect(scope.editableRecord.group).toBe(undefined);
            expect(scope.editableRecord.repeat).toBe(undefined);
            expect(scope.editableRecord.name).toBe(undefined);
            expect(scope.editableRecord.paid).toBe(undefined);
            expect(scope.editableRecord.day).toBe(new Date().getDate());
            expect(scope.hideEdit).toBe(false);
            expect(scope.expectedExpences).toBe(0);
            expect(scope.currentAmount).toBe(0);
            expect(scope.leftAmount).toBe(0);



        }));


    });
});