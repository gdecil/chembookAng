
/* Controllers */

var xControllers = angular.module('xControllers', ['ui.layout', 'ngSanitize', 'angularTreeview', 'angAccordion'])
.controller('searchCtrl', ['$scope', '$http', '$window', '$location', function($scope,$http, $window, $location) {        
        $scope = treeview($scope,$http,null,$location)  
//        $scope = formView($scope,$http)  
        $scope = tabsSearch($scope, $window)
        $scope = navBarSearch($scope, $location)        
        $scope.$on("editReactionEvent", function (event, args) {
//          $('#containerReaction').hide()
//          $('#ketcherFrame').show();
          var ketcher = getKetcher();
          ketcher.setMolecule(exp.Rxn);
          if($scope.form.ctrl != undefined){
            $scope.form.ctrl.$dirty= true;
          }
        });

     }])
.controller('viewCtrl',['$scope','$routeParams','$http','$location', function($scope, $param ,$http, $location) {
        var form ={input: {}}

        $scope = treeview($scope,$http,$param,$location)  
        $scope = navBarView($scope,$param, $location)     
        $scope.$on("openExperiment", function (event, args) {
          var tmp = args.value.split("-");
          $scope.form = getExperiment(tmp[0],tmp[1], form);
        });        
        
        $scope.save = function () {
          // Set the form to pristine state so we're not prompting the user to save
          // the changes when changing the location.

          $scope.form.ctrl.$setPristine(true);
          inform.add('Form data saved');
      //    $location.path('/');
        };

        $http.get("simple.json").then(function(res){
          if($param.experiment.length >1){
            var tmp = $param.experiment.split("-");
            $scope.form = getExperiment(tmp[0],tmp[1], form);
          }            
        });

      }
    ])
.controller('registerCtrl', ['$scope', '$routeParams', '$http', '$location','inform', function($scope, $param ,$http, $location, inform) {        
        $scope = treeview($scope,$http, $param,$location)  
        $scope = navBarRegister($scope, $location)             
        var form ={input: {}}
        $scope.form =form
        $scope.$on("openExperiment", function (event, args) {
          var tmp = args.value.split("-");
          $scope.form = getExperiment(tmp[0],tmp[1], form);
        });        
        $scope.$watch('form.input', 
        function() { 
          if(exp != undefined){
            exp.GeneralDataReaction[0].subject = form.input.title
            exp.GeneralDataReaction[0].yield= (form.input.yield==null) ? "0" :form.input.yield 
            //exp.PROJECT_CODE= form.input.
            exp.GeneralDataReaction[0].batch_creator= form.input.batch_creator
            exp.GeneralDataReaction[0].notebook= form.input.notebook
            exp.GeneralDataReaction[0].experiment= form.input.experiment
            exp.GeneralDataReaction[0].creation_date= form.input.creation_date
            exp.GeneralDataReaction[0].continued_from_rxn= (form.input.continued_from_rxn==null) ? "" :form.input.continued_from_rxn  
            exp.GeneralDataReaction[0].continued_to_rxn= (form.input.continued_to_rxn==null) ? "" :form.input.continued_to_rxn  
            exp.GeneralDataReaction[0].project_code = ""
            exp.GeneralDataReaction[0].project_alias = ""
            exp.GeneralDataReaction[0].synth_route_ref=""
            exp.GeneralDataReaction[0].literature_ref = ""
            exp.GeneralDataReaction[0].issuccessful = ""
  //          exp.PROJECT_ALIAS= form.input.
  //          exp.BATCH_OWNER= form.input.
  //          exp.LITERATURE_REF= form.input.
  //          exp.OWNER_USERNAME= form.input.
          }
        }, true);
                                             
        $scope.$on("editReactionEvent", function (event, args) {
          $('#containerReaction').hide()
          $('#ketcherFrame').show();
          var ketcher = getKetcher();
          ketcher.setMolecule(exp.Rxn);
          if($scope.form.ctrl != undefined){
            $scope.form.ctrl.$dirty= true;
          }
        });

        $scope.$on("regDetailEvent", function (event, args) {
          
          exp.updateDetail();
          if($scope.form.ctrl != undefined){$scope.form.ctrl.$setPristine(true);}
//          inform.add('Form data saved');
        });
        $scope.$on("regSchemalEvent", function (event, args) {
          var ketcher = getKetcher();
          exp.Rxn = ketcher.getMolfile();

          exp.updateSchema();
          if($scope.form.ctrl != undefined){$scope.form.ctrl.$setPristine(true);}
//          inform.add('Form data saved');
        });
  
        $http.get("simple.json").then(function(res){
          if($param.experiment.length >1){
            var tmp = $param.experiment.split("-");
            //$scope.form.input.batch_creator = "pippo"
            $scope.form = getExperiment(tmp[0],tmp[1], form);
          }            
        });
        //$scope.form.input.batch_creator = "pippo"
     }])

