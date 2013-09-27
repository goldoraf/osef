
const { StateManager, ViewContext } = Osef.ui;
const { EventStore, KeyValueStore, LocalstorageEventStoreAdapter } = Osef.storage;
const { EventBus } = Osef.wires;

import BoardsView from './views/boards';
import AppLayout from './views/layout';

import Board from './domain/board';
import BoardListProjection from './domain/projections/board_list';

var eventStore = new EventStore(new LocalstorageEventStoreAdapter('testapp')),
    docStore = KeyValueStore.open('testapp'),
    boardListProj = new BoardListProjection(docStore);

EventBus.subscribe('uiCreateBoard', function(msg, data) {
    var board = new Board();
    board.create(data.name);
    eventStore.appendToStream(board.getStreamId(), 0, board.changes);
});

/*EventBus.subscribe('uiRenameBoard', function(data) {
    var board = new Board(data.id);
    var eventStream = eventStore.loadEventStream(board.getStreamId());
    board.loadFromHistory(eventStream.events);
    board.rename(data.name);
    eventStore.appendToStream(board.getStreamId(), eventStream.version, board.changes);
});*/

EventBus.subscribe('domain.board-*', function(msg, data) {
    boardListProj.project(data);
});

var stateManager = new StateManager(),
    layout = new AppLayout();
    
layout.render();

stateManager.addState('boards', function(params) {
    var view = new BoardsView();
    docStore.get('board-list')
        .then(function(list) {
            view.setContext(new ViewContext(list));
            layout.main.show(view);
        });
});

stateManager.defaultTo('boards');
stateManager.run();