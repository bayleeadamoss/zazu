import { expect } from 'chai'
import notification from '../../app/lib/notification'
import sinon from 'sinon'

describe('Notification', () => {
  describe('tick', () => {
    let noop

    beforeEach(() => {
      noop = sinon.stub()
      notification.queue.push(noop)
      expect(notification.queue.length).to.eq(1)
      notification.tick()
    })

    it('shifts the queue', () => {
      expect(notification.queue.length).to.eq(0)
    })

    it('shifts the queue', () => {
      expect(noop).to.have.been.calledOnce
    })
  })
})
