function JaPromise(fn) {
  let __state = 'pending';
  let __value;
  let __deferred;
  
  function __resolve(val) {
    try {
      if(val && typeof val.then === 'function') {
        val.then(resolve);
        return;
      }

      __value = val;
      __state = 'resolved';
      if(__deferred) {
        __handle(__deferred);
      }
    } catch(e) {
      __reject(e);
    }
  }

  function __reject(reason) {
    __state = 'rejected';
    __value = reason;

    if(__deferred) {
      __handle(__deferred);
    }
  }


  function __handle(handler) {
    if(__state === 'pending') {
      __deferred = handler;
      return;
    }

    if(!handler.onResolved) {
      handler.__resolve(__value);
      return;
    }
    try {
      var ret = handler.onResolved(__value);
    } catch(e) {
      handler.__reject(e);
      return;
    }
    handler.__resolve(ret);
  }

  function __handle(handler) {
    if(__state === 'pending') {
      __deferred = handler;
      return;
    }

    let handlerCallback;

    if(__state === 'resolved') {
      handlerCallback = handler.onResolved;
    } else {
      handlerCallback = handler.onRejected;
    }

    if(!handlerCallback) {
      if(state === 'resolved') {
        handler.__resolve(__value);
      } else {
        handler.__reject(__value);
      }
      return;
    }

    var ret = handlerCallback(__value);
    handler.__resolve(ret);
  }

  this.then = function(onResolved, onRejected) {
    return new JaPromise(function(__resolve, __reject) {
      __handle({
        onResolved: onResolved,
        onRejected: onRejected,
        __resolve: __resolve,
        __reject: __reject
      });
    });
  };

  fn(__resolve, __reject);
}
//if(!window.Promise)

module.exports = JaPromise;