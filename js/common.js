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
    var src = server + '/render?idReaction=' + rxnId ;
    var img_height = $('#containerReaction').parent().height();
    var img_width = $('#containerReaction').parent().width();
    $(containerId).append("<img id='moleculeB' src=" + src + " style='width: " + img_width + "px; height: " + img_height + "px;'/>");
}

var searchSSS = function (ketcher){
    if (ketcher){
        var rxn =ketcher.getMolfile();
        if (rxn.length > 105) {
            var rxnIDs = getReactions(rxn,"SSS", $('#reaction1'),"#myGridSearch")            
        }
    }
}

var getExperiment = function(notebook,page, model){
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