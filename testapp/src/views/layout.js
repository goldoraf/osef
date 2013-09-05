const { Layout } = Osef.ui;

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

export default AppLayout;