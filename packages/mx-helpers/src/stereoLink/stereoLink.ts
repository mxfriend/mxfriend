import { EventEmitter } from '@mxfriend/osc';
import { Container, Dispatcher, Value } from '@mxfriend/oscom';
import { HelperInfo, HelperInterface, HelperState } from '../helpers';
import { ParamLink } from '../utils';
import { StereoLinkAdapterInterface } from './types';

export type StereoLinkEvents = {
  link: [a: Container, b: Container, native: boolean];
  unlink: [a: Container, b: Container, native: boolean];
};

/**
 * Todo
 *  - smart send level / pan pairing when dst is stereo
 */

type LinkState = {
  members: [Container, Container];
  params: ParamLink[];
};

const $key = Symbol('StereoLink');

export class StereoLink extends EventEmitter<StereoLinkEvents> implements HelperInterface {
  private readonly adapter: StereoLinkAdapterInterface;
  private readonly dispatcher: Dispatcher;
  private readonly local: boolean;
  private readonly nativePairs: Map<Value, [Container, Container]> = new Map();
  private readonly links: Map<Container, LinkState> = new Map();
  private readonly triggers: Map<Value, Container> = new Map();

  constructor(adapter: StereoLinkAdapterInterface, dispatcher: Dispatcher, local: boolean = false) {
    super();
    this.adapter = adapter;
    this.dispatcher = dispatcher;
    this.local = local;

    this.handlePrefsChange = this.handlePrefsChange.bind(this);
    this.handleInSrcChange = this.handleInSrcChange.bind(this);
    this.handleNativeLink = this.handleNativeLink.bind(this);
  }

  async init(): Promise<void> {
    for (const option of this.adapter.getLinkPreferenceNodes()) {
      option.$on('remote-change', this.handlePrefsChange);
      await this.addAndMaybeQuery(option);
    }

    this.local && await this.handlePrefsChange();

    for (const [ch1, ch2, link] of this.adapter.getNativeLinks()) {
      this.nativePairs.set(link, [ch1, ch2]);
      link.$on('remote-change', this.handleNativeLink);
      await this.addAndMaybeQuery(link);
    }
  }

  getInfo(): HelperInfo {
    return {
      name: 'Stereo Link',
    };
  }

  getState(channels: Container[]): HelperState {
    if (channels.length < 1 || channels.length > 2) {
      return 'unavailable';
    }

    return this.isLinked(channels[0], channels[1])
      ? 'active'
      : this.adapter.isChannelLinkable(channels[0], channels[1])
        ? 'inactive'
        : 'unavailable';
  }

  async activate([a, b]: Container[]): Promise<void> {
    await this.link(a, b);
  }

  async deactivate([a]: Container[]): Promise<void> {
    await this.unlink(a);
  }

  async destroy(): Promise<void> {
    for (const member of this.links.keys()) {
      await this.unlink(member);
    }

    for (const option of this.adapter.getLinkPreferenceNodes()) {
      option.$off('remote-change', this.handlePrefsChange);
      await this.dispatcher.remove($key, option);
    }

    for (const link of this.nativePairs.keys()) {
      this.nativePairs.delete(link);
      link.$off('remote-change', this.handleNativeLink);
      await this.dispatcher.remove($key, link);
    }
  }

  isLinked(a: Container, b?: Container): boolean {
    const link = this.links.get(a);
    return !!link && (!b || link.members.includes(b));
  }

  async link<M extends Container>(left: M, right: M, pan: boolean = true): Promise<void> {
    if (this.links.has(left) || this.links.has(right)) {
      return;
    }

    const state: LinkState = {
      members: [left, right],
      params: [],
    };

    this.links.set(left, state);
    this.links.set(right, state);

    await this.toggleTriggers(left, right, true);
    await this.toggleParams(left, right, true, state);
    pan && this.setPan(left, right);

    this.emit('link', left, right, false);
  }

  async unlink(member: Container): Promise<void> {
    const state = this.links.get(member);

    if (!state) {
      return;
    }

    this.links.delete(state.members[0]);
    this.links.delete(state.members[1]);

    await this.toggleTriggers(...state.members, false);
    await this.toggleParams(...state.members, false, state);

    this.emit('unlink', ...state.members, false);
  }

  private async toggleParams(a: Container, b: Container, on: boolean, state: LinkState): Promise<void> {
    if (on) {
      for (const [va, vb, delay] of this.adapter.getLinkableValuePairs(a, b)) {
        const link = new ParamLink(this.dispatcher, va, vb, delay);
        await link.sync(!this.local);
        state.params.push(link);
      }
    } else {
      for (const link of state.params) {
        link.destroy();
      }
    }
  }

  private async toggleTriggers(a: Container, b: Container, on: boolean): Promise<void> {
    for (const ch of [a, b]) {
      for (const values of this.adapter.getNodesWhichShouldTriggerRelinking(ch)) {
        if (on) {
          await this.addAndMaybeQuery(values);
          values.$on('remote-change', this.handleInSrcChange);
          this.triggers.set(values, ch);
        } else {
          this.dispatcher.remove($key, values);
          values.$off('remote-change', this.handleInSrcChange);
          this.triggers.delete(values);
        }
      }
    }
  }

  private setPan(a: Container, b: Container): void {
    for (const [ch, pan] of [[a, 0], [b, 1]] as const) {
      for (const node of this.adapter.getMixPanNodes(ch)) {
        this.dispatcher.add($key, node);
        node.$set(pan, true);
        this.dispatcher.remove($key, node);
      }
    }
  }

  private async addAndMaybeQuery(...nodes: Value[]): Promise<void> {
    this.dispatcher.add($key, ...nodes);

    if (!this.local) {
      await this.dispatcher.query(...nodes);
    }
  }

  private async handlePrefsChange(): Promise<void> {
    const orig = new Map(this.links);
    const processed = new Set<LinkState>();

    for (const state of orig.values()) {
      if (!processed.has(state)) {
        processed.add(state);
        await this.unlink(state.members[0]);
        await this.link(...state.members, false);
      }
    }
  }

  private async handleInSrcChange(src: any, node: Value): Promise<void> {
    const target = this.triggers.get(node);
    const state = target && this.links.get(target);

    if (state) {
      await this.unlink(state.members[0]);
      await this.link(...state.members, false);
    }
  }

  private async handleNativeLink(on: any, btn: Value): Promise<void> {
    const members = this.nativePairs.get(btn);

    if (!members) {
      return;
    }

    if (on) {
      for (const member of members) {
        if (this.isLinked(member)) {
          await this.unlink(member);
        }
      }

      this.emit('link', ...members, true);

      if (!this.links.has(members[0]) && !this.links.has(members[1])) {
        const state: LinkState = {
          members,
          params: [],
        };

        this.links.set(members[0], state);
        this.links.set(members[1], state);
      }
    } else {
      this.emit('unlink', ...members, true);
      this.links.delete(members[0]);
      this.links.delete(members[1]);
    }
  }
}
