const { Projection } = Osef.domain;

class BoardProjection extends Projection {
    boardCreated(e) {
        return this.add(e.id, function(s) {
            s.id = e.id;
            s.name = e.name;
            return s;
        });
    }

    cardListCreated(e) {
        return this.update(e.boardId, function(s) {
            s.cardLists.push({
                id: e.id,
                title: e.title,
                cards: []
            });
            return s;
        });
    }

    cardCreated(e) {
        return this.update(e.boardId, function(s) {
            s.cardLists.filter(function(list) {
                return list.id == e.listId;
            })[0].cards.push({ id: e.id, title: e.title });
            return s;
        });
    }
}

export default BoardProjection;