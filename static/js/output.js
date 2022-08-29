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
        transcript = fired_button.replace('http://127.0.0.1:8000/web_data/output/','')
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type: 'POST',
            url: 'crawler/', 
            data: {'transcript':transcript},
            success: function(response){
                $('#Sequence').append('<p>'+response.sequence_fin+'</p>')
            },//回傳response
            error: function(){
                alert('Something error');
            },
        });
    });
});
