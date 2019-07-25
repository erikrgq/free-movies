import 'jquery';
import '../src/style.scss';

$(document).ready(function() {

    var key '/* insert API **/';
    var playlistId = 'PLHPTxTxtC0ibabHy6NWYuZDn9xCZt0NP3';
    var URL = 'https://www.googleapis.com/youtube/v3/playlistItems';

    var options = {
        part: 'snippet',
        key: key,
        maxResults: 20,
        playlistId: playlistId,
    };

    loadVid();
    function loadVid(){
        $.getJSON(URL, options, function(data){
            var id = data.items[0].snippet.resourceId.videoId;
            mainVid(id);
            resultsLoop(data);
        });
    };

    function mainVid(id){
        $('#video').html(`
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `);
    };

    //we are looping through the array of data
    function resultsLoop(data){
        
        //if descriptions are too lond this will cut them to a max of 120 char
        function limitDes(des, limit = 120){
            var newDes = [];
            if(des.length > limit) {
                des.split(' ').reduce((acc, cur) => {
                    if(acc + cur.length <= limit){
                        newDes.push(cur);
                    }
                    return acc + cur.length;
                }, 0);
        
                //return the result
                return `${newDes.join(' ')} ...`;
            }
            return des;
        }

        //insert the html 
        $.each(data.items, function(_i, item){
            var thumb = item.snippet.thumbnails.medium.url;
            var title = item.snippet.title;
            var des = item.snippet.description;
            var vid = item.snippet.resourceId.videoId;
            
            $('main').append(`
            <article class="item" data-key="${vid}">
                <img src="${thumb}" alt="" class="thumb">
                <div class="details">
                    <h4>${title}</h4>
                    <p>${limitDes(des)}</p>
                </div>
            </article>
        `);
        });
    };

    //on click on a thumbnail this looks for the ID and displays it
    $('main').on('click', 'article', function() {
        var id = $(this).attr('data-key');
        mainVid(id);
    });

});
