'use strict';

jsq.service("buyCalculation", function($rootScope) {
    var self = this;

    // 计算契税
    // 非普通住宅/普通住宅非首套，全额3%比例;普通住宅首套,且面积小于等于90平米，全额1%;普通住宅首套,面积大于90平米，全额1.5%
    self.deedTaxCal = function(buyParam) {
        var deedTaxProportion = 0;
        if (buyParam.buyhouseType) {
            deedTaxProportion = 0.03;
        } else {
            if (buyParam.isFirst) {
                deedTaxProportion = 0.03;
            } else {
                deedTaxProportion = (buyParam.area <= 90) ? 0.01 : 0.015;
            }
        }
        return buyParam.contractPrice * deedTaxProportion;
    }

    // 计算房产税
    self.buildingTaxCal = function(buyParam) {
        var unitBase = 2.7740;
        var unitPrice = buyParam.contractPrice / buyParam.area;
        var unitCompare = (unitPrice > unitBase) ? true : false;
        var extraArea = buyParam.area - 60 * buyParam.familyNum;

        // (总面积-60*家庭人数) <= 0,房产税=0
        if (extraArea <= 0) {
            return 0;
        }
        // 沪籍首套,房产税=0
        if (!buyParam.isSh && !buyParam.isFirst) {
            return 0;
        }
        // 沪籍非首套，且(合同价/面积)>2.7740万,房产税={合同价/面积*(总面积-60*家庭人数)}*70%*0.6%
        if (!buyParam.isSh && buyParam.isFirst && unitCompare) {
            return unitPrice * extraArea * 0.7 * 0.006;
        }
        // 沪籍非首套，且(合同价/面积)<=2.7740万,房产税={合同价/面积*(总面积-60*家庭人数)}*70%*0.4%
        if (!buyParam.isSh && buyParam.isFirst && !unitCompare) {
            return unitPrice * extraArea * 0.7 * 0.004;
        }
        // 非沪籍,(合同价/面积)>2.7740万,房产税= 合同价*70%*0.6%
        if (buyParam.isSh && unitCompare) {
            return buyParam.contractPrice * 0.7 * 0.006;
        }
        // 非沪籍,(合同价/面积)<=2.7740万,房产税= 合同价*70%*0.4%
        if (buyParam.isSh && !unitCompare) {
            return buyParam.contractPrice * 0.7 * 0.004;
        }
        return 0;
    }

});