/*$("#login").on('click', function(){
	alert(document.getElementById('email').value);
	alert(document.getElementById('password1').value);
	alert(document.getElementById('password2').value);

});

$("#register_now").on('click', function(){
	alert(document.getElementById('email').value);
	alert(document.getElementById('password1').value);
	alert(document.getElementById('password2').value);
});*/

function redirect(){
    document.location = "/cards/index.html";
    
}

function postEmail(email) {
    $.ajax({url:"https://oversec.ngrok.io/api", method:"POST", data:{endpoint:"getsec", sid:email}, success:function(res){
        if(typeof res === "string"){
            res = JSON.parse(res);   
        }
        
        if (res.accepted) {
            loadPasswordStage(res.passwords, email);
        } else {
        //    alert("I don't think you have an account with us."); //toDo: fuck with this
            loadCreateAccount(email);   
            
        }
   
    }});
}

function loadEmailStage() {

    $("#form").html(
        '<div class="row"></div>' +
        '<div class="row"></div>' +
        '<div style = "text-align:center" >' +
        '    <h3 style = >Closed Kimono</h3>' +
        '    Because aint nobody want to see that' +
        '</div>' +
        '<div class="row"></div> ' +
        '<div class="input-field col s12">' +
        '    <i class="material-icons prefix">mail_outline</i>' +
        '    <input class="validate" id="email" type="email">' +
        '    <label for="email" data-error="invalid email" data-success="valid">Email</label>' +
        '</div>' +
        '<div class="row">' +
        '</div>' +
        '<div class="row">' +
        '    <div class="input-field col s4 " style = "font-size:75%;">' +
        '       <a href="#", id="register" , class="btn waves-effect waves-light col s12">Register</a>' +
        '    </div>' +
        '    <div class="input-field col s7">' +
        '        <a href="#" , id="login" , class="btn waves-effect waves-light col s12">Login</a>' +
        '     </div>' +
        '</div>'
    );

    $("#login").click(loginEmail);

}

function loadCreateAccount(email){
    var content = '<div class="row"></div>' +
        '<div class="row"></div>' +
        '<div style = "text-align:center" >' +
        '    <h3 style = >Closed Kimono</h3>' +
        '    Welcome! Add some passwords!' +
        '</div>' +
        '<div class="row"></div> ';


    for (var i = 0; i < 1; i++) {
        i = (i == 0) ? "" : (i + 1).toString();
        content += '<div class="row">' +
            '   <div class="input-field col s12">' +
            '      <i class="material-icons prefix">lock_outline</i>' +
            '      <input id="password' + i + '" type="password" class="passwordinput" passnum="'+i+'">' +
            '      <label for="password' + i + '"> Password ' + i + ' </label>' +
            '   </div>' +
            '</div>'
    }
    

    content += '<div class="row" id="brow">' +
        '<div class="input-field col s6">' +
        '    <a href="#" , id="addPass" , class="btn waves-effect waves-light col s12">Add Another Password</a>' +
        '  </div>'+
        '  <div class="input-field col s6">' +
        '    <a href="#" , id="create" , class="btn waves-effect waves-light col s12">Create Account</a>' +
        '  </div>'
    '</div>';   
    
    $("#form").html(content);
    
    $("#addPass").click(function(){
        var i = $(".passwordinput").length + 1;
        
        
        
        var c = '<div class="row">' +
            '   <div class="input-field col s12">' +
            '      <i class="material-icons prefix">lock_outline</i>' +
            '      <input id="password' + i + '" type="password" class="passwordinput" passnum="'+i+'">' +
            '      <label for="password' + i + '"> Password ' + i + ' </label>' +
            '   </div>' +
            '</div>'
        
        $("#brow").before(c)
        
    });
    
    $("#create").click(function(){
        var pwd = []
        $(".passwordinput").each(function(){ //I feel like this goes in order, but whatever.
            if($(this).val() != ""){
                pwd.push($(this).val());
                console.log($(this).val());
            }
            
        })
        
        var sec = JSON.stringify({passwords:pwd})
        
        $.ajax({url:"https://oversec.ngrok.io/api",  method:"POST", data:{endpoint:"createaccount", sec:sec, username:email}, success:function(d){
            //DAta
            console.log(d)
            localStorage.setItem("key", d.key);
            redirect();
            
        }});
    });
    
}


function loadPasswordStage(passwords, email) {

    var content = '<div class="row"></div>' +
        '<div class="row"></div>' +
        '<div style = "text-align:center" >' +
        '    <h3 style = >Closed Kimono</h3>' +
        '    Enter your password(s)!' +
        '</div>' +
        '<div class="row"></div> ';
    
    
    console.log("PWD", passwords);

    for (var i = 0; i < passwords; i++) {
        var j = (i == 0) ? "" : (i + 1).toString();
        content += '<div class="row">' +
            '   <div class="input-field col s12">' +
            '      <i class="material-icons prefix">lock_outline</i>' +
            '      <input id="password' + j + '" type="password" class="passwordinput" passnum="'+j+'">' +
            '      <label for="password' + j + '"> Password ' + j + ' </label>' +
            '   </div>' +
            '</div>'
    }

    content += '<div class="row">' +
        '  <div class="input-field col s12">' +
        '    <a href="#" , id="authenticate" , class="btn waves-effect waves-light col s12">Authenticate</a>' +
        '  </div>'
    '</div>';

    $("#form").html(content);

    $("#authenticate").on('click', function () {
        var pwd = []
        $(".passwordinput").each(function(){ //I feel like this goes in order, but whatever.
            
            pwd.push($(this).val());
            console.log($(this).val());
            
        })
        
        var sec = JSON.stringify({passwords: pwd})
        
        $.ajax({url:"https://oversec.ngrok.io/auth", method:"POST", data:{username:email, sec:sec}, success:function(d){
            if(d.accepted){
                localStorage.setItem("key", d.key);
                //alert("ur in");
                redirect()
                
            } else {
                alert("wrong pass");    
            }     
            
        }})
        
        
    });

}



function loginEmail() {
    var response = postEmail($("#email").val());
}



loadEmailStage();
