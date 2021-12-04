"use strict";
const { Gio, St, Clutter, GObject } = imports.gi;
const Main = imports.ui.main;
const Keyboard = imports.ui.keyboard;
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const InputSourceManager = imports.ui.status.keyboard;

let _indicator;

let settings;

// Indicator
let OSKIndicator = GObject.registerClass(
  { GTypeName: "OSKIndicator" },
  class OSKIndicator extends PanelMenu.Button {
    _init() {
      super._init(0.0, `${Me.metadata.name} Indicator`, false);

      let icon = new St.Icon({
        icon_name: "input-keyboard-symbolic",
        style_class: "system-status-icon",
      });

      this.add_child(icon);

      this.connect("button-press-event", function (actor, event) {
        let button = event.get_button();

        if (button == 1) {
          if (Main.keyboard._keyboardVisible) return Main.keyboard.close();

          Main.keyboard.open(Main.layoutManager.bottomIndex);
        }
        if (button == 3) {
          ExtensionUtils.openPrefs();
        }
      });

      this.connect("touch-event", function () {
        if (Main.keyboard._keyboardVisible) return Main.keyboard.close();

        Main.keyboard.open(Main.layoutManager.bottomIndex);
      });
    }
  }
);

// Overrides

function defaultLayout() {
  const backspace = { width: 1.5, keyval: Clutter.KEY_BackSpace, icon: 'edit-clear-symbolic' };
  const del = { width: backspace.width, keyval: Clutter.KEY_Delete, label: '⌦' };
  const tab = { width: 1, keyval: Clutter.KEY_Tab, label: '↹' };
  const backslash = '\\';
  // const caps = { width: 1.5, keyval: Clutter.KEY_Control_L, label: 'Ctrl', extraClassName: 'control-key' };
  const caps = { width: 1.5, keyval: Clutter.KEY_Escape, label: 'Esc' };
  const enter = { width: 2, keyval: Clutter.KEY_Return, extraClassName: 'enter-key', icon: 'keyboard-enter-symbolic' };
  const ctrl = { label: "Ctrl", keyval: Clutter.KEY_Control_L, extraClassName: "control-key" };
  const alt = { label: "Alt", keyval: Clutter.KEY_Alt_L, extraClassName: "alt-key" };
  const win = { label: "◆", keyval: Clutter.KEY_Super_L, extraClassName: "super-key" };
  const aleft = { label: "←", keyval: Clutter.KEY_Left };
  const aup = { label: "↑", keyval: Clutter.KEY_Up };
  const adown = { label: "↓", keyval: Clutter.KEY_Down };
  const aright = { label: "→", keyval: Clutter.KEY_Right };
  const space = { keys: [' '], width: 5.5 };
  const shiftl = { width: 2, level: 1, right: true, extraClassName: 'shift-key-lowercase', icon: 'keyboard-shift-filled-symbolic' };
  const shiftr = { width: 2.5, level: 1, right: true, extraClassName: 'shift-key-lowercase', icon: 'keyboard-shift-filled-symbolic' };
  const shiftlu = { width: shiftl.width, level: 0, right: true, extraClassName: 'shift-key-uppercase', icon: 'keyboard-shift-filled-symbolic' };
  const shiftru = { width: shiftr.width, level: 0, right: true, extraClassName: 'shift-key-uppercase', icon: 'keyboard-shift-filled-symbolic' };
  const hide = { label: "⇊", action: "hide", extraClassName: "hide-key" };
  const layoutkey = { label: '🌐', action: "languageMenu", extraClassName: "layout-key", width: 2 };
  const home = { label: "Hom", keyval: Clutter.KEY_Home, width: 2 };
  const pgup = { label: "P↑", keyval: Clutter.KEY_Page_Up, width: 2 };
  const pgdn = { label: "P↓", keyval: Clutter.KEY_Page_Down, width: 2 };
  const end = { label: "End", keyval: Clutter.KEY_End, width: 2 };
  const esc = { label: 'Esc', keyval: Clutter.KEY_Escape, width: 2 };
  const ins = { label: 'Ins', keyval: Clutter.KEY_Insert, width: 2 };
  const F = n => ({ label: `F${n}`, keyval: Clutter[`KEY_F${n}`], width: 1.5 });
  const fn = { label: 'Fn', level: 2 };
  const fnend = { label: 'Fn', level: 0 };

  const lower = [
    ['`', ['1', '¹', '½', '⅓', '¼', '⅛'], ['2', '²', '⅔'], ['3', '³', '¾', '⅜'], ['4', '⁴'],
        ['5', '€', '⅝'], '6', ['7', '⅞'], '8', '9', ['0', 'ⁿ', '∅'],
        '-', '=', backspace],
    [tab, 'q', 'w', ['e', 'è', 'é', 'ê', 'ë', 'ē'], 'r', 't', 'y', ['u', 'û', 'ü', 'ù', 'ú', 'ū'],
          ['i', 'î', 'ï', 'í', 'ī', 'ì'], ['o', 'ô', 'ö', 'ò', 'ó', 'œ', 'ø', 'ō', 'õ'], 'p',
      '[', ']', {keys: ['\\'], width: 1.5}],
    [caps, ['a', 'à', 'á', 'â', 'ä', 'æ', 'ã', 'å', 'ā'], ['s', 'ß'], 'd', 'f', 'g',
        'h', 'j',  'k' , 'l',
      ';', ['\'', '‘', '’'], enter],
    [shiftl, 'z', 'x', ['c', 'ç'], 'v', 'b', ['n', 'ñ'], 'm',
      ',', ['.', '…'], '/', shiftr],
    [ctrl, alt, win, fn, space, hide,
      aleft, aup, adown, aright],
  ];
  const upper = [
    ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', del],
    [tab, 'Q', 'W', ['E', 'È', 'É', 'Ê', 'Ë', 'Ē'], 'R', 'T', 'Y', ['U', 'Û', 'Ü', 'Ù', 'Ú', 'Ū'],
          ['I', 'Î', 'Ï', 'Í', 'Ī', 'Ì'], ['O', 'Ô', 'Ö', 'Ò', 'Ó', 'Œ', 'Ø', 'Ō', 'Õ'], 'P',
      '{', '}', {keys: ['|'], width: 1.5}],
    [caps, ['A', 'À', 'Á', 'Â', 'Ä', 'Æ', 'Ã', 'Å', 'Ā'], 'S', 'D', 'F', 'G',
        'H', 'J', 'K', 'L',
      ':', ['\'', '“', '”'], enter],
    [shiftlu, 'Z', 'X', ['C', 'Ç'], 'V', 'B', ['N', 'Ñ'], 'M',
      ['<', '‹', '≤', '«'], ['>', '›', '≥', '»'], ['?', '¿'], shiftru],
    [ctrl, alt, win, fn, space, hide,
      aleft, aup, adown, aright],
  ];
  const fnlvl = [
    // TODO
    [{ ...F(1), width: 1}, F(2), F(3), F(4), F(5), F(6), F(7), F(8), F(9), F(10)],
    [{ ...F(11), width: 1}, F(12), F(13), F(14), F(15), F(16), F(17), F(18), F(19), F(20)],
    [ins, layoutkey],
    [home, pgup, pgdn, end],
    [ctrl, alt, win, fnend, space, hide, aleft, aup, adown, aright],
  ];
  return [lower, upper, fnlvl];
}

