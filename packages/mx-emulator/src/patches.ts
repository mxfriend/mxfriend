import { NodeCommand } from '@mxfriend/common';

const $attachedOrig = NodeCommand.prototype.$attached;

NodeCommand.prototype.$attached = function $attached(parent, address) {
  $attachedOrig.call(this, parent, address);

  Promise.resolve().then(() => {
    this.$emit = () => false;
    $attachedOrig.call(this, parent, address.replace(/^\//, ''));
    delete (this as any).$emit;
  });
};
