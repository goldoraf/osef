const { Projection } = Osef.domain;

class BoardListProjection extends Projection {
    constructor(store) {
        super(store);
        this.key = 'board-list';
        this.initialState = new BoardList();
    }

    boardCreated(e) {
        return this.addOrUpdate(this.key, function(s) {
            s.boards.push({ id: e.id, name: e.name });
            return s;
        });
    }
}

class BoardList {
    constructor() {
        this.boards = [];
    }
}

export default BoardListProjection;