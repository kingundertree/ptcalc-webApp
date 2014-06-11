'use strict';

jsq.service("sellCalculation", function($rootScope, calculator) {
    var self = this;

    // 个税
    self.indeedTaxCal = function(contractPrice, primeCost, it) {
        if (contractPrice < primeCost) {
            return 0;
        }
        return contractPrice * it.totalProportion + (contractPrice - primeCost) *  it.profitProportion;
    }

    // 营业税
    self.businessTaxCal = function(contractPrice, primeCost, bt) {
        var tax = 0;
        if (bt.totalProportion) {
            tax = contractPrice * bt.totalProportion;
        } else if (bt.diffProportion) {
            tax = (contractPrice - primeCost) * bt.diffProportion;
        }
        return tax;
    }

    // 到手价计算合同价
    self.contractPriceCal = function(native, bt, it, fee, tradingFee, lastPrice) {
        var contractPrice = 0;
        var primeCost = fee.purchasePrice + fee.interest + fee.decorationCost;
        // temp1 1-营业税比例-个税全额比例-个税利润比例-佣金比例
        var temp1 = 1 - bt.proportion - it.totalProportion - it.profitProportion - calculator.commissionFeeCal();
        // temp2 = 购入价 * 差额比例 + (购入价 + 装修 + 利润) * 个税利润比例 - 交易手续费
        var temp2 = fee.purchasePrice * bt.diffProportion + primeCost * it.profitProportion - tradingFee;
        // 合同价(有公证费/无公证费)
        if (!native) {
            contractPrice = contractPriceCal1(lastPrice, temp1, temp2);
            if (contractPrice < primeCost) {
                it.profitProportion = 0;
                contractPrice = contractPriceCal1(lastPrice, temp1, temp2);
                if (contractPrice < primeCost) {
                    alert("输入有误!");
                    contractPrice = 0;
                }
            }
        } else {
            contractPrice = contractPriceCal2(lastPrice, temp1, temp2);
            if (contractPrice < primeCost) {
                contractPrice = contractPriceCal2(lastPrice, temp1, temp2);
            }
        }
        return contractPrice;
    }

    // 合同价=(到手价-购入价*差额比例+交易手续费-(购入价+贷款利息+装修成本)*个税利润比例)/(1-营业税全额比例-个税全额比例-个税利润比例-佣金比例)
    function contractPriceCal1(lastPrice, temp1, temp2) {
        return (lastPrice - temp2) / temp1;
    }

    function contractPriceCal2(lastPrice, temp1, temp2) {
        // 公证费比例
        var notaryTaxProportion = 0;
        // 公证费常量
        var notaryTaxNum = 0;
        if (lastPrice <= 6.6666 * temp1 + temp2 - 0.02) {
            notaryTaxProportion = 0;
            notaryTaxNum = 0.02
        }else if (lastPrice <= 50 * (temp1 - 0.003) + temp2) {
            notaryTaxProportion = 0.003;
            notaryTaxNum = 0;
        }else if (lastPrice <= 500 * (temp1 - 0.0025) + temp2 - 0.025) {
            notaryTaxProportion = 0.0025;
            notaryTaxNum = 0.025;
        }else if (lastPrice <= 1000 * (temp1 - 0.002) + temp2 - 0.275) {
            notaryTaxProportion = 0.002;
            notaryTaxNum = 0.275;
        }else if (lastPrice <= 2000 *(temp1 - 0.0015) + temp2 - 0.775) {
            notaryTaxProportion = 0.0015;
            notaryTaxNum = 0.775;
        }else if (lastPrice <= 5000 * (temp1 - 0.001) + temp2 - 1.775) {
            notaryTaxProportion = 0.001;
            notaryTaxNum = 1.775;
        }else{
            notaryTaxProportion =0.0005;
            notaryTaxNum = 4.275;
        }
        return (lastPrice - temp2 + notaryTaxNum) / (temp1 - notaryTaxProportion);
    }
});