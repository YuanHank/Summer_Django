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


    var start_end_type=[]
    var tooltips 
    var rects 
    
    $('#sequence_name').on('click',function(){
        $('.tooltip2').empty()
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
                // set rect data dict/ where after '//' is the old way to set rect by for loop 
                for (var i=0;i<exon_intron_type.length;i++){
                    if (exon_intron_type[i] == 'five_prime_UTR')
                    {
                        start_end_type.push({start:Number(exon_intron_start[i]),end:Number(exon_intron_stop[i]),type:String(exon_intron_type[i]),color:'gray',x:Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1],width:(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]})
                        //rect =rect+ `<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:gray;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`;
                        
                    }
                    else if (exon_intron_type[i] == 'exon') {
                        if (i==1){
                            if (rect_color == 'yellow'){
                                start_end_type.push({start:Number(exon_intron_start[i]),end:Number(exon_intron_stop[i]),type:String(exon_intron_type[i]),color:'orange',x:(Number(exon_intron_stop[0])+1)*100/exon_intron_stop[exon_intron_type.length-1],width:(Number(exon_intron_stop[i])-Number(exon_intron_stop[i-1])+1)*100/exon_intron_stop[exon_intron_type.length-1]})
                                //rect += `<rect x="${(Number(exon_intron_stop[0])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_stop[i-1])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:orange;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`;
                                rect_color = 'orange'    
                                
                            }
                            else if (rect_color=='orange'){
                                start_end_type.push({start:Number(exon_intron_start[i]),end:Number(exon_intron_stop[i]),type:String(exon_intron_type[i]),color:'yellow',x:(Number(exon_intron_stop[0])+1)*100/exon_intron_stop[exon_intron_type.length-1],width:(Number(exon_intron_stop[i])-Number(exon_intron_stop[i-1])+1)*100/exon_intron_stop[exon_intron_type.length-1]})
                                //rect +=`<rect x="${(Number(exon_intron_stop[0])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_stop[i-1])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:yellow;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                                
                                
                                rect_color = 'yellow'
                            }
                        }
                        else if (i ==exon_intron_type.length-2){
                            if (rect_color == 'yellow'){
                                start_end_type.push({start:Number(exon_intron_start[i]),end:Number(exon_intron_stop[i]),type:String(exon_intron_type[i]),color:'orange',x:(Number(exon_intron_start[i]))*100/exon_intron_stop[exon_intron_type.length-1],width:(Number(exon_intron_start[i+1])-Number(exon_intron_start[i]))*100/exon_intron_stop[exon_intron_type.length-1]})
                                //rect += `<rect x="${(Number(exon_intron_start[i]))*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_start[i+1])-Number(exon_intron_start[i]))*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:orange;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron" />`;
                                rect_color = 'orange'    
                                
                            }
                            else if (rect_color=='orange'){
                                start_end_type.push({start:Number(exon_intron_start[i]),end:Number(exon_intron_stop[i]),type:String(exon_intron_type[i]),color:'yellow',x:((Number(exon_intron_start[i]))*100/exon_intron_stop[exon_intron_type.length-1]),width:(Number(exon_intron_start[i+1])-Number(exon_intron_start[i]))*100/exon_intron_stop[exon_intron_type.length-1]})
                                //rect +=`<rect x="${((Number(exon_intron_start[i]))*100/exon_intron_stop[exon_intron_type.length-1])}" y="10" width="${(Number(exon_intron_start[i+1])-Number(exon_intron_start[i]))*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:yellow;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                                rect_color = 'yellow'
                            }
                        }
                        else if(i!=1 & i!=exon_intron_type.length-2){
                            if (rect_color == 'yellow'){
                                start_end_type.push({start:Number(exon_intron_start[i]),end:Number(exon_intron_stop[i]),type:String(exon_intron_type[i]),color:'orange',x:Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1],width:(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]})
                               // rect+=`<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:orange;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                                rect_color = 'orange';
                            }else if (rect_color=='orange'){
                                start_end_type.push({start:Number(exon_intron_start[i]),end:Number(exon_intron_stop[i]),type:String(exon_intron_type[i]),color:'yellow',x:Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1],width:(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]})
                               // rect+=`<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:yellow;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                                rect_color= 'yellow';  
                             }
                        };
                    } 
                    else if (exon_intron_type[i] == 'intron') {
                        start_end_type.push({start:Number(exon_intron_start[i]),end:Number(exon_intron_stop[i]),type:String(exon_intron_type[i]),color:'white',x:Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1],width:(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]})
                       // rect+=`<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:white;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                     
                    }
                    else if (exon_intron_type[i] == 'three_prime_UTR') {
                        start_end_type.push({start:Number(exon_intron_start[i]),end:Number(exon_intron_stop[i]),type:String(exon_intron_type[i]),color:'gray',x:Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1],width:(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]})
                        //rect += `<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:gray;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                    }
                };   
                //$('#rect-unspliced').append(`<svg viewbox="0,9.5,110,3" preserveAspectRatio="xMinYMin meet"> ${rect}</svg>`) //the old way to append rect by loop

                // by using d3 append rect and set hover by toolips
                d3.select('#rect-unspliced').style('position', 'relative')
                rects = d3.select('#rect-unspliced')
                .append('svg')
                .attr('viewBox',"0,9.5,110,3")
                .attr('preserveAspectRation',"xMinYMin meet")
                .selectAll('rect')
                .data(start_end_type)
                .enter()
                .append('rect')
                .attr('x', d => d.x)
                .attr('width', d => d.width)
                .attr('y',"10")
                .attr('fill', d => d.color)
                .attr('start',d =>d.start)
                .attr('height',"2")
                .style('cursor', 'pointer')
                .attr("id",'rects');

                tooltips = d3.select("#rect-unspliced")
                .append("div")
                .style("opacity", 0)
                .style('position', 'absolute')
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .attr('id','tooltips')
            
                d3.selectAll('#rects').on('mouseover', function(){
                tooltips.style("opacity", 1) // 顯示tooltip
                })
                .on('mousemove', function(d){
                let pt = d3.pointer(this) // 抓圓點位置
                tooltips.style("opacity", 1)
                .style('left', pt[0]+30+'px') // 設定tooltips位置
                .style('top', pt[1]+'px')
                .html(`Type:${d.target.__data__.type}<br>Start:${d.target.__data__.start}<br>End:${d.target.__data__.end}`) // 抓到綁定在DOM元素的資料                
                })    
                .on('mouseleave', function(){ //設定滑鼠離開時tooltips隱藏
             tooltips.style("opacity", 0)  
                });
                            
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

    //d3 test


    /*
    $('#rects').on('mouseover', function(){
    tooltips.style("opacity", 1) // 顯示tooltip
    })
    .on('mousemove', function(d){
    let pt = d3.pointer(event, this) // 抓圓點位置
    $('#tooltips').style("opacity", 1)
    .style('left', pt[0]+30+'px') // 設定tooltips位置
    .style('top', pt[1]+'px')
    .html(`start${d.target._data_.start}`) // 抓到綁定在DOM元素的資料
    })   */   

    
    /*
    //
    const tooltip = d3.select(`#rect-unspliced`)
    .append("div")
    .style("position", "absolute")
    .style("visibility", "visible") // 一開始tooltips是隱藏的
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .html(`<p>type:${exon_intron_type[i]}</p><p>start:${exon_intron_start[i]}</p>
        <p>end:${exon_intron_stop[i]}</p><p>length:${Number(exon_intron_stop[i])-Number(exon_intron_start[i])}</p>`
        ); */
});

