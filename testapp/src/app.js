
const { StateManager, ViewContext } = Osef.ui;
const { EventStore, KeyValueStore, LocalstorageEventStoreAdapter } = Osef.storage;
const { EventBus } = Osef.wires;

import BoardsView from './views/boards';
import BoardView from './views/board';
import AppLayout from './views/layout';

import { Board, CardList } from './domain/board';
import BoardListProjection from './domain/projections/board_list';
import BoardProjection from './domain/projections/board';

var eventStore = new EventStore(new LocalstorageEventStoreAdapter('testapp:events')),
    docStore = KeyValueStore.open('testapp:projections'),
    boardListProj = new BoardListProjection(docStore),
    boardProj = new BoardProjection(docStore);

EventBus.subscribe('ui.createBoard', function(msg, data) {
    var board = new Board();
    board.create(data.name);
    eventStore.appendToStream(board.getStreamId(), 0, board.changes);
});

EventBus.subscribe('ui.createList', function(msg, data) {
    var board = new Board(data.boardId);
    var eventStream = eventStore.loadEventStream(board.getStreamId());
    board.loadFromHistory(eventStream.events);
    var list = board.createList(data.title);
    eventStore.appendToStream(list.getStreamId(), 0, list.changes);
});

EventBus.subscribe('ui.createCard', function(msg, data) {
    var list = new CardList(data.listId);
    var eventStream = eventStore.loadEventStream(list.getStreamId());
    list.loadFromHistory(eventStream.events);
    var card = list.createCard(data.title);
    eventStore.appendToStream(card.getStreamId(), 0, card.changes);
});

EventBus.subscribe('domain.board-*', function(msg, data) {
    boardListProj.project(data);
    boardProj.project(data);
});

EventBus.subscribe('domain.cardlist-*', function(msg, data) {
    boardProj.project(data);
});

EventBus.subscribe('domain.card-*', function(msg, data) {
    boardProj.project(data);
});

var stateManager = new StateManager(),
    layout = new AppLayout();
    
layout.render();

stateManager.addState('boards', function(params) {
    var view = new BoardsView();
    boardListProj.getOrCreate('board-list')
        .then(function(list) {
            view.setContext(list);
            layout.main.show(view);
        });
});

stateManager.addState('board/{id}', function(params) {
    var view = new BoardView();
    boardProj.get(params.id)
        .then(function(board) {
            view.setContext(board);
            layout.main.show(view);
        });
});

stateManager.defaultTo('boards');
stateManager.run();