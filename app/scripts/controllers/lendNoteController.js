angular.module('ethExplorer')
    .controller('lendNoteCtrl', function ($rootScope, $scope, $location, $routeParams,$q, $http,$filter) {
        var web3 = $rootScope.web3;
        var contract = $rootScope.contract;
        $scope.init = function()
        {
            $scope.lendNoteStatus = lendNoteStatus;
            $scope.lendNoteId = $routeParams.lendNoteId;
            if($scope.lendNoteId!==undefined) {

                var basicData = {};
                var res1 = contract.getFirstLoanDataById($scope.lendNoteId);
                for (var i=0; i<res1.length; i++) {
                        switch (i) {
                            case 0:
                                basicData.publishTime = res1[i].c.join('');
                                break;
                            case 1:
                                basicData.repayTime = res1[i].c.join('');
                                break;
                            case 2:
                                basicData.loanStatus = res1[i].c.join('');
                                break;
                            case 3:
                                basicData.borrower = res1[i];
                                break;
                            case 4:
                                basicData.lender = res1[i];
                                break;
                            case 5:
                                basicData.balance = res1[i];
                                break;
                        }
                }
                var res2 = contract.getSecondLoanDataById($scope.lendNoteId);
                for (var i=0; i<res2.length; i++) {
                        switch (i) {
                            case 0:
                                basicData.interest = res2[i];
                                break;
                            case 1:
                                basicData.lendEffectTime = res2[i].c.join('');
                                break;
                            case 2:
                                basicData.actualRepayTime = res2[i].c.join('');
                                break;
                            case 3:
                                basicData.lendMd5 = res2[i];
                                break;
                            case 4:
                                basicData.repayMd5 = res2[i];
                                break;
                            case 5:
                                basicData.isAppeal = res2[i].c.join('');
                                break;
                        }
                }
                $scope.basicData = basicData;
            } else {
                $location.path("/");
            }

            if ($scope.basicData.loanStatus == 0) {
                document.getElementById('lendNoteImg').style.display = 'block';
            }else {
                document.getElementById('lendNoteContent').style.display = 'block';
                $http.get($rootScope.commonUrl + '/blockchain/iou-history/'+$scope.lendNoteId)
                    .then(function successCallback(response) {
                        if(response.data.code==0){
                            $scope.lendNoteStatusArray = response.data.result;
                        }else {
                            alert(response.data.message);
                        }
                    },function errorCallback(response) {
                        console.log(response);
                    });
            }
        };
        $scope.init();
    });
