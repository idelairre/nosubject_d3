export function handleErrors(target, name, descriptor) {
  console.log(target);
  target.prototype = target.prototype || {};
  target.prototype.handleErrors = target.prototype.handleErrors || {};
  target.prototype.handleErrors = function(errors) {
    if (errors) {
      console.log(errors);
      return;
    }
  };
  return target;
}

export function iterator(target, name, descriptor) {
  target.prototype = target.prototype || {};
  target.prototype.iterator = target.prototype.iterator || {};
  target.prototype.iterator = function iterator(array) {
    let nextIndex = 0;
    return {
       next: function () {
           return nextIndex < array.length ?
               { value: array[nextIndex++], done: false } :
               { done: true };
       },
       hasNext: function () {
         return array[nextIndex++] ? true : false;
       }
    }
    return target;
  }
}
