#!/bin/bash

grep -rl left HSliding* | xargs sed -i -e 's/left/top/g'
grep -rl Left HSliding* | xargs sed -i -e 's/Left/Top/g'

grep -rl right HSliding* | xargs sed -i -e 's/right/bottom/g'
#grep -rl Right HSliding* | xargs sed -i -e 's/Right/Bottom/g'

grep -rl width HSliding* | xargs sed -i -e 's/width/height/g'
grep -rl Width HSliding* | xargs sed -i -e 's/Width/Height/g'

grep -rl left HSliding* | xargs sed -i -e 's/left/top/g'
grep -rl right HSliding* | xargs sed -i -e 's/right/bottom/g'
grep -rl width HSliding* | xargs sed -i -e 's/width/height/g'

grep -rl HFlexLayout HSliding* | xargs sed -i -e 's/HFlexLayout/VFlexLayout/g'

grep -rl SlidingView HSliding* | xargs sed -i -e 's/SlidingView/HSlidingView/g'
grep -rl SlidingPane HSliding* | xargs sed -i -e 's/SlidingPane/HSlidingPane/g'

grep -rl dx HSliding* | xargs sed -i -e 's/dx/dy/g'

grep -rl translate3d HSliding* | xargs sed -i -e 's/translate3d(\" + inSlide + \"px,0,0)/translate3d(0,\" + inSlide + \"px,0)/g'

grep -rl this.getBounds\(\).height HSlidingPane.js | xargs sed -i -e 's/this.getBounds().height/this.getBounds().width/g'
grep -rl new\ enyo.VFlexLayout HSlidingView.js | xargs sed -i -e 's/new enyo.VFlexLayout/new enyo.HFlexLayout/g'
