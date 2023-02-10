class EventQueue {
  constructor(props) {
    this.handlers = {};
  }
  checkExist(eventName, handler) {
    let isExist = false;
    do {
      if (!this.handlers[eventName])
        break;
      const handlers = this.handlers[eventName];
      isExist = handlers.filter(h => h == handler).length > 0;
    }
    while (false);
    return isExist;
  }
  on(eventName, handler) {
    if (!this.handlers[eventName]) this.handlers[eventName] = [];
    if (!this.checkExist(eventName, handler)) {
      this.handlers[eventName].push(handler);
    }
  }
  remove(eventName, handler) {
    const handlers = this.handlers[eventName] || [];
    this.handlers[eventName] = handlers.filter(h => h != handler);
  }
  emit(eventName, eventData) {
    const handlers = this.handlers[eventName] || [];
    handlers.forEach(handler => {
      handler(eventData);
    });
  }
}
const EVENTS = new EventQueue();

export default EVENTS;