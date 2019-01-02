/* global localStorage */

(function () {
  'use strict'

  if (!window.addEventListener) return // Check for IE9+

  // Prevent the cookie banner from being displayed within iFrames
  if (window.frameElement) return

  var options = INSTALL_OPTIONS
  var element

  function getMaxZIndex () {
    var max = 0
    var elements = document.getElementsByTagName('*')

    Array.prototype.slice.call(elements).forEach(function (element) {
      var zIndex = parseInt(document.defaultView.getComputedStyle(element).zIndex, 10)

      max = zIndex ? Math.max(max, zIndex) : max
    })

    return max
  }

  function hideAlert (e) {
    e.preventDefault()
    element.style.display = 'none'
    document.cookie = 'coockiless=1; expires=Thu, 18 Dec 2050 12:00:00 UTC'
    if (localStorage) {
      localStorage.coockiless = 1
    }
  }

  // updateElement runs every time the options are updated.
  // Most of your code will end up inside this function.
  function updateElement () {
    if (localStorage && localStorage.coockiless) return

    element = INSTALL.createElement({selector: 'body', method: 'append'}, element)

    // Set the app attribute to your app's dash-delimited alias.
    element.setAttribute('app', 'cookiless')
    element.style.zIndex = getMaxZIndex() + 1

    var ckElement = document.createElement('cookiless-div')

    ckElement.className = 'ckcontent'
    ckElement.style.opacity = options.opacity / 100

    var ckPolicyText = document.createElement('policy-text')
    ckPolicyText.textContent = options.policyText

    var ckAcceptButton = document.createElement('a')
    ckAcceptButton.className = 'iAccept'
    ckAcceptButton.textContent = options.acceptButton

    ckElement.appendChild(ckPolicyText)
    ckElement.appendChild(ckAcceptButton)

    element.appendChild(ckElement)

    element.querySelectorAll('.iAccept')[0].addEventListener('click', hideAlert)
  }

  // This code ensures that the app doesn't run before the page is loaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateElement)
  } else {
    updateElement()
  }

  // INSTALL_SCOPE is an object that is used to handle option changes without refreshing the page.
  window.INSTALL_SCOPE = {
    setOptions: function setOptions (nextOptions) {
      options = nextOptions
      updateElement()
    }
  }
}())
