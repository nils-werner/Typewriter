Typewriter for WebOS
====================

Installation
------------

Clone the repository using Git

	git clone git://github.com/nils-werner/Typewriter.git

Initialize all submodules

	cd Typewriter
	git submodule update --init

Generate the package and put it on your device or emulator

	make install

What needs to be done
---------------------

There are several branches that need some work:

### `positioning`

This branch aims to implement a more sophisticated alignment-method during the swipe-animation. In version 1.0.3, the app simply guessed the position in the output document by calculating the "scrolled down percentage" (i.e. "half way down in the editor" => "half way down in the output").

The new method injects a hidden `<span id='renderedselection' />` into the editor and tries to locate that element in the output view. It works fine so far except for situation when the `span` sits inside Markdown control-characters (like headline `=====`'s).

### `refocus`

This branch sits ontop of `positioning`. It will eventually implement a method that allows seamless editing->previewing->editing by placing the caret exactly at the position where it has been before the swipe animation.

### `fixxsl`

The way the XSLT is used is currently a bit broken. It's unneccessarily recreating variables and objects and uses weird global variables. This branch aims to clean up the code.

### Dropbox-Token/Secret

Right now the Token/Secret pair has been removed from the sourcecode as I am not allowed to distribute it. Also, the app uses the deprecated v0 API for wich one can't obtain new keys. I heard that it's possible to get a special token for open source software. Let's see what we can do.
