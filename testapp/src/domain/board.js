const { Aggregate, AggregateState } = Osef.domain;

import Card from './card';

class Board extends Aggregate {
    constructor(identifier) {
        super(identifier);
        this.state = new BoardState();
    }

    create(name) {
        this.apply(this.toEvent('boardCreated', { id: this.identifier, name: name }));
    }

    createList(title) {
        var list = new CardList();
        list.create(this.identifier, title);
        return list;
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

class CardList extends Aggregate {
    constructor(identifier) {
        super(identifier);
        this.state = new CardListState();
    }

    create(boardId, title) {
        this.apply(this.toEvent('cardListCreated', { id: this.identifier, boardId: boardId, title: title }));
    }

    createCard(title) {
        var card = new Card();
        card.create(this.state.boardId, this.state.id, title);
        return card;
    }

    getType() {
        return 'CardList';
    }
}

class CardListState extends AggregateState {
    cardListCreated(e) {
        this.id = e.id;
        this.title = e.title;
        this.boardId = e.boardId;
    }
}

export { Board, CardList };