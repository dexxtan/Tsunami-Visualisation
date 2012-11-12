$("#details_label").css("left", $("#map").outerWidth(true));

var po = org.polymaps;

// Create the map object, add it to #map…
/*var map = po.map()
    .container(d3.select("#map").append("svg:svg").node())
    .center({lat: 30.5, lon: -9.5})
    .size({x: $("#map").width(), y: $("#map").height()})
    .zoom(1.5)
    .add(po.interact())
    .add(po.hash());

// Add the CloudMade image tiles as a base layer…
map.add(po.image()
    .url(po.url("http://{S}tile.cloudmade.com"
    + "/1a1b06b230af4efdbb989ea99e9841af" // http://cloudmade.com/register
    + "/999/256/{Z}/{X}/{Y}.png")
    .hosts(["a.", "b.", "c.", ""])));

// Add the compass control on top.
map.add(po.compass()
    .position("top-right")
    .pan("none"));*/

// azimuthal code
//$("div#row1").height($(window).height()-200);
/*$(window).resize(function() {
  $("div#map").height($(window).height()-200);
});*/
var feature;
var point;
var mapWidth = $("div#map").width();
var mapHeight = $("div#map").height();
var size = (mapHeight/2)-10;
var loaded = false;
var stopRotating = false;
var paused = false;

var origin = [103.849972, 1.289545];
var velocity = [0.0040, 0.0000];

var projection = d3.geo.azimuthal()
    .scale(size)
    .origin(origin)
    .mode("orthographic")
    .translate([mapWidth/2, mapHeight/2]);

var circle = d3.geo.circle()
    .origin(projection.origin());

// TODO fix d3.geo.azimuthal to be consistent with scale
var scale = {
  orthographic: size,
  stereographic: size,
  gnomonic: size,
  equidistant: size / Math.PI * 2,
  equalarea: size / Math.SQRT2
};

var path = d3.geo.path()
    .projection(projection);

var azimuthal = d3.select("#azimuthal").append("svg:svg")
    .attr("width", mapWidth)
    .attr("height", mapHeight);

/*azimuthal.selectAll("circle")
    .data([0])
    .enter()
    .append('circle')
    .attr("class", "outline")
    .attr("fill-opacity", 0.0) // Override these with css for globe-outline
    .attr("stroke", "#000000") // Override these with css for globe-outline
    .attr("stroke-width", 4)
    .attr("r", (size)) // Add a 2 pixel buffer
    .attr("cx", (mapWidth/2))
    .attr("cy", (mapHeight/2));*/

d3.json("data/world-countries.json", function(collection) {
  feature = azimuthal.selectAll("path")
      .data(collection.features)
    .enter().append("svg:path")
      .attr("class", "country")
      .attr("d", clip);

  feature.append("svg:title")
      .text(function(d) { return d.properties.name; });
});

d3.select("#azimuthal")
    .on("mousedown", mousedown)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup);

d3.select("select").on("change", function() {
  projection.mode(this.value).scale(scale[this.value]);
  refresh(750);
});

var m0,
    o0;

function mousedown() {
  m0 = [d3.event.pageX, d3.event.pageY];
  o0 = projection.origin();
  d3.event.preventDefault();
}

function mousemove() {
  if (m0) {
    stopRotating = true;
    var m1 = [d3.event.pageX, d3.event.pageY],
        o1 = [o0[0] + (m0[0] - m1[0]) / 8, o0[1] + (m1[1] - m0[1]) / 8];
    projection.origin(o1);
    circle.origin(o1)
    refresh();
  }
}

function mouseup() {
  if (m0) {
    mousemove();
    m0 = null;
  }
}

