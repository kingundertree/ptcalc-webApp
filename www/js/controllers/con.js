jsq.controller('con',function con($scope, calculator, buyCalculation, $http, indeedTax, businessTax, sellCalculation){

    pushNewPolicy();
    function pushNewPolicy(){
        $http.get("http://app.dooioo.com:8080/app/caleVersion").success(function(data) {
            $scope.newpolicy = data.versionList;
            var newNum = '';
            if ($scope.newpolicy) {
                for(var i=0; i < $scope.newpolicy.length; i++){
                    if ($scope.newpolicy[i].version == 1.2) {
                        newNum = i;
                    }
                }                
                // var errortipNum = localStorage.getItem("errortipNum");&& errortipNum != 1
                if ($scope.newpolicy[newNum].newsCon != "" ) {
                    $scope.errorcon = $scope.newpolicy[newNum].description;
                    showerror();

                    // localStorage.setItem("errortipNum",1);
                }
            };
        })        
    }

 
    document.getElementById("calcsell").scrollTop = 52;
    // 点击买房和卖房按钮，切换
    $$(".buy").tap(function(e){
        $$(".mainbuy").removeClass("conhide");
        // $$(".mainsell").removeClass("conhide");
        // $$(".mainhelp").removeClass("conhide");
        $$(".first").removeClass("mainshow");
        $$(".first").addClass("mainhide");
        $$(".mainbuy").addClass("conshow");        
        buyHouse();
    })

    $$(".firstnav .inputline").on("touchstart",function(){
        $$(this).addClass("inputlinehover");
    })

    $$(".firstnav .inputline").on("touchend",function(){
        $$(this).removeClass("inputlinehover");
    })

    $$(".submitbtn").on("touchstart",function(){
        $$(this).addClass("ptnhover");
    })
    $$(".submitbtn").on("touchend",function(){
        $$(this).removeClass("ptnhover");
    })

    $$(".sell").tap(function(e){
        // $$(".mainbuy").removeClass("conhide");
        $$(".mainsell").removeClass("conhide");
        // $$(".mainhelp").removeClass("conhide");
        $$(".first").removeClass("mainshow");
        $$(".first").addClass("mainhide");
        $$(".mainsell").addClass("conshow");
        sellHouse();
    })
    $$(".help").tap(function(e){
        $$(".mainbuy").removeClass("conhide");
        $$(".mainsell").removeClass("conhide");
        $$(".mainhelp").removeClass("conhide");
        $$(".first").removeClass("mainshow");
        $$(".first").addClass("mainhide");
        $$(".mainhelp").addClass("conshow");

        setTimeout(function(){
            $$(".mainbuy").addClass("conhide");
            $$(".mainsell").addClass("conhide");
        },10)
    })

    //功能页点击返回，动画切换至首页
    $$(".mainbuy .back").tap(function(e){
        $$(".mainbuy").removeClass("conshow");     
        $$(".mainbuy").addClass("conhide");        
        $$(".first").removeClass("mainhide");
        $$(".first").addClass("mainshow");
        buyInit();
    })

    $$(".mainsell .back").tap(function(e){
        $$(".mainsell").removeClass("conshow");     
        $$(".mainsell").addClass("conhide");        
        $$(".first").removeClass("mainhide");
        $$(".first").addClass("mainshow");
        setTimeout(function(){
            document.getElementById("calcsell").scrollTop = 52;
        },200)
        sellInit();
    })

    $$(".mainhelp .back").tap(function(e){
        $$(".mainhelp").removeClass("conshow");     
        $$(".mainhelp").addClass("conhide");        
        $$(".first").removeClass("mainhide");
        $$(".first").addClass("mainshow");
    })

    $$(".buyresult .back").tap(function(e){
        $$(".buyresult").removeClass("conshow");     
        $$(".buyresult").addClass("conhide");                
        $$(".mainbuy").removeClass("conshow1");
        $$(".mainbuy").addClass("conshow2");
    })
    $$(".sellresult .back").tap(function(e){
        $$(".sellresult").removeClass("conshow");     
        $$(".sellresult").addClass("conhide");                
        $$(".mainsell").removeClass("conshow1");
        $$(".mainsell").addClass("conshow2");
    })

    // 点击每行可以切换tab，买房
    $$(".buytab").tap(function(e) {
        var ch = $$(this).find(".tabchoose-checkbox");
        $scope.$apply(function() {
            $scope.filter1[ch[0].id] = !ch[0].checked;
        });
    });

    // 点击每行可以切换tab，卖房
    $$(".tab").tap(function(e) {
        var ch = $$(this).find(".tabchoose-checkbox");
        $scope.$apply(function() {
            $scope.filter2[ch[0].id] = !ch[0].checked;
        });
    });

    $$(".inputlinetype").tap(function(e) {
        var ch = $$(this).find(".tabchoose-checkbox");
        $scope.$apply(function() {
            $scope[ch[0].id] = !ch[0].checked;
        });
    });

    $scope.errorcon = "";

    function buyHouse() {
        buyInit();
        buyCon();
    }
    function buyInit() {
        var filter1 = $scope.filter1 = {
            contractPrice: 0.00,
            area: 0.00,
            existArea: 0.00,
            familyNum: 3
        }
        $scope.$apply();
    }

    function sellHouse(){
        $scope.calType = false;
        sellInit();
        sellCon();
    }
    function sellInit() {
        $http.get("data/region.json").success(function(data) {
            $scope.filter2.regions = data;
            $scope.filter2.region = data[0];
        });
        var filter2 = $scope.filter2 = {
            lastPrice : 0.00,
            contractPrice : 0.00,
            businessTaxResult : 0.00,
            indeedTaxResult : 0.00,
            tradingFee : 0.00,
            area : 0.00,
            notaryFee : 0.00,
            commissionFee : 0.00,
            totalTax : 0.00
        };
        var bt = $scope.bt = {};
        var fee = $scope.fee = {
            purchasePrice: 0.00,
            interest: 0.00,
            decorationCost: 0.00,
            buyDeedTax: 0.00
        };
        var it = $scope.it = {
            totalProportion: 0,
            profitProportion: 0
        };
        $scope.$apply();
    }

    function sellCon() {
        $scope.$watch('filter2', function(){
            $scope.noIndeedTax = indeedTax.noIndeedTaxCal($scope.filter2);

            // 个税选项的显示和隐藏
            if ($scope.noIndeedTax) {
                $scope.profitShow = false;
                $scope.totalShow = false;
                
                //个人所得税判断为隐藏前，个人所得税展开时，执行隐藏动画
                if ($$('.row11').hasClass('rowone')) {
                    $$('.row11').removeClass('inputlinehide');
                    $$('.row11').addClass('inputlineshow');
                    $$('.inputlinecon1').removeClass('inputlineconup');

                    //延迟执行行消失效果
                    setTimeout(function(){
                        $$('.row11').removeClass('inputlineshow');
                        $$('.row11').addClass('inputlinehide');
                    },10);

                    $scope.fee.interest = 0.00;
                    $scope.fee.decorationCost = 0.00;

                    $$('.row11').removeClass('rowone');
                }else{
                    //选择上海时，隐藏项非打开状态,不做任何事情
                }
            } else if (!$scope.noIndeedTax){
                $scope.totalShow = indeedTax.byTotalCal($scope.filter2) ? true : false;
                $scope.profitShow = indeedTax.byProfitCal($scope.filter2) ? true : false;

                if ($scope.totalShow && $scope.profitShow) {
                    // $$('.ischina').removeClass('borderbtrd');
                    //个人所得税判断为显示，执行显示动画
                    $$('.row11').removeClass('inputlinehide');
                    $$('.row11').addClass('inputlineshow');
                    $$('.row11').addClass('rowone');

                    $$('.inputlinecon1').addClass('inputlineconup');
                }else {
                    $$('.row11').addClass('inputlinehide');
                    $scope.fee.interest = 0.00;
                    $scope.fee.decorationCost = 0.00;
                }
            }

            //购入契税的显示与否
            if ($scope.filter2.isDeedTax) {
                // if ($$('.buyDeedTax').hasClass('rowone')) {
                    $$('.buyDeedTax').removeClass('inputlineshow');
                    $$('.buyDeedTax').addClass('inputlinehide');  
                    $scope.fee.buyDeedTax = 0.00;                  
                // }else{
                //     $$('.buyDeedTax').addClass('inputlinehide'); 
                // };

            }else if (!$scope.filter2.isDeedTax) {
                $$('.buyDeedTax').removeClass('inputlinehide');
                $$('.buyDeedTax').addClass('inputlineshow');
            };

            if ($scope.totalShow) {
                $scope.taxCalType = 2;
            } else if ($scope.profitShow) {
                $scope.taxCalType = 1;
            } else {
                $scope.taxCalType = 0;
            }


            // 利润/全额按钮切换事件
            $$("#calctype1").tap(function(e) {
                $scope.taxCalType = 1;
                $scope.$apply();

                //利润部分装修和利息显示
                $$('.row22').addClass('inputlinehide');

                $$('.row22').removeClass('inputlinehide');
                $$('.row22').addClass('inputlineshow');
                $$('.row22').addClass('rowone');

                setTimeout(function(){
                    $$('.inputlinecon2').addClass('inputlineconup');
                },10)

                setTimeout(function(){
                    $$('.inputlinecon3').addClass('inputlineconup');
                },100)
            });

            $$("#calctype2").tap(function(e) {
                $scope.taxCalType = 2;
                $scope.$apply();

                //如果选择全额之前，装修和利息是展开状态
                if ($$('.row22').hasClass('rowone')) {
                    $$('.row22').removeClass('inputlinehide');
                    $$('.row22').addClass('inputlineshow');
                    $$('.inputlinecon2').removeClass('inputlineconup');
                    $$('.inputlinecon3').removeClass('inputlineconup');

                    setTimeout(function(){
                        $$('.row22').removeClass('inputlineshow');
                        $$('.row22').addClass('inputlinehide');
                    },10);

                    $$('.row22').removeClass('rowone');
                }else{
                    //如果选择全额之前，装修和利息是隐藏状态，无操作
                }
            });

            //利润部分显示和隐藏
            $$('.row22').addClass('inputlinehide');
            //利润项显示和折叠时，展现动画
            if ($scope.profitShow && ($scope.taxCalType == 1)) {//利润选项显示

                $$('.row22').removeClass('inputlinehide');
                $$('.row22').addClass('inputlineshow');
                $$('.row22').addClass('rowone');

                setTimeout(function(){
                    $$('.inputlinecon2').addClass('inputlineconup');
                },10)

                setTimeout(function(){
                    $$('.inputlinecon3').addClass('inputlineconup');
                },100)
            }else{
                if ($$('.row22').hasClass('rowone')) {//如果选择上海之前，隐藏项是展开状态
                    //如果选择全额之前，装修和利息是展开状态
                    $$('.row22').removeClass('inputlinehide');
                    $$('.row22').addClass('inputlineshow');
                    $$('.inputlinecon2').removeClass('inputlineconup');
                    $$('.inputlinecon3').removeClass('inputlineconup');

                    setTimeout(function(){
                        $$('.row22').removeClass('inputlineshow');
                        $$('.row22').addClass('inputlinehide');
                    },10);

                    $$('.row22').removeClass('rowone');
                }else{
                    //如果选择全额之前，装修和利息是隐藏状态，无操作
                }
            };
            // 营业税系数
            $scope.bt.totalProportion = businessTax.byTotalCal($scope.filter2) ? businessTax.byTotalCal($scope.filter2) : 0;
            $scope.bt.diffProportion = businessTax.byDiffCal($scope.filter2) ? businessTax.byDiffCal($scope.filter2) : 0;
            $scope.bt.proportion = $scope.bt.totalProportion ? $scope.bt.totalProportion : ($scope.bt.diffProportion ? $scope.bt.diffProportion : 0);
        }, true);

        //监控合同价和到手价的转换/
        $scope.$watch("calType",function(){
            $scope.filter2.contractPrice = 0.00;
            $scope.filter2.lastPrice = 0.00;
            $scope.contract = "";
            if($scope.calType){
                $scope.contract = 'contractup';
            } else {
                $scope.contract = 'contractdown';
            }
        });
    }

    //退出错误提示
    $$(".hidemask").tap(function(e){
        $$(".mask").removeClass("maskshow");
        $$(".mask").addClass("maskhide");
        setTimeout(function(){
            $$(".mask").removeClass("maskhide")
        },200)
        
        $$(".errortip").removeClass("errortipshow");  
        $$(".errortip").addClass("errortiphide");
        setTimeout(function(){
            $$(".errortip").removeClass("errortiphide")
        },200)        
        $scope.errorcon = "";
    })

    //显示错误提示
    function showerror(){
        $$(".mask").addClass("maskhide");               
        setTimeout(function(){
            $$('.mask').addClass('maskshow')
        },10);

        $$(".errortip").addClass("errortiphide");
        setTimeout(function(){
            $$('.errortip').addClass('errortipshow')
        },10);
    }

    function buyCon() {
        // 住房面积/家庭人数的显示/隐藏
        $scope.$watch('filter1', function(){
            $scope.existShow =(!$scope.filter1.isSh && $scope.filter1.isFirst) ? true : false;

            //*国际项的显示和隐藏动画部分*
            //如果是上海地区，隐藏国际行的动画
            if (!$scope.filter1.isSh) {
                $$('.row1').addClass('inputlinehide');

                //如果选择上海之前，国籍展开状态，执行隐藏动画
                if ($$('.row1').hasClass('rowone')) {
                    $$('.row1').removeClass('inputlinehide');
                    $$('.row1').addClass('inputlineshow');
                    $$('.inputlinecon1').removeClass('inputlineconup');

                    //延迟执行行消失效果
                    setTimeout(function(){
                        $$('.row1').removeClass('inputlineshow');
                        $$('.row1').addClass('inputlinehide');//取消行隐藏
                    },10);

                    $scope.filter1.existArea = 0.00;
                    
                    $$('.row1').removeClass('rowone');//移除rowone标记
                }else{
                    //选择上海时，隐藏项非打开状态,不做任何事情
                }
            }else if ($scope.filter1.isSh) {

                //如果不是上海地区，显示国籍项
                $$('.row1').removeClass('inputlinehide');
                $$('.row1').addClass('inputlineshow');
                $$('.row1').addClass('rowone');

                $$('.inputlinecon1').addClass('inputlineconup');
            };

            //*显示隐藏家庭人口和已有面积动画*
            //隐藏已有住房及家庭人口
            if ($scope.existShow == false) {
                $$('.row2').addClass('inputlinehide');

                //如果已有面积之前，隐藏项是展开状态,则隐藏
                if ($$('.row2').hasClass('rowone')) {
                    $$('.row2').removeClass('inputlinehide');
                    $$('.row2').addClass('inputlineshow');
                    $$('.inputlinecon2').removeClass('inputlineconup');
                    $$('.inputlinecon3').removeClass('inputlineconup');

                    //延迟执行行消失效果
                    setTimeout(function(){
                        $$('.row2').removeClass('inputlineshow');
                        $$('.row2').addClass('inputlinehide');
                    },10);

                    $$('.row2').removeClass('rowone');
                }else{
                    //如果已有面积之前，隐藏项是隐藏状态,则无操作
                }
            }else{
                //显示已有面积和家庭人口部分
                setTimeout(function(){
                    $$('.row2').removeClass('inputlinehide');//取消行隐藏
                    $$('.row2').addClass('inputlineshow');//行显示

                    $$('.row2').addClass('rowone');

                    //家庭人口行内容，延迟0.1s
                    setTimeout(function(){
                        $$('.inputlinecon2').addClass('inputlineconup');
                    },10)

                    setTimeout(function(){
                        $$('.inputlinecon3').addClass('inputlineconup');
                    },100)                    
                },300)

            };
        },true);
    }

    // 计算结果
    $scope.showBuyResult = function() {
        $scope.filter1.contractPrice = $scope.filter1.contractPrice ? parseFloat($scope.filter1.contractPrice) : 0;
        $scope.filter1.area = $scope.filter1.area ? parseFloat($scope.filter1.area) : 0;
        var essentialFlag = false;
        if (!$scope.filter1.contractPrice || !$scope.filter1.area) {
            essentialFlag = true;
        }
        if (!essentialFlag) {
            $scope.filter1.registFee = 0.008;  // 登记费
            $scope.filter1.certificateFee = 0.0005;  // 权证印花
            $scope.filter1.imgFee = 0.0025;  // 配图费
            $scope.filter1.buildingTax = buyCalculation.buildingTaxCal($scope.filter1);  // 房产税
            $scope.filter1.deedTax = buyCalculation.deedTaxCal($scope.filter1);  // 契税
            $scope.filter1.tradingFee = calculator.tradingFeeCal($scope.filter1.area); // 交易手续费
            $scope.filter1.commissionFee = $scope.filter1.contractPrice * calculator.commissionFeeCal();  // 佣金
            // 公证费
            if (!$scope.filter1.buynative) {
                $scope.filter1.notaryFee = 0;
            } else {
                $scope.filter1.notaryFee =  calculator.notaryFeeCal($scope.filter1.contractPrice);
            }
            // 总税费 =  房产税 + 契税 + 交易手续费 + 公证费 + 佣金 + 登记费 + 权证印花 + 配图费
            $scope.filter1.totalTax =  $scope.filter1.buildingTax + $scope.filter1.deedTax + $scope.filter1.tradingFee + $scope.filter1.notaryFee
                + $scope.filter1.commissionFee + $scope.filter1.registFee + $scope.filter1.certificateFee + $scope.filter1.imgFee;

            // 总支付 = 总税费 + 合同价
            $scope.filter1.cost = $scope.filter1.totalTax + $scope.filter1.contractPrice;
        } else {
            $scope.errorcon = "请输入合同价和面积";
            showerror();
            // alert("请输入合同价和面积");
            return false;
        }
        $$(".buyresult").removeClass("conhide");
        $$(".buyresult").addClass("conshow");

        $$(".mainbuy").removeClass("conshow");
        $$(".mainbuy").removeClass("conshow2");
        $$(".mainbuy").addClass("conshow1");

    }

    $scope.showSellResult = function() {
        $scope.filter2.contractPrice = $scope.filter2.contractPrice ? parseFloat($scope.filter2.contractPrice) : 0.00;
        $scope.filter2.lastPrice = $scope.filter2.lastPrice ? parseFloat($scope.filter2.lastPrice) : 0.00;
        $scope.filter2.area = $scope.filter2.area ? parseFloat($scope.filter2.area) : 0.00;
        $scope.fee.purchasePrice = $scope.fee.purchasePrice ? parseFloat($scope.fee.purchasePrice) : 0.00;
        $scope.fee.interest = $scope.fee.interest ? parseFloat($scope.fee.interest) : 0.00;
        $scope.fee.decorationCost = $scope.fee.decorationCost ? parseFloat($scope.fee.decorationCost) : 0.00;
        var primeCost = $scope.fee.purchasePrice + $scope.fee.interest + $scope.fee.decorationCost;
        
        var essentialFlag = false;
        if (!$scope.calType) {
            if (!$scope.filter2.contractPrice || !$scope.filter2.area) {
                essentialFlag = true;
            }
        } else {
            if (!$scope.filter2.lastPrice || !$scope.filter2.area) {
                essentialFlag = true;
            }
        }

        // 个税全额3/利润比例
        $scope.it.profitProportion = ($scope.taxCalType == 1) ? indeedTax.byProfitCal($scope.filter2) : 0;
        $scope.it.totalProportion = ($scope.taxCalType == 2) ? indeedTax.byTotalCal($scope.filter2) : 0;

        $scope.filter2.tradingFee = calculator.tradingFeeCal($scope.filter2.area); // 交易手续费

        // 合同价
        if (essentialFlag) {
            $scope.errorcon = "请输入合同价(到手价)和面积";
            showerror();
            return false;
        } else {
            if (!$scope.calType) {
                if ($scope.filter2.contractPrice < primeCost) {                
                    $scope.errorcon = "请检查输入";
                    showerror();
                    return false;
                }
            } else {
                $scope.filter2.contractPrice = sellCalculation.contractPriceCal($scope.filter2.native, $scope.bt, $scope.it, $scope.fee, $scope.filter2.tradingFee, $scope.filter2.lastPrice);
            }
        }

        $scope.filter2.notaryFee = !$scope.filter2.native ? 0 : calculator.notaryFeeCal($scope.filter2.contractPrice); // 公证费
        $scope.filter2.indeedTaxResult = sellCalculation.indeedTaxCal($scope.filter2.contractPrice, primeCost, $scope.it); // 个税
        $scope.filter2.businessTaxResult = sellCalculation.businessTaxCal($scope.filter2.contractPrice, primeCost, $scope.bt); // 营业税
        $scope.filter2.commissionFee = $scope.filter2.contractPrice * calculator.commissionFeeCal(); // 佣金
        $scope.filter2.totalTax = $scope.filter2.businessTaxResult + $scope.filter2.indeedTaxResult + $scope.filter2.tradingFee + $scope.filter2.commissionFee
            + $scope.filter2.notaryFee; // 总税费

        // 到手价
        if (!$scope.calType) {
            $scope.filter2.lastPrice = $scope.filter2.contractPrice - $scope.filter2.totalTax;
        }

        $$(".sellresult").removeClass("conhide");
        $$(".sellresult").addClass("conshow");

        $$(".mainsell").removeClass("conshow");
        $$(".mainsell").addClass("conshow1");

    }

    // help部分内容
    $http.get("data/help.json").success(function(data) {
        $scope.helpall = data;
    });  

})