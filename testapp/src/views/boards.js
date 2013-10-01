const { View } = Osef.ui;
const { EventBus } = Osef.wires;

class BoardsView extends View {
    constructor(context) {
        super(context);
        this.templateName = 'boards';
        this.events = {
            'submit #create-board': 'createBoard'
        };
    }

    setContext(context) {
        super(context);
        var that = this;
        EventBus.subscribe('projections.board-list.changed', function(msg, data) {
            that.context = data;
            that.contextChanged();
        });
    }

    createBoard(e) {
        e.preventDefault();
        this.trigger('ui.createBoard', { name: this.$('#create-board').name.value });
    }
}

export default BoardsView;