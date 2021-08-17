Function.prototype.MyBind = function(context) {

    if (typeof this !== 'function') {
        throw new Error()
    }

    const args = Array.prototype.slice(arguments, 1)
    const self = this

    // 通过一个空函数，避免修改fBound原型时，会修改绑定函数的prototype
    const fNOP = function() {}

    // bind返回的函数可以作为 构造函数
    const fBound = function() {
        const bindArgs = Array.prototype.slice(arguments, 1)
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs))
    }

    // 将 返回函数 的原型指向 绑定函数 的原型
    fNOP.prototype = this.prototype
    fBound.prototype = new fNOP()
    return fBound

}