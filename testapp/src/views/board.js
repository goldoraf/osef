const { View } = Osef.ui;
const { EventBus } = Osef.wires;

class BoardView extends View {
    constructor(context) {
        super(context);
        this.templateName = 'board';
        this.events = {
            'submit form.create-list': 'createList',
            'submit form.create-card': 'createCard'
        };
    }

    setContext(context) {
        super(context);
        var that = this;
        EventBus.subscribe('projections.'+context.id+'.changed', function(msg, data) {
            that.context = data;
            that.contextChanged();
        });
    }

    createList(e) {
        e.preventDefault();
        this.trigger('ui.createList', { 
            boardId: this.context.id, 
            title: this.$('form.create-list').title.value
        });
    }

    createCard(e) {
        e.preventDefault();
        var form = this.$('form.create-card');
        this.trigger('ui.createCard', { 
            listId: form.listId.value,
            title: form.title.value
        });
    }
}

export default BoardView;