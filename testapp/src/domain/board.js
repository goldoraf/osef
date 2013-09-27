const { Aggregate, AggregateState } = Osef.domain;

class Board extends Aggregate {
    constructor(identifier) {
        super(identifier);
        this.state = new BoardState();
    }

    create(name) {
        this.apply(this.toEvent('boardCreated', { id: this.identifier, name: name }));
    }

    getType() {
        return 'Board';
    }
}

class BoardState extends AggregateState {
    boardCreated(e) {
        this.id = e.id;
        this.name = e.name;
    }
}

export default Board;