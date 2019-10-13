var stringIconFolder = '';
var stringIconItem = '';

var itemEveryRow = 4

var numRow = Math.ceil(arrPackIcon.length / itemEveryRow)

$('#check-all').on('change', '', function(){
    $('.folder-name').prop('checked', $('#check-all').is(':checked'))
})

renderArrayPack()
var dataR = [ awesome_icons, chemistry, contact_us, countrys_flags, ecommerce_set, hacker, interface, logistics_delivery,
    miscellaneous_elements, multimedia_collection, phone_icons, social_media_logos, social_network_logo_collection, vector_editing, vector_editing2, material_design, essential_compilation
]
dataR.forEach(e => {
    renderIcon(e)
})

var lazyLoadInstance = new LazyLoad({
    elements_selector: ".img-icon"
    // ... more custom settings?
});

$('body').on('click', '#collap-search', function(e){
    $('.feed-control').toggleClass('active')
})

function renderArrayPack(){
    arrPackIcon.forEach(function(e,i){
        stringIconItem += '<td>'
        stringIconItem += '  <input type="checkbox" id="' + e + '" name="folder-name" class="folder-name" value="true">'
        stringIconItem += '  <label for="' + e + '">' + e + '</label>'
        stringIconItem += '</td>'
        if((i+1)%itemEveryRow == 0){
            stringIconFolder += '<tr>' + stringIconItem + '</tr>'
            stringIconItem = ''
        }
    })
    for (var i = 0; i < (numRow*itemEveryRow - arrPackIcon.length); i++) {
        stringIconItem += '<td></td>';
    }

    stringIconFolder += '<tr>' + stringIconItem + '</tr>'
    stringIconFolder = '<table cellspacing="0" borderspacing="0">' + stringIconFolder + '</table>'

    $('#icon-folder').html(stringIconFolder)
}

function renderIcon(arrRender, title){
    title = title || arrRender[0].toString().split('/')[2]
    var strRender = '<div class="title-icon">' + title + '</div>'
    arrRender.forEach(function(el,i){
        strRender += '<div class="icon-item" title="' + el + '">'
        strRender += '  <img class="img-icon" data-src="' + el + '"/>'
        strRender += '</div>'
    })
    $('.box.icon').append(strRender)
}
