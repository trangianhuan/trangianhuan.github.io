var stringIconFolder = '';
var stringIconItem = '';
var fuse;
var itemEveryRow = 4
var numRow = Math.ceil(arrPackIcon.length / itemEveryRow)

$('#check-all').on('change', '', function(){
    $('.folder-name').prop('checked', $('#check-all').is(':checked'))
})

setTimeout(renderArrayPack, 10)

var dataR = [ awesome_icons, chemistry, contact_us, countrys_flags, ecommerce_set, hacker, interface, logistics_delivery,
    miscellaneous_elements, multimedia_collection, phone_icons, social_media_logos, social_network_logo_collection, vector_editing, vector_editing2, material_design, essential_compilation
]
var dataSearch = [];
dataR.forEach(e => {
    renderIcon(e)
    e.forEach(function(el){
        dataSearch.push({word: el})
    })
})

var lazyLoadInstance = new LazyLoad({
    elements_selector: ".img-icon"
    // ... more custom settings?
});

setTimeout(initSearchIcon, 10)

$('body').on('keyup', '#ip-search-icon', function(e){
    var keySearch = $(this).val()
    callDebounceSearch(keySearch)
})

$('body').on('click', '#collap-search', function(e){
    $('.feed-control').toggleClass('active')
})

function searchItem(key){
    arrResultSearch = fuse.search(key)
    //renderNote('ul-note-search', arrResultSearch, 'search')
    console.log(arrResultSearch)

    $('.box.icon').html('<div style="padding: 0 15px; width: 100%;">' + arrResultSearch.length + ' icons found</div>')
    renderIcon(arrResultSearch, false)
    if (lazyLoadInstance) {
        lazyLoadInstance.update();
    }
}

var callDebounceSearch = _.debounce(function(str){
    searchItem(str);
}, 600);

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

function renderIcon(arrRender, title = true){
    var strRender = ''
    if(title){
        title = arrRender[0].toString().split('/')[2]
        strRender = '<div class="title-icon">' + title + '</div>'
    }
    arrRender.forEach(function(el,i){
        strRender += '<div class="icon-item" title="' + (el.word || el) + '">'
        strRender += '  <img class="img-icon" data-src="' + (el.word || el) + '"/>'
        strRender += '</div>'
    })
    $('.box.icon').append(strRender)
}

function initSearchIcon(){
  var options = {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: ['word'],
  };
  fuse = new Fuse(dataSearch, options);
}
