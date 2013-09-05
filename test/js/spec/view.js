describe('View tests', function() {
    it('Should append to the right element', function() {
        var view = new Tests.TestView();
        view.render().appendTo(document.body.querySelector('#osef'));
        chai.assert.equal('Test', document.body.querySelector('#osef h1').innerHTML);
    });
});