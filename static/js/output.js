$(document).ready(function(){
 
    $("#sequence_name").on('click', function(){
        $("#Sequence").toggle("slow");
        });
    $("#exon").on('click', function(){
        $("#exon_table").toggle("slow");
        });
    $("#exon_intron").on('click', function(){
        $("#exon_intron_table").toggle("slow");
        });
    $("#protein_sequence").on('click', function(){
        $("#protein_table").toggle("slow");
        });        



    $('#sequence_name').on('click',function(){
        $('#Sequence').empty()
        var fired_button = document.URL; //用這個可以得到現在的URL網址
        transcript = fired_button.replace('http://127.0.0.1:8000/web_data/output/','');
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type: 'POST',
            url: 'crawler/', 
            data: {'transcript':transcript},
            success: function(response){
                exon_intron_type = response.exon_intron_type;
                exon_intron_start = response.exon_intron_start
                exon_intron_stop = response.exon_intron_stop
                sequence_fin = response.sequence_fin
                /*----------------------------------------------------------------------------- */
                exon_intron_type = exon_intron_type.replace('[','');
                exon_intron_type = exon_intron_type.replace(']','');
                exon_intron_type = exon_intron_type.replace(/"/g,'');
                exon_intron_type = exon_intron_type.split(',');
                /*----------------------------------------------------------------------------- */
                exon_intron_start = exon_intron_start.replace('[','');
                exon_intron_start = exon_intron_start.replace(']','');
                exon_intron_start = exon_intron_start.split(',');                
                /*----------------------------------------------------------------------------- */
                exon_intron_stop = exon_intron_stop.replace('[','');
                exon_intron_stop = exon_intron_stop.replace(']','');
                exon_intron_stop = exon_intron_stop.split(',');
                /*----------------------------------------------------------------------------- */
                //sequence_fin = sequence_fin.split('');
                //alert(sequence_fin)
                //for (var i=0;i<sequence_fin.length;i++){
                var color = 'orange';
                for (var i=0;i<exon_intron_type.length;i++){
                    if (exon_intron_type[i] == 'five_prime_UTR')
                    {
                        for (var j=exon_intron_start[i]-1;j<exon_intron_stop[i];j++){
                            $('#Sequence').append("<span class = 'G1' style='background-color: grey;'>"+sequence_fin[j]+'</span>'); 
                        };
                    }
                    else if (exon_intron_type[i] == 'exon') {
                        if (color == 'yellow'){
                        for (var j=exon_intron_start[i]-1;j<exon_intron_stop[i];j++){
                            if (sequence_fin[j] == sequence_fin[j].toUpperCase()){
                                    $('#Sequence').append("<span class = 'G2' style='background-color: orange;'>"+sequence_fin[j]+'</span>');    
                                };

                            };     
                        color = 'orange';
                        }else if (color =='orange'){
                            for (var j=exon_intron_start[i]-1;j<exon_intron_stop[i];j++){
                                if (sequence_fin[j] == sequence_fin[j].toUpperCase()){
                                        $('#Sequence').append("<span class = 'G2' style='background-color: yellow;'>"+sequence_fin[j]+'</span>');    
                                    };
    
                                }; 
                                color = 'yellow';  
                        };
                    } 
                    else if (exon_intron_type[i] == 'intron') {
                        for (var j=exon_intron_start[i]-1;j<exon_intron_stop[i];j++){
                            $('#Sequence').append("<span class = 'G3' >"+sequence_fin[j]+'</span>'); 
                        };
                     
                    }
                    else if (exon_intron_type[i] == 'three_prime_UTR') {
                        for (var j=exon_intron_start[i]-1;j<exon_intron_stop[i];j++){
                            $('#Sequence').append("<span class = 'G2' style='background-color: grey;'>"+sequence_fin[j]+'</span>'); 
                        };
                }};   
            },//回傳response
            error: function(){
                alert('Something error');
            },
        });
    });
});
