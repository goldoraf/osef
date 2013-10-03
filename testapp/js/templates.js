this["JST"] = this["JST"] || {};

this["JST"]["board"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n                    <div class=\"card-list\">\n                        <h4>"
    + escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\n                        ";
  stack2 = helpers.each.call(depth0, depth0.cards, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                        <div class=\"card-composer\">\n                            <form class=\"create-card\">\n                                <input type=\"hidden\" name=\"listId\" value=\""
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\n                                <textarea name=\"title\"></textarea>\n                                <input type=\"submit\" value=\"Add\" />\n                            </form>\n                        </div>\n                    </div>\n                ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                            <div class=\"card\">\n                                "
    + escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n                            </div>\n                        ";
  return buffer;
  }

  buffer += "<section>\n    <aside>\n        <h3>Add a list</h3>\n        <form class=\"create-list\">\n            <textarea name=\"title\"></textarea>\n            <input type=\"submit\" value=\"Add\" />\n        </form>\n        <h3>Activity</h3>\n    </aside>\n    <section class=\"board-view\">\n        <header>\n            <h2>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h2>\n        </header>\n        <section class=\"grid\">\n            <div class=\"grid"
    + escapeExpression(((stack1 = ((stack1 = depth0.cardLists),stack1 == null || stack1 === false ? stack1 : stack1.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n                ";
  stack2 = helpers.each.call(depth0, depth0.cardLists, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            </div>\n        </section>\n    </section>\n</section>";
  return buffer;
  });

this["JST"]["boards"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

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
  stack1 = helpers.each.call(depth0, depth0.boards, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>";
  return buffer;
  });

this["JST"]["layout"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<header id=\"launchbar\">\n    <nav>\n        <ul>\n            <li><a href=\"#/boards\">Boards</a></li>\n        </ul>\n    </nav>\n</header>\n\n<section id=\"main\"></section>\n\n<footer></footer>\n\n";
  });