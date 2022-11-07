$(document).ready(function(){
    $('#submit').on('click',function(){
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type:'Post',
            url:'/enrichment/ajax/',
            data: $('#ajax_form').serialize(),
            success: function(response){
                data = response.result_table
                p_value = response.p_value
                input_data = response.input_data
                if (p_value == 'FDR'){
                $('#enrichment_table').DataTable({
                    "stateSave": true,
                    "data": data,
                    "columns": [
                    { data: 'Domain_id',title:'Domain_id'},
                    { data: 'FDR',title:'FDR'},
                    { data:'A',title:'A'},
                    { data:'B',title:'B'},
                    { data:'C',title:'C'},
                    { data:'D',title:'D'},
                    { data:'Expect ratio',title:'Expect ratio(C/D)'},
                    { data:'Obeserved ratio',title:'Obeserved ratio(A/B)'},
                    
                    { data:'Domain_id',title:'compare', 
                        render: function (data, type, row) {
                        return `<a href = "/enrichment/${data}_${input_data}" id ="enrichment_check"><button> compare </button></a>` // 這邊是加連結
                      }
                    },
                    ],
                    "bDestroy": true
                    })

                }
                else if (p_value =='No adjustment'){
                    $('#enrichment_table').DataTable({
                        "stateSave": true,
                        "data": data,
                        "columns": [
                        { data: 'Domain_id',title:'Domain_id'},
                        { data: 'P-value',title:'P-value'},
                        { data:'A',title:'A'},
                        { data:'B',title:'B'},
                        { data:'C',title:'C'},
                        { data:'D',title:'D'},
                        { data:'Expect ratio',title:'Expect ratio(C/D)'},
                        { data:'Obeserved ratio',title:'Obeserved ratio(A/B)'},
                        
                        { data:'Domain_id',title:'compare', 
                        render: function (data, type, row) {
                            return `<a href = "/enrichment/${data}_${input_data}" id ="enrichment_check"><button> compare </button></a>` // 這邊是加連結
                            }
                        },
                        ],
                        "bDestroy": true
                    })
                }
                else if (p_value =='Bonferroni'){
                    $('#enrichment_table').DataTable({
                        "stateSave": true,
                        "data": data,
                        "columns": [
                        { data:'Domain_id',title:'Domain_id',},
                        { data:'Bonferroni',title:'Bonferroni'},
                        { data:'A',title:'A'},
                        { data:'B',title:'B'},
                        { data:'C',title:'C'},
                        { data:'D',title:'D'},
                        { data:'Expect ratio',title:'Expect ratio(C/D)'},
                        { data:'Obeserved ratio',title:'Obeserved ratio(A/B)'},
                        
                        { data:'Domain_id',title:'compare', 
                        render: function (data, type, row) {
                        return `<a href = "/enrichment/${data}_${input_data}" id ="enrichment_check"><button> compare </button></a>` // 這邊是加連結
                            }
                        },   
                        ],
                        "bDestroy": true
                    })

                }

            },
            error: function(){
                alert('Something error or check your input');
            },


        })
    })

    /*
    $('#enrichment_check').on('click',function(){

        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type:'Post',
            url: 'enrichment_check/',
            data: $('#ajax_form').serialize(),
            success: function(response){
                $('#compare_table').DataTable({
                    "stateSave": true,
                    "data": data,
                    "columns": [
                    { data:'ID',title:'Name',},
                    { data:'input',title:'input'},
                    { data:'Domain',title:'Domain'},
                    ],
                    "bDestroy": true
                })                
            },
            error: function(){
                alert('Something error or check your input');
            },


        })
    })*/
})