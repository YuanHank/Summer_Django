$(document).ready(function(){
    
    $('#submit').click(function(){
        
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type: 'POST',
            url: 'duplicate_check_ajax/', 
            data: $('#ajax_form').serialize(),
            success: function(response){
                geneid = response.Gene_ID
                var data = response.table_list
                if (geneid != 'error')
                {
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
                }
                else
                {
                    alert('please insert the value with single Wormbase Gene ID or check your input')
                }
            },//回傳response
            error: function(){
                alert('Something error');
            },
        });

    });

});