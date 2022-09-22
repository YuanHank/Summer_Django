$(document).ready(function(){
 
    $("#sequence_name").on('click', function(){
        $("#Sequence").toggle("slow");
        $("#title-num").toggle("slow");
        $('#rect-unspliced').toggle("slow");
        });
    $("#exon").on('click', function(){
        $("#exon_table").toggle("slow");
        });
    $("#exon_intron").on('click', function(){
        $("#exon_intron_table").toggle("slow");
        });
    $("#protein_sequence").on('click', function(){
        $("#Protein").toggle("slow");
        $('#protein-title').toggle('slow');
        });        



    $('#sequence_name').on('click',function(){
        $('#Sequence').empty()
        $('#title-num').empty()
        $('#rect-unspliced').empty()
        var fired_button = document.URL; //用這個可以得到現在的URL網址
        transcript = fired_button.replace('http://127.0.0.1:8000/web_data/output/','');
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type: 'POST',
            url: 'crawler/', 
            data: {'transcript':transcript},
            success: function(response){
                title =response.title;
                exon_intron_type = response.exon_intron_type;
                exon_intron_start = response.exon_intron_start;
                exon_intron_stop = response.exon_intron_stop;
                sequence_fin = response.sequence_fin;
                /*----------------------------------------------------------------------------- */
                exon_intron_type = exon_intron_type.replace('[','');
                exon_intron_type = exon_intron_type.replace(']','');
                exon_intron_type = exon_intron_type.replace(/"/g,'');
                exon_intron_type = exon_intron_type.split(',');
                /*----------------------------------------------------------------------------- */
                exon_intron_start = exon_intron_start.replace('[','');
                exon_intron_start = exon_intron_start.replace(']','');
                exon_intron_start = exon_intron_start.split(',');                
                /*----------------------------------------------------------------------------- */
                exon_intron_stop = exon_intron_stop.replace('[','');
                exon_intron_stop = exon_intron_stop.replace(']','');
                exon_intron_stop = exon_intron_stop.split(',');
                /*----------------------------------------------------------------------------- */
                //sequence_fin = sequence_fin.split('');
                //alert(sequence_fin)
                //for (var i=0;i<sequence_fin.length;i++){
                var color = 'orange';
                var rect_color='orange';
                var rect =''
                var start_end_type=[]
                //set axis
                /*
                for (var i=0;i<exon_intron_type.length;i++){
                    start_end_type.push({x:exon_intron_start[i],y:exon_intron_stop[i],z:exon_intron_type[i]})
                };
                const xScale = d3.scaleLinear()
                 .domain([0, d3.max(xData)])
                 .range([10, 290]);
                const xAxis = d3
                 .axisBottom(xScale)
                 
                d3.select('.rect-unspliced').append("g").call(xAxis);
                */
                // set numbers
                for (var i=0;i<title.length;i++){
                    $("#title-num").append(`<span class='g5'>${title[i]}</span><br>`)
                };
                //set sequences
                for (var i=0;i<exon_intron_type.length;i++){
                    if (exon_intron_type[i] == 'five_prime_UTR')
                    {
                        for (var j=exon_intron_start[i]-1;j<exon_intron_stop[i];j++){
                            $('#Sequence').append(`<span class="g1" style="background-color: grey;">${sequence_fin[j]}</span>`); 
                        };
                    }
                    else if (exon_intron_type[i] == 'exon') {
                        if (color == 'yellow'){
                        for (var j=exon_intron_start[i]-1;j<exon_intron_stop[i];j++){
                            if (sequence_fin[j] == sequence_fin[j].toUpperCase()){
                                    $('#Sequence').append(`<span class="g2" style="background-color: orange;">${sequence_fin[j]}</span>`);    
                                };

                            };     
                        color = 'orange';
                        }else if (color =='orange'){
                            for (var j=exon_intron_start[i]-1;j<exon_intron_stop[i];j++){
                                if (sequence_fin[j] == sequence_fin[j].toUpperCase()){
                                        $('#Sequence').append(`<span class="g2" style="background-color: yellow;">${sequence_fin[j]}</span>`);    
                                    };
    
                                }; 
                                color = 'yellow';  
                        };
                    } 
                    else if (exon_intron_type[i] == 'intron') {
                        for (var j=exon_intron_start[i]-1;j<exon_intron_stop[i];j++){
                            $('#Sequence').append(`<span class="g3" >${sequence_fin[j]}</span>`); 
                        };
                     
                    }
                    else if (exon_intron_type[i] == 'three_prime_UTR') {
                        for (var j=exon_intron_start[i]-1;j<exon_intron_stop[i];j++){
                            $('#Sequence').append(`<span class = 'g2' style='background-color: grey;'>${sequence_fin[j]}</span>`); 
                        };
                    }
                };   
                // set rect pic
                for (var i=0;i<exon_intron_type.length;i++){
                    if (exon_intron_type[i] == 'five_prime_UTR')
                    {
                        rect =rect+ `<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:gray" id ="exon_intron_${i}" class="rect_exon_intron"/>`;
                        //rect = rect+` <rect x="1" y="10" width="20" height="10" style ="fill:gray"/>`
                    }
                    else if (exon_intron_type[i] == 'exon') {
                        if (i==1){
                            if (rect_color == 'yellow'){
                                rect += `<rect x="${(Number(exon_intron_stop[0])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_stop[i-1])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:orange" id ="exon_intron_${i}" class="rect_exon_intron"/>`;
                                rect_color = 'orange'    
                                //rect = rect+` <rect x="10" y="10" width="20" height="10" style ="fill:orange"/>`
                            }
                            else if (rect_color=='orange'){
                                rect +=`<rect x="${(Number(exon_intron_stop[0])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_stop[i-1])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:yellow" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                                //rect = rect+` <rect x="10" y="10" width="20" height="10" style ="fill:yellow"/>`
                                
                                rect_color = 'yellow'
                            }
                        }
                        else if (i ==exon_intron_type.length-2){
                            if (rect_color == 'yellow'){
                                rect += `<rect x="${(Number(exon_intron_start[i]))*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_start[i+1])-Number(exon_intron_start[i]))*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:orange" id ="exon_intron_${i}" class="rect_exon_intron" />`;
                                rect_color = 'orange'    
                                //rect = rect+` <rect x="10" y="10" width="20" height="10" style ="fill:orange"/>`
                            }
                            else if (rect_color=='orange'){
                                rect +=`<rect x="${((Number(exon_intron_start[i]))*100/exon_intron_stop[exon_intron_type.length-1])}" y="10" width="${(Number(exon_intron_start[i+1])-Number(exon_intron_start[i]))*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:yellow" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                                //rect = rect+` <rect x="10" y="10" width="20" height="10" style ="fill:yellow"/>`
                                
                                rect_color = 'yellow'
                            }
                        }
                        else if(i!=1 & i!=exon_intron_type.length-2){
                            if (rect_color == 'yellow'){
                                rect+=`<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:orange" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                                rect_color = 'orange';
                            }else if (rect_color=='orange'){
                                rect+=`<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:yellow" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                                rect_color= 'yellow';  
                             }
                        };
                    } 
                    else if (exon_intron_type[i] == 'intron') {
                        rect+=`<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:white" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                     
                    }
                    else if (exon_intron_type[i] == 'three_prime_UTR') {
                        rect += `<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:gray" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                    }
                };   
                $('#rect-unspliced').append(`<svg viewbox="0,9.5,110,3" preserveAspectRatio="xMinYMin meet"> ${rect}</svg>`)
                for (var i=0;i<exon_intron_type.length;i++){
                    const tooltip = d3.select(`#exon_intron_${i}`)
                    .append("div")
                    .attr("id","rect_value")
                    .style("position", "absolute")
                    .style("visibility", "hidden") // 一開始tooltips是隱藏的
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "1px")
                    .style("border-radius", "5px")
                    .style("padding", "10px")
                    .html(`<p>type:${exon_intron_type[i]}</p><p>start:${exon_intron_start[i]}</p>
                        <p>end:${exon_intron_stop[i]}</p><p>length:${Number(exon_intron_stop[i])-Number(exon_intron_start[i])}</p>`
                        );                
                };
            },
            //alert(rect)
            //回傳response
            error: function(){
                alert('Something error');
            },
        });
    });

    $('#protein_sequence').on('click',function(){
        var fired_button = document.URL; //用這個可以得到現在的URL網址
        transcript = fired_button.replace('http://127.0.0.1:8000/web_data/output/','');
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type: 'POST',
            url: 'crawler/', 
            data: {'transcript':transcript},
            success: function(response){
                protein_title = response.protein_title
                protein = response.protein
                protein = protein.split('')
                //alert(protein_title)
                $('#Protein').empty()
                $('#protein-title').empty()
                
                for (var i=0;i<protein_title.length;i++){
                    $('#protein-title').append(`<span class='g6' >${protein_title[i]}</span><br>`)
                }
                for (var i=0;i<protein.length;i++){
                $('#Protein').append(`<span class="g7">${protein[i]}</span>`)
                }
            },//回傳response
            error: function(){
                alert('Something error');
            },
        });
    });


});

