# `@mxfriend/mx-helpers`

This package provides a set of helper utilities which
extend the functionality of the Behringer® X32 / X-Air
and the Midas® M32 / M-Air mixing consoles. Currently
available helpers include:

 - **Stereo Link** - allows you to link _any_ two adjacent
   channels, not just odd-even pairs like the native Stereo
   Link function of the mixer. Works with channels, buses
   and auxes for now; matrix support is planned as well.
 - **Headroom Adjustment** - allows you to adjust channel
   input gain / trim while compensating for the change in
   all the relevant places - e.g. if you lower the input
   gain by 3 dB, all pre-fader send levels and the main
   channel fader will be raised by 3 dB and gate and compressor
   thresholds will be lowered by 3 dB - meaning you get +3 dB
   headroom in the channel signal path without affecting
   any of your mixes.
 - **Stereo Tools** - provides an alternative means of
   controlling pan for linked channels. Usually, linked
   channels still have independent pan. With this helper
   enabled, the left channel's pan now controls the pan
   of both channels, while the right channel's pan controls
   the stereo width of the pair.
