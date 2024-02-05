type EventFn = (...args: any[]) => void;
type EventType = Record<string, EventFn[]>;

export class EventManager {
  events = {} as EventType;

  getEvent(name: string) {
    let event = this.events[name];
    if (!event) {
      this.events[name] = event = [];
    }

    return event;
  }

  on(name: string, fn: EventFn) {
    if (typeof fn !== 'function') {
      console.error('参数fn不是一个函数');
      return;
    }

    const event = this.getEvent(name);
    if (!event.includes(fn)) {
      event.push(fn);
    }
  }

  emit(name: string, ...args: any[]) {
    const event = this.getEvent(name);
    event.forEach((fn) => fn(...args));
  }

  off(name: string, fn: EventFn) {
    const event = this.getEvent(name);
    const targetIndex = event.indexOf(fn);

    if (targetIndex > -1) {
      event.splice(targetIndex, 1);
    }
  }

  removeAllEvent() {
    this.events = {};
  }
}
