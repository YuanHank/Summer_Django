$(document).ready(function(){
    
    $('#submit').click(function(){
        $('#sequence-table').empty()
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type: 'POST',
            url: 'ajax/', 
            data: $('#ajax_form').serialize(),
            success: function(response){
                var data = response.table_list
                //alert(response.table_list[0].id)
                $('#sequence-table').DataTable({
                    "stateSave": true,
                    "data": data,
                    "columns": [
                    { data: 'id', "name": "id",title:'transcript',
                        "render": function(data, type, row, meta){    
                            
                            data = '<a href ="/web_data/output/' + data + '">' + data + '</a>';
                            return data;
                        }
                        },
                    { data: 'gene_type',title:'type'},
                    { data: 'length',title:'unspliced length'},
                    { data:'cds_length',title:'CDS length'},
                    {data:'protein_length',title:'protein length'}
                    ],
                    "bDestroy": true
                })
            },//回傳response
            error: function(){
                alert('Something error or check your input');
            },
        });

    });

});