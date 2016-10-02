/**
 * Created by Hitler on 10/1/16.
 */


function buildCardReveal ( card_name, message, passwords ) {

    var ret = '<div style = "padding: 10px 0px; text-align:center;">' +
              '    <p>' + message + '</p>';

    for (var i = 0; i < passwords; i++) {

        i = ( i == 0 ) ? "" : (i+1).toString();

        ret +='   <div style = "text-align:left;">'+
              '       <div class="input-field col s12" >' +
              '           <input id="password" type="password" class="validate">' +
              '           <label for="password">Password ' + i + '</label>' +
              '       </div>'
              '   </div>';
    }

    ret  +=   '   <a class="waves-effect waves-light btn authenticationist" style = "margin: 0 auto;" data="'+card_name+'" >Authenticate</a> ' +
              '</div>'

    return ret;

}

function buildCard ( card_class, card_name, image_url, link_description, reveal_text, passwords ) {
    return  '<div class="col s2">' +
            '   <div class="card ' + card_class + '">' +
            '       <div class="card-image waves-effect waves-block waves-light activator" data="'+card_name+'">' +
            '           <img class="activator" data="'+card_name+'" style = "padding:15%;" src="' + image_url +'">' +
            '       </div>' +
            '       <div class="card-content">' +
            '           <span class="card-title activator grey-text text-darken-4">' + card_name + '<i class="material-icons right">more_vert</i></span>' +
            '           <p> ' + link_description + '</p>' +
            '       </div>' +
            '       <div class="card-reveal">' +
            '           <span class="card-title grey-text text-darken-4">' + card_name +'<i class="material-icons right">close</i></span>' +
                         buildCardReveal( card_name, reveal_text, passwords) +
            '       </div>' +
            '   </div>' +
            '</div>';
}

function backCard ( ) {
    return  '<div class="col s2">' +
            '   <div class="card ' + "back_card" + '">' +
            '       <div class="card-image waves-effect waves-block waves-light activator">' +
            '           <img class="activator" style = "padding:15%;" src="' + "../images/back.svg" +'">' +
            '       </div>' +
            '       <div class="card-content">' +
            '           <span class="card-title activator grey-text text-darken-4">' + "Back" + '<i class="material-icons right">more_vert</i></span>' +
            '           <p> ' + 'Go back' + '</p>' +
            '       </div>' +
            '   </div>' +
            '</div>';
}

function newCard ( ) {
    return  '<div class="col s2">' +
            '   <div class="card ' + "new_card" + '">' +
            '       <div class="card-image waves-effect waves-block waves-light activator">' +
            '          <img class="activator" style = "padding:15%;" src="' + "../images/plus.svg" +'">' +
            '       </div>' +
            '       <div class="card-content">' +
            '          <span class="card-title activator grey-text text-darken-4">' + "New" + '<i class="material-icons right">more_vert</i></span>' +
            '          <p> ' + 'New folder or file' + '</p>' +
            '       </div>' +
            '   </div>' +
            '</div>';
}

function jsonCard ( json ) {

    return buildCard( "dataCard", json.name, "../images/locked.svg", "A folder or a file", " Authentication Required", 2 );

}


function open( db, path,  file ) {
        folder = db;
        for ( var i = 0, l = path.length; i < l; i++ ) {
            folder = getByValue(folder.data, "name", path[i]);
        }

        if (file.data == "back_button") {
          path.pop();
          $('#browser').html("");
          drawCardsFromJSON( "database.json", path );
          return;
        }

        else if (file.data == "new_button") {
            alert( " Make a new File" );
            return;
        }

        file = getByValue(folder.data, "name", file);

        if (file.type == "file" ) {
            alert("Opening " + file.name);
        }
        else {
            path.push(file.name);
            $('#browser').html("");
            drawCardsFromJSON( "database.json", path );
        }
    }

drawCardsFromJSON( "database.json", [  ] );

function loadJSON(source, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType( "application/json" );
    xobj.open('GET', source, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function getByValue(arr, value, search) {

    for (var i=0, iLen=arr.length; i<iLen; i++) {

        if (arr[i][value] == search) return arr[i];
    }
}

function drawCards( db, path ) {

    folder = db ;
    for ( var i = 0, l = path.length; i < l; i++ ) {
        folder = getByValue(folder.data, "name", path[i]);
    }

    if (path.length != 0) {
        folder.data.unshift( "back_button" );
    } folder.data.push( "new_button" );

    var row = 0;
    $.each( folder.data, function (key, data) {
        if (key % 6 == 0) {
            row += 1;
            $('#browser').append( '<div class="row" id="row'+row.toString()+'">  </div>' );
        }

        if (data == "back_button") {
            $('#row' + row.toString() ).append( backCard( ) );
        } else if (data == "new_button") {
            $('#row' + row.toString() ).append( newCard( ) );
        } else {
            $('#row' + row.toString()).append( jsonCard(data) );
        }
    });
}

function drawCardsFromJSON( source, path ) {

    loadJSON( source, function( response ) {

        var data = JSON.parse( response );
        drawCards( data, path );

        $(".authenticationist").click( function() {
            var value = $(this).attr("data");
            open(data, path, value);
        });

        $(".back_card .activator").click( function() {
            open(data, path, {"data":"back_button"});
        });

        $(".new_card .activator").click( function() {
            $('#modal1').openModal();
        });

    });
}

 $("#p1c").change(function() {
        if(this.checked) {
            $("#password1").prop('disabled', false);
        } else {
            $("#password1").prop('disabled', true);
        }
    });

    $("#p2c").change(function() {
        if(this.checked) {
            $("#password2").prop('disabled', false);
        } else {
            $("#password2").prop('disabled', true);
        }
    });

    $("#new_file_button").click( function(){
        submitModal("file");
    });

    $("#new_folder_button").click( function(){
        submitModal("folder");
    });

    function submitModal( type ) {
        var p1e =  $("#p1c").prop("checked");
        var p2e =  $("#p2c").prop("checked");

        var passwords = [];

        if (p1e) { passwords.push( $("#password1").val() );   }
        if (p2e) { passwords.push( $("#password2").val() );   }

        $('#modal1').closeModal();

        alert( "new " + type );
        alert( passwords  );
    }

