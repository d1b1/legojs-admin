var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');
var Authorization = require('./authorization');

Backbone.$ = $ ;
window._ = _;
window.Backbone = Backbone;
window.Backbone.$ = $ ;
var LayoutManager = require("backboneLayoutmanager");

var Router = require('./router.js');
var router = new Router();

Backbone.Layout.configure({ manage: true });

var authConfig = {
  key: 'abc123',
  secret: 'ssh-secret'
};

var AuthService = Authorization.Header(authConfig);

var sync = Backbone.sync;
Backbone.sync = function (method, model, options) {
  options.beforeSend = function(xhr, request) {
    // Only send a signed request when we have tokens or we
    // are trying to login.
    if (signature = AuthService.getSignature(request.url, request.type)) {
      xhr.setRequestHeader('Authorization', signature);
    }
  };
  sync(method, model, options);
};

$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    options.crossDomain ={
        crossDomain: true
    };
    options.xhrFields = {
        withCredentials: false
    };
});

$.ajaxSetup({
    cache: false,
    statusCode: {
      401: function () {
        window.location.href='#login';
        window.location.reload();
      }
    }
});

$(function() {
  $('#nav-accordion').dcAccordion({
    eventType: 'click',
    autoClose: true,
    saveState: true,
    disableLink: true,
    speed: 'slow',
    showCount: false,
    autoExpand: true,
    classExpand: 'dcjq-current-parent'
  });

});

Backbone.history.start( { pushState: false } );

console.log('Starting Router');

// All navigation that is relative should be passed through the navigate
// method, to be processed by the router. If the link has a `data-bypass`
// attribute, bypass the delegation completely.
// $(document).on("click", "a:not([data-bypass])", function(evt) {
  // Get the absolute anchor href.
  // var href = $(this).prop("href");
  // Get the absolute root.
  // var root = location.protocol + "//" + location.host + app.root;

  // Ensure the protocol is not part of URL, meaning it's relative.
  // if (href && href.indexOf(root)) {
    // Stop the default event to ensure the link will not cause a page
    // refresh.
    // evt.preventDefault();

    // `Backbone.history.navigate` is sufficient for all Routers and will
    // trigger the correct events. The Router's internal `navigate` method
    // calls this anyways.  The fragment is sliced from the root.
    // Backbone.history.navigate(href.slice(root.length), true);
  // }
// });
