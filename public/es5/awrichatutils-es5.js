
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChatMessage = function () {
    function ChatMessage() {
        var from = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var txt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

        _classCallCheck(this, ChatMessage);

        this._time = Date.now();
        this._from = from;
        this._to = 0;
        this._type = 0;
        this._txt = txt;
        this._color = '#333';
    }

    _createClass(ChatMessage, [{
        key: "setFrom",
        value: function setFrom(from) {
            this._from = from;
        }
    }, {
        key: "getFrom",
        value: function getFrom() {
            return this._from;
        }
    }, {
        key: "setTo",
        value: function setTo(to) {
            this._to = to;
        }
    }, {
        key: "getFrom",
        value: function getFrom() {
            return this.to;
        }
    }, {
        key: "setType",
        value: function setType(type) {
            this._type = type;
        }
    }, {
        key: "getType",
        value: function getType() {
            return this._type;
        }
    }, {
        key: "setColor",
        value: function setColor(color) {
            this._color = color;
        }
    }, {
        key: "getColor",
        value: function getColor() {
            return this._color;
        }
    }, {
        key: "setText",
        value: function setText(txt) {
            this._txt = txt;
        }
    }, {
        key: "getText",
        value: function getText() {
            return this._txt;
        }
    }, {
        key: "setParam",
        value: function setParam(params) {
            this._params = params;
        }
    }, {
        key: "getParam",
        value: function getParam() {
            return this._params;
        }
    }, {
        key: "color",
        get: function get() {
            return this._color;
        },
        set: function set(color) {
            this._color = color;
        }
    }, {
        key: "type",
        set: function set(type) {
            this._type = type;
        },
        get: function get() {
            return this._type;
        }
    }, {
        key: "txt",
        set: function set(txt) {
            this._txt = txt;
        },
        get: function get() {
            return this._txt;
        }
    }, {
        key: "params",
        set: function set(params) {
            this._params = params;
        },
        get: function get() {
            return this._params;
        }
    }, {
        key: "from",
        set: function set(from) {
            this._from = from;
        },
        get: function get() {
            return this._from;
        }
    }, {
        key: "to",
        set: function set(to) {
            this._to = to;
        },
        get: function get() {
            return this._to;
        }
    }]);

    return ChatMessage;
}();

var LogMessage = function (_ChatMessage) {
    _inherits(LogMessage, _ChatMessage);

    function LogMessage(ip, msg) {
        _classCallCheck(this, LogMessage);

        var _this = _possibleConstructorReturn(this, (LogMessage.__proto__ || Object.getPrototypeOf(LogMessage)).call(this));

        _this.ip = ip;
        _this.msg = msg;
        return _this;
    }

    _createClass(LogMessage, [{
        key: "msg",
        set: function set(msg) {
            this._msg = msg;
        },
        get: function get() {
            return this._msg;
        }
    }, {
        key: "ip",
        set: function set(ip) {
            this._ip = ip;
        },
        get: function get() {
            return this._ip;
        }
    }]);

    return LogMessage;
}(ChatMessage);



var ChatCommand = function () {
    function ChatCommand() {
        var cmd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _classCallCheck(this, ChatCommand);

        this._cmd = cmd;
        this._data = data;
        this._log = console.log();
        this._time = Date.now();
    }

    _createClass(ChatCommand, [{
        key: "cmd",
        get: function get() {
            return this._cmd;
        },
        set: function set(cmd) {
            this._cmd = cmd;
        }
    }, {
        key: "data",
        get: function get() {
            return this._data;
        },
        set: function set(data) {
            this._data = data;
        }
    }]);

    return ChatCommand;
}();


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChatUser = function () {
  function ChatUser() {
    var uid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Unbekannt';

    _classCallCheck(this, ChatUser);

    this._uid = uid;
    this._time = Date.now();
    this._name = name;
    this._picture = 'img/anonymous.png';
    this._roles = { '1': 'anonymous user' };
    this._email = null;
    this._fbid = null;
    this._session = null;
    this._token = null;
    this._sid = null;
  }

  _createClass(ChatUser, [{
    key: 'setName',
    value: function setName(name) {
      this._name = name;
    }
  }, {
    key: 'sid',
    get: function get() {
      return this._sid;
    },
    set: function set(sid) {
      this._sid = sid;
    }
  }, {
    key: 'uid',
    get: function get() {
      return this._uid;
    },
    set: function set(email) {
      this._email = email;
    }
  }, {
    key: 'fbid',
    get: function get() {
      return this._fbid;
    },
    set: function set(fbid) {
      this._fbid = fbid;
    }
  }, {
    key: 'email',
    get: function get() {
      return this._email;
    }
  }, {
    key: 'name',
    get: function get() {
      return this._name;
    },
    set: function set(name) {
      this._name = name;
    }
  }, {
    key: 'picture',
    get: function get() {
      return this._picture;
    },
    set: function set(picture) {
      this._picture = picture;
    }
  }]);

  return ChatUser;
}();