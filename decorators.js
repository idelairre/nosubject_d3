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
