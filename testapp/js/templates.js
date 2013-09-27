this["JST"] = this["JST"] || {};

this["JST"]["boards"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <li class=\"board-list-elt\"><a href=\"#/board/"
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = depth0.name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></li>\n    ";
  return buffer;
  }

  buffer += "<h2>Boards</h2>\n\n<h3>Create board</h3>\n<form id=\"create-board\">\n    <label>Name:</label>\n    <input type=\"text\" name=\"name\" />\n    <input type=\"submit\" value=\"Create\" />\n</form>\n\n<ul class=\"board-list\">\n    ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.state),stack1 == null || stack1 === false ? stack1 : stack1.boards), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</ul>";
  return buffer;
  });

this["JST"]["layout"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"launchbar\"></div>\n\n<div class=\"page-wrapper two-column\">\n    <div class=\"testapp-sidebar page-sidebar\">\n        <div class=\"sidebar-section navigation\">\n            <div class=\"sidebar-section-content\">\n                <ul>\n                    <li class=\"sidebar-menu-item\"><a href=\"#/boards\">Boards</a></li>\n                </ul>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"page-content-wrapper\">\n        <div class=\"page-content\">\n            <div id=\"main\" class=\"testapp-content\"></div>\n            <div class=\"page-footer-wrapper\"></div>\n        </div>\n        <div id=\"footer\" class=\"page-footer\"></div>\n    </div>\n\n</div>";
  });