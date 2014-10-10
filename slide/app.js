var Twitter = {
    init: function() { 
        var announce = '<span style="color:red;font-weight:bold;margin:20px;">Twitter: @jsdc_tw &nbsp;&nbsp;&nbsp;IRC: irc.freenode.net#jsdc.tw</span>';
        this.insertLatestTweets('jsdc_tw', announce);
    },


    // This replaces the <p>Loading...</p> with the tweets
    insertLatestTweets: function(username, announce) {
        var limit = 5; // How many feeds do you want?

        var url = '//api.twitter.com/1/statuses/user_timeline.json?screen_name=' + username + '&count=' + limit + '&callback=?';
        //var url = 'https://c9.io/df1/jsdc_screensaver/workspace/test.json';

        // Now ajax in the feeds from twitter.com
        $.getJSON(url, function(data) { // We'll start by creating a normal marquee-element for the tweets

            var html = '';

            // Loop through all the tweets and create a link for each

            for (var i in data) {
                html += '<a href="http://twitter.com/' + username + '#status_' + data[i].id_str + '">' + data[i].text + ' <i>' + Twitter.daysAgo(data[i].created_at) + '</i></a>';
            }


            // Now replace the <p> with our <marquee>-element
            if($('#twitter p').length > 0){
                $('#twitter p').replaceWith('<marquee behavior="scroll" scrollamount="1" direction="left">' + announce + html +'</marquee>' );
            }else{
                $('#twitter > div > div').html(announce + html);
            }

            // The marquee element looks quite shite so we'll use Remy Sharp's plug-in to replace it with a smooth one
            Twitter.fancyMarquee();
        });
    },


    // Replaces the marquee-element with a fancy one
    fancyMarquee: function() { // Replace the marquee and do some fancy stuff (taken from remy sharp's website)
        $('#twitter marquee').marquee('pointer').mouseover(function() {
            //$(this).trigger('stop');
        }).mouseout(function() {
            $(this).trigger('start');
        }).mousemove(function(event) {
            if ($(this).data('drag') === true) {
                this.scrollLeft = $(this).data('scrollX') + ($(this).data('x') - event.clientX);
            }
        }).mousedown(function(event) {
            $(this).data('drag', true).data('x', event.clientX).data('scrollX', this.scrollLeft);
        }).mouseup(function() {
            $(this).data('drag', false);
        });
    },


    // Takes a date and return the number of days it's been since said date
    daysAgo: function(date) {

        var d = new Date(date).getTime();
        var n = new Date().getTime();

        var numDays = Math.round(Math.abs(n - d) / (1000 * 60 * 60 * 24));
        var daysAgo = numDays + ' days ago';


        if (numDays === 0) {
            daysAgo = 'today';
        }
        else if (numDays == 1) {
            daysAgo = numDays + ' day ago';
        }


        return daysAgo;
    }
};
$(function() {
    Twitter.init();
    // update twitter every 5 minutes
    setInterval(function(){
        Twitter.init();
    },1000*5*60);
});