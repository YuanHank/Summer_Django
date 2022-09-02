$(document).ready(function(){
    
    $('#submit').click(function(){
        
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type: 'POST',
            url: 'ajax/', 
            data: $('#ajax_form').serialize(),
            success: function(response){
                transcript = response.transcript.replace(/'/g,'');
                transcript = transcript.replace('[','');
                transcript = transcript.replace(']','');
                transcript = transcript.replace(/,/g,"|")
                //transcript = transcript.replace(/,/g,'|');
                const transcript_list = transcript.split('|')
                var len = transcript_list.length
                $("#gene_id").empty();
                $("#transcript").empty();
                $("#numbers").empty();
                //tr ='<td>'+response.Gene_ID+'</td>'+'<td>'+transcript+'</td>'+'<td>'+response.numbers+'</td>';
                //$("#message").html('<div class="alert alert-warning">' + response.message + '</div>');
                $("#gene_id").html(response.Gene_ID);
                for (var i =0;i<len;i++){
                    $("#transcript").append(`<a href ="/web_data/output/${transcript_list[i].replace(' ','')}">${transcript_list[i]}</a>|`);
                } // by using loop , I can append transcipts seperatly and giving it a url,
                // 用反單引號加上＄{}可傳入變數
                //$("#transcript").html(transcript); //this line is old version which will only get the string of the transcript
                $("#number").html(response.numbers);
            },//回傳response
            error: function(){
                alert('Something error');
            },
        });

    });
    /*
    $('#transcript').on('click','#transcript_button',function(){
        var fired_button = $(this).val();
        window.location.href = 'output/';
        
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type: 'POST',
            url: 'crawler/', 
            data: {'transcript':fired_button},
            success: function(response){
                
                alert(response.name);
                $("#output").html('<h2>'+response.name+'</h2>');
            },
            error: function(){
                alert('Something error');
            },
        
        });
    });*/
});

//https://wormbase.org/species/c_elegans/transcript/"+transcript_list[i]+"#06--10
//'crawler/' id ="+transcript_list[i]+">"
