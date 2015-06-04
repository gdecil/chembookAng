var checkUserIsLoggedIn = function () {
    var username = $.session.get("username");
    if (username == null || username == undefined || username == "") {
        alert("You are not logged in: You cannot insert or update data!")
        return false;
    };
    return true;
}

var getObjects = function (obj, key, val) {
            var objects = [];
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    objects = objects.concat(getObjects(obj[i], key, val));
                } else if (i == key && obj[key] == val) {
                    objects.push(obj);
                }
            }
            return objects;
        }

var getKetcher = function (){
  var frame = null;

  if ('frames' in window && 'ketcherFrame' in window.frames){
      frame = window.frames['ketcherFrame'];
  }
  else {
      return null;
  }
  if ('window' in frame){
      return frame.window.ketcher;
		}
}

var appendReaction = function (containerId, rxnId) {
    $(containerId).html("");
    if (rxnId==null) {        
        return;
    }
    d = new Date();
    var src = server + '/render?idReaction=' + rxnId + '&' +d.getTime() ;
    img_height=200
    img_width=800

//    var img_height = $('#reaction1').height();
//    var img_width = $('#reaction1').width();
//    if(img_height==null){
//    }
    //$(containerId).append("<img id='moleculeB' src=" + src + " />");
    $(containerId).append("<img id='moleculeB' src=" + src + " style='width: " + img_width + "px; height: " + img_height + "px;'/>");
}

var appendMolecule = function (containerId, Id) {
    $(containerId).html("");
    if (Id==null) {        
        return;
    }
    d = new Date();
    var src = server + '/render?strid=' + Id + '&' +d.getTime() ;
    img_height=200
    img_width=400

//    var img_height = $('#reaction1').height();
//    var img_width = $('#reaction1').width();
//    if(img_height==null){
//    }
    //$(containerId).append("<img id='moleculeB' src=" + src + " />");
    $(containerId).append("<img id='moleculeB' src=" + src + " style='width: " + img_width + "px; height: " + img_height + "px;'/>");
}

var searchOnline = function (ketcher){
    currentMolInfo=[]  
    
    if (ketcher){
        var mol =ketcher.getMolfile();
        if (mol.length > 105) {
            getSmileFromMol(mol)            
            getInchiFromMol(mol)
        }
    }
}

var searchSSS = function (ketcher){
    if (ketcher){
        var rxn =ketcher.getMolfile();
        if (rxn.length > 105) {
            var rxnIDs = getReactions(rxn,"SSS", $('#containerReaction'),"#myGridSearch")            
        }
    }
}

var searchMARSSS = function (ketcher){
    if (ketcher){
        var rxn =ketcher.getMolfile();
        if (rxn.length > 105) {
            var rxnIDs = getMolecules(rxn,"SSS", $('#containerReaction'),"#myGridSearch")            
        }
    }
}

var getExperiment = function(notebook,page, form){
  exp = new Experiment(notebook,page);
  form.input.batch_creator  = exp.GeneralDataReaction[0].batch_creator;  
  form.input.continued_from_rxn = exp.GeneralDataReaction[0].continued_from_rxn; 
  form.input.continued_to_rxn = exp.GeneralDataReaction[0].continued_to_rxn;
  form.input.creation_date = exp.GeneralDataReaction[0].creation_date; 
  form.input.experiment= exp.GeneralDataReaction[0].experiment;   
  form.input.notebook= exp.GeneralDataReaction[0].notebook;   
  form.input.yield = exp.GeneralDataReaction[0].yield;   
  form.input.title = exp.GeneralDataReaction[0].subject;  

  $('#containerReaction').html("");
  appendReaction('#containerReaction', exp.GeneralDataReaction[0].rxn_scheme_key) 
  $('#containerReaction').show();
  $('#ketcherFrame').hide();
  
    var grid = $("#myReactant");
    grid.jqGrid('GridUnload');
    var Mydata = exp.getReagents()

    if (Mydata != null) {
        var gridR = "#myReactant",
            pagerR = '#reactantspager',
            captionR = "Reagents";
        cgProductsReagentsSave(Mydata, gridR, pagerR, captionR);
    }

    var grid = $("#myProducts");
    grid.jqGrid('GridUnload');
    var Mydata = exp.getProducts()
    if (Mydata != null) {
        var gridR = "#myProducts",
            pagerR = '#Productspager',
            captionR = "Products";
        cgProductsReagentsSave(Mydata, gridR, pagerR, captionR);
    }

/*
    var grid = $("#myAttach");
    grid.jqGrid('GridUnload');
    cgAttach($.parseJSON(expCurrent.getAttachement()));
*/

    
  $('#containerProcedure').html(exp.GeneralDataReaction[0].procedure);
    
  var grid = $("#myAttach");
  grid.jqGrid('GridUnload');
  cgAttach(exp.getAttachement());


  return form;
}

var getExperiment1 = function(notebook,page, model){
  exp = new Experiment(notebook,page);
  model.batch_creator  = exp.GeneralDataReaction[0].batch_creator;  
  model.continued_from_rxn = exp.GeneralDataReaction[0].continued_from_rxn; 
  model.continued_to_rxn = exp.GeneralDataReaction[0].continued_to_rxn;
  model.creation_date = exp.GeneralDataReaction[0].creation_date; 
  model.experiment= exp.GeneralDataReaction[0].experiment;   
  model.notebook= exp.GeneralDataReaction[0].notebook;   
  model.yield = exp.GeneralDataReaction[0].yield;   
  model.title = exp.GeneralDataReaction[0].subject;  

  $('#containerReaction').html("");
  appendReaction('#containerReaction', exp.GeneralDataReaction[0].rxn_scheme_key) 
  $('#containerReaction').show();
  $('#ketcherFrame').hide();
  
  return model;
}

var updateExperimentDetail = function(model){
  exp.GeneralDataReaction[0].batch_creator=model.batch_creator;  
  exp.GeneralDataReaction[0].continued_from_rxn=model.continued_from_rxn ; 
  exp.GeneralDataReaction[0].continued_to_rxn=model.continued_to_rxn;
  exp.GeneralDataReaction[0].creation_date=model.creation_date; 
  exp.GeneralDataReaction[0].experiment=model.experiment;   
  exp.GeneralDataReaction[0].notebook=model.notebook;
  exp.GeneralDataReaction[0].yield= (model.yield==null) ? "0" : model.yield
//  exp.GeneralDataReaction[0].yield=model.yield ;   
  exp.GeneralDataReaction[0].subject=model.title ;  
}

var updated = function(modelValue,form){
  alert("pippo")
} 

var viewAttach = function (att) {
        $('#txtDocName').val(att.DOCUMENT_NAME).css('width', '400px')
        $('#txtDocDesc').val(att.DOCUMENT_DESCRIPTION).css('width', '400px')
        $('#txtDocFile').val(att.ORIGINAL_FILE_NAME).css('width', '600px')
        var fileName = getAttFileName(att.ATTACHEMENT_KEY)[0].ORIGINAL_FILE_NAME;
        var tmp = fileName.split("\\");
        var fn = tmp[tmp.length-1]
        $('#downFile').html('<a href="attachements/' + fn + '">' + fn + '</a>')
    }

Array.prototype.keyUcase = function() {
  for(var i = 0; i<this.length;i++) {

      var a = this[i];
      for (var key in a) {
          var temp; 
          if (a.hasOwnProperty(key)) {
            temp = a[key];
            delete a[key];
            a[key.toUpperCase()] = temp;
          }
      }
      this[i] = a;

  }
  return this;
}