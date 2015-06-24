function getCorpId(corpid) {

    var dataX = '{"corpid":"' + corpid + '"}';
    var ret = $.ajax({
        type: "POST",
        url: server + "/Chemlink/getCorpId",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    //return $.parseJSON(ret);

    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        //return tmp;
    }
    else {

        return tmp;
//        return tmp.d.replace(/'/g, "\\\"");
    }
}

function getBatch(batch) {

    var dataX = '{"batch":"' + batch + '"}';

    var ret = $.ajax({
        type: "POST",
        url: server + "/Chemlink/getBatch",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    //return $.parseJSON(ret);

    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        //return tmp;
    }
    else {

        return tmp;
//        return tmp.d.replace(/'/g, "\\\"");
    }
}

function getBottle(id, type) {
    var dataX = '{"id":"' + id + '", "type":"' + type + '"}';
    var ret = $.ajax({
        type: "POST",
        url: server + "/Chemlink/getBottle",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {
        return tmp;
    }
}

function getBottleForm(id,type) {

    var dataX = '{"id":"' + id + '", "type":"' + type + '"}';

    var ret = $.ajax({
        type: "POST",
        url: server + "/Chemlink/getBottleFormulation",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {
        return tmp;
    }
}

function getReactionsMolecules(compound) {
    var dataX = '{"compound":' + JSON.stringify(compound) + '}';
    var dataX = '{"compound":"' + compound + '"}';

    var ret = $.ajax({
        type: "POST",
        url: server + "/Chemlink/GetData",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp;
    }
}

function CreateReaction( rxn,  product,  reagent) {
    var dataX = '{"rxn":"' + rxn + '","product":"' + product + '","reagent":"' + reagent + '"}'

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/CreateReaction",
        data: dataX, 
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
  return ret;
//    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return ret;
    }
}

function FromReactionToMolecules(rxn) {
    var dataX = '{"rxn":"' + rxn + '"}';

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/FromReactionToMolecules",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp;
    }
}

function getProductsIndigo(rxn) {
    var dataX = '{"rxn":"' + rxn + '"}';

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetProductsIndigo",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp;
    }
}

function getReagentsIndigo(rxn) {
    var dataX = '{"rxn":"' + rxn + '"}';

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetReagentsIndigo",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp;
    }
}

var getAttFileName = function (attacKey) {
    var dataX = '{"attacKey":"' + attacKey  + '"}';

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetAttachment",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp;
    }
}

var getMAR = function (query) {
    var request = $.ajax({
        type: "GET",
        url: server + "/Chemlink?quest=getMar&query=" + query.replace('%','%25'),
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json"
    });

    request.done(function( data ) {
      appendMolecule($('#containerReaction'), data[0].str_id);  
      cgMoleculesMar("#myGridSearch", data);
    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var getReactions = function (reaction, searchType, reactionId, gridId) {
/*
    if(reaction.indexOf("batch") >= 0){
        var url= serverWeb + "/chemlinkangMob/?" + reaction
        window.open(url, '_blank');          
        return
    }
*/
    var dataX = '{"compound":' + JSON.stringify(reaction) + ', "searchType":"' + searchType + '", "cns":""}';

    var request = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/MatchBingoReaction",
        data: JSON.stringify(dataX),
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json"
    });

    request.done(function( data ) {
      appendReaction(reactionId, data[0].rxn_scheme_key);  
      cgReactions(gridId, data);
    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var getReactionsData = function (reaction) {
    var dataX = '{"reaction":' + JSON.stringify(reaction) + '}';

    return $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/MatchBingoReactionD",
        data: JSON.stringify(dataX),
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json"
    });
}

var getMolecule = function(strid) {
        url = server + "/Chemlink?quest=getMolecule&strid=" + strid;
        return $.ajax(
        		{
        			type: "GET",
        			url: url 
        		});
    }

var getMolecules = function (reaction, searchType, containerId, gridId) {
    var dataX = '{"compound":' + JSON.stringify(reaction) + ', "searchType":"' + searchType + '", "cns":""}';

    var request = $.ajax({
        type: "POST",
        url: server + "/Chemlink/MatchBingoMolecule",
        data: JSON.stringify(dataX),
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json"
    });

    request.done(function( data ) {
      appendMolecule(containerId, data[0].str_id);  
      cgMoleculesMar(gridId, data);
    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var getSmileFromMol = function (mol, searchType, reactionId, gridId) {
    var dataX = '{"mol":' + JSON.stringify(mol) + '}';

    var request = $.ajax({
        type: "POST",
        url: server + "/Convert/molToSmile",
        data: JSON.stringify(dataX)
    });

    request.done(function( data ) {
      //$('#containerSmile').append(data+ '\r\n')
      var obj = {
            name: "smile",
            info: data,
        };
      currentMolInfo.push(obj);
      cgMolecules("#myGridSearchMol", currentMolInfo)
    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var getInchiFromMol = function (mol, searchType, reactionId, gridId) {
    var dataX = '{"mol":' + JSON.stringify(mol) + '}';

    var request = $.ajax({
        type: "POST",
        url: server + "/Convert/molToInchi",
        data: JSON.stringify(dataX)
    });

    request.done(function( data ) {
      //$('#containerSmile').append(data+ '\r\n')
      var obj = {
            name: "inchi",
            info: data,
        };
      currentMolInfo.push(obj);
      cgMolecules("#myGridSearchMol", currentMolInfo)
      getIupacName(data);
      getMW(data);
      getCAS(data);
      getFormula(data);

    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var getChemspider = function (inchi) {
    var request = $.ajax({
        type: "GET",
        url: server + "/Mirror?quest=getChemspiderId&inchi=" + inchi
    });

    request.done(function( data ) {
      var url= "http://www.chemspider.com/Chemical-Structure."+ data +".html"
      window.open(url, '_blank');  
    });
}

var getCAS = function (inchi) {
    var request = $.ajax({
        type: "GET",
        url: "http://cactus.nci.nih.gov/chemical/structure/" + inchi + "/cas"
    });

    request.done(function( data ) {
      //$('#containerSmile').append(data+ '\r\n')
      out = data.replace(/[\n\r]/g, ':').split(":")
      $.each(out, function( index, value ) {
        var obj = {
              name: "CAS",
              info: value,
          };
        currentMolInfo.push(obj);
      });      
      cgMolecules("#myGridSearchMol", currentMolInfo)

    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
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

var getFormula = function (inchi) {
    var request = $.ajax({
        type: "GET",
        url: "http://cactus.nci.nih.gov/chemical/structure/" + inchi + "/formula"
    });

    request.done(function( data ) {
      //$('#containerSmile').append(data+ '\r\n')
      out = data.replace(/[\n\r]/g, ':').split(":")
      $.each(out, function( index, value ) {
        var obj = {
              name: "Formula",
              info: value,
          };
        currentMolInfo.push(obj);
      });      
      cgMolecules("#myGridSearchMol", currentMolInfo)

    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

function getFormulationData(strId) {
    var dataX = '{"strId":' + strId + '}';

    var ret = $.ajax({
        type: "POST",
        url: server + "/Chemlink/GetFormulationData",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    return tmp;
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

var getMW = function (inchi) {
    var request = $.ajax({
        type: "GET",
        url: "http://cactus.nci.nih.gov/chemical/structure/" + inchi + "/mw"
    });

    request.done(function( data ) {
      //$('#containerSmile').append(data+ '\r\n')
      out = data.replace(/[\n\r]/g, ':').split(":")
      $.each(out, function( index, value ) {
        var obj = {
              name: "MW",
              info: value,
          };
        currentMolInfo.push(obj);
      });      
      cgMolecules("#myGridSearchMol", currentMolInfo)

    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var getIupacName = function (inchi) {
    var request = $.ajax({
        type: "GET",
        url: "http://cactus.nci.nih.gov/chemical/structure/" + inchi + "/iupac_name"
    });

    request.done(function( data ) {
      var obj = {
            name: "Iupac Name",
            info: data,
        };
      currentMolInfo.push(obj);
      cgMolecules("#myGridSearchMol", currentMolInfo)

    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var getGusar = function (cas) {
  var url= "http://cactus.nci.nih.gov/chemical/apps/add/structure"
  window.open(url, '_blank');  
}

var getNCI = function (cas) {
  var url= "http://cactus.nci.nih.gov/ncidb2.2/nci2.2.tcl?op1=cas&data1="  +  cas + "&output=detail%20&highbondlist=1+2+3+4+5+6+7+8+9+10&highatomlist=1+2+3+4+5+6+7+8+9+10&conflist=-1&passid=&nomsg=1"
  window.open(url, '_blank');  
}

var getNIST = function (cas) {
  var url= "http://webbook.nist.gov/cgi/cbook.cgi?ID=" + cas + "&Units=SI"
  window.open(url, '_blank');  
}

var getTOXNET = function (cas) {
    var request = $.ajax({
        type: "GET",
        url: server + "/Mirror?quest=getToxnet&cas=" + cas
    });

    request.done(function( data ) {
      var url1= "http://toxgate.nlm.nih.gov/cgi-bin/sis/search2/f?" + data + ":1"
      window.open(url1, '_blank'); 
    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var get3D = function (cas) {
  var url= "http://cactus.nci.nih.gov/chemical/structure/" + cas + "/twirl"
  window.open(url, '_blank');  
}

var getChemIdPlus = function (cas) {
  var url= "http://chem.sis.nlm.nih.gov/chemidplus/rn/" + cas
  window.open(url, '_blank');  
}
