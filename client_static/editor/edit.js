
var quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Your on a secure line..'
});

path = [      ]
data = {
    "name": "File Name",
    "data": [
        {"name": "page1", "data": 'hello' },
        {"name": "page2", "data": 'hey' },
        {"name": "page3", "data": 'hi' }
    ]
}
currentPage = 0;

function displayPages( ) {

$.each( data.data, function ( key, data ) {

    $("#pages_list").append('<li class="collection-item page_button" data="'+key+'">'+data.name+'</li>');

} );

$(".page_button").click( function() {
    updatePage( currentPage );
    openPage( $(this).attr("data") );
} );

}

function getPageContentString( ) {
    return quill.getText();
}

function openPage( index ) {
    currentPage = index;
    quill.setText( data.data[index].data );
    }

function updatePage( index ) {
    data.data[index].data = getPageContentString();
}

function sync( ) {

}

$("#file_name").val(data.name);
displayPages();
openPage(currentPage);
