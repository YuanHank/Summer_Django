$(document).ready(function(){

    $('#submit').click(function(){
        
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type: 'POST',
            url: 'transcriptgene__ajax/', 
            data: $('#ajax_form').serialize(),
            success: function(response){
                geneid = response.Gene_ID
                var data = response.table_list
                var transcript_data = response.transcript_table
                input_type =response.input_type 
                if (geneid != 'error')
                {
                    //alert(response.table_list[0].id)
                    $('#sequence-table').DataTable({
                        "stateSave": true,
                        "searching": false,
                        "paging": false,
                        "info": false,
                        "data": transcript_data,
                        "columns": [
                        { data: 'transcript', "name": "transcript",title:'transcript',
                            "render": function(data, type, row, meta){    
                                data = `<a href ="/web_data/output/${data}"> ${data} </a>`;
                                return data;
                            }
                            },
                        { data: 'transcript_type',title:'transcript type'},
                        { data: 'transcript', "name": "transcript",title:'site',
                        "render": function(data, type, row, meta){    
                            data = `<a href = 'http://127.0.0.1:8000/pirscan/${data}'>
                            <button type="button">site</button> </a>`;
                            return data;
                        }
                        },
                        ],
                        "bDestroy": true,
                    })
                    $('#name_table').DataTable({
                        "stateSave": true,
                        "searching": false,
                        "paging": false,
                        "info": false,
                        "data": data,
                        "columns": [
                        { data: 'Wormbase_ID',title:'Wormbase ID'},
                        { data: 'Gene_Sequence_Name',title:'Gene Sequence Name'},
                        { data: 'Gene_Name',title:'Gene Name'},
                        { data:'Other_Name',title:'Other Name'},
                        ],
                        "bDestroy": true
                    })
                    if (input_type =='transcript'){
                        var regex = new RegExp( geneid, 'g' );

                        $(document).ready( function () {
                            var table = $('#sequence-table').DataTable({
                              "createdRow": function( row, data, dataIndex ) {
                                       if ( String(data[0]).search(regex) != -1 ) {        
                                   $(row).addClass('hightlight');
                                   //因為這邊的data是html形式，因此轉成string並用regex查找是否有該transcript出現在裡面，決定要附加hightlight在那一個row
                                } 
                              },
                              "searching": false,
                              "paging": false,
                              "info": false,
                              "bDestroy": true,
                            });
                          } );
                    }
                    else if (input_type =='ID'){
                        $(document).ready( function () {
                            var table = $('#name_table').DataTable({
                              "createdRow": function( row, data, dataIndex ) {
                                       if ( data[0] == geneid ) {        
                                   $(row).addClass('hightlight');
                                //這邊的data為單純string，因此可簡單使傭==查找資料是否在內，決定要附加hightlight在那一個row
                                } 
                              },
                              "searching": false,
                              "paging": false,
                              "info": false,
                              "bDestroy": true,
                            });
                          } );
                    }
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