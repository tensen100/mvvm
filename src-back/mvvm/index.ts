// import { render } from './render';
// import { createElement } from './create-element';
// import { reconcile } from './reconcile';
//
// class Component{
//     isReactComponent = {}
//     private props;
//     protected state = {};
//     constructor(props) {
//         this.props = props;
//     }
//     setState(partialState) {
//         this.state = Object.assign({}, this.state, partialState);
//         // update instance
//         const parentDom = this.__internalInstance.dom.parentNode;
//         const element = this.__internalInstance.element;
//         reconcile(parentDom, this.__internalInstance, element);
//     }
// }
//
// export const MVVM =  {
//     render,
//     Component,
//     createElement
// }
