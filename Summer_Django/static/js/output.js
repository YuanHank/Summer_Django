$(document).ready(function(){
 
    $("#sequence_name").on('click', function(){
        $("#Sequence").toggle("slow");
        $("#title-num").toggle("slow");
        $('#rect-unspliced').toggle("slow");
        $("#exon_intron_table").toggle("slow");
        });
    $("#exon").on('click', function(){
        $('#Sequence_spliced').toggle("slow");
        $('#title-num_spliced').toggle("slow");
        $("#rect-spliced").toggle("slow");
        $("#exon_table").toggle("slow");
        });
    $("#protein_sequence").on('click', function(){
        $("#Protein").toggle("slow");
        $('#protein-title').toggle('slow');
        });        


    var start_end_type=[]
    var start_end_type_UTR=[]
    var tooltips 
    var start_end_type_spliced=[]
    var start_end_type_spliced_UTR=[]
    var tooltips2
    
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

                //alert(sequence_fin)

                var color = 'orange';
                var rect_color='orange';
                //var rect =''
                // set numbers
                for (var i=0;i<title.length;i++){
                    $("#title-num").append(`<span class='g5'>${title[i]}</span><br>`)
                };
                //set sequences
                for (var i=0;i<exon_intron_type.length;i++){
                    if (exon_intron_type[i] == 'five_prime_UTR')
                    {
                        for (var j=exon_intron_start[i]-1;j<exon_intron_stop[i];j++){
                            $('#Sequence').append(`<span class="g1" style="background-color: gray;">${sequence_fin[j]}</span>`); 
                        };
                    }
                    else if (exon_intron_type[i] == 'exon') {
                        if (color == 'Khaki'){
                        for (var j=exon_intron_start[i]-1;j<exon_intron_stop[i];j++){
                            if (sequence_fin[j] == sequence_fin[j].toUpperCase()){
                                    $('#Sequence').append(`<span class="g2" style="background-color: orange;">${sequence_fin[j]}</span>`);    
                                };

                            };     
                        color = 'orange';
                        }else if (color =='orange'){
                            for (var j=exon_intron_start[i]-1;j<exon_intron_stop[i];j++){
                                if (sequence_fin[j] == sequence_fin[j].toUpperCase()){
                                        $('#Sequence').append(`<span class="g2" style="background-color: Khaki;">${sequence_fin[j]}</span>`);    
                                    };
    
                                }; 
                                color = 'Khaki';  
                        };
                    } 
                    else if (exon_intron_type[i] == 'intron') {
                        for (var j=exon_intron_start[i]-1;j<exon_intron_stop[i];j++){
                            $('#Sequence').append(`<span class="g3" >${sequence_fin[j]}</span>`); 
                        };
                     
                    }
                    else if (exon_intron_type[i] == 'three_prime_UTR') {
                        for (var j=exon_intron_start[i]-1;j<exon_intron_stop[i];j++){
                            $('#Sequence').append(`<span class = 'g2' style='background-color: gray;'>${sequence_fin[j]}</span>`); 
                        };
                    }
                };   
                // set rect data dict/ where after '//' is the old way to set rect by for loop 
                for (var i=0;i<exon_intron_type.length;i++){
                    if (exon_intron_type[i] == 'five_prime_UTR')
                    {
                        start_end_type_UTR.push({start:Number(exon_intron_start[i]),end:Number(exon_intron_stop[i]),type:String(exon_intron_type[i]),color:'gray',x:Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1],width:(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1],height:1.25,y:10.35})
                        //rect =rect+ `<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:gray;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`;
                        
                    }
                    else if (exon_intron_type[i] == 'exon') {
                            if (rect_color == 'Khaki'){
                                start_end_type.push({start:Number(exon_intron_start[i]),end:Number(exon_intron_stop[i]),type:String(exon_intron_type[i]),color:'orange',x:Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1],width:(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1],height:2,y:10})
                               // rect+=`<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:orange;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                                rect_color = 'orange';
                            }else if (rect_color=='orange'){
                                start_end_type.push({start:Number(exon_intron_start[i]),end:Number(exon_intron_stop[i]),type:String(exon_intron_type[i]),color:'Khaki',x:Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1],width:(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1],height:2,y:10})
                               // rect+=`<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:yellow;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                                rect_color= 'Khaki';  
                             }
                    } 
                    else if (exon_intron_type[i] == 'intron') {
                        start_end_type.push({start:Number(exon_intron_start[i]),end:Number(exon_intron_stop[i]),type:String(exon_intron_type[i]),color:'green',x:Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1],width:(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1],height:0.5,y:10.75})
                       // rect+=`<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:white;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                     
                    }
                    else if (exon_intron_type[i] == 'three_prime_UTR') {
                        start_end_type_UTR.push({start:Number(exon_intron_start[i]),end:Number(exon_intron_stop[i]),type:String(exon_intron_type[i]),color:'gray',x:Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1],width:(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1],height:1.25,y:10.35})
                        //rect += `<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:gray;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                    }
                };   
                //$('#rect-unspliced').append(`<svg viewbox="0,9.5,110,3" preserveAspectRatio="xMinYMin meet"> ${rect}</svg>`) //the old way to append rect by loop
                start_end_type = start_end_type.concat(start_end_type_UTR)
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
                .attr('y',d=>d.y)
                .attr('fill', d => d.color)
                .attr('start',d =>d.start)
                .attr('height',d =>d.height)
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

    $('#exon').on('click',function(){
        $('.tooltip2').empty()
        $('#Sequence_spliced').empty()
        $('#title-num_spliced').empty()
        $('#rect-spliced').empty()
        var fired_button = document.URL; //用這個可以得到現在的URL網址
        transcript = fired_button.replace('http://127.0.0.1:8000/web_data/output/','');
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type: 'POST',
            url: 'crawler/', 
            data: {'transcript':transcript},
            success: function(response){
                title =response.title_spliced;
                exon_type = response.exon_type;
                exon_start = response.exon_start;
                exon_stop = response.exon_stop;
                sequence_fin = response.spliced_fin;
                /*----------------------------------------------------------------------------- */
                exon_type = exon_type.replace('[','');
                exon_type = exon_type.replace(']','');
                exon_type = exon_type.replace(/"/g,'');
                exon_type = exon_type.split(',');
                /*----------------------------------------------------------------------------- */
                exon_start = exon_start.replace('[','');
                exon_start = exon_start.replace(']','');
                exon_start = exon_start.split(',');                
                /*----------------------------------------------------------------------------- */
                exon_stop = exon_stop.replace('[','');
                exon_stop = exon_stop.replace(']','');
                exon_stop = exon_stop.split(',');
                /*----------------------------------------------------------------------------- */
                //sequence_fin = sequence_fin.split('');
                //alert(sequence_fin)
                //for (var i=0;i<sequence_fin.length;i++){
                var color = 'orange';
                var rect_color='orange';
                
                // set numbers
                for (var i=0;i<title.length;i++){
                    $("#title-num_spliced").append(`<span class='g5'>${title[i]}</span><br>`)
                };
                //set sequences
                for (var i=0;i<exon_type.length;i++){
                    if (exon_type[i] == 'five_prime_UTR')
                    {
                        for (var j=exon_start[i]-1;j<exon_stop[i];j++){
                            $('#Sequence_spliced').append(`<span class="g1" style="background-color: gray;">${sequence_fin[j]}</span>`); 
                        };
                    }
                    else if (exon_type[i] == 'exon') {
                        if (color == 'Khaki'){
                        for (var j=exon_start[i]-1;j<exon_stop[i];j++){
                            if (sequence_fin[j] == sequence_fin[j].toUpperCase()){
                                    $('#Sequence_spliced').append(`<span class="g2" style="background-color: orange;">${sequence_fin[j]}</span>`);    
                                };
                            };     
                        color = 'orange';
                        }else if (color =='orange'){
                            for (var j=exon_start[i]-1;j<exon_stop[i];j++){
                                if (sequence_fin[j] == sequence_fin[j].toUpperCase()){
                                        $('#Sequence_spliced').append(`<span class="g2" style="background-color: Khaki;">${sequence_fin[j]}</span>`);    
                                    };
    
                                }; 
                                color = 'Khaki';  
                        };
                    } 
                    else if (exon_type[i] == 'intron') {
                        for (var j=exon_start[i]-1;j<exon_stop[i];j++){
                            $('#Sequence_spliced').append(`<span class="g3" >${sequence_fin[j]}</span>`); 
                        };
                     
                    }
                    else if (exon_type[i] == 'three_prime_UTR') {
                        for (var j=exon_start[i]-1;j<exon_stop[i];j++){
                            $('#Sequence_spliced').append(`<span class = 'g2' style='background-color: gray;'>${sequence_fin[j]}</span>`); 
                        };
                    }
                };   
                // set rect data dict/ where after '//' is the old way to set rect by for loop (spliced)
                for (var i=0;i<exon_type.length;i++){
                    if (exon_type[i] == 'five_prime_UTR')
                    {
                        start_end_type_spliced_UTR.push({start:Number(exon_start[i]),end:Number(exon_stop[i]),type:String(exon_type[i]),color:'gray',x:Number(exon_start[i])*100/exon_stop[exon_type.length-1],width:(Number(exon_stop[i])-Number(exon_start[i])+1)*100/exon_stop[exon_type.length-1],height:1.25,y:10.35})
                        //rect =rect+ `<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:gray;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`;
                        
                    }
                    else if (exon_type[i] == 'exon') {
                        if (rect_color == 'Khaki'){
                            start_end_type_spliced.push({start:Number(exon_start[i]),end:Number(exon_stop[i]),type:String(exon_type[i]),color:'orange',x:Number(exon_start[i])*100/exon_stop[exon_type.length-1],width:(Number(exon_stop[i])-Number(exon_start[i])+1)*100/exon_stop[exon_type.length-1],height:2,y:10})
                            // rect+=`<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:orange;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                            rect_color = 'orange';
                        }else if (rect_color=='orange'){
                            start_end_type_spliced.push({start:Number(exon_start[i]),end:Number(exon_stop[i]),type:String(exon_type[i]),color:'Khaki',x:Number(exon_start[i])*100/exon_stop[exon_type.length-1],width:(Number(exon_stop[i])-Number(exon_start[i])+1)*100/exon_stop[exon_type.length-1],height:2,y:10})
                            // rect+=`<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:yellow;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                            rect_color= 'Khaki';  
                            }
                    } 
                    else if (exon_type[i] == 'intron') {
                        start_end_type_spliced.push({start:Number(exon_start[i]),end:Number(exon_stop[i]),type:String(exon_type[i]),color:'green',x:Number(exon_start[i])*100/exon_stop[exon_type.length-1],width:(Number(exon_stop[i])-Number(exon_start[i])+1)*100/exon_stop[exon_type.length-1],height:0.5,y:10.75})
                       // rect+=`<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:white;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                     
                    }
                    else if (exon_type[i] == 'three_prime_UTR') {
                        start_end_type_spliced_UTR.push({start:Number(exon_start[i]),end:Number(exon_stop[i]),type:String(exon_type[i]),color:'gray',x:Number(exon_start[i])*100/exon_stop[exon_type.length-1],width:(Number(exon_stop[i])-Number(exon_start[i])+1)*100/exon_stop[exon_type.length-1],height:1.25,y:10.35})
                        //rect += `<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:gray;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                    }
                };   
                //$('#rect-unspliced').append(`<svg viewbox="0,9.5,110,3" preserveAspectRatio="xMinYMin meet"> ${rect}</svg>`) //the old way to append rect by loop
                start_end_type_spliced =start_end_type_spliced.concat(start_end_type_spliced_UTR)
                // by using d3 append rect and set hover by toolips
                d3.select('#rect-spliced').style('position', 'relative')
                rects = d3.select('#rect-spliced')
                .append('svg')
                .attr('viewBox',"0,9.5,110,3")
                .attr('preserveAspectRation',"xMinYMin meet")
                .selectAll('spliced')
                .data(start_end_type_spliced)
                .enter()
                .append('rect')
                .attr('x', d => d.x)
                .attr('width', d => d.width)
                .attr('y',d=>d.y)
                .attr('fill', d => d.color)
                .attr('height',d =>d.height)
                .style('cursor', 'pointer')
                .attr("id",'rects_spliced');

                tooltips2 = d3.select("#rect-spliced")
                .append("div")
                .style("opacity", 0)
                .style('position', 'absolute')
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .attr('id','tooltips2')
                
                d3.selectAll('#rects_spliced').on('mouseover', function(){
                tooltips2.style("opacity", 1) // 顯示tooltip
                })
                .on('mousemove', function(d){
                let pt = d3.pointer(this) // 抓圓點位置
                tooltips2.style("opacity", 1)
                .style('left', pt[0]+30+'px') // 設定tooltips位置
                .style('top', pt[1]+'px')
                .html(`Type:${d.target.__data__.type}<br>Start:${d.target.__data__.start}<br>End:${d.target.__data__.end}`) // 抓到綁定在DOM元素的資料                
                })    
                .on('mouseleave', function(){ //設定滑鼠離開時tooltips隱藏
             tooltips2.style("opacity", 0)  
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

 
});

