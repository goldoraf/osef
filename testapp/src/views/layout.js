const { Layout } = Osef.ui;

class AppLayout extends Layout {
    constructor() {
        super();
        this.templateName = 'layout';
        this.zones = {
            header: 'header',
            main: '#main',
            footer: 'footer'
        };
    }
}

export default AppLayout;