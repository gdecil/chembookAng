var getReactions = function (reaction, searchType, reactionId, gridId) {
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