const LAYOUT = defaultLayout();

const overrides = {
  KeyboardManager: {
    _lastDeviceIsTouchscreen: function() {
      if (!this._lastDevice) return false;

      let deviceType = this._lastDevice.get_device_type();

      return settings.get_boolean("ignore-touch-input")
        ? false
        : deviceType == Clutter.InputDeviceType.TOUCHSCREEN_DEVICE;
      },
  },

  Keyboard: {
    _createLayersForGroup: function(group) {
        let layers = [];

        for (const currentLevel of LAYOUT) {
            let layout = new Keyboard.KeyContainer();
            layout.shiftKeys = [];

            for (const row of currentLevel) {
                layout.appendRow();
                for (const key of row) {
                    const button =
                      typeof key === 'string' ? this._mkNormalKey([key]) :
                      key instanceof Array ? this._mkNormalKey(key) :
                      'keys' in key ? this._mkNormalKey(key.keys, key.width) :
                      this._mkFancyKey(key, layout);
                    if (button !== null)
                        layout.appendKey(button, button.keyButton.keyWidth);
                }
            }
            layers.push(layout);
            this._aspectContainer.add_child(layout);
            layout.layoutButtons(this._aspectContainer);

            layout.hide();
        }

        return layers;
    },

    _mkFancyKey: function(key, layout) {
        let keyval = key.keyval;
        let switchToLevel = key.level;
        let action = key.action;
        let icon = key.icon;

        /* Skip emoji button if necessary */
        if (!this._emojiKeyVisible && action == 'emoji')
            return null;

        const extraButton = new Keyboard.Key(key.label || '', [], icon);

        extraButton.keyButton.add_style_class_name('default-key');
        if (key.extraClassName != null)
            extraButton.keyButton.add_style_class_name(key.extraClassName);
        if (key.width != null)
            extraButton.setWidth(key.width);

        let actor = extraButton.keyButton;

        extraButton.connect('pressed', () => {
            if (switchToLevel != null) {
                this._setActiveLayer(switchToLevel);
                // Shift only gets latched on long press
                this._latched = switchToLevel != 1;
            } else if (keyval != null) {
                this._keyboardController.keyvalPress(keyval);
            }
        });
        extraButton.connect('released', () => {
            if (keyval != null)
                this._keyboardController.keyvalRelease(keyval);
            else if (action == 'hide') {
                // Press latched ctrl/super/alt keys again to release them before hiding OSK
                if (this._keyboardController._controlActive) {
                    this._keyboardController.keyvalPress(Clutter.KEY_Control_L);
                }
                if (this._keyboardController._superActive) {
                    this._keyboardController.keyvalPress(Clutter.KEY_Super_L);
                }
                if (this._keyboardController._altActive) {
                    this._keyboardController.keyvalPress(Clutter.KEY_Alt_L);
                }
                this.close();
            } else if (action == 'languageMenu')
                this._popupLanguageMenu(actor);
            else if (action == 'emoji')
                this._toggleEmoji();
        });

        if (switchToLevel == 0) {
            layout.shiftKeys.push(extraButton);
        } else if (switchToLevel == 1) {
            extraButton.connect('long-press', () => {
                this._latched = true;
                this._setCurrentLevelLatched(this._currentPage, this._latched);
            });
        }

        return extraButton;
    },

    _mkNormalKey: function(key, width) {
        let button = new Keyboard.Key(key[0], key.slice(1));

        /* Space key gets special width, dependent on the number of surrounding keys */
        if (width != null)
            button.setWidth(width);

        button.connect('pressed', (actor, keyval, str) => {
            if (!Main.inputMethod.currentFocus ||
                !this._keyboardController.commitString(str, true)) {
                if (keyval != 0) {
                    this._keyboardController.keyvalPress(keyval);
                    button._keyvalPress = true;
                }
            }
        });
        button.connect('released', (actor, keyval, _str) => {
            if (keyval != 0) {
                if (button._keyvalPress)
                    this._keyboardController.keyvalRelease(keyval);
                button._keyvalPress = false;
            }

            if (!this._latched)
                this._setActiveLayer(0);
        });

        return button;
    },
  },

  KeyboardController: {
    commitString: function(string, fromKey) {
        // Prevents alpha-numeric key presses from bypassing override_keyvalPress()
        // while ctrl/alt/super are latched
        if (this._controlActive || this._superActive || this._altActive)
          return false;

        return backups.KeyboardController.commitString.apply(this, [string, fromKey]);
    },

    keyvalPress: function(keyval) {
        // This allows manually releasing a latched ctrl/super/alt keys by tapping on them again
        if (keyval == Clutter.KEY_Control_L) {
          this._controlActive = !this._controlActive;

          if (this._controlActive) {
            this._virtualDevice.notify_keyval(
                Clutter.get_current_event_time() * 1000,
                Clutter.KEY_Control_L,
                Clutter.KeyState.PRESSED
            );
            Main.layoutManager.keyboardBox.add_style_class_name("control-key-latched");
          } else {
            this._virtualDevice.notify_keyval(
                Clutter.get_current_event_time() * 1000,
                Clutter.KEY_Control_L,
                Clutter.KeyState.RELEASED
            );
            Main.layoutManager.keyboardBox.remove_style_class_name("control-key-latched");
          }

          return;
        }

        if (keyval == Clutter.KEY_Super_L) {
          this._superActive = !this._superActive;

          if (this._superActive) {
            this._virtualDevice.notify_keyval(
                Clutter.get_current_event_time() * 1000,
                Clutter.KEY_Super_L,
                Clutter.KeyState.PRESSED
            );
            Main.layoutManager.keyboardBox.add_style_class_name("super-key-latched");
          } else {
            this._virtualDevice.notify_keyval(
                Clutter.get_current_event_time() * 1000,
                Clutter.KEY_Super_L,
                Clutter.KeyState.RELEASED
            );
            Main.layoutManager.keyboardBox.remove_style_class_name("super-key-latched");
          }

          return;
        }

        if (keyval == Clutter.KEY_Alt_L) {
          this._altActive = !this._altActive;

          if (this._altActive) {
            this._virtualDevice.notify_keyval(
                Clutter.get_current_event_time() * 1000,
                Clutter.KEY_Alt_L,
                Clutter.KeyState.PRESSED
            );
            Main.layoutManager.keyboardBox.add_style_class_name("alt-key-latched");
          } else {
            this._virtualDevice.notify_keyval(
                Clutter.get_current_event_time() * 1000,
                Clutter.KEY_Alt_L,
                Clutter.KeyState.RELEASED
            );
            Main.layoutManager.keyboardBox.remove_style_class_name("alt-key-latched");
          }

          return;
        }

        // Not a ctrl/super/alt key, continue down original execution path
        this._virtualDevice.notify_keyval(Clutter.get_current_event_time() * 1000,
                                          keyval, Clutter.KeyState.PRESSED);
    },

    keyvalRelease: function(keyval) {
        // By default each key is released immediately after being pressed.
        // Don't release ctrl/alt/super keys to allow them to be latched
        // and used in "ctrl/alt/super + key" combinations
        if (keyval == Clutter.KEY_Control_L || keyval == Clutter.KEY_Alt_L || keyval == Clutter.KEY_Super_L) return;

        this._virtualDevice.notify_keyval(Clutter.get_current_event_time() * 1000,
                                          keyval, Clutter.KeyState.RELEASED);

        if (this._controlActive) {
            this._virtualDevice.notify_keyval(
                Clutter.get_current_event_time() * 1000,
                Clutter.KEY_Control_L,
                Clutter.KeyState.RELEASED
            );
            this._controlActive = false;
            Main.layoutManager.keyboardBox.remove_style_class_name("control-key-latched");
        }
        if (this._superActive) {
            this._virtualDevice.notify_keyval(
                Clutter.get_current_event_time() * 1000,
                Clutter.KEY_Super_L,
                Clutter.KeyState.RELEASED
            );
            this._superActive = false;
            Main.layoutManager.keyboardBox.remove_style_class_name("super-key-latched");
        }
        if (this._altActive) {
            this._virtualDevice.notify_keyval(
                Clutter.get_current_event_time() * 1000,
                Clutter.KEY_Alt_L,
                Clutter.KeyState.RELEASED
            );
            this._altActive = false;
            Main.layoutManager.keyboardBox.remove_style_class_name("alt-key-latched");
        }
    },
  },
}

