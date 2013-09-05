describe('View tests', function() {
    it('Should append to the right element', function() {
        var view = new Tests.TestView();
        view.render().append();
        chai.assert.equal('Test', document.body.querySelector('h1').innerHTML);
    });
});