(function(){
  window.searchQuery = (function(){
    var search = location.search;
    var query = {};
    if(search.indexOf("?") >= 0){
      search = search.substr(1, search.length);
      search = search.split("&");
      for(var i = 0; i < search.length; i++){
        var data = search[i].split("=");
        query[data[0]] = data[1];
      }
    }
    return query;
  })();
})();
