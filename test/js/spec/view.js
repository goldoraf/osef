describe('View tests', function() {
    var view;

    beforeEach(function() {
        if (view) {
            view.remove();
        }
    });

    it('should append to the document body by default', function() {
        view = new Tests.TestView();
        view.render().append();
        chai.assert.equal('Test', document.body.querySelector('h1').innerHTML);
    });

    it('should destroy DOM representation when remove() is called', function() {
        view = new Tests.TestView();
        view.render().append();
        view.remove();
        chai.assert.equal(undefined, document.body.querySelector('h1'));
    });
});