var treeview = function($scope,$http,$param,$location) {
        /* treeview section*/
  var swt
  if($param == null){
    swt = 0
  }
  else if($param.experiment == "1"){
    swt = 0
  }
  else {
    swt = 1
  }
  if(swt==0){
    $http.post(server + '/Reaction.asmx/GetUsersFullnameAng','{}').
      success(function(data, status, headers, config) {
        $scope.treedata = data;
      }).
      error(function(data, status, headers, config) {
        $scope.treedata = 
                [
                    { "label" : "De Cillis, Gianpiero", "id" : "role1", "children" : [
                        { "label" : "00000001", "id" : "role11", "children" : [
                            { "label" : "0001", "id" : "role111", "children" : []},
                            { "label" : "0002", "id" : "role112", "children" : []}
                        ],collapsed:true},
                        { "label" : "00000002", "id" : "role12", "children" : [
                            { "label" : "0001", "id" : "role121", "children" : []},
                            { "label" : "0002", "id" : "role122", "children" : []}
                        ],collapsed:true}
                    ],collapsed:true}
                ];   
    });
  }
  else {
    var tmp = $param.experiment.split("-");
    var tv =server + '/Reaction.asmx/GetExperimentTreeView'
    var data = '{"notebook":"' + tmp[0] + '", "page":"' + tmp[1] + '","enumVal":"undefined"}'
    $http.post(tv, data).
      success(function(data, status, headers, config) {
        $scope.treedata = data;
      }).
      error(function(data, status, headers, config) {
        $scope.treedata = 
                [
                    { "label" : "De Cillis, Gianpiero", "id" : "role1", "children" : [
                        { "label" : "00000001", "id" : "role11", "children" : [
                            { "label" : "0001", "id" : "role111", "children" : []},
                            { "label" : "0002", "id" : "role112", "children" : []}
                        ],collapsed:true},
                        { "label" : "00000002", "id" : "role12", "children" : [
                            { "label" : "0001", "id" : "role121", "children" : []},
                            { "label" : "0002", "id" : "role122", "children" : []}
                        ],collapsed:true}
                    ],collapsed:true}
                ];   
    });
  }
  
  $scope.$watch( 'abc.currentNode', function( newObj, oldObj ) {
          if( $scope.abc && angular.isObject($scope.abc.currentNode) ) {
            //alert($scope.abc.currentNode.label);
            $scope.addChild();
/*
              var labParent =   $scope.abc.currentNode.id.substr(0 , $scope.abc.currentNode.id.length - 1);
              var a = getObjects($scope.treedata,'id',labParent)
//                    var nodeParent = $.grep($scope.treedata, function(e){ return e.id == labParent; })
              alert(a[0].label + "-" + $scope.abc.currentNode.label);
              console.log( 'Node Selected!!' );
              console.log( $scope.abc.currentNode );
*/
          }
      }, false);
  $scope.selectedItem = {};
  $scope.options = {

  };
  $scope.remove = function(scope) {
    scope.remove();
  };
  $scope.toggle = function(scope) {novembre
    scope.toggle();
  };
  $scope.newSubItem = function(scope) {
    var nodeData = scope.$modelValue;
    nodeData.items.push({
      id: nodeData.id * 10 + nodeData.items.length,
      title: nodeData.title + '.' + (nodeData.items.length + 1),
      items: []
    });
  };
  
  $scope.temporaryNode = {
        children: []
    };
  $scope.addChild = function () {
          /* add child */
    
    if ("userid" in $scope.abc.currentNode){
      var userid = $scope.abc.currentNode.userid;
      var notebooks;
      $scope.abc.currentNode.children.length = 0;

      $http.post(server + '/Reaction.asmx/GetUserNotebooks','{"id":"' + userid + '"}').
      success(function(data, status, headers, config) {
        notebooks = data;
        $.each( notebooks, function( key, value ) {
          $scope.temporaryNode = {
              children: []
          };
          $scope.temporaryNode.id = value.title;
          $scope.temporaryNode.label= value.title;
          $scope.temporaryNode.notebook = value.title;
          if( $scope.temporaryNode.id && $scope.temporaryNode.label ) {
            $scope.abc.currentNode.children.push(angular.copy($scope.temporaryNode)) ;
          }
        });
      }).
      error(function(data, status, headers, config) {
      });        
    }
    else {
      if ("notebook" in $scope.abc.currentNode){
        if ("page" in $scope.abc.currentNode){
          var page = $scope.abc.currentNode.page;
          var notebook= $scope.abc.currentNode.notebook;
                   
          if (window.location.hash.indexOf("search") >= 0){
            currentNB =""
            currentPage="" 
            var rxnIDs = getReactions(notebook + "-" + page ,"text", $('#containerReaction'),"#myGridSearch") 
          }
          else{
            $location.path('/view/' + notebook + '-' + page);
/*
            $scope.$root.$broadcast("openExperiment", {                                      
                value: notebook + "-" + page
            });
*/
          }
        }
        else{
          var notebook = $scope.abc.currentNode.label;
          var pages;
          $scope.abc.currentNode.children.length = 0;

          $http.post(server + '/Reaction.asmx/GetPagesNotebook','{"notebook":"' + notebook + '"}').
          success(function(data, status, headers, config) {
            pages = data;
            $.each( pages, function( key, value ) {
              $scope.temporaryNode = {
                  children: []
              };
              $scope.temporaryNode.id = value.title;
              $scope.temporaryNode.label= value.title;
              $scope.temporaryNode.page= value.title;
              $scope.temporaryNode.notebook= notebook;
              if( $scope.temporaryNode.id && $scope.temporaryNode.label ) {
                  $scope.abc.currentNode.children.push(angular.copy($scope.temporaryNode)) ;
              }
            });
          }).
          error(function(data, status, headers, config) {
          });        
        }
      }
      else{
     
      }
            
    }

  }
  return $scope
}

