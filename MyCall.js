// es5
Function.prototype.MyCall = function(context) {
    let ctx = context || window;
    ctx.fn = this

    const args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    let result = eval('ctx.fn(' + args +')');
    delete ctx.fn
    return result
}

// es6
Function.prototype.MyCall2 = function(context, ...args) {
    let ctx = context || window;
    ctx.fn = this

    let result = ctx.fn(...args)
    delete ctx.fn
    return result
}

// es5
Function.prototype.MyApply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}

// es6
Function.prototype.MyApply2 = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        result = context.fn(...arr);
    }

    delete context.fn
    return result;
}