#!/bin/bash

grep -rl left HSliding* | xargs sed -i -e 's/left/top/'
grep -rl Left HSliding* | xargs sed -i -e 's/Left/Top/'

grep -rl right HSliding* | xargs sed -i -e 's/right/bottom/'
#grep -rl Right HSliding* | xargs sed -i -e 's/Right/Bottom/'

grep -rl width HSliding* | xargs sed -i -e 's/width/height/'
grep -rl Width HSliding* | xargs sed -i -e 's/Width/Height/'

grep -rl left HSliding* | xargs sed -i -e 's/left/top/'
grep -rl right HSliding* | xargs sed -i -e 's/right/bottom/'
grep -rl width HSliding* | xargs sed -i -e 's/width/height/'
grep -rl Width HSliding* | xargs sed -i -e 's/Width/Height/'
grep -rl Width HSliding* | xargs sed -i -e 's/Width/Height/'

grep -rl HFlexLayout HSliding* | xargs sed -i -e 's/HFlexLayout/VFlexLayout/'

grep -rl SlidingView HSliding* | xargs sed -i -e 's/SlidingView/HSlidingView/'
grep -rl SlidingPane HSliding* | xargs sed -i -e 's/SlidingPane/HSlidingPane/'

grep -rl dx HSliding* | xargs sed -i -e 's/dx/dy/'

grep -rl translate3d HSliding* | xargs sed -i -e 's/translate3d(\" + inSlide + \"px,0,0)/translate3d(0,\" + inSlide + \"px,0)/'

grep -rl this.getBounds\(\).height HSliding* | xargs sed -i -e 's/this.getBounds().height/this.getBounds().width/'
