    var svgWidth = 600;
    var svgHeight = 600;

    var margin = { top: 20, right: 40, bottom: 60, left: 120 };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select("#scatter")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    // Import Data
    var csv = "./assets/data/data.csv"
    d3.csv(csv).then(function(journalismData){
      

    // Parse Data/Cast as numbers
    journalismData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcareLow = +data.healthcareLow;
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([24, d3.min(journalismData, d => d.poverty)])
      .range([width, 0]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, 26], d3.max(journalismData, d => d.healthcareLow))
      .range([height, 26]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(journalismData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcareLow))
    .attr("r", "10")
    .attr("fill", "orange")
    .attr("opacity", ".5");
    
    // Create state labels
    circlesGroup.append("text")
        .attr("dx", function (d) {
            return -20;
          })
        .text(function(d){return d.abbr});
        
    // Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`<br>State: ${d.state}<br>Poverty(%): ${d.poverty}<br>Healthcare(%): ${d.healthcareLow}`);
      });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  });;