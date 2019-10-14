
/**
 * Saving button
 */
const saveButton = document.getElementById('saveButton');

if(document.getElementById('editorjs')){
  //var editor = new EditorJS(optionEditor);
    var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image']

      ['clean']                                         // remove formatting button
    ];

  var quill = new Quill('#editorjs', {
    modules: {
      toolbar: toolbarOptions
    },
    placeholder: 'write note here..',
    theme: 'snow'
  });

  $('#editorjs').prepend('<div><input type="text" name="title" id="note_title" value="" placeholder="Title"></div>')

  var callDebounceQuillChange = _.debounce(function(title, content){
    updateNote(title, JSON.stringify(content))
  }, 2000);

  quill.on('text-change', function(delta, oldDelta, source) {
    if($('#idHidden').val() && source == 'user'){
      setImageMess('/images/code.gif', 40, 30, 'Dữ liệu note đang thay đổi...')
      $('.saved').show()
      callDebounceQuillChange(document.getElementById('note_title').value || '', quill.getContents())
    }
  });

  function setImageMess(src, w, h, mess){
    if(mess){
      $('#mess-note').html(mess)
    }
    $('#image-mess-note')
        .prop('src', src)
        .prop('width', w)
        .prop('height', h)
  }

}


/**
 * Saving example
 */
if(saveButton){
  saveButton.addEventListener('click', function () {
    if($('#idHidden').val()){
      updateNote(document.getElementById('note_title').value || '', JSON.stringify(quill.getContents()))
    } else {
      createNote(document.getElementById('note_title').value || '', JSON.stringify(quill.getContents()))
    }
  });
}

// Initialize Firebase
var app = firebase.initializeApp(firebaseConfig);
var db = firebase.firestore(app);
var user;
var arrNote = [];
var arrNotePin = [];
var arrNoteBooks = [];
var arrSearch = [];
var arrResultSearch = [];
var fuse;
var currentNotebook;

function addCollectionInit(collectionName){
  //var batch = db.batch();
  //var notebooks = db.collection('users').doc(collectionName).collection('note').doc('notebooks')
  //var none = db.collection('users').doc(collectionName).collection('note').doc('none')
  //var notebooks = db.doc('users/' + collectionName + '/note/notebooks')
  //var none = db.doc('users/' + collectionName + '/note/none')

  // batch.set(notebooks, {});
  // batch.set(none, {});

  // batch.commit();
}

function initSetup(){
  db.collection(dbCollectNote).where('email', '==', user.email).onSnapshot(function(snapshot){
    snapshot.docChanges().forEach(function(change) {
      var data = change.doc.data()
      if (change.type === "added") {
        if(data.pin){
          arrNotePin[change.doc.id] = data
        }else{
          arrNote[change.doc.id] = data
        }
        if(data.notebook){
          arrNoteBooks[data.notebook] = arrNoteBooks[data.notebook] || []
          arrNoteBooks[data.notebook].push(data)
        }
        data['id'] = change.doc.id
        arrSearch.push(data)
      }
      if (change.type === "modified") {
        if(typeof arrNote[change.doc.id] != 'undefined'){
          arrNote[change.doc.id] = data
        }
        if(typeof arrNotePin[change.doc.id] != 'undefined'){
          arrNotePin[change.doc.id] = data
        }

        data['id'] = change.doc.id
        var isExistsNotebook = false
        for(var arNB in arrNoteBooks){
          var noteBooks = arrNoteBooks[arNB].find(x => x.id === change.doc.id)
          if(noteBooks){
            isExistsNotebook = true
            var idxNoteBook = arrNoteBooks[arNB].findIndex(x => x.id === change.doc.id)
            if(idxNoteBook >= 0){
              if(noteBooks.notebook == data.notebook){
                  arrNoteBooks[arNB][idxNoteBook] = data
              } else {
                arrNoteBooks[arNB].splice(idxNoteBook, 1)
                if(arrNoteBooks[arNB].length == 0){
                  delete arrNoteBooks[arNB]
                }
                arrNoteBooks[data.notebook] = arrNoteBooks[data.notebook] || []
                arrNoteBooks[data.notebook].push(data)
              }
            }// end idxnotebook >= 0
          }
        }

        if(!isExistsNotebook){
          arrNoteBooks[data.notebook] = arrNoteBooks[data.notebook] || []
          arrNoteBooks[data.notebook].push(data)
        }

        var indx = arrSearch.findIndex(x => x.id === change.doc.id)
        if(indx >= 0){
          arrSearch[indx] = data
        }
      }

      if (change.type === "removed") {
        if(typeof arrNote[change.doc.id] != 'undefined'){
          delete arrNote[change.doc.id]
        }
        if(typeof arrNotePin[change.doc.id] != 'undefined'){
          delete arrNotePin[change.doc.id]
        }
        var indx = arrSearch.findIndex(x => x.id === change.doc.id)
        if(indx >= 0){
          delete arrSearch[indx]
        }
        for(var arNB in arrNoteBooks){
          var noteBooks = arrNoteBooks[arNB].find(x => x.id === change.doc.id)
          if(noteBooks){
            var idxNoteBook = arrNoteBooks[arNB].findIndex(x => x.id === change.doc.id)
            if(idxNoteBook >= 0){
              if(arrNoteBooks[arNB].length == 1){
                console.log('step 1', arrNoteBooks[arNB])
                delete arrNoteBooks[arNB]
              } else {
                console.log('step 2', arrNoteBooks[arNB][idxNoteBook])
                delete arrNoteBooks[arNB][idxNoteBook]
              }
            }// end idxnotebook >= 0
          }
        }

      }
    });

    setTimeout(function(){
      renderNote('ul-note',arrNote)
      renderNotePin()
      renderNoteBooks()
      initSearch()
    }, 10)

  })
}

