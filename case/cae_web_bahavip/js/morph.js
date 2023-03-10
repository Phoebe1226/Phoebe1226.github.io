/**
 * demo1.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2017, Codrops
 * http://www.codrops.com
 */
{
  // Helper vars and functions.
  const extend = function(a, b) {
    for( let key in b ) {
      if( b.hasOwnProperty( key ) ) {
        a[key] = b[key];
      }
    }
    return a;
  };

  // from http://www.quirksmode.org/js/events_properties.html#position
  const getMousePos = function(ev) {
    let posx = 0;
    let posy = 0;
    if (!ev) ev = window.event;
    if (ev.pageX || ev.pageY)   {
      posx = ev.pageX;
      posy = ev.pageY;
    }
    else if (ev.clientX || ev.clientY)  {
      posx = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return { x : posx, y : posy };
  };

  const TiltObj = function(el, options) {
    this.el = el;
    this.options = extend({}, this.options);
    extend(this.options, options);
    this.DOM = {};
    this.DOM.img = this.el.querySelector('.content__img');
    this.DOM.title = this.el.querySelector('.content__title');
    this._initEvents();
  };

  TiltObj.prototype.options = {
    movement: {
      img : { translation : {x: -10, y: -10} },
      title : { translation : {x: 25, y: 25} },
    }
  };

  TiltObj.prototype._initEvents = function() {
    this.mouseenterFn = (ev) => {
      anime.remove(this.DOM.img);
      anime.remove(this.DOM.title);
    };

    this.mousemoveFn = (ev) => {
      requestAnimationFrame(() => this._layout(ev));
    };

    this.mouseleaveFn = (ev) => {
      requestAnimationFrame(() => {
        anime({
          targets: [this.DOM.img, this.DOM.title],
          duration: 1500,
          easing: 'easeOutElastic',
          elasticity: 400,
          translateX: 0,
          translateY: 0
        });
      });
    };

    this.el.addEventListener('mousemove', this.mousemoveFn);
    this.el.addEventListener('mouseleave', this.mouseleaveFn);
    this.el.addEventListener('mouseenter', this.mouseenterFn);
  };

  TiltObj.prototype._layout = function(ev) {
    // Mouse position relative to the document.
    const mousepos = getMousePos(ev);
    // Document scrolls.
    const docScrolls = {left : document.body.scrollLeft + document.documentElement.scrollLeft, top : document.body.scrollTop + document.documentElement.scrollTop};
    const bounds = this.el.getBoundingClientRect();
    // Mouse position relative to the main element (this.DOM.el).
    const relmousepos = { x : mousepos.x - bounds.left - docScrolls.left, y : mousepos.y - bounds.top - docScrolls.top };

    // Movement settings for the animatable elements.
    const t = {
      img: this.options.movement.img.translation,
      title: this.options.movement.title.translation,
    };

    const transforms = {
      img : {
        x: (-1*t.img.x - t.img.x)/bounds.width*relmousepos.x + t.img.x,
        y: (-1*t.img.y - t.img.y)/bounds.height*relmousepos.y + t.img.y
      },
      title : {
        x: (-1*t.title.x - t.title.x)/bounds.width*relmousepos.x + t.title.x,
        y: (-1*t.title.y - t.title.y)/bounds.height*relmousepos.y + t.title.y
      }
    };
    this.DOM.img.style.WebkitTransform = this.DOM.img.style.transform = 'translateX(' + transforms.img.x + 'px) translateY(' + transforms.img.y + 'px)';
    this.DOM.title.style.WebkitTransform = this.DOM.title.style.transform = 'translateX(' + transforms.title.x + 'px) translateY(' + transforms.title.y + 'px)';
  };

  const DOM = {};
  DOM.svg = document.querySelector('.morph');
  DOM.shapeEl = DOM.svg.querySelector('path');
  DOM.contentElems = Array.from(document.querySelectorAll('.content-wrap'));
  DOM.contentLinks = Array.from(document.querySelectorAll('.content__link'));
  DOM.footer = document.querySelector('.content--related');
  const contentElemsTotal = DOM.contentElems.length;
  const shapes = [

    {
      path: 'M 262.9,252.2 C 210.1,338.2 212.6,487.6 288.8,553.9 372.2,626.5 511.2,517.8 620.3,536.3 750.6,558.4 860.3,723 987.3,686.5 1089,657.3 1168,534.7 1173,429.2 1178,313.7 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
      pathAlt: 'M 262.9,252.2 C 210.1,338.2 273.3,400.5 298.5,520 323.7,639.6 511.2,537.2 620.3,555.7 750.6,577.8 872.2,707.4 987.3,686.5 1102,665.6 1218,547.8 1173,429.2 1128,310.6 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
      scaleX: 1.2,
      scaleY: 1,
      rotate: 0,
      tx: -30,
      ty: -250,
      fill: {
        color: '#48853c',
        opacity: '0.5',
        duration: 500,
        easing: 'linear'
      },
      animation: {
        path: {
          duration: 3000,
          easing: 'easeOutElastic',
          elasticity: 600
        },
        svg: {
          duration: 2000,
          easing: 'easeOutElastic'
        }
      }
    },
    {
      path: 'M 262.9,252.2 C 210.1,338.2 212.6,487.6 288.8,553.9 372.2,626.5 511.2,517.8 620.3,536.3 750.6,558.4 860.3,723 987.3,686.5 1089,657.3 1168,534.7 1173,429.2 1178,313.7 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
      pathAlt: 'M 262.9,252.2 C 210.1,338.2 273.3,400.5 298.5,520 323.7,639.6 511.2,537.2 620.3,555.7 750.6,577.8 872.2,707.4 987.3,686.5 1102,665.6 1218,547.8 1173,429.2 1128,310.6 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
      scaleX: 1.5,
      scaleY: 1,
      rotate: -20,
      tx: 0,
      ty: 0,
      fill: {
        color: '#4b8141',
        duration: 500,
        easing: 'linear'
      },
      animation: {
        path: {
          duration: 3000,
          easing: 'easeOutQuad',
          elasticity: 600
        },
        svg: {
          duration: 3000,
          easing: 'easeOutElastic'
        }
      }
    }
  ];
  let step;

  const initShapeLoop = function(pos) {
    pos = pos || 0;
    anime.remove(DOM.shapeEl);
    anime({
      targets: DOM.shapeEl,
      easing: 'linear',
      d: [{value: shapes[pos].pathAlt, duration:3500}, {value: shapes[pos].path, duration:3500}],
      loop: true,
      fill: {
        value: shapes[pos].fill.color,
        duration: shapes[pos].fill.duration,
        easing: shapes[pos].fill.easing
      },
      direction: 'alternate'
    });
  };

  const initShapeEl = function() {
    anime.remove(DOM.svg);
    anime({
      targets: DOM.svg,
      duration: 1,
      easing: 'linear',
      scaleX: shapes[0].scaleX,
      scaleY: shapes[0].scaleY,
      translateX: shapes[0].tx+'px',
      translateY: shapes[0].ty+'px',
      rotate: shapes[0].rotate+'deg'
    });

    initShapeLoop();
  };

  const createScrollWatchers = function() {
    DOM.contentElems.forEach((el,pos) => {
      const scrollElemToWatch = pos ? DOM.contentElems[pos] : DOM.footer;
      pos = pos ? pos : contentElemsTotal;
      const watcher = scrollMonitor.create(scrollElemToWatch,-300);

      watcher.enterViewport(function() {
        step = pos;
        anime.remove(DOM.shapeEl);
        anime({
          targets: DOM.shapeEl,
          duration: shapes[pos].animation.path.duration,
          easing: shapes[pos].animation.path.easing,
          elasticity: shapes[pos].animation.path.elasticity || 0,
          d: shapes[pos].path,
          fill: {
            value: shapes[pos].fill.color,
            duration: shapes[pos].fill.duration,
            easing: shapes[pos].fill.easing
          },
          complete: function() {
            initShapeLoop(pos);
          }
        });

        anime.remove(DOM.svg);
        anime({
          targets: DOM.svg,
          duration: shapes[pos].animation.svg.duration,
          easing: shapes[pos].animation.svg.easing,
          elasticity: shapes[pos].animation.svg.elasticity || 0,
          scaleX: shapes[pos].scaleX,
          scaleY: shapes[pos].scaleY,
          translateX: shapes[pos].tx+'px',
          translateY: shapes[pos].ty+'px',
          rotate: shapes[pos].rotate+'deg'
        });
      });

      watcher.exitViewport(function() {
        const idx = !watcher.isAboveViewport ? pos-1 : pos+1;

        if( idx <= contentElemsTotal && step !== idx ) {
          step = idx;
          anime.remove(DOM.shapeEl);
          anime({
            targets: DOM.shapeEl,
            duration: shapes[idx].animation.path.duration,
            easing: shapes[idx].animation.path.easing,
            elasticity: shapes[idx].animation.path.elasticity || 0,
            d: shapes[idx].path,
            fill: {
              value: shapes[idx].fill.color,
              duration: shapes[idx].fill.duration,
              easing: shapes[idx].fill.easing
            },
            complete: function() {
              initShapeLoop(idx);
            }
          });

          anime.remove(DOM.svg);
          anime({
            targets: DOM.svg,
            duration: shapes[idx].animation.svg.duration,
            easing: shapes[idx].animation.svg.easing,
            elasticity: shapes[idx].animation.svg.elasticity || 0,
            scaleX: shapes[idx].scaleX,
            scaleY: shapes[idx].scaleY,
            translateX: shapes[idx].tx+'px',
            translateY: shapes[idx].ty+'px',
            rotate: shapes[idx].rotate+'deg'
          });
        }
      });
    });
  };

  const init = function() {
    imagesLoaded(document.body, () => {
      initShapeEl();
      createScrollWatchers();
      Array.from(document.querySelectorAll('.content--layout')).forEach(el => new TiltObj(el));
      // Remove loading class from body
      document.body.classList.remove('loading');
    });
  }

  init();
};