var navBarSearch = function($scope, $location){
      /* navBar section*/
          $scope.affixed = 'top';
          $scope.search = {
            show : true,
            terms : ''
          };
          $scope.brand = "<span class='glyphicon glyphicon-user'></span> Ugo";
          $scope.inverse = true;
          $scope.menus = [
            {
              title : "Move to",
              menu : [
                {
                  title : "Register",
                  action : "item.one"
                },
                {
                  title : "View",
                  action : "item.two"
                }
              ]
            },
            {
              title : "Reaction",
              menu : [
                {
                  title : "Search SSS",
                  action : "item.sss"
                },
                {
                  title : "Search Exact",
                  action : "item.exact"
                }
              ]
            },
            {
              title : "Search Mol Online",
              action : "searchOnline"
            },
            {
              title : "Search Text",
              menu : [
                {
                  title : "AND",
                  action : "item.and"
                },
                {
                  title : "OR",
                  action : "item.or"
                }
              ]
            },
            {
              title : "Clear",
              action : "clear"
            },
            {
              title : "Selected",
              menu : [
                {
                  title : "Edit",
                  action : "editReaction"
                },
                {
                  title : "View",
                  action : "viewsel"
                },
                {
                  title : "Update",
                  action : "updatesel"
                }
              ]
            }
          ]; // end menus

          $scope.item = '';
          $scope.styling = 'Inverse';
          $scope.searchDisplay = 'Visible';true

          $scope.searchfn = function(){
            var rxnIDs = getReactions($scope.search.terms ,"fulltext", $('#containerReaction'),"#myGridSearch") 
          }; // searchfn

          $scope.navfn = function(action){
            switch(action){
              case 'item.one':
                $location.path('/register/1');
//                window.open(window.location.origin +"/chembookAng/app/index.html#/register/1", "_self");
                break;
              case 'item.two':
                $location.path('/view/1');
                
                //window.open(window.location.origin +"/chembookAng/app/index.html#/view/1", "_self");
                break;
              case 'item.three':
                $scope.item = 'Item three selected.';
                break;
              case 'item.sss':
                  var ketcher = getKetcher();
                  searchSSS(ketcher);
                break;
              case 'item.exact':
                break;
              case 'item.and':
                break;
              case 'item.or':
                break;
              case 'clear':
                break;
              case 'searchOnline':
                  var ketcher = getKetcher();
                  searchOnline(ketcher);
                break;
              case 'viewsel':
                var expV = currentNB + "-" + currentPage
                if (expV=="-"){
                  alert("Please select a grid row")
                  return
                }
                //$location.path('/view/' + expV);
                window.open(window.location.origin +"/chembookAng/app/index.html#/view/" + expV)
                break;
              case 'updatesel':
                var expV = currentNB + "-" + currentPage
                if (expV=="-"){
                  alert("Please select a grid row")
                  return
                }
//                $location.path('/register/' + expV);
                window.open(window.location.origin +"/chembookAng/app/index.html#/register/" + expV)
                break;
              case 'editReaction':
                var expV = currentNB + "-" + currentPage
                if (expV=="-"){
                  alert("Please select a grid row")
                  return
                }
                $scope.$root.$broadcast("editReactionEvent", {                                      
                    value: ""
                });
                break;
              default:
                $scope.item = 'Default selection.';
                break;
            }; // end switch
          }; // end navfn

          $scope.toggleStyling = function(){
            $scope.inverse = !$scope.inverse;
            if(angular.equals($scope.inverse,true))
              $scope.styling = 'Inverse';
            else
              $scope.styling = 'Default';
          }; // end toggleStyling

          $scope.toggleSearchForm = function(){
            $scope.search.show = !$scope.search.show;
            if(angular.equals($scope.search.show,true))
              $scope.searchDisplay = 'Visible';
            else
              $scope.searchDisplay = 'Hidden';
          }; // end toggleSearchForm

          $scope.addMenu = function(){
            $scope.menus.push({
                title : "Added On The Fly!",
                action : "default"
            });
          }; // end test

          $scope.toggleAffixed = function(){
            switch($scope.affixed){
              case 'top':
                $scope.affixed = 'bottom';
                break;
              case 'bottom':
                $scope.affixed = 'none';
                break;
              case 'none':
                $scope.affixed = 'top';
                break;
            };
          }; // end toggleAffixed
  
  return $scope
}

