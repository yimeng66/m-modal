import { BaseModal } from '@ym/modal-core';
import { createVNode, render as _render } from 'vue';
import { isPromise, isESModule } from '@ym/shared/utils';

import { NormalModal } from './components/normal-modal';

export class Modal extends BaseModal {
  content: any;
  contentInstance: any;

  async confirm() {
    const { contentInstance } = this;
    let res = null;

    if (contentInstance) {
      const confirmFn = contentInstance.onConfirm || contentInstance.onOk;
      if (confirmFn && typeof confirmFn === 'function') {
        res = await confirmFn();
      }
    }

    this.emit('confirm', res);
  }

  async handleAction(type: string) {
    this.emit('action', type);

    switch (type) {
      case 'close':
        this.destroy();
        break;
      case 'confirm':
        await this.confirm();
        this.destroy();
        break;
    }
  }

  resolveContent() {
    const { content } = this;

    if (isPromise(content)) {
      return new Promise((resolve, reject) => {
        (content as any).then((comp: any) => {
          if (!comp) {
            reject('加载组件为空');
            return;
          }

          resolve(isESModule(comp) ? comp.default : comp);
        });
      });
    }

    return content;
  }

  createElement(resolvedComponent: any) {
    return createVNode(
      NormalModal,
      {},
      {
        default: () => {
          if (typeof resolvedComponent === 'string') {
            return createVNode(
              'span',
              { class: 'content-text' },
              resolvedComponent,
            );
          }

          // TODO 支持HTMLElement元素
          if (resolvedComponent instanceof HTMLElement) {
            return '';
          }

          return createVNode(resolvedComponent, {
            ref: (instance) => (this.contentInstance = instance as any),
            onClose: () => this.handleAction('close'),
            onCancel: () => this.handleAction('close'),
            onConfirm: () => this.handleAction('confirm'),
          });
        },
      },
    );
  }

  render(modalContainer: HTMLElement, isUnmount: boolean): void {
    _render(
      isUnmount ? null : this.createElement(this.resolveContent()),
      modalContainer,
    );
  }
}
