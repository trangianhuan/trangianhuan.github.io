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
var arrFeed = [];
var arrSite = [];
var arrSiteData = [];

initSetup()

function initSetup(){
  db.collection('feed').orderBy('public_at', 'desc').onSnapshot(function(snapshot){
    snapshot.docChanges().forEach(function(change) {
      arrSite.push(change.doc.data().site)

      if( typeof arrSiteData[change.doc.data().site] == "undefined"){
        arrSiteData[change.doc.data().site] = []
        arrSiteData[change.doc.data().site].push(change.doc.data())
      } else {
        arrSiteData[change.doc.data().site].push(change.doc.data())
      }

      if (change.type === "added") {
        arrFeed[change.doc.id] = change.doc.data()
      }
      if (change.type === "modified") {
        arrFeed[change.doc.id] = change.doc.data()
      }
      if (change.type === "removed") {
        delete arrFeed[change.doc.id]
      }
    });

    arrSite = arrSite.filter( onlyUnique );
    var siteIndx;
    for (var index in arrSite) {
      siteIndx = arrSite[index].replace(/\//g, '').replace('https:', '').replace('http:', '').replace(/\./g, '')
      var feedItemHeader = document.createElement('div')
      feedItemHeader.setAttribute('class', 'feed-item_header')
      feedItemHeader.innerText = arrSite[index]

      var feedItem = document.createElement('div')
      feedItem.setAttribute('class', 'feed-item')
      feedItem.setAttribute('id', siteIndx)

      var el = document.createElement('div')
      el.setAttribute('class', 'feed-column')

      el.appendChild(feedItemHeader)
      el.appendChild(feedItem)
      $('.feed-row').append(el)
      bindData(siteIndx, arrSiteData[arrSite[index]])
    }
  })
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function bindData(site, data){
  for (var idx in data) {
    var feedData = data[idx]
    var feed = '<div class="feed-info">';
    if(typeof feedData.public_at != 'undefined'){
      var last = Date.now() - (5 * 24 * 60 * 60 * 1000);
      var publicDate = new Date(feedData.public_at)
      if(feedData.link == 'https://laravel-news.com/laravel-fireable-package'){
        console.log('step10', publicDate.getTime(), last)
      }
      if(publicDate.getTime() >= last){
        console.log('step1', feedData.link)

        feed += '  <span class="feed-flag">NEW</span>'
      }else{
        console.log('nottime')
      }
    }
    feed += '  <a href="' + feedData.link + '" class="feed-title">' + feedData.title + '</a>'
    //feed += '  <div class="feed-content">' + feedData.description.replace(/<img[^>]*>/g,"") + '</div>'
    if(typeof feedData.public_at != 'undefined'){
      feed += '  <span class="feed-publish">' + feedData.public_at + '</span>'
    }
    feed += '</div>'
    $('#'+site).append(feed)
  }
}

function initPublicDate()
{
  db.collection("feed").get()
    .then(function(querySnapshot) {
      var batch = db.batch();

      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
        data = doc.data();
        if(!data.public_at){
          var sfRef = db.collection("feed").doc(doc.id);
          batch.update(sfRef, {"public_at": data.created_at});
        }

      });

      batch.commit()
    })
}
