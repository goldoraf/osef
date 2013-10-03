const { Aggregate, AggregateState } = Osef.domain;

class Card extends Aggregate {
    constructor(identifier) {
        super(identifier);
        this.state = new CardState();
    }

    create(boardId, listId, title) {
        this.apply(this.toEvent('cardCreated', { id: this.identifier, listId: listId, boardId: boardId, title: title }));
    }

    getType() {
        return 'Card';
    }
}

class CardState extends AggregateState {
    cardCreated(e) {
        this.id = e.id;
        this.title = e.title;
        this.listId = e.listId;
        this.boardId = e.boardId;
    }
}

export default Card;