function refresh(duration) {
  function updateSource(d) {
    var lon;
    var lat;
    var coords = [];
    var geojson;
    if (d.type == undefined) {
      if (d.key == undefined) {
        // d is a hit
        lon = d[10];
        lat = d[9];
      } else {
        // d is an event
        lon = d.value[15];
        lat = d.value[14];
      }
      geojson = { "type": "Feature", "geometry": { "type": "Point", "coordinates": [lon, lat] } };
    } else {
      geojson = d;
    }
    var clipped = circle.clip(geojson);
    if (clipped !== null) {
      if (clipped.geometry == undefined) {
        coords[0] = projection([0.00, 0.00])[0];
        coords[1] = projection([0.00, 0.00])[1];
        coords[2] = 0;
      } else {
        coords[0] = projection(clipped.geometry.coordinates)[0];
        coords[1] = projection(clipped.geometry.coordinates)[1];
        coords[2] = 1
      }
    } else {
      coords[0] = projection(geojson.geometry.coordinates)[0];
      coords[1] = projection(geojson.geometry.coordinates)[1];
      coords[2] = 0;
    }
    return coords;
  }

  var radius;
  if (duration) {
    feature.transition().duration(duration).attr("d", clip);
    point.transition().duration(duration).attr({
      "cx": function(d) {
        return updateSource(d)[0];
      },
      "cy": function(d) {
        return updateSource(d)[1];
      },
      "r": function(d) {
        if (updateSource(d)[2] === 1) {
          if (d3.select(this).attr("class") == "source-selected") {
            radius = 6
          } else {
            radius = 4.5
          }
          return radius;
        } else {
          return 0;
        }
      }
    });
  } else {
    feature.attr("d", clip);
    point.attr({
      "cx": function(d) {
        return updateSource(d)[0];
      },
      "cy": function(d) {
        return updateSource(d)[1];
      },
      "r": function(d) {
        if (updateSource(d)[2] === 1) {
          var thisClass = d3.select(this).attr("class");
          if (thisClass == "source-selected") {
            radius = 6;
          } else if (thisClass == "hit" || thisClass == "source") {
            radius = 4.5;
          } else if (thisClass == "invis") {
            radius = 0;
          }
          return radius;
        } else {
          return 0;
        }
      }
    });
  }
}

function clip(d) {
  return path(circle.clip(d));
}
    
// chart code
var w = $("div#chart").width();
var h = $("div#chart").height();

var svg = d3.select("#chart").append("svg");

svg.append("rect")
    .attr("class", "background")
    .attr("fill", "#021019")
    .attr("width", w)
    .attr("height", h);

