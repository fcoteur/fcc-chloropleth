let data = [];
let countryTopo = {};

Promise.all([loadTopo(), loadData()])
   .then(
    responses => renderD3()
)
function loadData() {
    return new Promise(function(resolve, reject){
        req1 = new XMLHttpRequest();
        req1.open("GET",'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json',true);
        req1.send();
        req1.onload = () => {
            let json = JSON.parse(req1.responseText);
            data = json.slice();
            resolve('loadData done!');
        }
    })
}
function loadTopo() {
    return new Promise(function(resolve, reject){
        req2 = new XMLHttpRequest();
        req2.open("GET",'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json',true);
        req2.send();
        req2.onload = () => {
            let json = JSON.parse(req2.responseText);
            countryTopo = Object.assign({},json);
            resolve('loadTopo done!');
        }  
    })
}

function renderD3() {
    const width = 960;
    const height = 600;
    const path = d3.geoPath();
console.log(data,countryTopo)

    const color = d3.scaleQuantize()
        .domain([1, 100])
        .range(d3.schemeReds[9])

    const format = d3.format("")
    
    //scale for positioning of legend
    const x = d3.scaleLinear()
        .domain(d3.extent(color.domain()))
        .range([600, 860]);

    const svg = d3.select('#map').append('svg')
        .attr('width', width)
        .attr('height', height)
        .style("width", "100%")
        .style("height", "auto");

    const body = d3.select('body')

    const tooltip = body.append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

    const g = svg.append("g")
        .attr("transform", "translate(0,40)");

    // reference: color legend
    g.selectAll("rect")
    .data(color.range().map(d => color.invertExtent(d)))
    .enter().append("rect")
    .attr("id", "legend")
        .attr("height", 8)
        .attr("x", d => x(d[0]))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("fill", d => color(d[0]));

    // reference: text legend
    g.append("text")
        .attr("x", x.range()[0] + 40)
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text('% of >25y population with higher education');

    // reference: axis of legend
    g.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat(format)
        .tickValues(color.range().slice(1).map(d => color.invertExtent(d)[0])))

    // draw counties with tooltip
    svg.append("g")
    .selectAll("path")
    .data(topojson.feature(countryTopo, countryTopo.objects.counties).features)
    .enter()
    .append("path")
        .attr("fill", d => { 
            let result = data.filter( obj => {
                return (obj.fips == d.id);
            });
            if(result[0]){
              return color(result[0].bachelorsOrHigher)
            }
            return color(0)
           })        
        .attr("d", path)
        .attr('class','county')
        .attr("data-fips", d => d.id)
        .attr("data-education", d => {
            var result = data.filter( obj => {
              return obj.fips == d.id;
            });
            if(result[0]){
              return result[0].bachelorsOrHigher
            }
            return 0
           }
        )
        .on("mouseover", d => {      
            tooltip
            .style("opacity", 1) 
            .html(() => {
                var result = data.filter( obj => {
                  return obj.fips == d.id;
                });
                if(result[0]){
                  return result[0].area_name+ ' ' + result[0].bachelorsOrHigher + '%'
                }
                return 0
               })  
            .style("left", (d3.event.pageX + 10) + "px") 
            .style("top", (d3.event.pageY - 30) + "px")
            .attr("data-education", () => {
                var result = data.filter( obj => {
                    return obj.fips == d.id;
                });
                if(result[0]){
                    return result[0].bachelorsOrHigher
                }
                return 0
                });
            })
        .on("mouseout", d => {tooltip.style("opacity", 0);});
    
    // draw states
    svg.append("path")
        .datum(topojson.mesh(countryTopo, countryTopo.objects.states, (a, b) => a !== b))
        .attr("class", "states")
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);
    }
