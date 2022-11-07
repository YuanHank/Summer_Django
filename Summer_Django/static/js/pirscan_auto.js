$(document).ready(function(){
        var url = document.URL
        var start_end_type_spliced=[]
        var start_end_type_spliced_UTR=[]
        url = url.replace('http://127.0.0.1:8000/pirscan/','')
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type: 'POST',
            url: '/pirscan/pirscan_ajax/', 
            data: 
            {
                'gene_id':url
            },
            success: function(response){
                var data = response.total_json_list
                length = response.length
                d3_y = response.y // for pirscan
                d3_y_2 = response.y_2 // for clash
                var clash = response.clash
                var g22 = response.g22
                max_evenly_rc = response.max_evenly_rc
                exon_start = response.exon_start;
                exon_stop = response.exon_stop;
                exon_type = response.exon_type;
                if (data == 'none'){
                    //alert('not availiable CDS or wrong input')
                    $('#table').html("<span> not availiable CDS or wrong input </span>")
                }
                else{
                    //d3 for spliced
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
                    var color = 'orange';
                    var rect_color='orange';
                    for (var i=0;i<exon_type.length;i++){
                        if (exon_type[i] == 'five_prime_UTR')
                        {
                            start_end_type_spliced_UTR.push({start:Number(exon_start[i]),end:Number(exon_stop[i]),type:String(exon_type[i]),color:'gray',x:Number(exon_start[i])*100/exon_stop[exon_type.length-1],width:(Number(exon_stop[i])-Number(exon_start[i])+1)*100/exon_stop[exon_type.length-1],height:1.25,y:0.5})
                            //rect =rect+ `<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:gray;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`;
                            
                        }
                        else if (exon_type[i] == 'exon') {
                            if (rect_color == 'Khaki'){
                                start_end_type_spliced.push({start:Number(exon_start[i]),end:Number(exon_stop[i]),type:String(exon_type[i]),color:'orange',x:Number(exon_start[i])*100/exon_stop[exon_type.length-1],width:(Number(exon_stop[i])-Number(exon_start[i])+1)*100/exon_stop[exon_type.length-1],height:2,y:0})
                                // rect+=`<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:orange;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                                rect_color = 'orange';
                            }else if (rect_color=='orange'){
                                start_end_type_spliced.push({start:Number(exon_start[i]),end:Number(exon_stop[i]),type:String(exon_type[i]),color:'Khaki',x:Number(exon_start[i])*100/exon_stop[exon_type.length-1],width:(Number(exon_stop[i])-Number(exon_start[i])+1)*100/exon_stop[exon_type.length-1],height:2,y:0})
                                // rect+=`<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:yellow;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                                rect_color= 'Khaki';  
                                }
                        } 
                        else if (exon_type[i] == 'intron') {
                            start_end_type_spliced.push({start:Number(exon_start[i]),end:Number(exon_stop[i]),type:String(exon_type[i]),color:'green',x:Number(exon_start[i])*100/exon_stop[exon_type.length-1],width:(Number(exon_stop[i])-Number(exon_start[i])+1)*100/exon_stop[exon_type.length-1],height:0.5,y:0})
                           // rect+=`<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:white;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                         
                        }
                        else if (exon_type[i] == 'three_prime_UTR') {
                            start_end_type_spliced_UTR.push({start:Number(exon_start[i]),end:Number(exon_stop[i]),type:String(exon_type[i]),color:'gray',x:Number(exon_start[i])*100/exon_stop[exon_type.length-1],width:(Number(exon_stop[i])-Number(exon_start[i])+1)*100/exon_stop[exon_type.length-1],height:1.25,y:0.5})
                            //rect += `<rect x="${Number(exon_intron_start[i])*100/exon_intron_stop[exon_intron_type.length-1]}" y="10" width="${(Number(exon_intron_stop[i])-Number(exon_intron_start[i])+1)*100/exon_intron_stop[exon_intron_type.length-1]}" height="2" style="fill:gray;cursor:pointer" id ="exon_intron_${i}" class="rect_exon_intron"/>`
                        }
                    };   
                    //$('#rect-unspliced').append(`<svg viewbox="0,9.5,110,3" preserveAspectRatio="xMinYMin meet"> ${rect}</svg>`) //the old way to append rect by loop
                    start_end_type_spliced =start_end_type_spliced.concat(start_end_type_spliced_UTR)
                    // by using d3 append rect and set hover by toolips
                    // for sequence 
                    d3.select('#sequence').style('position', 'relative')
                    rects = d3.select('#sequence')
                    .append('svg')
                    .attr("id","sequence_svg")
                    .attr('viewBox',"0,0,100,2")
                    .attr('preserveAspectRation',"xMinYMim slice")
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
                    .attr("id",'sequence_rect');

                // for pirscan table
                $('#sequence-table').DataTable({
                    "stateSave": true,
                    "data": data,
                    "columns": [
                    { data: 'piRNA name',title:'piRNA'},
                    { data: 'piRNA target score',title:'piRNA target score'},
                    { data: 'target region',title:'target region'},
                    { data:'# mismatches',title:'# mismatches'},
                    { data:'position in piRNA',title:'position in piRNA'},
                    { data:'# non-GU mismatches in seed region',title:'# non-GU mismatches in seed region'},
                    { data:'# GU mismatches in seed region',title:'# GU mismatches in seed region'},
                    { data:'# non-GU mismatches in non seed region',title:'# non-GU mismatches in non seed region'},
                    { data:'# Gu mismatches in non seed region',title:'# Gu mismatches in non seed region'},
                    { data:'pairing (top:Input sequence, bottom:piRNA)',className:'pairing-sequence',"width":"400",title:'pairing (top:Input sequence, bottom:piRNA)'}
                    ],
                    "bDestroy": true
                })
                // for clash table
                $('#clash-table').DataTable({
                    "stateSave": true,
                    "data": clash,
                    "columns": [
                    { data: 'readcount',title:'Read count'},
                    { data: 'smallrnaname',title:'small RNA Name'},
                    { data: 'smallrnalength',title:'small RNA Length'},
                    { data:'targetrnaregionfoundinclashread',title:'Clash Identified Region'},
                    { data:'predictedtargetsite',title:'Predicted Target Site'},
                    { data:'rnaupscore',title:'RNA up Score'},
                    //{ data:'# GU mismatches in seed region',title:'# GU mismatches in seed region'},
                    ],
                    "bDestroy": true
                })
                // for ticker
                d3.select('#ticker').style('position', 'relative')
                ticker = d3.select('#sequence')
                .append('svg')
                .attr("id","ticker_svg")
                .attr('viewBox',"0,0,1000,30")
                .attr('preserveAspectRation',"xMinYMim slice")
                const xScale = d3.scaleLinear()
                .domain([0, length])
                .range([0, 1000]);
                const xAxis = d3
                .axisBottom(xScale)
                d3.select('#ticker_svg').append("g").call(xAxis)

                // d3 for pirscan (little rect)
                d3.select('#pirscan').style('position', 'relative')
                rects = d3.select('#pirscan')
                .append('svg')
                .attr('viewBox',`0,0,100,${d3_y-2}`)
                .attr('preserveAspectRation',"xMinYMin slice")
                .selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                .attr('x', d => (d.start/length)*100)
                .attr('width', d => ((d.end-d.start)/length)*100)
                .attr('y',d => d.y)
                .attr('fill', 'green')
                .attr('height',2)
                .style('cursor', 'pointer')
                .attr("id",'pirscan_d3');



                

                // tooltips for the little rects (pirscan)
                tooltips2 = d3.select("#pirscan")
                .append("div")
                .style("display", 'none')
                .style('position', 'absolute')
                .style('z-index',0) // 設定z-index可以決定網頁的z軸，決定覆蓋的順序
                .attr("class", "tooltip2")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .attr('id','tooltips2')
                d3.selectAll('#pirscan_d3').on('mouseover', function(){
                    tooltips2.style("display", 'block') // 顯示tooltip
                    })
                    .on('mousemove', function(d){
                    target = d.target.__data__
                    let pt = d3.pointer(this) // 抓圓點位置
                    tooltips2.style("display", 'block')
                    tooltips2.style('z-index',100)
                    .style('left', pt[0]+30+'px') // 設定tooltips位置
                    .style('top', pt[1]+200+'px')
                    
                    
                    .html(`<table role="grid" aria-describedby="originalResult-myTable_info" style="width: 1489px;  border: 1px solid black;border-collapse: collapse;">
                                <thead>
                                    <tr>
                                        <th scope="col">piRNA name</th>
                                        <th scope="col">piRNA target score</th>
                                        <th scope="col">target region</th>
                                        <th scope="col"># mismatches</th>
                                        <th scope="col">position in piRNA</th>
                                        <th scope="col"># non-GU mismatches in seed region</th>
                                        <th scope="col"># GU mismatches in seed region</th>
                                        <th scope="col"># non-GU mismatches in non seed region</th>
                                        <th scope="col"># Gu mismatches in non seed region</th>
                                        <th scope="col">pairing (top:Input sequence, bottom:piRNA)</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    <tr> 
                                        <td>${target['piRNA name']}</td>
                                        <td>${target['piRNA target score']}</td>
                                        <td>${target['target region']}</td>
                                        <td>${target['# mismatches']}</td>
                                        <td>${target['position in piRNA']}</td>
                                        <td>${target['# non-GU mismatches in seed region']}</td>
                                        <td>${target['# GU mismatches in seed region']}</td>
                                        <td>${target['# non-GU mismatches in non seed region']}</td>
                                        <td>${target['# Gu mismatches in non seed region']}</td>
                                        <td>${target['pairing (top:Input sequence, bottom:piRNA)']}</td>
                                    </tr>
                                </tbody>
                                    </table>`) // 抓到綁定在DOM元素的資料           
                    } 
                    )  
                    .on('mouseleave', function(){ //設定滑鼠離開時tooltips隱藏
                 tooltips2.style("display", 'none')  
                 tooltips2.style('z-index',0)
                    }); 
                    

                // d3 for clash (little rect)
                d3.select('#clash').style('position', 'relative')
                rects = d3.select('#clash')
                .append('svg')
                .attr('viewBox',`0,0,100,${d3_y_2}`)
                .attr('preserveAspectRation',"xMinYMin slice")
                .selectAll('rect')
                .data(clash)
                .enter()
                .append('rect')
                .attr('x', d => (d.start/length)*100)
                .attr('width', d => ((d.end-d.start)/length)*100)
                .attr('y',d => d.y  )
                .attr('fill', 'red')
                .attr('height',2)
                .style('cursor', 'pointer')
                .attr("id",'clash_d3');

                // tooltips for the little rects (clash)
                tooltips3 = d3.select("#clash")
                .append("div")
                .style("display", 'none')
                .style('position', 'absolute')
                .style('z-index',2) // 設定z-index可以決定網頁的z軸，決定覆蓋的順序
                .attr("class", "tooltip3")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .attr('id','tooltips3')

                d3.selectAll('#clash_d3').on('mouseover', function(){
                    tooltips3.style("display", 'block') // 顯示tooltip
                    })
                    .on('mousemove', function(d){
                    target = d.target.__data__
                    let pt = d3.pointer(this) // 抓圓點位置
                    tooltips3.style("display", 'block')
                    //tooltips.style('z-index',100)
                    .style('left', pt[0]+30+'px') // 設定tooltips位置
                    .style('top', pt[1]+'px')
                    .html(`<table role="grid" aria-describedby="originalResult-myTable_info" style="width: 1489px;  border: 1px solid black;border-collapse: collapse;">
                                <thead>
                                    <tr>
                                        <th scope="col">Clash Read</th>
                                        <th scope="col">Clash read length</th>
                                        <th scope="col">Region identified by Regulator</th>
                                        <th scope="col">Region identifiend by target</th>

                                    </tr>
                                </thead>
                                <tbody >
                                    <tr> 
                                        <td>${target['clashread']}</td>
                                        <td>${target['clashreadlength']}</td>
                                        <td>${target['regiononclashreadidentifiedassmallrna']}</td>
                                        <td>${target['regiononclashreadidentifiedastargetrna']}</td>
     
                                    </tr>
                                </tbody>
                                    </table>`) // 抓到綁定在DOM元素的資料              
                    }
                    )    
                    .on('mouseleave', function(){ //設定滑鼠離開時tooltips隱藏
                tooltips3.style("display", 'none')
                //tooltips3.style('z-index',0)  
                    }
                    );
                }
                // for 22G
                d3.select('#G_22').style('position', 'relative')
                rects = d3.select('#G_22')
                .append('svg')
                .attr('viewBox',`0,0,100,2`)
                .attr('preserveAspectRation',"xMinYMin slice")
                .selectAll('rect')
                .data(g22)
                .enter()
                .append('rect')
                .attr('x', d => (d.init_pos/length)*100)
                .attr('width', d => ((d.end_pos-d.init_pos)/length)*100)
                .attr('y',0.5)
                .attr('fill', 'black')
                .attr('height',d =>(d.evenly_rc/max_evenly_rc)*5)
                .style('cursor', 'pointer')
                .style('z-index',1)
                .attr("id",'g22');
                
            },//回傳response
            error: function(){
                alert('Something error');
            },
        });

        
    });