// Load the tsunami data. When the data comes back, display it.
d3.json("data/tsunami.json", function(data) {
  dataset = d3.entries(data);

  for (var i = 0; i < dataset.length; i++) {
    if (dataset[i].value[10] == null) dataset[i].value[10] = 0;
    if (dataset[i].value[1] < 1900) {
      dataset.splice(i, 1);
      i--;
    }
  }

  /************AZIMUTHAL CODE************/
  point = azimuthal.selectAll("sources")
      .data(dataset)
    .enter().append("svg:circle")
      .attr("class", "source")
      .attr("fill", function(d) {
        return "orange";
      })
      .attr("cx", function(d) {
        return projection([d.value[15], d.value[14]])[0];
      })
      .attr("cy", function(d) {
        return projection([d.value[15], d.value[14]])[1];
      })
      .attr("r", function(d) {
        return "4.5";
      })
      .attr("id", function(d) {
        // create d.date for each event
        if (d.date == null) {
          var date = new Date(d.value[1],0,1);
          if (d.value[2] != null) date.setMonth(d.value[2]-1);
          if (d.value[3] != null) date.setMonth(d.value[3]);
          d.date = date;
        }
        return "e" + d.value[0];
      })
      .on("click", click);
  loaded = true;
  refresh();

  function transformX(data) {
    var sourceCx = projection([data.source_lon, data.source_lat])[0];
    var hitCx = projection([data.hit_lon, data.hit_lat])[0];
    return sourceCx-hitCx;
  }

  function transformY(data) {
    var sourceCy = projection([data.source_lon, data.source_lat])[1];
    var hitCy = projection([data.hit_lon, data.hit_lat])[1];
    return sourceCy-hitCy;
  }

  function click(d) {
    toggleEvent(d);
  }

  function toggleEvent(d) {
    stopRotating = true;
    // check for existing selected events
    var existing = azimuthal.select("circle.source-selected");
    var id = d.value[0];

    // if no event is selected, populate newly selected
    if (existing.empty()) {
      populateHits(d);
      populateEventDetails(d);
    } else {
      // deselect selected events and remove all hit markers
      existing.attr("class", "source")
          .attr("r", 4.5);
      azimuthal.selectAll("circle.invis").each(function(d, i) {
        d3.select(this).attr("class", "source");
      });
      azimuthal.selectAll("circle.hit").remove();
      azimuthal.selectAll("path.line").remove();
      clearDetails();
      // if selected event is not the newly selected, populate newly selected
      if (existing.attr("id") != "e"+id) {
        populateHits(d);
        populateEventDetails(d);
      } else {
        // unfocus map off previously selected
        //circle.origin(origin);
        //projection.origin(origin);
      }
    }
    refresh();
  }

  function populateEventDetails(d) {
    var cause = "";
    switch (d.value[8]) {
      case 0:
        cause = "Unknown";
        break;
      case 1:
        cause = "Earthquake";
        break;
      case 2:
        cause = "Questionable Earthquake";
        break;
      case 3:
        cause = "Earthquake and Landslide";
        break;
      case 4:
        cause = "Volcano and Earthquake";
        break;
      case 5:
        cause = "Volcano, Earthquake, and Landslide";
        break;
      case 6:
        cause = "Volcano";
        break;
      case 7:
        cause = "Volcano and Landslide";
        break;
      case 8:
        cause = "Landslide";
        break;
      case 9:
        cause = "Meteorological";
        break;
      case 10:
        cause = "Explosion";
        break;
      case 11:
        cause = "Astronomical Tide";
        break;
    }
    $("p#event_cause").text(cause);
    $("p#event_date").text(d.date.toDateString());
    var location = d.value[13] + (d.value[12] ? ", " + d.value[12] : "") + ", " + d.value[11];
    $("p#event_location").text(location);
    $("p#event_max_height").text(d.value[17] ? d.value[17] + " m" : "N/A");
    $("p#event_deaths").text(d.value[22] ? d.value[22] : "N/A");
    $("p#event_injuries").text(d.value[26] ? d.value[26] : "N/A");
    $("p#event_damage").text(d.value[28] ? d.value[28] + " million dollars" : "N/A");
  }

  function clearDetails() {
    $("div#event_details div p, div#tsunami_details div p").each(function() {
      $(this).text("");
    });
  }

  function populateHits(d) {
    // focus map on selected
    circle.origin([d.value[15], d.value[14]]);
    projection.origin([d.value[15], d.value[14]]);
    // highlight selected source
    azimuthal.select("circle#e"+d.value[0])
        .attr("class", "source-selected")
        .attr("r", 6);
    // hide all other sources
    azimuthal.selectAll("circle.source").each(function(d, i) {
      d3.select(this).attr("class", "invis");
    });
    $.each(d.value[46], function() {
      // code to highlight hit
      var subPoint = azimuthal.insert("svg:circle", "circle#e"+d.value[0])
          .datum(this)
          //.attr("transform", transform)
          .attr("class", "hit")
          .attr("source", d.value[0])
          .attr("fill", function(d) {
            return "yellow";
          })
          .attr("cx", function(d) {
            return projection([d[10], d[9]])[0];
          })
          .attr("cy", function(d) {
            return projection([d[10], d[9]])[1];
          })
          .attr("r", function(d) {
            return "4.5";
          });

      // code to create line
      var subPointLine = azimuthal.insert("svg:path", "circle.hit")
          .datum({ 
              "type": "Feature", 
              "geometry": {
                "type": "LineString",
                "coordinates": [ [d.value[15], d.value[14]], [this[10], this[9]] ]
              }
          })
          .attr("class", "line")
          .attr("d", clip);

      point[0].push(subPoint[0][0]);
      feature[0].push(subPointLine[0][0]);
      
    });

    $('svg circle.hit').on("mouseover", function(d) {
      var d = this.__data__;
      populateTsunamiDetails(d);
      $('svg circle.hit').tipsy({
        gravity: $.fn.tipsy.autoWE,
        html: true,
        title: function() {
          var d = this.__data__;
          var distance = d[12], w = d[15], deaths = d[20], l = d[8] + ", " + d[6];
          return  'Distance: <span style="color: orange">' + distance + ' km</span><br />' +
                  'Water Height: <span style="color: orange">' + w + ' m</span><br />' +
                  'Deaths: <span style="color: orange">' + (deaths ? deaths : 0) + '</span><br />' +
                  'Location: <span style="color: orange">' + l + '</span>';
        }
      });
    });
  }

  function populateTsunamiDetails(d) {
    $("div#tsunami_details div p").each(function() {
      $(this).text("");
    });
    var location = d[8] + (d[7] ? ", " + d[7] : "") + ", " + d[6];
    $("p#tsunami_location").text(location);
    $("p#tsunami_distance").text(d[12] ? d[12] + " km" : "N/A");
    var travel_time = (d[13] ? d[13] + " hours " : "") + (d[14] ? d[14] + " minutes" : "");
    $("p#tsunami_travel_time").text(travel_time == "" ? "N/A" : travel_time);
    $("p#tsunami_height").text(d[15] ? d[15] + " m" : "N/A");
    $("p#tsunami_flood_distance").text(d[16] ? d[16] + " m" : "N/A");
    $("p#tsunami_deaths").text(d[20] ? d[20] : "N/A");
    $("p#tsunami_injuries").text(d[22] ? d[22] : "N/A");
    $("p#tsunami_damage").text(d[24] ? d[24] + " million dollars" : "N/A");
  }

  $('svg circle.source').tipsy({
    gravity: $.fn.tipsy.autoWE,
    html: true,
    title: function() {
      var d = this.__data__;
      var date = d.date, m = d.value[10], w = d.value[17], deaths = d.value[22], l = d.value[13] + ", " + d.value[11];
      return  'Date: <span style="color: orange">' + date.toDateString() + '</span><br />' +
              'Magnitude: <span style="color: orange">' + m + ' Richter</span><br />' +
              'Max Water Height: <span style="color: orange">' + (w ? w : 0) + ' m</span><br />' +
              'Total Deaths: <span style="color: orange">' + (deaths ? deaths : 0) + '</span><br />' +
              'Location: <span style="color: orange">' + l + '</span>';
    }
  });

  spin();

  function spin() {
    t0 = Date.now();
    origin = projection.origin();
    d3.timer(function() {
      var t = Date.now() - t0;
      // Don't refresh until everything is rendered... ah ha
      if (t > 500 && loaded) {
        var o = [origin[0] + (t - 500) * velocity[0], origin[1] + (t - 500) * velocity[1]];
        projection.origin(o);
        circle.origin(o);
        refresh();
      }
      return stopRotating;
    });
  }

  /************MAP CODE******************/
  // Insert our layer beneath the compass.
  /*var layer = d3.select("#map svg").insert("svg:g", ".compass");
  layer.attr("class", "marker");

  // Add an svg:g for each station.
  var marker = layer.selectAll("g")
      .data(dataset)
    .enter().append("svg:g")
      .attr("transform", transform)
      .attr("class", "event")
      .attr("id", function(d) {
        // create d.date for each event
        if (d.date == null) {
          var date = new Date(d.value[1],0,1);
          if (d.value[2] != null) date.setMonth(d.value[2]-1);
          if (d.value[3] != null) date.setMonth(d.value[3]);
          d.date = date;
        }
        return "e" + d.value[0];
      });

  // Add a circle.
  marker.append("svg:circle")
      .attr("r", 4.5)
      .on("click", click);

  // Add a label.
  marker.append("svg:text")
      .attr("x", 7)
      .attr("dy", ".31em")
      .style("fill", "white")
      .text(function(d) {
        return ""; 
      });

  // Whenever the map moves, update the marker positions.
  map.on("move", function() {
    layer.selectAll("g").attr("transform", transform);
    layer.selectAll("line")
        .attr("x2", transformX)
        .attr("y2", transformY);
  });

  function transform(data) {
    var d = null;
    if (data.key == undefined) {
      // d is a hit
      d = map.locationPoint({lon: data[10], lat: data[9]});
    } else {
      // d is an event
      d = map.locationPoint({lon: data.value[15], lat: data.value[14]});
    }
    return "translate(" + d.x + "," + d.y + ")";
  }

  function transformX(data) {
    var source = map.locationPoint({lon: data.source_lon, lat: data.source_lat});
    var hit = map.locationPoint({lon: data.hit_lon, lat: data.hit_lat});
    return source.x-hit.x;
  }

  function transformY(data) {
    var source = map.locationPoint({lon: data.source_lon, lat: data.source_lat});
    var hit = map.locationPoint({lon: data.hit_lon, lat: data.hit_lat});
    return source.y-hit.y;
  }

  function click(d) {
    toggleEvent(d);
  }

  function toggleEvent(d) {
    // check for existing selected events
    var existing = layer.select("g.selected");
    var id = d.value[0];

    // if no event is selected, populate newly selected
    if (existing.empty()) {
      layer.select("g#e"+id)
          .attr("class", "event selected")
        .select("circle")
          .attr("r", 6)
          .style("fill-opacity", .8);
      populateHits(d);
    } else {
      // deselect selected events and remove all hit markers
      existing.attr("class", "event")
        .select("circle")
          .attr("r", 4.5)
          .style("fill-opacity", .5);
      layer.selectAll("g.hit").remove();
      // if selected event is not the newly selected, populate newly selected
      if (existing.attr("id") != "e"+id) {
        layer.select("g#e"+id)
            .attr("class", "event selected")
          .select("circle")
            .attr("r", 6)
            .style("fill-opacity", .8);
        populateHits(d);
      } else {
        map.center({lat: 30.5, lon: -9.5})
          .zoom(1.5)
      }
    }
  }

  function populateHits(d) {
    map.zoom(2.5)
      .center({lat: d.value[14], lon: d.value[15]})
    $.each(d.value[46], function() {
      // code to highlight hit
      var subMarker = layer.insert("svg:g", "#e"+d.value[0])
          .datum(this)
          .attr("transform", transform)
          .attr("class", "hit")
          .attr("source", d.value[0]);
      
      // code to create line
      subMarker.append("svg:line")
          .datum({
              "source_lon": d.value[15],
              "source_lat": d.value[14],
              "hit_lon": this[10],
              "hit_lat": this[9]
          })
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", transformX)
          .attr("y2", transformY)
          .attr("class", "line");

      subMarker.append("svg:circle")
          .attr("r", 4.5);
    });

    $('svg g.hit>circle').on("mouseover", function() {
      $('svg g.hit>circle').tipsy({
        gravity: $.fn.tipsy.autoWE,
        html: true,
        title: function() {
          var d = this.__data__;
          var distance = d[12], w = d[15], deaths = d[20], l = d[8] + ", " + d[6];
          return  'Distance: <span style="color: orange">' + distance + ' km</span><br />' +
                  'Water Height: <span style="color: orange">' + w + '</span><br />' +
                  'Deaths: <span style="color: orange">' + (deaths ? deaths : 0) + '</span><br />' +
                  'Location: <span style="color: orange">' + l + '</span>';
        }
      });
    });
  }

  $('svg g.event>circle').tipsy({
    gravity: $.fn.tipsy.autoWE,
    html: true,
    title: function() {
      var d = this.__data__;
      var date = d.date, m = d.value[10], w = d.value[17], deaths = d.value[34], l = d.value[13] + ", " + d.value[11];
      return  'Date: <span style="color: orange">' + date.toDateString() + '</span><br />' +
              'Magnitude: <span style="color: orange">' + m + ' Richter</span><br />' +
              'Max Water Height: <span style="color: orange">' + (w ? w : 0) + ' m</span><br />' +
              'Total Deaths: <span style="color: orange">' + (deaths ? deaths : 0) + '</span><br />' +
              'Location: <span style="color: orange">' + l + '</span>';
    }
  });

  /************CHART CODE******************/
  var v = 10;
  var paused = false;

  var maxMag = d3.max(dataset, function(d) { return d.value[v]; });
  var yScale = d3.scale.linear().domain([0, maxMag]).range([10, h]);
  var xScale = d3.fisheye.scale(d3.scale.linear).domain([0, dataset.length]).range([0, w]).focus(w/2);
  var xAxis;

  //Color
  var startColor = "#FFFFFF";
  var endColor = "#FF7F00";
  var colorScale = d3.scale.pow()
      .domain([10, h])
      .range([startColor, endColor]);

  //Color
  function richterColors(d) {
    return d3.rgb(colorScale(d)).darker(0.0).toString();
  }
  
  var bar = svg.append("g")
      .attr("class", "bars")
      .selectAll(".bar")
      .data(dataset)
    .enter().append("rect")
      .attr("class", "bar")
    .attr("y", yPosition) //if you want the bar to grow downwards, put 0!!!!!! WHEEEE!!!
      .attr("width", w/dataset.length)
      .attr("height", height)
      .attr("fill", fill)
      .on("click", click)
      .call(position);
    
  function yPosition(d) {
    var value;
    if (d.value[v] == null || d.value[v] == 0) {
      value = 0.01;
    } else {
      value = d.value[v];
    }
    var height = h - yScale(value);
    return (height == 200 ? 190 : height);
  }
  
  function height(d) {
    var height = d.value[v];
    return (height == 0 || height == null ? 10 : yScale(height));
  }
  
  function fill(d) {
    return richterColors(height(d));
  }
  
  $('svg rect.bar').tipsy({
    gravity: $.fn.tipsy.autoWE,
    html: true,
    title: function() {
      var field;
      if(v == 10) {
        field = "Magnitude";
      } else if (v == 22) {
        field = "Deaths";
      } else if (v == 17) {
        field = "Max Water Height";
      }
    
      var a = this.__data__, c = a.value[v], e = a.value[1], f = a.value[13];
      return  field + ': <span style="color: orange' + '">' + c + '</span><br>Year: <span style="color: orange' + '">' + e + '</span><br>Location: <span style="color: orange' + '">' + f + '</span>';
    }
  });
  
  $(window).keyup(function(e) {
    if (e.which == 32) {
      if (!paused) {
        paused = true;
      } else {
        paused = false;
      }
    } else if (e.which == 27) {
      stopRotating = false;
      spin();
      // deselect selected events and remove all hit markers
      azimuthal.select("circle.source-selected")
          .attr("class", "source")
          .attr("r", 4.5);
      azimuthal.selectAll("circle.invis").each(function(d, i) {
        d3.select(this).attr("class", "source");
      });
      azimuthal.selectAll("circle.hit").remove();
      azimuthal.selectAll("path.line").remove();
      clearDetails();
      refresh();
    }
  });

  // Positions the bars based on data.
  function position(bar) {
    if (!paused) {
      bar.attr("x", function(d, i) {
        return xScale(i);
      });
      bar.attr("width", function(d, i) {
        return xScale(i+1) - xScale(i);
      });
    }
  }

  svg.on("mousemove", function() {
    var mouse = d3.mouse(this);
    xScale.distortion(5).focus(mouse[0]);
    bar.call(position);
  });
  
  function redraw() {
    maxMag = d3.max(dataset, function(d) { return d.value[v]; });
    yScale = d3.scale.log().domain([0.01, maxMag]).range([10, h]);
    colorScale = d3.scale.pow()
        .domain([0, h])
        .range([startColor, endColor]);
    bar.attr("height", height)
        .attr("y", yPosition)
        .attr("fill", fill);    
  }
    
  var ex1 = document.getElementById('magnitude');
  var ex2 = document.getElementById('death');
  var ex3 = document.getElementById('waterHeight');
  ex1.onclick = handler;
  ex2.onclick = handler;
  ex3.onclick = handler;

  function handler() {
    var frm = document.forms['filter'].elements;
    var radios = frm['variable'];
    if (radios[0].checked) {
      v = 10;
      maxMag = d3.max(dataset, function(d) { return d.value[v]; });
      yScale = d3.scale.linear().domain([0, maxMag]).range([10, h]);
      
      colorScale = d3.scale.pow()
          .domain([10, h])
          .range([startColor, endColor]);
      
      bar.attr("y", yPosition)
      .attr("height", height)
      .attr("fill", fill);
      
    } else if (radios[1].checked) {
      v = 22;
      redraw();
    } else if (radios[2].checked) {
      v = 17;
      redraw();
    }
  }
});