var navBarRegister = function($scope, $location){
      /* navBar section*/
          $scope.affixed = 'top';
          $scope.search = {
            show : true,
            terms : ''
          };
          $scope.brand = "<span class='glyphicon glyphicon-list-alt'></span> Reactions";
          $scope.inverse = true;
          $scope.menus = [
            {
              title : "Move to",
              menu : [
                {
                  title : "Search",
                  action : "item.one"
                },
                {
                  title : "View",
                  action : "item.two"
                },
                {
                  divider: true
                },
                {
                  title : "Register Three",
                  action : "item.three"
                }
              ]
            },
            {
              title : "Register",
              menu : [
                {
                  title : "Detail",
                  action : "regdetail"
                },
                {
                  title : "Reaction",
                  action : "regSchema"
                },
                {
                  title : "Stoichiometry",
                  action : "regStoic"
                },
                {
                  title : "Procedure & workup",
                  action : "regProc"
                }
              ]
            },                            
            {
              title : "Edit Reaction",
              action : "editReaction"
            }
          ]; // end menus

          $scope.item = '';
          $scope.styling = 'Inverse';
          $scope.searchDisplay = 'Visible';true

          $scope.searchfn = function(){
            alert('Attempting search on: "' + $scope.search.terms + '"');
          }; // searchfn

          $scope.navfn = function(action){
            switch(action){
              case 'item.one':
                $location.path('/search');
                
                //window.open(window.location.origin +"/chembookAng/app/index.html#/search", "_self");
                break;                $scope.item = 'Item three selected.';
                var el = document.getElementById('form1');
                var scopeForm1 = angular.element(el).scope();
                scopeForm1.submitForm(scopeForm1.ngform,scopeForm1.model);

              case 'item.two':
                $location.path('/view/1');
                break;
              case 'item.three':
                break;
              case 'editReaction':
                $scope.$root.$broadcast("editReactionEvent", {                                      
                    value: ""
                });
                break;
              case 'regdetail':
                $scope.$root.$broadcast("regDetailEvent", {                                      
                    value: ""
                });
                break;
              case 'regSchema':
                $scope.$root.$broadcast("regSchemalEvent", {                                      
                    value: ""
                });
                break;
              default:
                $scope.item = 'Default selection.';
                break;
            }; // end switch
          }; // end navfn
return $scope
}

