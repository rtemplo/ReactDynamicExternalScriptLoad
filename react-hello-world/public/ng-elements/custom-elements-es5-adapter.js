// WARNING! This file contains some subset of JS that is not supported by type inference.
// You can try checking 'Transpile to ES5' checkbox if you want the types to be inferred
/**
 * @license

Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
"use strict"
;(function() {
  ;(() => {
    if (!window.customElements) {
      return
    }
    const parentClazz = window.HTMLElement
    const nativeDefine = window.customElements.define
    const nativeGet = window.customElements.get
    const tagnameByConstructor = new Map()
    const constructorByTagname = new Map()
    let f = false
    let g = false
    window.HTMLElement = function() {
      if (!f) {
        const tagname = tagnameByConstructor.get(this.constructor)
        const Error = nativeGet.call(window.customElements, tagname)
        g = true
        const instance = new Error()
        return instance
      }
      f = false
    }
    window.HTMLElement.prototype = parentClazz.prototype
    Object.defineProperty(window, "customElements", {
      value: window.customElements,
      configurable: true,
      writable: true
    })
    Object.defineProperty(window.customElements, "define", {
      value: (tagname, elementClass) => {
        const elementProto = elementClass.prototype
        const StandInElement = class extends parentClazz {
          constructor() {
            super()
            Object.setPrototypeOf(this, elementProto)
            if (!g) {
              f = true
              elementClass.call(this)
            }
            g = false
          }
        }
        const standInProto = StandInElement.prototype
        StandInElement.observedAttributes = elementClass.observedAttributes
        standInProto.connectedCallback = elementProto.connectedCallback
        standInProto.disconnectedCallback = elementProto.disconnectedCallback
        standInProto.attributeChangedCallback =
          elementProto.attributeChangedCallback
        standInProto.adoptedCallback = elementProto.adoptedCallback
        tagnameByConstructor.set(elementClass, tagname)
        constructorByTagname.set(tagname, elementClass)
        nativeDefine.call(window.customElements, tagname, StandInElement)
      },
      configurable: true,
      writable: true
    })
    Object.defineProperty(window.customElements, "get", {
      value: a => {
        return constructorByTagname.get(a)
      },
      configurable: true,
      writable: true
    })
  })()
})()
