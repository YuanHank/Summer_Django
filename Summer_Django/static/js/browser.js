$(document).ready(function(){
    
    $('#submit').click(function(){
        
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type: 'POST',
            url: 'browser_ajax/', 
            data: $('#ajax_form').serialize(),
            success: function(response){
                var data_out = $.parseJSON(response.data_out) //要轉成json這個很重要
                $('#browser-table').DataTable({
                    "stateSave": true,
                    "data": data_out,
                    "columns": [
                        { data:'transcript', "name": "transcript",title:'transcript',
                        "render": function(data, type, row, meta){    
                            data = `<a href = 'https://wormbase.org/species/c_elegans/cds/${data}#06--10'>${data}</a>`;
                            return data;
                        }
                        },
                    { data:'wormbase_id',title:'Wormbase ID'},
                    { data:'type',title:'type'},
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