
const { View, StateManager, Layout } = Osef.ui;

class TestView extends View {
    constructor(context) {
        super(context);
        this.templateName = 'test';
    }
}

class AppLayout extends Layout {
    constructor() {
        super();
        this.templateName = 'layout';
        this.zones = {
            launchbar: '#launchbar',
            main: '#main',
            footer: '#footer'
        };
    }
}

var stateManager = new StateManager(),
    layout = new AppLayout();
    
layout.render();
layout.main.addView(new TestView());
