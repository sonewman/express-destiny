var desc = require('macchiato')
var destiny = require('./')

desc('express-destiny')

.beforeEach(function () {
  this.req = {}
  this.res = { format: this.stub() }
  this.next = this.stub()
  this.fn = this.stub()
})

.it('destiny({string}, {function})', function () {
  destiny('text', this.fn)(this.req, this.res, this.next)

  this.expect(this.res.format.calledOnce).to.be.true()
  this.expect(this.res.format.calledWith({ text: this.fn })).to.be.true()
  this.end()
})

.it('destiny({string}, {function}) adds priority with correct ordering', function () {
  destiny('json', this.fn)(this.req, this.res, this.next)

  var options = this.res.format.firstCall.args[0];
  this.expect(this.res.format.calledOnce).to.be.true()
  this.expect(Object.keys(options)).deepEquals(['html', 'json'])
  this.end()
})

.it('destiny({string}, {function}, {defaultHTML: false})', function () {
  destiny('json', this.fn, { defaultHTML: false })(this.req, this.res, this.next)

  this.expect(this.res.format.calledOnce).to.be.true()
  this.expect(this.res.format.calledWith({ json: this.fn })).to.be.true()
  this.end()
})

.it('destiny({object})', function () {
  destiny({ text: this.fn })(this.req, this.res, this.next)

  this.expect(this.res.format.calledOnce).to.be.true()
  this.expect(this.res.format.calledWith({ text: this.fn })).to.be.true()
  this.end()
})

.it('destiny({object}, {defaultHTML: false})', function () {
  destiny({ json: this.fn }, { defaultHTML: false })(this.req, this.res, this.next)

  this.expect(this.res.format.calledOnce).to.be.true()
  this.expect(this.res.format.calledWith({ json: this.fn })).to.be.true()
  this.end()
})

.it('destiny({object}) adds html if no priority is added', function () {
  destiny({ json: this.fn })(this.req, this.res, this.next)

  this.expect(this.res.format.calledOnce).to.be.true()
  this.expect(this.res.format.calledWith({
    html: this.match.func,
    json: this.fn
  })).to.be.true()
  this.end()
})

.it('destiny({object}) ordering', function () {
  destiny({
    json: this.fn,
    html: this.fn
  })(this.req, this.res, this.next)

  var options = this.res.format.firstCall.args[0];
  this.expect(this.res.format.calledOnce).to.be.true()
  this.expect(Object.keys(options)).deepEquals(['html', 'json'])
  this.end()
})
