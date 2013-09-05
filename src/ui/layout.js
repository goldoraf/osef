import View from './view';
import ViewGroup from './view_group';

class Layout extends View {
    constructor() {
        super();
        this.zones = [];
    }

    render() {
        super();
        this.append();
        for (var name in this.zones) {
            this[name] = new ViewGroup(this.zones[name]);
        }
        return this;
    }
}

export default Layout;