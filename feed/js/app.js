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
var feedNewString = '';
var stringLoadImg = '<div class="load" ><img src="/images/load.gif"></div>'

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

    renderArraySite(arrSite)
    prepareFeedNewData(arrSite)

  })
}
var dateGetNew = 5
function prepareFeedNewData(arrSite){
  arrSite = arrSite.filter( onlyUnique );
  var last = Date.now() - (dateGetNew * 24 * 60 * 60 * 1000);
  var arrFeedNew = [];
  for (var index in arrSite) {
    var feedData = arrSiteData[arrSite[index]]
    for(var idfeed in feedData){
      var publicDate = new Date(feedData[idfeed].public_at)

      if(publicDate.getTime() >= last){
        arrFeedNew.push(feedData[idfeed])
      }
    }

    if(arrFeedNew.length){
      feedNewString += '<div class="feed-header-new">' + arrSite[index] + '</div>'
      feedNewString += renderArray(arrFeedNew)
      arrFeedNew = []
    }
  }
}

function renderArray(arrData){
  var feedNew = '';
  if(!arrData.length) return '';

  for (var index in arrData) {
    feedNew += '  <div class="feed-item-new">'
    feedNew += '    <div class="feed-dummy"></div>'
    feedNew += '    <div class="feed-info-new">'
    feedNew += '      <div class="feed-area-new">'
    feedNew += '        <div class="feed-title-new">' + arrData[index].title + '</div>'
    feedNew += '        <div class="feed-description-new">' + arrData[index].description.replace(/<[^>]*>?/gm, '') + '</div>'
    feedNew += '      </div>'
    feedNew += '      <div class="feed-publish-new">' + formatDate(arrData[index].public_at) + '</div>'
    feedNew += '    </div>'
    feedNew += '  </div>'
  }
  return feedNew;
}

function renderArraySite(arrSite){
  arrSite = arrSite.filter( onlyUnique );
  $('.feed-row').html('')
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
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function bindData(site, data){
  for (var idx in data) {
    var feedData = data[idx]
    var feed = '<div class="feed-info">';
    if(typeof feedData.public_at != 'undefined'){
      var last = Date.now() - (dateGetNew * 24 * 60 * 60 * 1000)
      var publicDate = new Date(feedData.public_at)
      if(publicDate.getTime() >= last){
        feed += '  <span class="feed-flag">NEW</span>'
      }
    }
    feed += '  <a href="' + feedData.link + '" class="feed-title"  target="_blank">' + feedData.title + '</a>'
    //feed += '  <div class="feed-content">' + feedData.description.replace(/<img[^>]*>/g,"") + '</div>'
    if(typeof feedData.public_at != 'undefined'){
      feed += '  <span class="feed-publish">' + formatDate(feedData.public_at) + '</span>'
    }
    feed += '</div>'
    $('#'+site).append(feed)
  }
}

$('body').on('change', '.control-item_select', function(){
  $('.feed-row').html(stringLoadImg)
  var conditionSelect = +$(this).val()

  switch(conditionSelect) {
    case 0:
      renderArraySite(arrSite)
      break;
    case 1:
      $('.feed-row').html(feedNewString)
      break;
    default:
  }
})

function sleep(ms) {
    var unixtime_ms = new Date().getTime();
    while(new Date().getTime() < unixtime_ms + ms) {}
}

function initPublicDate()
{
  db.collection("feed").get()
    .then(function(querySnapshot) {
      var batch = db.batch();

      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
        data = doc.data();
        // if(!data.public_at || typeof data.public_at == 'object'){
        //   var sfRef = db.collection("feed").doc(doc.id);
        //   batch.update(sfRef, {"public_at": formatDate(data.created_at.toDate()) });
        // }
        if(typeof data.public_at == 'string'){
          var sfRef = db.collection("feed").doc(doc.id);
          batch.update(sfRef, {"public_at": getEpochTime(data.public_at) });
        }

      });

      batch.commit()
    })
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

function getEpochTime(datetime){
  return new Date(datetime).getTime();
}