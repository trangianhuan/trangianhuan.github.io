
/**
 * Saving button
 */
const saveButton = document.getElementById('saveButton');
/**
 * To initialize the Editor, create a new instance with configuration object
 * @see docs/installation.md for mode details
 */
var optionEditor = {
  /**
   * Wrapper of Editor
   */
  holder: 'editorjs',
  /**
   * Tools list
   */
  tools: {
    /**
     * Each Tool is a Plugin. Pass them via 'class' option with necessary settings {@link docs/tools.md}
     */
    header: {
      class: Header,
      inlineToolbar: ['link'],
      config: {
        placeholder: 'Header'
      },
      shortcut: 'CMD+SHIFT+H'
    },
    /**
     * Or pass class directly without any configuration
     */
    image: {
      class: SimpleImage,
      inlineToolbar: ['link'],
    },
    list: {
      class: List,
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+L'
    },
    checklist: {
      class: Checklist,
      inlineToolbar: true,
    },
    quote: {
      class: Quote,
      inlineToolbar: true,
      config: {
        quotePlaceholder: 'Enter a quote',
        captionPlaceholder: 'Quote\'s author',
      },
      shortcut: 'CMD+SHIFT+O'
    },
    warning: Warning,
    marker: {
      class:  Marker,
      shortcut: 'CMD+SHIFT+M'
    },
    code: {
      class:  CodeTool,
    },
    delimiter: Delimiter,
    inlineCode: {
      class: InlineCode,
      shortcut: 'CMD+SHIFT+C'
    },
    linkTool: LinkTool,
    embed: {
      class:  Embed,
      shortcut: 'CMD+SHIFT+E'
    },
    table: {
      class: Table,
      inlineToolbar: true,
      shortcut: 'CMD+ALT+T'
    },
  },
  data: {
  },
  onReady: function(){
    //saveButton.click();
  },
  onChange: function() {
    console.log('something changed');
  }
}

if(document.getElementById('editorjs')){
  var editor = new EditorJS(optionEditor);
}

/**
 * Saving example
 */
if(saveButton){
    saveButton.addEventListener('click', function () {
      editor.save().then((savedData) => {
        createNote(document.getElementById('note_title').value || '', savedData.blocks)
      });
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
      if (change.type === "added") {
        if(change.doc.data().pin){
          arrNotePin[change.doc.id] = change.doc.data()
        }else{
          arrNote[change.doc.id] = change.doc.data()
        }
        arrNoteBooks.push(change.doc.data().notebook)
      }
      if (change.type === "modified") {
        arrNote[change.doc.id] = change.doc.data()
      }
      if (change.type === "removed") {
        delete arrNote[change.doc.id]
      }
    });
    renderNote()
    renderNotePin()
    renderNoteBooks()
  })
}

function renderNoteBooks(){
  arrNoteBooks = arrNoteBooks.filter(onlyUnique);
  var strNoteBook = '';
  for(noteBookIdx in arrNoteBooks){
    strNoteBook += '<li data-id="' + noteBookIdx + '" class="notebook-item"><img width="16px" height="16px" src="/images/book.svg" style="padding-right: 5px"/>' + arrNoteBooks[noteBookIdx] + '<li>'
  }
  document.getElementById('notebook-content').innerHTML = strNoteBook
  console.log('renderNoteBooks')
}

function renderNote(){
  var strNote = '';
  for(noteIdx in arrNote){
    strNote += '<li class="ul-note_item" data-id="' + noteIdx + '">'
    strNote += '  <div class="ul-title">' + arrNote[noteIdx]['title'] + '</div>'
    strNote += '  <div class="ul-content">' + arrNote[noteIdx]['content'][0]['data']['text'] + '</div>'
    strNote += '  <div class="ul-time">' + arrNote[noteIdx]['time'] + '</div>'
    strNote += '</li>'
  }
  document.getElementById('ul-note').innerHTML = strNote
}

$('body').on('click', '.note-pin-item', function(e){
  var idNote = $(this).data('id')
  optionEditor.data.blocks = arrNotePin[idNote]['content']
  optionEditor.data.time = 1569838207510
  optionEditor.data.version = '2.15.1'
  editor.destroy()
  $('#editorjs').append('<div><input type="text" name="title" id="note_title" value="' + arrNotePin[idNote]['title'] + '" placeholder="Title"></div>')

  editor = new EditorJS(optionEditor);
})

$('body').on('click', '.note-wrap.all', function(e){
  $('.list-note').toggle()
})

$('body').on('click', '.ul-note_item', function(e){
  var idNote = $(this).data('id')
  optionEditor.data.blocks = arrNote[idNote]['content']
  optionEditor.data.time = 1569838207510
  optionEditor.data.version = '2.15.1'
  editor.destroy()
  $('#editorjs').append('<div><input type="text" name="title" id="note_title" value="' + arrNote[idNote]['title'] + '" placeholder="Title"></div>')

  editor = new EditorJS(optionEditor);
})



function renderNotePin(){
  var strNote = '';
  for(noteIdx in arrNotePin){
    strNote += '<li data-id="' + noteIdx + '" class="note-pin-item"><img width="16px" height="16px" src="/images/book.svg" style="padding-right: 5px"/>' + arrNotePin[noteIdx]['title'] + '<li>'
  }
  document.getElementById('notePin-content').innerHTML = strNote
}

function createNote(title, content, notebook){
  notebook = notebook || ''
  if(user.email){
    db.collection('note').add({
      title: title || 'Untitled',
      content: content,
      email: user.email,
      notebook: notebook,
      pin: false,
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
    getDataNote(user.email)
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
