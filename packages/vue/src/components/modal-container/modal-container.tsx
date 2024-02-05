import { computed, defineComponent, ref, watch } from 'vue';

import { formatStyleSize } from '@ym/shared/utils';

import './modal-container.scss';

export default defineComponent({
  props: {
    mask: { type: Boolean, default: true },
    width: [Number, String],
    height: [Number, String],
    zIndex: Number,
  },
  setup(props, { slots }) {
    const innerWidth = ref(props.width);
    const innerHeight = ref(props.height);

    const wrapStyle = computed(() => {
      const styleObj = {};
      const sizeMode = 'max';

      if (sizeMode === 'max') {
        return Object.assign(styleObj, { width: '100%', height: '100%' });
      }

      if (sizeMode === 'embed') {
        return Object.assign(styleObj, {
          width: '100%',
          height: '100%',
          borderRadius: 0,
        });
      }

      const _width = formatStyleSize(innerWidth.value);
      const _height = formatStyleSize(innerHeight.value);

      if (sizeMode === 'custom') {
        return Object.assign(styleObj, { width: _width });
      }

      return Object.assign(styleObj, {
        width: _width,
        height: _height,
        transform: `translate(-50%, -50%)`,
        top: '50%',
        left: '50%',
        maxHeight: '90vh',
      });
    });

    watch(
      () => props.width,
      (val: number | string | undefined) => {
        innerWidth.value = val;
      },
    );

    return () => {
      return (
        <div class="modal-container" style={{ zIndex: props.zIndex }}>
          <div class="modal-wrap" style={wrapStyle.value}>
            {slots.default ? slots.default() : null}
          </div>
          {props.mask ? <div class="modal-mask"></div> : null}
        </div>
      );
    };
  },
});
