webpackJsonp([3],{"45Yh":function(t,e,n){"use strict";function o(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function r(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0}),n.d(e,"default",function(){return d});var u,c,i=n("KM04"),s=(n.n(i),n("/QC5")),a=n("E/bI"),p=n("a2ev"),b=function(t){return{number:t.number,test:t.test}},f=Object(i.h)("h2",null,"about page"),l=Object(i.h)(s.a,{activeClassName:"active",href:"/"},"go to home page"),d=(u=Object(a.b)(b,p.d))(c=function(t){function e(){for(var e,n,r,u=arguments.length,c=Array(u),i=0;i<u;i++)c[i]=arguments[i];return e=n=o(this,t.call.apply(t,[this].concat(c))),n.addTodos=function(){n.props.addNumber(2)},n.subTest=function(){n.props.addTest(1)},r=e,o(n,r)}return r(e,t),e.prototype.render=function(){return Object(i.h)("div",null,f,l,Object(i.h)("button",{onclick:this.addTodos}," Add todo"),Object(i.h)("button",{onclick:this.subTest}," Add test"),this.props.number)},e}(i.Component))||c}});
//# sourceMappingURL=3.chunk.5b282.js.map