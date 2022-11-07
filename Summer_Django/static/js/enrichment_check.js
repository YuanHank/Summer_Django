$(document).ready(function(){
    var url = document.URL
    url = url.replace('http://127.0.0.1:8000/enrichment/','')
    var domain = url.split('_')
    var given = domain[1].split(',')
    //alert(input_list)
    $.ajax({
        headers: { 'X-CSRFToken': csrf_token },
        type:'Post',
        url: '/enrichment/check/',
        data: {'url':url},
        success: function(response){
            data = response.result
            input_len = response.input_len
            domain_len = response.domain_len
            $('#compare_table').DataTable({
                "stateSave": true,
                "data": data,
                "columns": [
                { data:'ID',title:'Name',},
                { data:'input',title:`input(${input_len})`},
                { data:'domain',title:`Domain(${domain_len})`},
                ],
                "bDestroy": true
            })                
        },
        error: function(){
            alert('Something error or check your input');
        },


    })
})