var navBarView = function($scope, $param, $location){
      /* navBar section*/
          $scope.affixed = 'top';
          $scope.search = {
            show : false,
            terms : ''
          };
          $scope.brand = "<span class='glyphicon glyphicon-list-alt'></span> Reactions";
          $scope.inverse = true;
          $scope.menus = [
            {
              title : "Move to",
              menu : [
                {
                  title : "Search",
                  action : "item.one"
                },
                {
                  title : "Register",
                  action : "item.two"
                },
                {
                  divider: true
                },
                {
                  title : "Empty",
                  action : ""
                }
              ]
            },
            {
              title : "Update Reaction",
              action : "UpdateReaction"
            }
          ]; // end menus

          $scope.item = '';
          $scope.styling = 'Inverse';
          $scope.searchDisplay = 'Visible';

          $scope.searchfn = function(){
            alert('Attempting search on: "' + $scope.search.terms + '"');
          }; // searchfn

          $scope.navfn = function(action){
            switch(action){
              case 'item.one':
                $location.path('/search/');
                
        //        window.open(window.location.origin +"/chembookAng/app/index.html#/search", "_self");
                break;
              case 'item.two':
                $location.path('/register/1');
  //              window.open(window.location.origin +"/chembookAng/app/index.html#/register/1", "_self");
                break;
              case 'item.three':
                break;
              case 'UpdateReaction':
                var expV = $scope.form.input.notebook + "-" + $scope.form.input.experiment
                $location.path('/register/' + expV);
//                window.open(window.location.origin +"/chembookAng/app/index.html#/register/" + expV)
                break;
              default:
                $scope.item = 'Default selection.';
                break;
            }; // end switch
          }; // end navfn
return $scope
}
                                                          
var tabsSearch = function($scope, $window){
  $scope.tabs = [
    { title:'Dynamic Title 1', content:'Dynamic content 1' },
    { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
  ];

  $scope.alertMe = function() {
    setTimeout(function() {
      $window.alert('You\'ve selected the alert tab!');
    });
  };
  return $scope
}


















var formView = function($scope,$http,$param){

  $scope.tests = [
    { name: "Simple", data: 'detail.json' }
  ];

  $scope.selectedTest = $scope.tests[0];

  $scope.$watch('selectedTest',function(val){
    if (val) {      
      $http.get(val.data).then(function(res){
        $scope.schema = res.data.schema;
        $scope.form   = res.data.form;
        $scope.formR   = res.data.formR;
        $scope.schemaJson = JSON.stringify($scope.schema,undefined,2);
        $scope.formJson   = JSON.stringify($scope.form,undefined,2);
        $scope.modelData = res.data.model || {};
        if($param.experiment.length >1){
          var tmp = $param.experiment.split("-");
          $scope.modelData = getExperiment(tmp[0],tmp[1], $scope.modelData);
        }            
/*
        $scope.modelData.batch_creator = "Leeroy Jenkinsdddd";
        $scope.modelData.yield = "10";
*/
      });
    }
  });

  $scope.decorator = 'bootstrap-decorator';

  $scope.itParses     = true;
  $scope.itParsesForm = true;

  $scope.$on("myEvent", function (event, args) {
      if($scope.ngform!= undefined){
        $scope.submitForm($scope.ngform);
      }
  });
  
  $scope.$on("openExperiment", function (event, args) {
          var tmp = args.value.split("-");
          $scope.modelData = getExperiment(tmp[0],tmp[1], $scope.modelData);
  });
  
  $scope.$watch('schemaJson',function(val,old){
    if (val && val !== old) {
      try {
        $scope.schema = JSON.parse($scope.schemaJson);
        $scope.itParses = true;
      } catch (e){
        $scope.itParses = false;
      }
    }
  });

  $scope.$watch('formJson',function(val,old){
    if (val && val !== old) {
      try {
        $scope.form = JSON.parse($scope.formJson);
        $scope.itParsesForm = true;
      } catch (e){
        $scope.itParsesForm = false;
      }
    }
  });

  $scope.pretty = function(){
    return JSON.stringify($scope.modelData,undefined,2,2);
  };

  $scope.log = function(msg){
    console.log("Simon says",msg);
  };

  $scope.sayNo = function() {
    alert('Noooooooo');
  };

  $scope.say = function(msg) {
    alert(msg);
  };

  $scope.submitForm = function(form, model) {
    // First we broadcast an event so all fields validate themselves
    $scope.$broadcast('schemaFormValidate');
    // Then we check if the form is valid
    if (form.$valid) {
      updateExperimentDetail($scope.modelData);
      alert('You did it!');
    }
  }
  
  return $scope
}     

