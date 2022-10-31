$(document).ready(function(){
    $('#submit').on('click',function(){
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type:'Post',
            url:'/enrichment/ajax/',
            data: $('#ajax_form').serialize(),
            success: function(response){
                data = response.result_table
                $('#enrichment_table').DataTable({
                    "stateSave": true,
                    "data": data,
                    "columns": [
                    { data: 'Domain_id',title:'Domain_id'},
                    { data: 'P-value',title:'P-value'},
                    { data: 'FDR',title:'FDR'},
                    { data:'Bonferroni',title:'Bonferroni'},
                    { data:'A',title:'A'},
                    { data:'B',title:'B'},
                    { data:'C',title:'C'},
                    { data:'D',title:'D'},
                    { data:'Expect ratio',title:'Expect ratio'},
                    { data:'Obeserved ratio',title:'Obeserved ratio'},
                    ],
                    "bDestroy": true
                })
            },


            error: function(){
                alert('Something error or check your input');
            },


        })
    })

})