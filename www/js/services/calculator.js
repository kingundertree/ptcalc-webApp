'use strict';

jsq.service("calculator", function($rootScope) {
    var self = this;

    // 计算公证费
    self.notaryFeeCal = function(contractPrice) {
        var notaryFee = 0;
        if (contractPrice <= 50) {
            if (contractPrice * 0.003 < 0.02) {
                notaryFee = 0.02;
            } else {
                notaryFee = contractPrice * 0.003;
            }
        } else if (contractPrice <= 500){
            notaryFee = contractPrice * 0.0025 + 0.025;
        } else if (contractPrice <= 1000) {
            notaryFee = contractPrice * 0.002 + 0.275;
        } else if (contractPrice <= 2000) {
            notaryFee = contractPrice * 0.0015 + 0.775;
        } else if (contractPrice <= 5000) {
            notaryFee = contractPrice * 0.001 + 1.775;
        } else {
            notaryFee = contractPrice * 0.0005 + 4.275;
        }
        return  notaryFee;
    }

    // 计算交易手续费
    self.tradingFeeCal = function(area) {
        return area * 0.00025;
    }

    // 计算佣金
    self.commissionFeeCal = function() {
        return 0.01;
    }
});