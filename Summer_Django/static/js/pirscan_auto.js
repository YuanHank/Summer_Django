$(document).ready(function(){
        var url = document.URL
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
                d3_y = response.y
                var g22 = response.g22
                max_evenly_rc = response.max_evenly_rc
                if (data == 'none'){
                    //alert('not availiable CDS or wrong input')
                    $('#table').html("<span> not availiable CDS or wrong input </span>")
                }
                else{
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
                //d3 for the sequence
                d3.select('#sequence').style('position', 'relative')
                rects = d3.select('#sequence')
                .append('svg')
                .attr("id","sequence_svg")
                .attr('viewBox',"0,0,100,2")
                .attr('preserveAspectRation',"xMinYMim slice")
                .append('rect')
                .attr('x',0)
                .attr('width',100)
                .attr('y',0)
                .attr('fill', 'Brown')
                .attr('height',2)
                .style('cursor', 'pointer')
                .attr("id",'sequence_rect');
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
                // for 22G
                d3.select('#G_22').style('position', 'relative')
                rects = d3.select('#G_22')
                .append('svg')
                .attr('viewBox',`0,0,100,${max_evenly_rc+1}`)
                .attr('preserveAspectRation',"xMinYMin slice")
                .selectAll('rect')
                .data(g22)
                .enter()
                .append('rect')
                .attr('x', d => (d.init_pos/length)*100)
                .attr('width', d => ((d.end_pos-d.init_pos)/length)*100)
                .attr('y',0.5)
                .attr('fill', 'black')
                .attr('height',d =>d.evenly_rc)
                .style('cursor', 'pointer')
                .attr("id",'g22');

                // tooltips for the little rects
                tooltips2 = d3.select("#pirscan")
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

                d3.selectAll('#pirscan_d3').on('mouseover', function(){
                    tooltips2.style("opacity", 1) // 顯示tooltip
                    })
                    .on('mousemove', function(d){
                    target = d.target.__data__
                    let pt = d3.pointer(this) // 抓圓點位置
                    tooltips2.style("opacity", 1)
                    .style('left', pt[0]+30+'px') // 設定tooltips位置
                    .style('top', pt[1]+'px')
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
                    })    
                    .on('mouseleave', function(){ //設定滑鼠離開時tooltips隱藏
                 tooltips2.style("opacity", 0)  
                    });}


            },//回傳response
            error: function(){
                alert('Something error');
            },
        });

    });