const backups = {}
for (const klass in overrides) {
  backups[klass] = {};
  for (const method in overrides[klass]) {
    backups[klass][method] = Keyboard[klass].prototype[method];
  }
}

function enable_overrides() {
  for (const klass in overrides) {
    for (const method in overrides[klass]) {
      Keyboard[klass].prototype[method] = overrides[klass][method];
    }
  }
}

function disable_overrides() {
  for (const klass in overrides) {
    for (const method in overrides[klass]) {
      Keyboard[klass].prototype[method] = backups[klass][method];
    }
  }
}

function enable() {
  settings = ExtensionUtils.getSettings("org.gnome.shell.extensions.improvedosk");

  Main.layoutManager.removeChrome(Main.layoutManager.keyboardBox);

  // Set up the indicator in the status area
  if (settings.get_boolean("show-statusbar-icon")) {
    _indicator = new OSKIndicator();
    Main.panel.addToStatusArea("OSKIndicator", _indicator);
  }

  let KeyboardIsSetup = true;
  try {
    Main.keyboard._destroyKeyboard();
  } catch (e) {
    if (e instanceof TypeError) {
      // In case the keyboard is currently disabled in accessability settings, attempting to _destroyKeyboard() yields a TypeError ("TypeError: this.actor is null")
      // This doesn't affect functionality, so proceed as usual. The only difference is that we do not automatically _setupKeyboard at the end of this enable() (let the user enable the keyboard in accessability settings)
      KeyboardIsSetup = false;
    } else {
      // Something different happened
      throw e;
    }
  }

  enable_overrides();

  settings.connect("changed::show-statusbar-icon", function () {
    if (settings.get_boolean("show-statusbar-icon")) {
      _indicator = new OSKIndicator();
      Main.panel.addToStatusArea("OSKIndicator", _indicator);
    } else if (_indicator !== null) {
      _indicator.destroy();
      _indicator = null;
    }
  });

  if (KeyboardIsSetup) {
    Main.keyboard._setupKeyboard();
  }

  Main.layoutManager.addTopChrome(Main.layoutManager.keyboardBox, {
    affectsStruts: settings.get_boolean("resize-desktop"),
    trackFullscreen: false,
  });
}

function disable() {
  Main.layoutManager.removeChrome(Main.layoutManager.keyboardBox);

  let KeyboardIsSetup = true;
  try {
    Main.keyboard._destroyKeyboard();
  } catch (e) {
    if (e instanceof TypeError) {
      // In case the keyboard is currently disabled in accessability settings, attempting to _destroyKeyboard() yields a TypeError ("TypeError: this.actor is null")
      // This doesn't affect functionality, so proceed as usual. The only difference is that we do not automatically _setupKeyboard at the end of this enable() (let the user enable the keyboard in accessability settings)
      KeyboardIsSetup = false;
    } else {
      // Something different happened
      throw e;
    }
  }

  // Remove indicator if it exists
  if (_indicator instanceof OSKIndicator) {
    _indicator.destroy();
    _indicator = null;
  }

  disable_overrides();

  if (KeyboardIsSetup) {
    Main.keyboard._setupKeyboard();
  }
  Main.layoutManager.addTopChrome(Main.layoutManager.keyboardBox);
}