function initSearch(){
  var options = {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: [
      "title","content"
    ]
  };
  fuse = new Fuse(arrSearch, options);
}

function renderNoteBooks(){
  arrNoteBooksName = Object.keys(arrNoteBooks)
  arrNoteBooksName = arrNoteBooksName.filter(onlyUnique);

  //js sugest
  $("#notebooks_input").autocomplete({
      source: arrNoteBooksName
  });

  var strNoteBook = '';
  for(noteBookIdx in arrNoteBooksName){
    strNoteBook += '<li data-note-name="' + arrNoteBooksName[noteBookIdx] + '" class="notebook-item"><img width="16px" height="16px" src="/images/book.svg" style="padding-right: 5px"/>' + arrNoteBooksName[noteBookIdx] + '<li>'
  }
  document.getElementById('notebook-content').innerHTML = strNoteBook
}


function renderNote(idElmentRender, arrRender, isSearch){
  isSearch = isSearch ? '--' + isSearch : ''
  if(isSearch){
    var strNote = '<li>' + arrRender.length + ' notes found</li>';
  }else{
    var strNote = '';
  }
  for(noteIdx in arrRender){
    var keyNote = noteIdx
    if(isSearch){
      keyNote = arrRender[noteIdx]['id']
    }
    strNote += '<li class="ul-note_item'+ isSearch +'" data-id="' + keyNote + '">'
    strNote += '  <div class="ul-title">' + arrRender[noteIdx]['title'] + '</div>'
    strNote += '  <div class="ul-content">' + JSON.parse(arrRender[noteIdx]['content'])['ops'][0]['insert'] + '</div>'
    strNote += '  <div class="ul-time">' + formatDate(arrRender[noteIdx]['time']) + '</div>'
    strNote += '</li>'
  }
  document.getElementById(idElmentRender).innerHTML = strNote
}

$('body').on('click', '.note-pin-item', function(e){
  var idNote = $(this).data('id')
  // optionEditor.data.blocks = arrNotePin[idNote]['content']
  // optionEditor.data.time = 1569838207510
  // optionEditor.data.version = '2.15.1'
  //editor.destroy()
  //$('#editorjs').append('<div><input type="text" name="title" id="note_title" value="' + arrNotePin[idNote]['title'] + '" placeholder="Title"></div>')

  //editor = new EditorJS(optionEditor);
  $('.list-note').hide()
  $('.list-note-search').hide()
  setDataForQuill(idNote, arrNotePin)
})

$('body').on('click', '.note-pin-item, .ul-note_item, .ul-note_item--nb', function(e){
  $('.btn-save').hide()
  $('.saved').hide()
})

function setDataForQuill(idNote, dataset, isSearch){
  isSearch = isSearch || ''
  if(isSearch){
    dataset = dataset.find(x => x.id === idNote)
  } else {
    dataset = dataset[idNote]
  }
  $('#note_title').val(dataset['title'])
  $('#idHidden').val(idNote)
  $('#notebooks_input').val(dataset['notebook'])
  $('#note-pin').prop('checked', dataset['pin'] || false)
  quill.setContents(JSON.parse(dataset['content']));
}

$('body').on('click', '.note-wrap.all', function(e){
  renderNote('ul-note', arrNote)
  $('.list-note').show()
  $('.list-note-search').hide()
})

$('body').on('click', '.notebook-item', function(e){
  currentNotebook = $(this).data('note-name')
  renderNote('ul-note', arrNoteBooks[currentNotebook], 'nb')
  $('.list-note').show()
  $('.list-note-search').hide()
})

$('body').on('click', '.ul-note_item', function(e){
  var idNote = $(this).data('id')
  setDataForQuill(idNote, arrNote)
  hiddenImg()
})

$('body').on('click', '.ul-note_item--search', function(e){
  var idNote = $(this).data('id')
  setDataForQuill(idNote, arrResultSearch, 'search')
  hiddenImg()
})

