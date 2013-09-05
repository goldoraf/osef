describe('ViewGroup tests', function() {
    var container;

    beforeEach(function() {
        container = document.createElement('div');
        container.id = 'container';
        document.body.appendChild(container);
    });

    afterEach(function() {
        if (container) {
            container.parentNode.removeChild(container);
        }
    });

    it('should add a view to a container', function() {
        var group = new Osef.ui.ViewGroup('#container');
        group.addView(new Tests.TestView())
             .then(function() {
                  chai.assert.equal('Test', document.body.querySelector('#container h1').innerHTML);
             });
    });
});