d3.json("https://vnguyen1801.github.io/traveler-trip-analysis/csvjson.json")
  .then(function(data) {

    const width = 900;
    const height = 500;
    const margin = { top: 50, right: 30, bottom: 120, left: 80 };

    const svg = d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Use first 15 rows for clarity
    const sampleData = data.slice(0, 15);

    // x-scale: categorical (Destination)
    const xScale = d3.scaleBand()
      .domain(sampleData.map(d => d["Destination"]))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    // y-scale: numeric for Accommodation cost
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(sampleData, d => d["Accommodation cost"])])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Color scale: Traveler nationality
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const circleR = 15;

    // Draw rectangles (Accommodation cost)
    svg.selectAll(".rect")
      .data(sampleData)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d["Destination"]) + xScale.bandwidth()/2 - 10)
      .attr("y", d => yScale(d["Accommodation cost"]))
      .attr("width", 20)
      .attr("height", d => height - margin.bottom - yScale(d["Accommodation cost"]))
      .attr("fill", "grey")
      .attr("opacity", 0.6);

    // Draw circles (Traveler nationality) above rectangles
    svg.selectAll(".circle")
      .data(sampleData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d["Destination"]) + xScale.bandwidth()/2)
      .attr("cy", d => yScale(d["Accommodation cost"]) - circleR - 5) // above rectangle
      .attr("r", circleR)
      .attr("fill", d => colorScale(d["Traveler nationality"]));

    // Add nationality text above each circle
    svg.selectAll(".natLabel")
      .data(sampleData)
      .enter()
      .append("text")
      .attr("x", d => xScale(d["Destination"]) + xScale.bandwidth()/2)
      .attr("y", d => yScale(d["Accommodation cost"]) - circleR - 10)
      .attr("text-anchor", "middle")
      .text(d => d["Traveler nationality"])
      .style("font-size", "10px")
      .style("font-weight", "bold");

    // x-axis: Destination
    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");

    // x-axis title
    svg.append("text")
      .attr("x", width/2)
      .attr("y", height - 50)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Destination");

    // y-axis: Accommodation cost
    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);

    // y-axis title
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height/2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Accommodation Cost (USD)");

  })
  .catch(function(error) {
    console.error("Error loading data:", error);
  });
