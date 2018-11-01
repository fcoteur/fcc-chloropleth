let data = new Map();
let us = {};
data.title = "Education rate (%)";

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
    console.log('starting!')
    const width = 960;
    const height = 600;
    const path = d3.geoPath();

    const color = d3.scaleQuantize()
        .domain([1, 10])
        .range(d3.schemeBlues[9])

    const format = d3.format("")

    const x = d3.scaleLinear()
        .domain(d3.extent(color.domain()))
        .rangeRound([600, 860]);

    const svg = d3.select('#map').append('svg')
        .attr('width', width)
        .attr('height', height)
        .style("width", "100%")
        .style("height", "auto");

    const g = svg.append("g")
        .attr("transform", "translate(0,40)");

    g.selectAll("rect")
    .data(color.range().map(d => color.invertExtent(d)))
    .enter().append("rect")
        .attr("height", 8)
        .attr("x", d => x(d[0]))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("fill", d => color(d[0]));

    g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.title);

    g.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat(format)
        .tickValues(color.range().slice(1).map(d => color.invertExtent(d)[0])))
    .select(".domain")
        .remove();

    svg.append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
        .attr("fill", d => color(data.get(d.id)))
        .attr("d", path)
    .append("title")
        .text(d => format(data.get(d.id)));

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);

}