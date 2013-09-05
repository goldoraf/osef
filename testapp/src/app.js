
const { View } = Osef.ui;

class TestView extends View {
    constructor(context) {
        super(context);
        this.templateName = 'test';
    }
}

var view = new TestView();
view.render().append();
