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
                            data = `<a href = "/web_data/output/${data}">${data}</a>`;
                            return data;
                        }
                        },

                    { data:'wormbase_id',title:'Wormbase ID'},
                    { data:'type',title:'type'},
                    { data:'transcript', "name": "transcript",title:'site',
                        "render": function(data, type, row, meta){    
                            data = `<a href = "http://127.0.0.1:8000/pirscan/${data}"><button class="site">site</button></a>`;
                            return data;
                        }
                        },
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