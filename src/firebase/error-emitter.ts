// Stub — Firebase error emitter removed.
type EventHandler = (...args: any[]) => void;

class SimpleEmitter {
  private handlers: Record<string, EventHandler[]> = {};
  on(event: string, handler: EventHandler) {
    (this.handlers[event] = this.handlers[event] || []).push(handler);
  }
  off(event: string, handler: EventHandler) {
    if (this.handlers[event]) {
      this.handlers[event] = this.handlers[event].filter(h => h !== handler);
    }
  }
  emit(event: string, ...args: any[]) {
    (this.handlers[event] || []).forEach(h => h(...args));
  }
}

export const errorEmitter = new SimpleEmitter();
