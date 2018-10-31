let educationUrl = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json'
let countiesUrl = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json'

function loadData(src) {
    return new Promise(function(resolve, reject){
        let data = new Map();
        data.title = "Education rate (%)";
        req = new XMLHttpRequest();
        req.open("GET",src,true);
        req.send();
        req.onload = () => {
        json=JSON.parse(req.responseText);
        data = json.map(d => {
            data.set([d.fips, d.bachelorsOrHigher])
        });
        resolve(data);
        }
    })
}
let promise = loadData(educationUrl);

promise.then(
    data => console.log(data)
    
)

/*
  function loadTopo(src) {
    let topo = {};
    req = new XMLHttpRequest();
    req.open("GET",src,true);
    req.send();
    req.onload = () => {
        json=JSON.parse(req.responseText);
        topo = json.map(d => {
            topo.push(d)
        })
        return topo;
    }  
  }
  
  const topo = await getTopo();


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

*/