angular.module('ethExplorer')
    .controller('mainCtrl', function ($http,$rootScope, $scope, $location) {
        var web3 = $rootScope.web3;
        $scope.transactions = [];
        var isEnd = false;
        var currentNumber = 0;
        $scope.init =  function () {
             web3.eth.getBlockNumber(function (err, number) {
                if (err) {
                    console.log(err);
                    return ;
                }
                 currentNumber = number;
                 getBlockTransactionCount(number, $scope.transactions, getBlockTransactionCount);
            });
            var getBlockTransactionCount = function(number, list, callbak) {
                 if (!list) {
                     list = [];
                 }
                 if (number < 0) {
                     return ;
                 }
                 web3.eth.getBlockTransactionCount(number, function(error, result){
                     if (error) {
                         console.log(error);
                         return ;
                     }
                     if (currentNumber-number > 1000) {
                         return ;
                     }
                     var txCount = result;
                     if (result > 0) {

                         if (txCount > 0) {
                             isEnd = true;
                         }
                         else {
                             number--;
                             return ;
                         }
                         for (var blockIdx = 0; blockIdx < txCount; blockIdx++) {
                             web3.eth.getTransactionFromBlock(number, blockIdx, function(error, result) {
                                 var transaction = {
                                     transaction_hash:result.hash,
                                     block_high	: result.blockNumber,
                                     from: result.from,
                                     contracts_address: result.to
                                 };
                                 $scope.$apply(
                                     $scope.transactions.push(transaction)
                                 )
                             });
                         }
                         console.log($scope.transactions);
                         return ;
                     }else {
                         if (callbak) {
                             if (result == 0) {
                                 callbak(number-1, list, getBlockTransactionCount);
                             }
                         }
                     }
                 });
             }
        };


        $scope.init();
  //获取交易总数
  $http.get(commonUrl+'/blockchain/iou-statistics').
        success(function(data){
          if(data.code == '0'){
            var totalTransicationscount = $scope.totalTransicationscount = data.result.totalTransactionsCount;
          }else{
            console.log(data.message);
          }

        }).
        error(function(data){
          console.log(data)
        })

	var maxBlocks = 5; // TODO: into setting file or user select
	var blockNum = $scope.blockNum = parseInt(web3.eth.blockNumber);
    var accounts = $scope.accounts = web3.eth.accounts.length;
	if (maxBlocks > blockNum) {
	    maxBlocks = blockNum + 1;
	}

	// get latest 50 blocks
	$scope.blocks = [];
	for (var i = 0; i < maxBlocks; ++i) {
	    $scope.blocks.push(web3.eth.getBlock(blockNum - i));
	}

        $scope.processRequest = function() {
             var requestStr = $scope.ethRequest.split('0x').join('');

      if (requestStr.length === 40){
          return goToAddrInfos(requestStr)
      } else if(requestStr.length === 64) {
          if(/[0-9a-zA-Z]{64}?/.test(requestStr))
              return goToTxInfos('0x'+requestStr)
          else if(/[0-9]{1,7}?/.test(requestStr))
              return goToBlockInfos(requestStr)
      }else if(requestStr.length === 36 && /[0-9a-z-]{36}/.test(requestStr)){
          return goTolendNoteInfos(requestStr)
      }else {
          alert('Don\'t know how to handle '+ requestStr)
      }
  };

  function goTolendNoteInfos(requestStr) {
      $location.path('/lendNote/'+requestStr);
  }
  function goToBlockInfos(requestStr) {
      $location.path('/block/'+requestStr);
  }

  function goToAddrInfos(requestStr) {
      $location.path('/address/'+requestStr);
  }

   function goToTxInfos (requestStr) {
       $location.path('/transaction/'+requestStr);
  }

});


//移动端和pc端头部背景图切换
// window.onresize=function(){
//   var w = document.body.clientWidth || document.documentElement.clientWidth;
//   if(w<768){
//     //console.log(document.querySelector('header').getAttribute('class'))
//     document.querySelector('header').setAttribute('class','site-header-app');
//   }else{
//     document.querySelector('header').setAttribute('class','site-header');
//   }
// }


    // window.onresize=function(){
    //   var w = document.body.clientWidth || document.documentElement.clientWidth;
    //   if(w<768){
    //     //console.log(document.querySelector('header').getAttribute('class'))
    //     document.querySelector('header').setAttribute('class','site-header-app');
    //     document.querySelector('.form-group').style.width = '305px'
    //     document.querySelector('.search').style.fontSize = '12px'
    //     document.querySelector('.fa-search').style.top = '4px'
    //   }else{
    //     document.querySelector('header').setAttribute('class','site-header');
    //     document.querySelector('.form-group').style.width = '400px'
    //     document.querySelector('.search').style.fontSize = '16px'
    //     document.querySelector('.fa-search').style.top = '6px'
    //   }
    // }
