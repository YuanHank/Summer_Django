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
        $("#protein").toggle("slow");
        });        

});