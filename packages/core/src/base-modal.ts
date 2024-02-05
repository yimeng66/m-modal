import { MODAL_STATUS } from './contants';
import { EventManager } from './utils';

export abstract class BaseModal extends EventManager {
  name = '';
  private status: string | null = null;
  container: HTMLElement | null | undefined = null; // 弹窗插入的容器
  private _modalContainer: HTMLElement | null | undefined =
    document.createElement('div'); // 弹窗渲染的容器
  keepAlive = true;
  zIndex = 0;
  width: number | string = 600;
  height: number | string = 'auto';

  /**
   * 弹窗渲染函数
   * @param modalContainer - 弹窗需要渲染到的容器
   */
  abstract render(
    modalContainer: HTMLElement | null | undefined,
    isUnmount?: boolean,
  ): void;

  constructor(name: string, container?: HTMLElement) {
    super();

    this.name = name;
    this.container = container || document.body;
  }

  isActive() {
    return this.status === MODAL_STATUS.activated;
  }

  isDestroyed() {
    return this.status === MODAL_STATUS.destroyed;
  }

  setWidth(w: number) {
    if (this.width !== w) {
      this.width = w;
    }
  }

  setHeight(h: number) {
    if (this.height !== h) {
      this.height = h;
    }
  }

  setZIndex(index: number) {
    this.zIndex = index;
  }

  createComponent() {
    this._modalContainer = document.createElement('div');
  }

  updateComponent() {
    if (!this.isActive() || !this._modalContainer) return;

    this.render(this._modalContainer);
  }

  open() {
    if (this.isDestroyed()) {
      console.error('窗口已经被销毁');
      return;
    }

    const prevStatus = this.status;

    this.emit('before-open');

    this.status = MODAL_STATUS.activated;

    if (!prevStatus) {
      this.createComponent();
    } else {
      this.updateComponent();
    }

    this.mount();

    this.emit('open');
  }

  mount() {
    if (!this.container || !this._modalContainer) return;

    this.container.appendChild(this._modalContainer);
    this.emit('mount');
  }

  unmount() {
    if (!this.container || !this._modalContainer) return;

    if (this.container.contains(this._modalContainer)) {
      this.container.removeChild(this._modalContainer);
      this.emit('unmount');
    }
  }

  close() {
    if (!this.isActive()) {
      return;
    }

    this.emit('before-close');

    if (!this.keepAlive) {
      this.destroy();
      this.status = null;
      return;
    }

    this.status = MODAL_STATUS.deactivated;

    this.unmount();

    this.emit('close');
  }

  destroy() {
    if (this.isDestroyed()) {
      return;
    }

    this.emit('before-destroy');

    this.status = MODAL_STATUS.destroyed;

    this.render(this._modalContainer);

    this.unmount();

    this._modalContainer = null;
    this.container = null;

    this.emit('destroy');
    this.removeAllEvent();
  }
}
