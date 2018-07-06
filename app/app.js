'use strict';

//调用接口的commonUrl(开发环境)
// var commonUrl = 'https://api.sociallending.io/firenze';
var commonUrl = 'https://qa-hive.ibeesaas.com/firenze';
angular.module('ethExplorer', ['ngRoute','ui.bootstrap'])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/main.html',
                controller: 'mainCtrl'
            }).
            when('/block/:blockId', {
                templateUrl: 'views/blockInfos.html',
                controller: 'blockInfosCtrl'
            }).
            when('/lendNote/:lendNoteId', {
                templateUrl: 'views/lendNote.html',
                controller: 'lendNoteCtrl'
            }).
            when('/transaction/:transactionId', {
                templateUrl: 'views/transactionInfos.html',
                controller: 'transactionInfosCtrl'
            }).
            when('/address/:addressId', {
                templateUrl: 'views/addressInfo.html',
                controller: 'addressInfoCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }])
    .run(function($rootScope) {
        var web3 = new Web3();
        $rootScope.commonUrl = commonUrl;
        // var eth_node_url = 'http://172.16.50.132:8545'; // TODO: 测试链
        // var eth_node_url = 'https://poa.sociallending.io/'; // 私有链 product
        var eth_node_url = 'https://geth.ibeesaas.com/'; // 私有链 qa
        // var eth_node_url = 'http://172.16.50.113:8918'; // TODO: remote URL
	    // var eth_node_url = 'http://localhost:8545'; // TODO: remote URL
        
	web3.setProvider(new web3.providers.HttpProvider(eth_node_url));
	    var contractAddress = "0xb6796bed573836cac10ffdd6a1e119153ca755b2"; // TODO 需要真实的智能合约地址
	    var abi = [{"constant":false,"inputs":[{"name":"loanId","type":"string"},{"name":"repayMd5","type":"string"}],"name":"repayBeConfirmed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanId","type":"string"},{"name":"actualRepayTime","type":"uint32"}],"name":"repayToConfirm","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanId","type":"string"}],"name":"appeal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"string"}],"name":"getFirstLoanDataById","outputs":[{"name":"","type":"uint32"},{"name":"","type":"uint32"},{"name":"","type":"uint8"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanId","type":"string"},{"name":"lendMd5","type":"string"}],"name":"confirmReleaseLoan","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanId","type":"string"},{"name":"publishTime","type":"uint32"},{"name":"repayTime","type":"uint32"},{"name":"borrower","type":"string"},{"name":"lender","type":"string"},{"name":"amount","type":"string"},{"name":"interest","type":"string"}],"name":"releaseLoan","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanId","type":"string"}],"name":"cancelAppeal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"string"}],"name":"getSecondLoanDataById","outputs":[{"name":"","type":"string"},{"name":"","type":"uint32"},{"name":"","type":"uint32"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanId","type":"string"}],"name":"ReleaseToConfirm","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanId","type":"string"}],"name":"ReleaseBeConfirmed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanId","type":"string"}],"name":"AppealInReleaseToConfirm","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanId","type":"string"}],"name":"CancelAppealInReleaseToConfirm","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanId","type":"string"}],"name":"RepayToConfirm","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanId","type":"string"}],"name":"RepayBeConfirmed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanId","type":"string"}],"name":"AppealInRepayToConfirm","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanId","type":"string"}],"name":"CancelAppealInRepayToConfirm","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}];
        // var contract = new web3.eth.contract(abi);
        var contract = web3.eth.contract(abi).at(contractAddress);
        // contract.options.address = contractAddress;
        $rootScope.web3 = web3;
        $rootScope.contractAddress = contractAddress;
        $rootScope.contract = contract;
        function sleepFor( sleepDuration ){
            var now = new Date().getTime();
            while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
        }
        var connected = false;
        if(!web3.isConnected()) {
            $('#connectwarning').modal({keyboard:false,backdrop:'static'}) 
            $('#connectwarning').modal('show') 
        }
    });
