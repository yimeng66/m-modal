import { defineComponent, ref } from 'vue';

import { ModalContainer } from '../modal-container';

import './normal-modal.scss';

export default defineComponent({
  props: {
    title: String,
    okText: { type: String, default: '确定' },
    cancelText: { type: String, default: '取消' },
  },
  emits: ['action'],
  setup(props, { slots, emit }) {
    function handleActionClick(type: string) {
      emit('action', type);
    }

    return () => {
      return (
        <ModalContainer>
          <div class="normal-modal">
            <div class="normal-modal__header">
              <div class="normal-modal__header-left"></div>
              <div class="normal-modal__header-title">{props.title}</div>
            </div>
            <div class={['normal-modal__content']}>
              {slots.default ? slots.default() : null}
            </div>
            {props.cancelText !== null || props.okText !== null ? (
              <div class="normal-modal__bottom">
                {props.cancelText ? (
                  <el-button onClick={() => handleActionClick('close')}>
                    {props.cancelText}
                  </el-button>
                ) : null}
                {props.okText ? (
                  <el-button
                    type="primary"
                    onClick={() => handleActionClick('confirm')}
                  >
                    {props.okText}
                  </el-button>
                ) : null}
              </div>
            ) : null}
          </div>
        </ModalContainer>
      );
    };
  },
});
