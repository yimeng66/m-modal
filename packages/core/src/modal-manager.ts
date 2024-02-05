export type ModalInstance = any;

export class ModalManager {
  modalInstanceMap = new Map<string, ModalInstance>();
  modalFactories: Record<string, any> = {};

  getModalList(): ModalInstance[] {
    return [...this.modalInstanceMap.values()].filter((x) => x);
  }

  openModal(name: string) {
    const modalInstance = this.getModal(name);

    if (!modalInstance) {
      console.error(`名称为${name}的modal不存在`);
      return;
    }

    modalInstance.modal.open();
  }

  closeModal(name: string) {
    const modalInstance = this.getModal(name);

    if (!modalInstance) {
      console.error(`名称为${name}的modal不存在`);
      return;
    }

    modalInstance.modal.close();
  }

  destroyModal(name: string) {
    const modalInstance = this.getModal(name);

    if (!modalInstance) {
      console.error(`名称为${name}的modal不存在`);
      return;
    }

    modalInstance.modal.destroy();
    this.removeModal(name);
  }

  createModal(name: string, modalType: string, options?: any) {
    let modalInstance = this.getModal(name);

    if (modalInstance) {
      if (modalInstance.isDestroyed()) {
        this.removeModal(name);
      } else {
        return modalInstance;
      }
    }

    const modalFactory = this.getModalFactory(modalType);
    const modal = modalFactory.createModal(name, options);

    // 代理modal的部分方法,使其能被modalManager管理
    const modalProxy = new Proxy(
      {
        modal,
        open: () => this.openModal(name),
        close: () => this.closeModal(name),
        destroy: () => this.destroyModal(name),
      },
      {
        get(target: any, key: string) {
          if (key in target) {
            return target[key];
          }

          const val = modal[key];
          return typeof val === 'function' ? val.bind(modal) : val;
        },
      },
    );

    this.addModal(name, modalProxy);

    return modalProxy;
  }

  addModal(name: string, item: ModalInstance) {
    if (this.hasModal(name)) {
      return;
    }

    this.modalInstanceMap.set(name, item);
  }

  clearModal() {
    this.modalInstanceMap.clear();
  }

  getModal(name: string) {
    return this.modalInstanceMap.get(name);
  }

  removeModal(name: string) {
    if (this.hasModal(name)) {
      this.modalInstanceMap.set(name, null);
    }
  }

  hasModal(name: string) {
    return !!this.getModal(name);
  }

  addModalFactory(name: string, modalFactory: any) {
    this.modalFactories[name] = modalFactory;
  }

  getModalFactory(name: string) {
    return this.modalFactories[name];
  }

  static from() {
    return new ModalManager();
  }
}
