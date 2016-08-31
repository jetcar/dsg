'use strict';

describe('myApp.records', function () {

    beforeEach(module('myApp.records'));


    describe('records controller', function () {

        it('simple record', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var controller = $controller('RecordsCtrl',{$scope:scope});
            scope.records = [
                {
                    id: 1,
                    amount: 1,
                    name: 'test',
                    paid: true,
                    time: new Date(),

                },
                {
                    id: 1,
                    amount: 1,
                    name: 'test',
                    paid: true,
                    time: new Date(2011),

                },

            ];
            scope.updateView();

            expect(scope.currentRecords.length).toBe(1);
            expect(scope.currentRecords[0].id).toBe(1);
            expect(scope.currentRecords[0].amount).toBe(1);
            expect(scope.currentRecords[0].name).toBe('test');
            expect(scope.currentRecords[0].paid).toBe(true);
            expect(scope.currentRecords[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentRecords[0].time.getMonth()).toBe(new Date().getMonth());
        }));

        it('simple group', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var controller = $controller('RecordsCtrl',{$scope:scope});
            scope.groups = [
                {
                    id: 1,
                    amount: 1,
                    name: 'test',
                    time: new Date(),

                }
                ,
                {
                    id: 1,
                    amount: 1,
                    name: 'test',
                    time: new Date(2011),

                }
            ];
            scope.updateView();

            expect(scope.currentGroups.length).toBe(1);
            expect(scope.currentGroups[0].id).toBe(1);
            expect(scope.currentGroups[0].amount).toBe(1);
            expect(scope.currentGroups[0].name).toBe('test');
            expect(scope.currentGroups[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentGroups[0].time.getMonth()).toBe(new Date().getMonth());
        }));

        it('simple sequence', inject(function ($rootScope, $controller) {
            //spec body
            var scope = $rootScope.$new();
            var controller = $controller('RecordsCtrl',{$scope:scope});
            scope.sequences = [
                {
                    id: 1,
                    amount: 1,
                    name: 'test',
                    time: new Date(),

                }

            ];
            scope.updateView();

            expect(scope.currentRecords.length).toBe(1);
            expect(scope.currentRecords[0].id).toBe(undefined);
            expect(scope.currentRecords[0].amount).toBe(1);
            expect(scope.currentRecords[0].name).toBe('test');
            expect(scope.currentRecords[0].time.getDate()).toBe(new Date().getDate());
            expect(scope.currentRecords[0].time.getMonth()).toBe(new Date().getMonth());
        }));

    });
});