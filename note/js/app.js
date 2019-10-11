
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
}

/**
 * Saving example
 */
if(saveButton){
  saveButton.addEventListener('click', function () {
    if($('#idHidden').val()){

    } else {
      createNote(document.getElementById('note_title').value || '', JSON.stringify(quill.getContents()))
    }
  });
}


// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyATdwi0PUsJ8NsB4blrNgUTFSGn99xS02U",
  authDomain: "trangianhuan-github-io.firebaseapp.com",
  databaseURL: "https://trangianhuan-github-io.firebaseio.com",
  projectId: "trangianhuan-github-io",
  storageBucket: "",
  messagingSenderId: "397638218028",
  appId: "1:397638218028:web:0bf1e9de2ec91b9e50bc89"
};

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
  db.collection('note').where('email', '==', user.email).onSnapshot(function(snapshot){
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
        arrNote[change.doc.id] = data
      }
      if (change.type === "removed") {
        delete arrNote[change.doc.id]
      }
    });
    renderNote('ul-note',arrNote)
    renderNotePin()
    renderNoteBooks()
    initSearch()
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
  setDataForQuill(idNote, arrNotePin)
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
})

$('body').on('click', '.ul-note_item--search', function(e){
  var idNote = $(this).data('id')
  setDataForQuill(idNote, arrResultSearch, 'search')
})

$('body').on('click', '.ul-note_item--nb', function(e){
  var idNote = $(this).data('id')
  setDataForQuill(idNote, arrNoteBooks[currentNotebook], 'nb')
})

function searchItem(key){
  arrResultSearch = fuse.search(key)
  renderNote('ul-note-search', arrResultSearch, 'search')
  $('.list-note').hide()
  $('.list-note-search').show()
}

$('body').on('keyup', '#search-input', function(e){
  var keySearch = $(this).val();
  debounce(searchItem, 400)(keySearch)
})

function renderNotePin(){
  var strNote = '';
  for(noteIdx in arrNotePin){
    strNote += '<li data-id="' + noteIdx + '" class="note-pin-item"><img width="16px" height="16px" src="/images/book.svg" style="padding-right: 5px"/>' + arrNotePin[noteIdx]['title'] + '<li>'
  }
  document.getElementById('notePin-content').innerHTML = strNote
}

function createNote(title, content, notebook){
  notebook = notebook || $('#notebooks_input').val()
  if(user.email){
    db.collection('note').add({
      title: title || 'Untitled',
      content: content,
      email: user.email,
      notebook: notebook,
      time: new Date().getTime(),
      pin: $('#note-pin').is(':checked'),
    })
  } else {
    console.log('cannot create note, please login')
  }
}

function updateNote(title, content, notebook){
  notebook = notebook || $('#notebooks_input').val()
  if(user.email){
    db.collection('note').doc($('#idHidden').val()).set({
      title: title || 'Untitled',
      content: content,
      email: user.email,
      notebook: notebook,
      pin: $('#note-pin').is(':checked'),
    })
  } else {
    console.log('cannot create note, please login')
  }
}

function createNotebook(name){
  if(user.email){
    db.collection('notebooks').add({
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
    console.log('created', data)
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
