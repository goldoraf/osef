class ViewGroup {
    constructor(containerSelector) {
        this.container = this.getContainer(containerSelector);
        this.views = [];
        this.layoutTransition = new LayoutTransition();
    }

    show(view) {
        var that = this;
        return this.removeAllViews()
                   .then(function() {
                        return that.addView(view);
                   });
    }

    addView(view) {
        this.views.push(view);
        view.render().appendTo(this.container);
        return this.layoutTransition.addChild(this.container, view.element);
    }

    removeAllViews() {
        var promises = [];
        this.views.forEach(function(view, index) {
            promises.push(this.removeView(view, index));
        }, this);
        if (promises.length === 0) return when.resolve();
        return when.all(promises);
    }

    removeView(view, index) {
        if (index === undefined) {
            // la retrouver dans le tableau...
        }

        this.views.splice(index, 1);
        
        return this.layoutTransition.removeChild(this.container, view.element)
                                    .then(function() {
                                        view.remove();
                                    });
    }

    getContainer(containerSelector) {
        var container = document.querySelector(containerSelector);
        if (container === null) {
            throw new Error("Container "+containerSelector+" not found in the DOM");
        }
        return container;
    }
}

class LayoutTransition {
    constructor() {
        this.animator = new AnimationManager();
        this.transitions = {
            'CHANGE_APPEARING': 'fadeIn',
            'CHANGE_DISAPPEARING': 'fadeOut',
            'CHANGING': 'pulse',
            'APPEARING': 'fadeIn',
            'DISAPPEARING': 'fadeOut'
        }
    }

    addChild(parentElt, elt) {
        return this.animator.animate(elt, this.transitions['APPEARING']);
    }

    removeChild(parentElt, elt) {
        return this.animator.animate(elt, this.transitions['DISAPPEARING']);
    }
}

class AnimationManager {
    constructor() {
        this.animations = {
          'animation': ['animationend', 'transitionend'],
          'OAnimation': ['oAnimationEnd', 'oTransitionEnd'],
          'MozAnimation': ['animationend', 'transitionend'],
          'WebkitAnimation': ['webkitAnimationEnd', 'webkitTransitionEnd']
        };
    }

    animate(el, type) {
        var deferred = this.registerEndEvent(el, type);
        el.className += ' animated '+type;
        return deferred.promise;
    }

    registerEndEvent(el, type) {
        var deferred = when.defer(),
            eventNames = this.getEventNames(el);

        if (!eventNames) {
            deferred.resolve(el);
        } else {
            var handler = function(e) {
                var animType = e.animationName || e.propertyName;
                if (animType && animType == type) {
                    deferred.resolve(e.currentTarget);
                }
            };

            el.addEventListener(eventNames[0], handler);
            el.addEventListener(eventNames[1], handler);
        }

        return deferred;
    }

    getEventNames(el) {
        var a;
        for (a in this.animations) {
            if (el.style[a] !== undefined) {
                return this.animations[a];
            }
        }
    }
}

export default ViewGroup;