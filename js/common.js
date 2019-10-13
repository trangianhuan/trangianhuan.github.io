if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful');
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

function debounce(func, wait) {
  var timeout;

  return function() {
    var context = this,
        args = arguments;

    var executeFunction = function() {
      func.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(executeFunction, wait);
  };
};

function stringToSlug(str){
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
