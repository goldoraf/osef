
const { StateManager } = Osef.ui;

import TestView from './views/test';
import AppLayout from './views/layout';

var stateManager = new StateManager(),
    layout = new AppLayout();
    
layout.render();
layout.main.addView(new TestView());
