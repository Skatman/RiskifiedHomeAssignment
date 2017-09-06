(function(window){
    'use strict';
    function define_library(){
        var FlickrImagesSearch = {};
        var name = "Timmy";
        FlickrImagesSearch.greet = function(){
            alert("Hello from the " + name + " library.");
        }
        return FlickrImagesSearch;
    }

    if(typeof(FlickrImagesSearch) === 'undefined'){
        window.FlickrImagesSearch = define_Library();
    }
    else{
        console.log("Library already defined.");
    }
})(window);
