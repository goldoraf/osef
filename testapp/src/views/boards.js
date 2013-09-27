const { View } = Osef.ui;

class BoardsView extends View {
    constructor(context) {
        super(context);
        this.templateName = 'boards';
        this.events = {
            'submit #create-board': 'createBoard'
        };
    }

    createBoard(e) {
        e.preventDefault();
        this.trigger('uiCreateBoard', { name: this.$('#create-board').name.value });
    }
}

export default BoardsView;