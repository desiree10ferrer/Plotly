function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var defaultURL = `/metadata/${sample}`;
    
    d3.json(defaultURL).then(function(getdata) {
      var sample_meta = d3.select('#sample-metadata');
    // Use `.html("") to clear any existing metadata
      sample_meta.html("")
    // Use `Object.entries` to add each key and value pair to the panel' // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(getdata).forEach(function([key, value]) {
      newdata = sample_meta.append('p');
      x = newdata.text(`${key}: ${value}`);
      console.log(getdata);

      });
    }
  )};
  
  function buildCharts(sample) {

    var chart_url = `/samples/${sample}`;
    d3.json(chart_url).then(function(data) {
  
      // @TODO: Build a Bubble Chart using the sample data
      var id = data.otu_ids;
      var sample_values = data.sample_values;
      var size = data.sample_values; 
      var color = data.otu_ids;
      var values = data.otu_labels;
  
      var trace = {
        x: id,
        y: sample_values,
        text: values,
        mode: 'markers',
        marker: {
            color: color,
            size: size
        } 
      };
    
      var data = [trace];
  
      var layout = {
        xaxis: { title: "OTU ID"},
      };
  
      Plotly.newPlot('bubble', data, layout, {responsive: true});
     
  
      // @TODO: Build a Pie Chart
      d3.json(chart_url).then(function(data) {  
        var values = data.sample_values.slice(0,10);
        var labels = data.otu_ids.slice(0,10);
        var hover = data.otu_labels.slice(0,10);
  
        var data = [{
          values: values,
          labels: labels,
          hovertext: hover,
          type: 'pie'
        }];
  
        var layout = {
          title:"Top 10 Samples",
          font: {size: 16}
        };
        
  
        Plotly.newPlot('pie', data, layout, {responsive: true});
  
      });
    });   
  }
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new p each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();