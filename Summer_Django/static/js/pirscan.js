$(document).ready(function(){
    $('#submit').click(function(){
        
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type: 'POST',
            url: '/pirscan/pirscan_ajax/', 
            data: $('#ajax_form').serialize(),
            success: function(response){
                var data = response.total_json_list
                $('#sequence-table').DataTable({
                    "stateSave": true,
                    "data": data,
                    "columns": [
                    { data: 'piRNA name',title:'piRNA'},
                    { data: 'piRNA target score',title:'piRNA target score'},
                    { data: 'target region',title:'target region'},
                    { data:'# mismatches',title:'# mismatches'},
                    { data:'position in piRNA',title:'position in piRNA'},
                    { data:'# non-GU mismatches in seed region',title:'# non-GU mismatches in seed region'},
                    { data:'# GU mismatches in seed region',title:'# GU mismatches in seed region'},
                    { data:'# non-GU mismatches in non seed region',title:'# non-GU mismatches in non seed region'},
                    { data:'# Gu mismatches in non seed region',title:'# Gu mismatches in non seed region'},
                    { data:'pairing (top:Input sequence, bottom:piRNA)',className:'pairing-sequence',"width":"400",title:'pairing (top:Input sequence, bottom:piRNA)'}
                    ],
                    "bDestroy": true
                })
                
            },//回傳response
            error: function(){
                alert('Something error');
            },
        });

    });

});