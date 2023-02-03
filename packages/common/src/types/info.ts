import { Collection, StringValue } from '@mxfriend/oscom';

export class ServerInfo extends Collection<StringValue> {
  constructor() {
    super(() => new StringValue(), { size: 4, callable: true });
  }

  get serverVersion(): StringValue {
    return this.$get(0);
  }

  get serverName(): StringValue {
    return this.$get(1);
  }

  get consoleModel(): StringValue {
    return this.$get(2);
  }

  get consoleVersion(): StringValue {
    return this.$get(3);
  }
}

export class MixerInfo extends Collection<StringValue> {
  constructor() {
    super(() => new StringValue(), { size: 4, callable: true });
  }

  get networkAddress(): StringValue {
    return this.$get(0);
  }

  get networkName(): StringValue {
    return this.$get(1);
  }

  get consoleModel(): StringValue {
    return this.$get(2);
  }

  get consoleVersion(): StringValue {
    return this.$get(3);
  }
}

export class MixerStatus extends Collection<StringValue> {
  constructor() {
    super(() => new StringValue(), { size: 3, callable: true });
  }

  get state(): StringValue {
    return this.$get(0);
  }

  get ip(): StringValue {
    return this.$get(1);
  }

  get name(): StringValue {
    return this.$get(2);
  }
}
