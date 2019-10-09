
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
var fuse;

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
        arrNoteBooks.push(data.notebook)
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
    renderNote()
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
  arrNoteBooks = arrNoteBooks.filter(onlyUnique);
  var strNoteBook = '';
  for(noteBookIdx in arrNoteBooks){
    strNoteBook += '<li data-id="' + noteBookIdx + '" class="notebook-item"><img width="16px" height="16px" src="/images/book.svg" style="padding-right: 5px"/>' + arrNoteBooks[noteBookIdx] + '<li>'
  }
  document.getElementById('notebook-content').innerHTML = strNoteBook
}

function renderNote(){
  var strNote = '';
  for(noteIdx in arrNote){
    strNote += '<li class="ul-note_item" data-id="' + noteIdx + '">'
    strNote += '  <div class="ul-title">' + arrNote[noteIdx]['title'] + '</div>'
    strNote += '  <div class="ul-content">' + JSON.parse(arrNote[noteIdx]['content'])['ops'][0]['insert'] + '</div>'
    strNote += '  <div class="ul-time">' + formatDate(arrNote[noteIdx]['time']) + '</div>'
    strNote += '</li>'
  }
  document.getElementById('ul-note').innerHTML = strNote
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

function setDataForQuill(idNote, dataset){
  $('#note_title').val(dataset[idNote]['title'])
  $('#idHidden').val(idNote)
  $('#notebooks_input').val(dataset[idNote]['notebook'])
  $('#note-pin').prop('checked', dataset[idNote]['pin'] || false)
  quill.setContents(JSON.parse(dataset[idNote]['content']));
}

$('body').on('click', '.note-wrap.all', function(e){
  $('.list-note').toggle('slide')
})

$('body').on('click', '.ul-note_item', function(e){
  var idNote = $(this).data('id')
  // optionEditor.data.blocks = arrNote[idNote]['content']
  // optionEditor.data.time = 1569838207510
  // optionEditor.data.version = '2.15.1'
  // editor.destroy()
  //$('#editorjs').append('<div><input type="text" name="title" id="note_title" value="' + arrNote[idNote]['title'] + '" placeholder="Title"></div>')

  //editor = new EditorJS(optionEditor);
  setDataForQuill(idNote, arrNote)
})

function searchItem(key){
  console.log(fuse.search(key))
}
$('body').on('keyup', '#search-input', function(e){
  var keySearch = $(this).val();
  console.log(keySearch)
  debounce(searchItem(keySearch), 2000)
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

function stringToSlug(str)
{
  str = str || ''
  var slug = str.toLowerCase();

  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  slug = slug.replace(/đ/gi, 'd');

  slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');

  slug = slug.replace(/ /gi, "-");
  slug = slug.replace(/\-\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-/gi, '-');
  slug = slug.replace(/\-\-/gi, '-');

  slug = '@' + slug + '@';
  slug = slug.replace(/\@\-|\-\@|\@/gi, '');

  return slug;
}

function getrandom(){
    return Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 5);
}

function onlyUnique(value, index, self) {
  if(!value) return false;

  return self.indexOf(value) === index;
}
function formatDate(datetime){
    if(!datetime) return '';

    var dateParse = new Date(datetime);
    var dd = dateParse.getDate();
    var mm = dateParse.getMonth()+1;
    var yyyy = dateParse.getFullYear();
    var hh = dateParse.getHours();
    var minus = dateParse.getMinutes();
    var ss = dateParse.getSeconds();

    if(dd<10){
        dd='0'+dd
    }

    if(mm<10){
        mm='0'+mm
    }

    if(hh<10){
        hh='0'+hh
    }

    if(minus<10){
        minus='0'+minus
    }

    if(ss<10){
        ss='0'+ss
    }

    return dd+'/'+mm+'/'+yyyy + ' ' + hh + ':' + minus + ':' + ss;
}
