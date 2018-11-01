let data = new Map();
let us = {};
data.title = "% with a bachelor's degree or higher";

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
            let map = json.map(d => {
                data.set(d.fips, d.bachelorsOrHigher)
            });
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
            us = Object.assign({},json);
            resolve('loadTopo done!');
        }  
    })
}
function renderD3() {
    const width = 960;
    const height = 600;
    const path = d3.geoPath();

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

    const g = svg.append("g")
        .attr("transform", "translate(0,40)");

    // reference: color legend
    g.selectAll("rect")
    .data(color.range().map(d => color.invertExtent(d)))
    .enter().append("rect")
        .attr("height", 8)
        .attr("x", d => x(d[0]))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("fill", d => color(d[0]));

    // reference: text legend
    g.append("text")
        .attr("class", "legend")
        .attr("x", x.range()[0] + 40)
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.title);

    // reference: axis of legend
    g.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat(format)
        .tickValues(color.range().slice(1).map(d => color.invertExtent(d)[0])))

    // draw counties with tooltip
    svg.append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append("path")
        .attr("fill", d => color(data.get(d.id)))
        .attr("d", path)
        .attr('class','county')
    .append("title")
        .text(d => format(data.get(d.id))+'%')
        .attr('class','tooltip');
        
    // draw states
    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("class", "county")
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);


}