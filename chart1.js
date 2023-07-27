
async function loadData(region) {

    d3.selectAll("svg").remove();
    var margin = { top: 50, right: 40, bottom: 50, left: 60 };
    var width = 1000 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    // Create the SVG element
    var svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const data = await d3.csv('https://kbarta20.github.io/WorldSustainabilityDataset.csv', d3.autoType);
    const dataArray = Object.values(data);

    if (region == "World") {
        var dataArrayF = dataArray.filter(filtered);
    }
    else {
        console.log("now its " + region);
        var dataArrayF = dataArray.filter(function filteredR(da) {
            return (da['Year'] == '2018') && (da['Continent'] == region);
        })
    }

    var CO2damage = dataArrayF.map(d => +d["Adjusted savings: carbon dioxide damage (% of GNI) - NY.ADJ.DCO2.GN.ZS"]);
    var xs = d3.scaleLinear().domain([0, 3]).range([0, width]);

    var electricity = dataArrayF.map(d => +d["GDP per capita (current US$) - NY.GDP.PCAP.CD"]);
    var yDomain = d3.extent(electricity); // Get the min and max values for the domain
    var ys = d3.scaleLinear().domain([yDomain[0] - 5, yDomain[1] + 5]).range([height, 0]);

    var population = dataArrayF.map(d => +d["Population, total - SP.POP.TOTL"]);
    var rs = d3.scaleLinear().domain([0, d3.max(population)]).range([5, 70]);

    svg.selectAll('circle')
        .data(dataArrayF)
        .enter()
        .append('circle')
        .attr('cx', function (d) { return xs(d["Adjusted savings: carbon dioxide damage (% of GNI) - NY.ADJ.DCO2.GN.ZS"]); })
        .attr('cy', function (d) { return ys(d["GDP per capita (current US$) - NY.GDP.PCAP.CD"]); })
        .attr('r', function (d) { return rs(d["Population, total - SP.POP.TOTL"]); })
        .attr("fill", function (d) {
            var cont = d['Continent']
            if (cont == 'North America') {
                return "lightblue";
            } else if (cont == 'Africa') {
                return "tomato";
            }
            else if (cont == 'South America') {
                return "gold";
            }
            else if (cont == 'Asia') {
                return "teal";
            }
            else if (cont == 'Oceania') {
                return "violet";
            }
            else if (cont == 'Europe') {
                return "navy";
            }
            return "yellow";
        })
        .on("mouseover", function (event, d) {
            tooltip.style("visibility", "visible").text(d["Country Name"]);
            tooltip.style("top", (d.pageY) + "px")
                .style("left", (d.pageX) + "px");
        })
        .on("mousemove", function () { return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"); })
        .on("mouseout", function () { return tooltip.style("visibility", "hidden"); });

    //legend
    svg.append("circle").attr("cx", 450).attr("cy", 0).attr("r", 6).style("fill", "tomato")
    svg.append("circle").attr("cx", 450).attr("cy", 20).attr("r", 6).style("fill", "gold")
    svg.append("circle").attr("cx", 450).attr("cy", 40).attr("r", 6).style("fill", "green")
    svg.append("circle").attr("cx", 450).attr("cy", 60).attr("r", 6).style("fill", "lightblue")
    svg.append("circle").attr("cx", 450).attr("cy", 80).attr("r", 6).style("fill", "navy")
    svg.append("circle").attr("cx", 450).attr("cy", 100).attr("r", 6).style("fill", "violet")
    svg.append("text").attr("x", 470).attr("y", 0).text("Africa").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", 470).attr("y", 20).text("South America").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", 470).attr("y", 40).text("Asia").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", 470).attr("y", 60).text("North America").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", 470).attr("y", 80).text("Europe").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", 470).attr("y", 100).text("Oceania").style("font-size", "15px").attr("alignment-baseline", "middle")

    var yAxis = d3.axisLeft(ys).ticks(10).tickFormat(d3.format("~s"));
    svg.append("g").call(yAxis);

    var xAxis = d3.axisBottom(xs).tickValues([0, 0.5, 1.0, 1.5, 2, 2.5, 3, 3.5, 4])//.tickFormat(d3.format("~s"));
    svg.append("g").attr("transform", "translate(0," + height + ")").call(xAxis);

    svg.append("text")
        .attr("transform", "translate(300,540)")
        .style("text-anchor", "middle")
        .text("Adjusted savings: carbon dioxide damage (% of GNI)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("GDP per capita (current US$)");

    //add click event to the boxes
    d3.selectAll(".box").on("click", function () {
        var boxId = d3.select(this).attr("id");
        switch (boxId) {
            case "box1":
                goTo("index.html");
                break;
            case "box2":
                goTo("chart2.html");
                break;
            case "box3":
                goTo("chart3.html");
                break;
            default:
                break;
        }
    });

    // create a tooltip
    var tooltip = d3.select("#chart")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white");


}

function filtered(dataArr) {
    return (dataArr['Year'] == '2018') //&& (dataArr['Continent'] == reg)
}

function regionize(d, region) {
    return d['Continent'] === region;
}

function updateChart(cont) {
    var dataCont = d3.nest().key(function (d) {
        return (d["Continent"]);//== cont)
    })
        .entries(cont[0]);
}