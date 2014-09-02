;(function (exports) {
  var Line = exports.Line = function (container, options) {
    this.container = container;
    var dom = $("#" + container);

    var defaults = {};
    defaults.width = options.width || dom.width() || 400;
    defaults.height = options.height || dom.height() || 200;
    defaults.margin = options.margin || {top: 20, right: 20, bottom: 30, left: 50};
    defaults.max = options.max || 100;
    defaults.min = options.min || 0;
    defaults.gridNum = options.gridNum || 4;
    defaults.xAxisStyle = options.xAxisStyle || {'fill': 'none', 'stroke': '#000', 'stroke-width': '1px'};
    defaults.yAxisStyle = options.yAxisStyle || {'fill': 'none', 'stroke': '#000', 'stroke-width': '1px'};
    defaults.lineStyle = options.lineStyle || {'fill': 'none', 'stroke-width': '1.5px'};
    defaults.colorList = options.colorList || ['#eee', '#d6e685', '#8cc665', '#44a340', '#1e6823'];
    defaults.getColor = options.getColor || function (num) {
      return defaults.colorList[num % defaults.colorList.length];
    };

    this.defaults = defaults;
  };

  Line.prototype.loadData = function (data) {
    if (!data) {
      return false;
    }
    this.data = data;
  };

  Line.prototype._getSVG = function () {
    var conf = this.defaults;
    var container = this.container;

    var svg = d3.select("#" + container).append("svg")
      .attr({
        'width': conf.width,
        'height': conf.height,
      });

    return svg;
  }

  Line.prototype.render = function (callback) {
    var svg = this._getSVG();
    var conf = this.defaults;
    var margin = conf.margin;
    var width = conf.width - margin.left - margin.right;
    var height = conf.height - margin.top - margin.bottom;
    var min = conf.min;
    var max = conf.max;
    var gridNum = conf.gridNum;
    var getColor = conf.getColor;

    var data = this.data;

    var paper = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    x.domain(data.map(function(d) { return d.date; }));
    y.domain([min, max]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yTicks = [];
    var yStep = (max - min) / (gridNum - 1);
    for (var i = 0; i < gridNum; i++) {
      yTicks.push(min + yStep * i);
    }

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickValues(yTicks)
        .orient('left');

    var xAxisNode = paper.append('g')
        .attr({
          'class': 'x axis',
          'transform': 'translate(0,' + height + ')'
        })
        .call(xAxis);

    xAxisNode.selectAll('.axis path, .axis line').style(conf.xAxisStyle);

    var yAxisNode = paper.append('g')
        .attr({ 'class': 'y axis' })
        .call(yAxis);

    yAxisNode.selectAll('.axis path, .axis line').style(conf.yAxisStyle);

    var line = d3.svg.line()
        .x(function(d) { return x(d.date) + x.rangeBand() / 2; })
        .y(function(d) { return y(d.value); });

    paper.append('path')
      .datum(data)
      .attr({
        'class': 'line',
        'd': line,
        'stroke': getColor(0),
      })
      .style(conf.lineStyle);

    callback = callback || function () {;};
    callback();
  };

})(window.Chart = window.Chart || {});

