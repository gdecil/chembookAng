'use strict';

/* Controllers */

var xControllers = angular.module('xControllers', ['ui.layout', 'ngSanitize', 'angularTreeview', 'angAccordion']);

xControllers.controller('searchCtrl', ['$scope', '$http', function($scope,$http) {        
        $scope = treeview($scope,$http)  
        $scope.names = [ { "Name" : "qui", "City" : "Berlin", "Country" : "Germany" }, { "Name" : "quo", "City" : "Luleå", "Country" : "Sweden" }];        

        $scope = navBarSearch($scope)
     }])

xControllers.controller('viewCtrl', 
    [
      '$scope', 
      '$routeParams',
      '$http',
      function($scope, $param ,$http) {        
            $scope = treeview($scope,$http)  
            $scope = formView($scope,$http)  
            $scope.names = [ { "Name" : "Alfreds Futterkiste", "City" : "Berlin", "Country" : "Germany" }, { "Name" : "Berglunds snabbköp", "City" : "Luleå", "Country" : "Sweden" }];
             $scope = navBarView($scope)                  
         }
    ]
  );



xControllers.controller('registerCtrl', ['$scope', '$routeParams', '$http', function($scope, $param ,$http) {        
        $scope = treeview($scope,$http)  
        $scope = formView($scope,$http)  
        $scope.names = [ { "Name" : "Pippo", "City" : "Berlin", "Country" : "Germany" }, { "Name" : "Pluto", "City" : "Luleå", "Country" : "Sweden" }];
        $scope = navBarRegister($scope)             

     }])

var treeview = function($scope,$http){
        /* treeview section*/
  $http.post('http://localhost:8080/Reaction.asmx/GetUsersFullnameAng','{}').
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
  $scope.toggle = function(scope) {
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
          exp = new Experiment(notebook,page);
          $('#form1 #title')[0].value = exp.GeneralDataReaction[0].subject;          
          $('#form1 #yield')[0].value = exp.GeneralDataReaction[0].yield;          
          $('#form1 #batch_creator')[0].value = exp.GeneralDataReaction[0].batch_creator;          
          $('#form1 #creation_date')[0].value = exp.GeneralDataReaction[0].creation_date;          
          $('#form1 #notebook')[0].value = exp.GeneralDataReaction[0].notebook;          
          $('#form1 #experiment')[0].value = exp.GeneralDataReaction[0].experiment;          
          $('#form1 #continued_from_rxn')[0].value = exp.GeneralDataReaction[0].continued_from_rxn;          
          $('#form1 #continued_to_rxn')[0].value = exp.GeneralDataReaction[0].continued_to_rxn;
          
          $('#containerReaction').html("");
          
          var src = server + '/render?idReaction=' + exp.GeneralDataReaction[0].rxn_scheme_key ;
          var img_height = $('#containerReaction').parent().height();
          var img_width = $('#containerReaction').parent().width();
          $('#containerReaction').append("<img id='moleculeB' src=" + src + " style='width: " + img_width + "px; height: " + img_height + "px;'/>");
          $('#containerReaction').show();
          $('#ketcherFrame').hide();
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

var navBarSearch = function($scope){
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
                },
                {
                  divider: true
                },
                {
                  title : "Search Three",
                  action : "item.three"
                }
              ]
            },
            {
              title : "Singular Search Item",
              action : "singular"
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
                window.open(window.location.origin +"/chembookAng/app/index.html#/register/1", "_self");
                break;
              case 'item.two':
                window.open(window.location.origin +"/chembookAng/app/index.html#/view/1", "_self");
                break;
              case 'item.three':
                $scope.item = 'Item three selected.';
                break;
              case 'singular':
                $scope.item = 'Singular link item selected.';
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
}

var navBarRegister = function($scope){
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
              title : "Register Detail",
              action : "regdetail"
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
                window.open(window.location.origin +"/chembookAng/app/index.html#/search", "_self");
                break;                $scope.item = 'Item three selected.';
                var el = document.getElementById('form1');
                var scopeForm1 = angular.element(el).scope();
                scopeForm1.submitForm(scopeForm1.ngform,scopeForm1.model);

              case 'item.two':
                window.open(window.location.origin +"/chembookAng/app/index.html#/view/1", "_self");
                break;
              case 'item.three':
                break;
              case 'editReaction':
                $('#containerReaction').hide()
                $('#ketcherFrame').show();
                var ketcher = getKetcher();
                ketcher.setMolecule(exp.Rxn);
                break;
              case 'regdetail':
/*
                var el = document.getElementById('form1');
                var scopeForm1 = angular.element(el).scope();
                scopeForm1.submitForm(scopeForm1.ngform,scopeForm1.model);
*/
                $scope.$root.$broadcast("myEvent", {                                      
                    value: ""
                });
                break;
              default:
                $scope.item = 'Default selection.';
                break;
            }; // end switch
          }; // end navfn

}

var navBarView = function($scope){
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
                window.open(window.location.origin +"/chembookAng/app/index.html#/search", "_self");
                break;
              case 'item.two':
                window.open(window.location.origin +"/chembookAng/app/index.html#/register/1", "_self");
                break;
              case 'item.three':
                break;
              case 'UpdateReaction':
                alert("Work in progress");
                break;
              default:
                $scope.item = 'Default selection.';
                break;
            }; // end switch
          }; // end navfn

}
                                                          
var formView = function($scope,$http){

  $scope.tests = [
    { name: "Simple", data: 'detail.json' }
  ];

  $scope.selectedTest = $scope.tests[0];

  $scope.$watch('selectedTest',function(val){
    if (val) {      
      $http.get(val.data).then(function(res){
        $scope.schema = res.data.schema;
        $scope.form   = res.data.form;
        $scope.schemaJson = JSON.stringify($scope.schema,undefined,2);
        $scope.formJson   = JSON.stringify($scope.form,undefined,2);
        $scope.modelData = res.data.model || {};
      });
    }
  });

  $scope.decorator = 'bootstrap-decorator';

  $scope.itParses     = true;
  $scope.itParsesForm = true;"regdetail"

  $scope.$on("myEvent", function (event, args) {
      if($scope.ngform!= undefined){
        $scope.submitForm($scope.ngform);
      }
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
      alert('You did it!');
    }
  }
  
  return $scope
}                                                          