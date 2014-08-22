;(function (exports) {
	var Matrix = exports.Matrix = function (container, options) {
		this.container = container;
		var dom = $(container);

		var defaults = {};
		defaults.width = options.width || dom.width() || 400;
		defaults.height = options.height || dom.height() || 200;
		defaults.margin = options.margin || {top: 10, right: 10, bottom: 10, left: 10};
		var gridSize = options.gridSize || 20;
		defaults.gridSize = gridSize;
		defaults.getX = function (d) { return (d.week - 1) * gridSize; };
		defaults.getY = function (d) { return (d.day - 1) * gridSize; };
		var areaColors = options.areaColors || ['#eee', '#d6e685', '#8cc665', '#44a340', '#1e6823'];
		defaults.areaColors = areaColors;
		defaults.getColor = function (d) {
			var num = d.value;
			return areaColors[num];
		};

		this.defaults = defaults;
	};

	Matrix.prototype.loadData = function (data, startDate, endDate) {
		if (!data || data.length === 0) {
			return false;
		}

		var dDays = parseInt((endDate - startDate) / 1000 / 60 / 60 /24) + 1;
		var source = [];
		var startWeek = startDate.getWeek();
		var date = new Date(startDate.valueOf());
		for (var i = 0; i < dDays; i++) {
			var day = date.getDay() + 1;
			var week = date.getWeek() - startWeek + 1;
			source.push({"week": week, "day": day, "value": 0});
			date.setDate(date.getDate() + 1);
		}

		this.source = source;
		
		function setData (item) {
			var date = new Date(item[0].toString());
			var dDay = parseInt((date - startDate) / 1000 / 60 / 60 /24);
			if (dDay < source.length) {
				source[dDay].value = item[1];
			}
		}

		for (var i = 0; i < data.length; i++) {
			setData(data[i]);
		}
	};

	Matrix.prototype._getSVG = function () {
		var container = this.container;
		var conf = this.defaults;
		var margin = conf.margin;

		var svg = d3.select("#" + container).append("svg")
      .attr("width", conf.width + margin.left + margin.right)
      .attr("height", conf.height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    return svg;
	}

	Matrix.prototype.render = function () {
		var svg = this._getSVG();
		var conf = this.defaults;
		var gridSize = conf.gridSize;
		var getColor = conf.getColor;
		var getX = conf.getX;
		var getY = conf.getY;

		var data = this.source;

		var heatMap = svg.selectAll(".day")
      .data(data)
      .enter().append("rect")
      .attr("x", function(d) { return getX(d); })
      .attr("y", function(d) { return getY(d); })
      .attr("class", "day")
      .attr("width", gridSize)
      .attr("height", gridSize)
      .style({"fill": function(d) { return getColor(d); }, "stroke": "#fff", "stroke-width": 3});
	};

})(window.Chart = window.Chart || {});
