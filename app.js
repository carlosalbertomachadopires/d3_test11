const svgHeight = 400
const svgWidth = 1000

const margin = {
    top: 50,
    right: 50,
    bottom: 70,
    left: 50
    }

const chartHeight = svgHeight - margin.top - margin.bottom
const chartWidth = svgWidth - margin.left - margin.right

const colorDow = "#000000"
const colorSmurf = "#0000FF"

const parseDate = d3.timeParse("%d-%b-%Y")
const formatDate = d3.timeFormat("%d-%b-%Y")

const svg = d3.select("body").append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

const chartG = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

d3.csv("data.csv").then(data => {

    const x = d3.scaleTime()
        .domain(d3.extent(data.map(d => parseDate(d.date))))
        .range([0,chartWidth])

    const yDow = d3.scaleLinear()
        .domain(d3.extent(data.map((d) => parseInt(d.dow_index))))
        .range([chartHeight, 0])

    const ySmurf = d3.scaleLinear()
        .domain([0, d3.max(data.map((d) => parseInt(d.smurf_sightings))),
        ])
        .range([chartHeight, 0])


    const yAxisDow = d3.axisLeft(yDow)
    const yAxisSmurf = d3.axisRight(ySmurf)
    const xAxis = d3.axisBottom(x).tickFormat(formatDate);

    chartG.append("g")
    .attr("stroke", colorDow)
    .call(yAxisDow);

    chartG.append("g")
    .attr("stroke", colorSmurf)
    .attr("transform", `translate(${chartWidth}, 0)`)
    .call(yAxisSmurf);

    chartG.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    const lineDow = d3.line()
        .x(d => x(parseDate(d.date)))
        .y(d => yDow(d.dow_index));

    const lineSmurf = d3.line()
        .x(d => x(parseDate(d.date)))
        .y(d => ySmurf(d.smurf_sightings));

    chartG.append("path")
        .attr("d", lineDow(data))
        .attr("fill", "none")
        .attr("stroke", colorDow);

    chartG.append("path")
        .attr("d", lineSmurf(data))
        .attr("fill", "none")
        .attr("stroke", colorSmurf);

        const labelArea = svg
            .append("g")
            .attr("transform", `translate(${svgWidth / 2}, ${svgHeight - margin.bottom + 40})`)

        labelArea.append("text")
            .attr("stroke", colorDow)
            .text("Dow")

        labelArea.append("text")
            .attr("stroke", colorSmurf)
            .attr("dy", 20)
            .text("Smurf")




})