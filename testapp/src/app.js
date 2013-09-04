
import { View } from '../src/view.js';

class TestView extends View {
    constructor(context) {
        super(context);
        this.templateName = 'test.hbs';
    }
}

var view = new TestView();
view.render().append();
