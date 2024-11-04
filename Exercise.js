//Creating the main SVG.
let margin = {left: 0 , right: 10, bottom:10 , top:30};
let height = 300 - margin.top - margin.bottom;
let width = 400 - margin.left - margin.right;

let svg = d3.select("#chart").append("svg")
                            .attr('width', width + margin.left + margin.right)
                            .attr('height', height + margin.top + margin.bottom)
                            .append('g')
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
d3.json("Exercise_dataset.json").then(data=>{

//Creating the Axes.

let dimensions = Object.keys(data[0])    
                .filter(item => {return item != "class"});

let yScalers = {}
dimensions.forEach(dim=>{

    let yScaler = d3.scaleLinear().
        domain(d3.extent(data, d=>{return +d[dim]}))
        .range([height,0])
    yScalers[dim] = yScaler;

});


let xScaler = d3.scalePoint().domain(dimensions)
            .padding(1).range([0,width])

svg.selectAll("axis").data(dimensions).enter().append('g')
                .attr("transform", d=>{return "translate("+xScaler(d) +")"})
                .each(function(d)
                    {
                        d3.select(this)
                            .call(d3.axisLeft().scale(yScalers[d]))
                    })

                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -8)
                .text(d=>d)
                .style("fill","black")

//Adding the data to the chart.

function createPath(d){
    return d3.line()(dimensions.map(dim=>{return[xScaler(dim), yScalers[dim](d[dim])]}))
}
let species = data.map(d=>d['class'])
let speciesUnique = Array.from(new Set(species))

let getColor = d3.scaleOrdinal().domain(speciesUnique).range(d3.schemeCategory10)
svg.selectAll("myPath").data(data).enter().append("path")
                                    .attr("d",createPath)
                                    .attr("opacity",0.5)
                                    .attr("stroke",d=>{ return getColor(d["class"])})
                                    .attr("fill","none")

}); 
//Simple parallel coordinates plot using d3.js
//Json file data set containing of the information about different kind of cars labeled into different kinds of classes.