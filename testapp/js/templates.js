this["JST"] = this["JST"] || {};

this["JST"]["layout"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"launchbar\"></div>\n\n<div class=\"page-wrapper two-column\">\n    <div class=\"testapp-sidebar page-sidebar\">\n        <div class=\"sidebar-section navigation\">\n            <div class=\"sidebar-section-content\">\n                <ul>\n                    <li class=\"sidebar-menu-item\"><a href=\"#/boards\">Boards</a></li>\n                </ul>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"page-content-wrapper\">\n        <div class=\"page-content\">\n            <div id=\"main\" class=\"testapp-content\"></div>\n            <div class=\"page-footer-wrapper\"></div>\n        </div>\n        <div id=\"footer\" class=\"page-footer\"></div>\n    </div>\n\n</div>";
  });

this["JST"]["test"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>Test</h1>";
  });