$('body').on('click', '.ul-note_item--nb', function(e){
  var idNote = $(this).data('id')
  setDataForQuill(idNote, arrNoteBooks[currentNotebook], 'nb')
  hiddenImg()
})

$('body').on('click', '.dropdown-item.create', function(e){
  $('#idHidden').val('')
  $('#note_title').val('')
  $('#notebooks_input').val('')
  $('#note-pin').prop('checked', false)
  $('.saved').show()
  $('.btn-save').show()
  quill.setContents('')
})

$('body').on('click', '.img-logout', function(e){
  logout()
})

$('body').on('click', '.dropdown-item.del', function(e){
  Swal.fire({
    title: 'Are you sure, delete this note?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      deleteNote()
    }
  })
})

function searchItem(key){
  arrResultSearch = fuse.search(key)
  renderNote('ul-note-search', arrResultSearch, 'search')
  $('.list-note').hide()
  $('.list-note-search').show()
}

function hiddenImg(){
  $('.saved').hide()
}

var callDebounceHideImage = _.debounce(hiddenImg, 2000)

var callDebounceSearch = _.debounce(function(str){
    searchItem(str);
}, 400);

$('body').on('keyup', '#search-input', function(e){
  var keySearch = $(this).val();
  callDebounceSearch(keySearch)
})

function renderNotePin(){
  var strNote = '';
  for(noteIdx in arrNotePin){
    strNote += '<li data-id="' + noteIdx + '" class="note-pin-item"><img width="16px" height="16px" src="/images/book.svg" style="padding-right: 5px"/>' + arrNotePin[noteIdx]['title'] + '<li>'
  }
  document.getElementById('notePin-content').innerHTML = strNote
}

function createNote(title, content, notebook){
  if(!title && !content) return;
  notebook = notebook || $('#notebooks_input').val()
  if(user.email){
    db.collection(dbCollectNote).add({
      title: title.trim() || 'Untitled',
      content: content,
      email: user.email,
      notebook: notebook.trim(),
      time: new Date().getTime(),
      pin: $('#note-pin').is(':checked'),
    })
  } else {
    console.log('cannot create note, please login')
  }
}

function createNoteHis(idNote, title, content, notebook, pin){
  if(!title && !content) return;
  notebook = notebook || $('#notebooks_input').val()
  if(user.email){
    db.collection(dbCollectNoteHis).add({
      idNote: idNote,
      title: title,
      content: content,
      email: user.email,
      notebook: notebook,
      pin: pin,
      timeUpdate: new Date().getTime(),
    })
  } else {
    console.log('cannot create his note, please login')
  }
}


function deleteNote(title, content, notebook){
  db.collection(dbCollectNote).doc($('#idHidden').val()).delete().then(function() {
      Swal.fire(
        'Deleted!',
        'Your note has been deleted.',
        'success'
      )
  }).catch(function(error) {
      Swal.fire(
        'Error!',
        'Your note not has been delete.',
        'error'
      )
  });

}

function updateNote(title, content, notebook){
  notebook = notebook || $('#notebooks_input').val()
  if(user.email){
    db.collection(dbCollectNote).doc($('#idHidden').val()).set({
      title: title.trim() || 'Untitled',
      content: content,
      email: user.email,
      notebook: notebook.trim(),
      pin: $('#note-pin').is(':checked'),
    }).then(function(){
      $('.saved').show()
      setImageMess('/icon/awesome-icons/svg/correct-symbol.svg', 20, 20, 'Dữ liệu đã được lưu.')
      callDebounceHideImage()
      createNoteHis($('#idHidden').val(), title, content, notebook.trim(), $('#note-pin').is(':checked'))
    })
  } else {
    console.log('cannot update note, please login')
  }
}

function createNotebook(name){
  if(user.email){
    db.collection(dbCollectNb).add({
      code: stringToSlug(name) + '-' + getrandom(),
      name: name,
      email: user.email,
    })
  } else {
    console.log('cannot create note, please login')
  }
}

firebase.auth().onAuthStateChanged(function(userLogin) {
  if (userLogin) {
    user = userLogin
    initSetup()
    $('.img-logout').show()
  } else {
    window.location.href = '/login';
  }
});

function getDataNote(collectionName){
  var notebooksData = db.doc('users/' + collectionName + '/note/notebooks')
  .onSnapshot(function(doc) {
      console.log("Current data notebook: ", doc.data());
  });

  var noneData = db.doc('users/' + collectionName + '/note/none')
  .onSnapshot(function(doc) {
      console.log("Current data none: ", doc.data());
  });

}

function createUserWithEmailAndPassword(email, password){
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(data){
    user = data.user;
    if(user){
      user.sendEmailVerification()
    }
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
}

function signInWithEmailAndPassword(email, password){
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function(data){
    if(data){
      user = data.user;
      if(user && user.emailVerified){

      }else{
        logout()
      }
    }
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
}

function logout(){
  firebase.auth().signOut()
}
