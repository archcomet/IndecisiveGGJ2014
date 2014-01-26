//      Cog.js - Entity Component System framework v1.3.1pre 2014-01-13T04:56:53.078Z
//      http://www.github.com/archcomet/cogjs
//      (c) 2013-2014 Michael Good
//      Cog.js may be freely distributed under the MIT license.

(function() {

    var hasOwn = Object.prototype.hasOwnProperty;

    var slice = Array.prototype.slice;

    var toString = Object.prototype.toString;



    /**
     * CogJs exposes itself as a global namespace and as a named AMD module called 'cog'.
     * This namespace contains all classes and core utility functions.
     * @namespace cog
     */

    var cog = function() {
        return !(this instanceof cog) ? new cog() : this;
    };

    /**
     * A string containing the CogJs version number.
     * @memberof cog
     * @const
     */

    cog.VERSION = '1.3.1pre';

    // ------------------------------------------
    // Public Utilities

    /**
     * Merge the contents of two or more objects into the first object. Target properties will be overwritten.
     *
     * Based on [jQuery.extend()](http://api.jquery.com/jQuery.extend/)
     *
     * Essentially the same as jQuery.extend, except extends the cog namespaces instead of the jquery namespace if
     * only one argument is passed in.
     *
     * @see http://api.jquery.com/jQuery.extend/
     *
     * @memberof cog
     *
     * @param {boolean} [deep] - If true, the merge becomes recursive (a.k.a. deep copy).
     * @param {object} target - An object that will receive the properties if additional objects are passed in.
     * Alternatively, target will extend the cog namespace if it is the sole argument.
     * @param {object} [object1] - An object containing properties to be merged into the target.
     * @param {...object} [objectN] - Additional objects containing properties to be merged into the target.
     * Will overwrite properties provided by previous objects.
     * @returns {object} - The target object.
     *
     * @example <caption>Merge two objects</caption>
     *  var target = {
     *      foo: {
     *          bar: 42
     *      }
     *  }
     *
     *  var object {
     *      foo: {
     *          msg: 'hello world'
     *      }
     *  }
     *
     *  // Replaces object.foo with a references to target.foo.
     *  cog.extend(target, object);
     *
     *  // The following statements are now true:
     *  target.foo.msg === 'hello world'
     *  target.foo.bar === undefined;
     *  target.foo === object.foo;
     * @example <caption>Merge two objects with a deep copy</caption>
     *  var target = {
     *      foo: {
     *          bar: 42
     *      }
     *  }
     *
     *  var object {
     *      foo: {
     *          msg: 'hello world'
     *      }
     *  }
     *
     *  // Merges object.foo with to target.foo, and copies properties.
     *  cog.extend(true, target, object);
     *
     *  // The following statements are now true:
     *  target.foo.msg === 'hello world'
     *  target.foo.bar === 42;
     *  target.foo !== object.foo;
     */

    cog.extend = function() {
        var options, key, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            n = arguments.length,
            deep = false;

        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== 'object' && !cog.isFunction(target)) {
            target = {};
        }

        if (i === n) {
            target = this;
            i--;
        }

        for(; i < n; ++i) {
            if ((options = arguments[i]) != null) {
                for (key in options) {
                    //noinspection JSUnfilteredForInLoop
                    src = target[key];

                    //noinspection JSUnfilteredForInLoop
                    copy = options[key];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && (cog.isPlainObject(copy) || (copyIsArray = cog.isArray(copy)) )) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && cog.isArray(src) ? src : [];
                        } else {
                            clone = src && cog.isPlainObject(src) ? src : {};
                        }

                        //noinspection JSUnfilteredForInLoop
                        target[key] = cog.extend(deep, clone, copy);

                    } else if (copy !== undefined) {

                        //noinspection JSUnfilteredForInLoop
                        target[key] = copy;
                    }
                }
            }
        }

        return target;
    };

    /**
     * Merges the contents of two or more objects into the first object. Target properties will not be overwritten.
     *
     * Based on [underscore.defaults](http://underscorejs.org/#defaults)
     *
     * @see  http://underscorejs.org/#defaults
     *
     * @memberof cog
     *
     * @param {object} target - An object that will receive properties if additional objects are passed in.
     * @param {object} [object1] - An object containing properties to be merged into the target.
     * @param {object} [objectN] - Additional objects containing properties to be merged into the target.
     * @returns {object} - The target object.
     */

    cog.defaults = function defaults(target, object1, objectN) {
        slice.call(arguments, 1).forEach(function(source) {
            if (source) {
                for (var key in source) {
                    //noinspection JSUnfilteredForInLoop
                    if (target[key] === undefined) {
                        //noinspection JSUnfilteredForInLoop
                        target[key] = source[key];
                    }
                }
            }
        });
        return target;
    };

    cog.type = function type(obj) {
        // undefined or null
        if (obj == null) {
            return obj + '';
        }
        return typeof obj === 'object' || typeof obj === 'function' ? 'object' : typeof obj;
    };

    /**
     * Checks if the object is an array.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isArray = function isArray(obj) {
        return toString.call(obj) === '[object Array]';
    };

    /**
     * Checks if the object is a date.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isDate = function isDate(obj) {
        return toString.call(obj) === '[object Date]';
    };

    /**
     * Checks if the object is a boolean.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isBoolean = function isBoolean(obj) {
        return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
    };

    /**
     * Checks if the object is a function.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isFunction = function isFunction(obj) {
        return typeof obj === 'function';
    };

    /**
     * Checks if the object is a number.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isNumber = function isNumber(obj) {
        return toString.call(obj) === '[object Number]';
    };

    /**
     * Checks if the object is an object.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isObject = function isObject(obj) {
        return obj === Object(obj);
    };

    /**
     * Checks if the object is a plain object.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isPlainObject = function isPlainObject(obj) {
        if (cog.type(obj) !== 'object' || obj.nodeType || cog.isWindow(obj)) {
            return false;
        }
        try {
            if (obj.constructor && !hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
                return false;
            }
        } catch ( e ) {
            return false;
        }
        return true;
    };

    /**
     * Checks if the object is a regular expression.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isRegExp = function isRegExp(obj) {
        return toString.call(obj) === '[object RegExp]';
    };

    /**
     * Checks if the object is a string.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isString = function isString(obj) {
        return toString.call(obj) === '[object String]';
    };

    /**
     * Checks if the object is a window element.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isWindow = function isWindow(obj) {
        return obj != null && obj === obj.window;
    };

    // ------------------------------------------
    // Internal Utilities

    var initializing = false;

    //if function de-compilation is supported match '_super', otherwise match anything
    //noinspection JSValidateTypes
    var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    function _inherit(target, base, source) {
        for (var key in source) {
            //noinspection JSUnfilteredForInLoop
            target[key] = (cog.isFunction(source[key]) && cog.isFunction(base[key]) && fnTest.test(source[key])) ?
                (function(key, fn) {
                    return function() {
                        //noinspection JSPotentiallyInvalidUsageOfThis
                        var tmp = this._super;

                        //noinspection JSUnfilteredForInLoop,JSPotentiallyInvalidUsageOfThis
                        this._super = base[key];
                        var ret = fn.apply(this, arguments);
                        //noinspection JSPotentiallyInvalidUsageOfThis
                        this._super = tmp;

                        return ret;
                    }
                } (key, source[key])) : source[key];
        }
    }

    function _defineDirtyableProp(obj, key, value) {

        var privateKey = '_' + key;
        obj[privateKey] = value;

        Object.defineProperty(obj, key, {
            get: function() {
                return this[privateKey];
            },
            set: function(value) {
                var oldValue = this[privateKey];
                this[privateKey] = value;
                this.dirty = true;
                if (cog.isFunction(this.trigger)) {
                    this.trigger(key, value, oldValue);
                }
            },
            enumerable: true,
            configurable: true
        })
    }

    function _defaultProperties(obj, defaults, dirtyable) {
        var key;
        for (key in defaults) {
            if (defaults.hasOwnProperty(key)) {
                if (dirtyable) {
                    _defineDirtyableProp(obj, key, defaults[key]);
                } else {
                    Object.defineProperty(obj, key, {
                        value: defaults[key],
                        configurable: true,
                        writable: true,
                        enumerable: true
                    });
                }
            }
        }
    }

    /**
     * A base constructor for inheritance.
     *
     * Based on [Simple Javascript Inheritance](http://ejohn.org/blog/simple-javascript-inheritance/)
     * by John Resig
     *
     * @constructor
     * @abstract
     * @memberof cog
     */

    cog.Construct = function Construct() {
        if (arguments.length) {
            return cog.Construct.extend.apply(Construct, arguments);
        }
        return this;
    };


    /**
     * Create an instance
     * @memberof cog
     * @returns {instance} - A new instance of the Constructor.
     */

    cog.Construct.create = function() {
        var args = slice.call(arguments);
        args.splice(0, 0, this);
        return new (Function.prototype.bind.apply(this, args));
    };

    /**
     * Initialize an instance
     * @abstract
     * @instance
     * @memberof cog.Construct
     * @method init
     */

    cog.Construct.prototype.init = function() {};

    /**
     * Destroys an instance
     * @abstract
     * @instance
     * @memberof cog.Construct
     * @method destroy
     */

    cog.Construct.prototype.destroy = function() {};

    /**
     * Extends the Constructor
     * @memberof cog.Construct
     * @param fullName
     * @param staticProps
     * @param instanceProps
     * @returns {Constructor}
     */

    cog.Construct.extend = function(fullName, staticProps, instanceProps) {

        var prototype, superPrototype;

        if (!cog.isString(fullName)) {
            instanceProps = staticProps;
            staticProps = fullName;
            fullName = null;
        }

        if (!instanceProps) {
            instanceProps = staticProps;
            staticProps = null;
        }

        instanceProps = instanceProps || {};
        staticProps = staticProps || {};

        initializing = true;
        prototype = new this();
        superPrototype = this.prototype;
        initializing = false;

        _inherit(prototype, superPrototype, instanceProps);

        function Constructor() {
            if (!(this instanceof Constructor)) {
                throw 'Constructor called without new keyword';
            }
            if (!initializing) {
                this.init.apply(this, arguments);
            }
        }

        Constructor.prototype = prototype;
        Constructor.prototype.constructor = Constructor;

        _inherit(Constructor, {}, superPrototype.constructor);
        _inherit(Constructor, superPrototype.constructor, staticProps);

        Object.defineProperty(Constructor, 'fullName', {
            value: fullName,
            writable: false,
            configurable: true,
            enumerable: false
        });


        if (Constructor.dirtyOnChange) {
            Object.defineProperty(Constructor.prototype, 'dirty', {
                value: true,
                writable: true,
                configurable: true,
                enumerable: false
            });
        }

        if (instanceProps.defaults) {
            _defaultProperties(Constructor.prototype, instanceProps.defaults, Constructor.dirtyOnChange);
        }

        if (instanceProps.properties) {
            Object.defineProperties(Constructor.prototype, instanceProps.properties);
        }

        if (Constructor.defaults) {
            _defaultProperties(Constructor, Constructor.defaults, false);
        }

        if (Constructor.properties) {
            Object.defineProperties(Constructor, Constructor.properties);
        }

        if (Constructor.setup) {
            Constructor.setup();
        }

        return Constructor;
    };


    /**
     * @namespace debug
     * @memberof cog
     */

    var debug = {

        /**
         * enable debug
         * @memberof cog.debug
         */

        enable: function() {
            this._enabled = true;
        },

        /**
         * disable debug
         * @memberof cog.debug
         */

        disable: function() {
            this._enabled = false;
        },

        /**
         * log debug messages
         * @memberof cog.debug
         * @param {string} msg
         */

        log: function(msg) {
            if (this._enabled) {
                console.log(msg);
            }
        }
    };

    cog.extend({
        debug: debug
    });


    /**
     * ArrayWrapper
     *
     * Wraps a native javascript array for protected data access.
     * Can spawn clones or readonly copies.
     *
     * If the first parameter is an Array type or instance of an ArrayWrapper,
     * then initialize the data as a clone of the input array.
     *
     * If the first parameter is a Number type,
     * then initialize the data with the given capacity.
     *
     * If the second parameter is true,
     * then initialize as a read-only object.
     *
     * @param [array || capacity]
     * @param [readOnly]
     * @constructor
     */

    var ArrayWrapper = cog.Construct.extend('cog.ArrayWrapper', {

        init: function(arg, readOnly) {

            if (this.get) return;

            var data;

            if (arg instanceof ArrayWrapper) {
                data = arg.serialize();
            }
            else if (cog.isArray(arg)) {
                data = arg.slice(0);
            } else {
                data = new Array((cog.isNumber(arg) ? arg : 0));
            }

            if (!readOnly) {
                this.add = function(obj) {
                    data.push(obj);
                    return this;
                };

                this.insert = function(obj, index) {
                    data.splice(index, 0, obj);
                    return this;
                };

                this.remove = function(obj) {
                    var index = data.indexOf(obj);
                    if (index > -1) {
                        data.splice(index, 1);
                    }
                    return this;
                };

                this.removeAtIndex = function(index) {
                    data.splice(index, 1);
                    return this;
                };

                this.removeAll = function() {
                    data.length = 0;
                    return this;
                };

                this.removeLast = function() {
                    data.pop();
                    return this;
                };
            }

            this.get = function(index) {
                return data[index];
            };

            this.each = function(callback) {
                var i = 0, n = data.length;
                for (; i < n; ++i) {
                    callback(data[i], i);
                }
                return this;
            };

            this.length = function() {
                return data.length;
            };

            this.serialize = function() {
                return data.slice(0);
            };

            this.clone = function() {
                return new ArrayWrapper(this, readOnly);
            };

            this.readyOnly = function() {
                return new ArrayWrapper(this, true);
            };
        }
    });

    /**
     * SetWrapper
     *
     * Wraps a native javascript object for protected data access.
     * Can spawn clones or readonly copies.
     *
     * If the first parameter is an Object type or instance of an SetWrapper,
     * then initialize the data as a clone of the input object.
     *
     * If the second parameter is true,
     * then initialize as a read-only object.
     *
     * @param [object]
     * @param [readOnly]
     * @constructor
     */

    var SetWrapper = cog.Construct.extend('cog.SetWrapper', {

        init: function(arg, readonly) {

            if (this.get) return;

            var data;

            if (arg instanceof SetWrapper) {
                data = arg.serialize();
            } else if (cog.isObject(arg)) {
                data = cog.extend({}, arg);
            } else {
                data = {};
            }

            if (!readonly) {
                this.set = function(key, obj) {
                    data[key] = obj;
                    return this;
                };

                this.remove = function(obj) {
                    for (var key in data) {
                        if (data.hasOwnProperty(key) && data[key] === obj) {
                            return this.removeKey(key);
                        }
                    }
                    return this;
                };

                this.removeKey = function(key) {
                    delete data[key];
                    return this;
                };

                this.removeAll = function() {
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            delete data[key];
                        }
                    }
                    return this;
                };

                this.extend = function() {
                    var args = slice.call(arguments);
                    args.splice(0, 0, data);
                    cog.extend.apply(cog.extend, args);
                    return this;
                };
            }

            this.get = function(key) {
                return data[key];
            };

            this.each = function(callback) {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        callback(data[key], key);
                    }
                }
                return this;
            };

            this.count = function() {
                var count = 0;
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        ++count;
                    }
                }
                return count;
            };

            this.serialize = function() {
                return cog.extend({}, data);
            };

            this.clone = function() {
                return new SetWrapper(this, readonly);
            };

            this.readOnly = function() {
                return new SetWrapper(this, true);
            };
        }
    });

    cog.extend({
        ArrayWrapper: ArrayWrapper,
        SetWrapper: SetWrapper
    });


    /**
     * Seed-able random number generator based on ARC4
     * @namespace rand
     * @memberof cog
     */

    var rand = (function() {

        var lastSeed,
            width = 256, // Size of RC4 output
            chunks = 6, // Number of RC4 outputs for each double
            digits = 52, // Significant digits in a double
            S = new Array(width), // Entropy pool
            key = [], // Key array
            denominator = Math.pow(width, chunks),
            significance = Math.pow(2, digits),
            overflow = significance * 2,
            mask = width - 1;

        /**
         * Key mixing
         * Converts seed to an array of integers with a max length 256
         * @param seed
         */

        function _mixKey(seed) {
            var smear, i = 0, seedString = seed + '';
            key.length = 0;
            for (; i < seedString.length; ++i) {
                key[mask & i] =  mask & ((smear ^= key[mask & i] * 19) + seedString.charCodeAt(i))
            }
        }

        /**
         * Key scheduling
         * Initializes permutations in the entropy pool
         */

        function _scheduleKey() {
            var swap, i, j = 0, keyLength = key.length;
            for (i = 0; i < width; ++i) {
                S[i] = i;
            }

            for (i = 0; i < width; ++i) {
                j = (j + S[i] + key[i % keyLength]) % width;
                swap = S[i];
                S[i] = S[j];
                S[j] = swap;
            }
        }

        /**
         * generator
         * @type {{i: number, j: number, out: out}}
         * @private
         */

        var _gen = {
            i: 0, j: 0,
            out: function(count) {
                var i = this.i,
                    j = this.j,
                    swap, K = 0;
                while(count--) {
                    swap = S[i = (i + 1) % mask];
                    K = K * width + S[mask & ((S[i] = S[j = mask & (j + swap)]) + (S[j] = swap))];
                }
                this.i = i;
                this.j = j;
                return K;
            }
        };

        /**
         * Generate a random double between 0 and 1;
         * @returns {number}
         * @private
         */

        function _randDouble() {
            var n = _gen.out(chunks),
                d = denominator,
                x = 0;

            while (n < significance) {
                n = (n + x) * width;
                d *= width;
                x = _gen.out(1);
            }

            while (n >= overflow) {
                n /= 2;
                d /= 2;
                x >>>= 1;
            }

            return (n + x) / d;
        }

        /**
         * Gets/Sets seed
         *
         * seed(*) sets a seed
         * seed() gets the last seed
         *
         * Input can be a strings or a number.
         *
         * @memberof cog.rand
         *
         * @param {string|number} [seed] - An object to seed the RNG.
         * @return {string|number} - The current seed.
         */

        function seed(seed) {
            if (arguments.length > 0) {
                _mixKey(seed);
                _scheduleKey();
                _gen.i = 0;
                _gen.j = 0;
                lastSeed = seed;
                return seed;
            }
            return lastSeed;
        }

        /**
         * Seeds generator with output from Math.random()
         *
         * @memberof cog.rand
         * @return {string|number} - The current seed.
         */

        function seedRand() {
            return seed(Math.random());
        }

        /**
         * Seeds generator with output from Date.now()
         * Default seed is initialized with this.
         *
         * @memberof cog.rand
         * @return {string|number} - The current seed.
         */

        function seedTime() {
            return seed(Date.now());
        }

        /**
         * Generates a random integer between 0 and 255
         *
         * Gets the next byte of the output stream.
         * Not as 'random', but is about 5 times faster
         *
         * arc4rand255()    output is 0<= x < 256
         *
         * @memberof cog.rand
         *
         * @returns {number} - A random integer between 0 and 255
         */

        function arc4rand255() {
            return _gen.out(1);
        }

        /**
         * Generates a random double
         *
         * arc4rand()       output is 0 <= x < 1
         * arc4rand(N)      output is 0 <= x < N
         * arc4rand(N, M)   output is N <= x < M
         *
         * @memberof cog.rand
         *
         * @param {number} [N] - The max value if N is the sole argument or the min value if N and M are passed.
         * @param {number} [M] - The max value.
         * @return {number}  - A random double.
         */

        function arc4rand(N, M) {
            var r = _randDouble(),
                argLen = arguments.length;

            if (argLen === 0) {
                return r;
            } else if (argLen === 1) {
                M = N;
                N = 0;
            }

            return r * (M - N) + N;
        }

        /**
         * Generates a random integer
         *
         * arc4randInt()        output is 0 <= x <= 1
         * arc4randInt(N)       output is 0 <= x <= N
         * arc4randInt(N, M)    output is N <= x <= M
         *
         * @memberof cog.rand
         *
         * @param {number} [N] - The max value if N is the sole argument or the min value if N and M are passed.
         * @param {number} [M] - The max value.
         * @return {number} - A random integer.
         */

        function arc4randInt(N, M) {
            var r = _randDouble(),
                argLen = arguments.length;

            if (argLen === 0) {
                return Math.floor(r * 2);
            } else if (argLen === 1) {
                M = N;
                N = 0;
            }

            return Math.floor(r * (M - N + 1)) + N;
        }

        // Initialize seed with time
        seedTime();

        return {
            seed: seed,
            seedRand: seedRand,
            seedTime: seedTime,
            arc4rand: arc4rand,
            arc4randInt: arc4randInt,
            arc4rand255: arc4rand255
        };
    }());

    cog.extend({
        rand: rand
    });

    /**
     * _mask
     *  Creates a bit mask from the arguments array.
     * @returns {number}
     * @private
     */

    function _mask() {
        var arg, ret = 0, i = 0, n = arguments.length;
        for(; i < n; ++i) {
            if ((arg = arguments[i]) && arg.category) {
                ret |= arg.category;
            }
        }
        return ret;
    }


    /**
     * Entity provides identity to all game objects.
     *
     * @class
     * @memberof cog
     * @augments cog.Construct
     *
     * @param {EntityManager} manager - EntityManager that created the Entity
     * @param {number} id - Unique numeric Id assigned by the EntityManager
     * @param {string} [tag] - Entity Tag
     * @constructor
     */

    var Entity = cog.Construct.extend('cog.Entity', {

        components: null,
        _manager: null,
        _tag: null,

        properties: {

            /**
             * Gets the EntityManager
             *
             * @readonly
             * @instance
             * @memberof cog.Entity
             *
             * @type {EntityManager}
             */

            manager: { get: function() { return this._manager; } },

            /**
             * Gets the entity id
             *
             * @readonly
             * @instance
             * @memberof cog.Entity
             *
             * @type {number}
             */

            id: { get: function() { return this._id } },

            /**
             * @member tag
             * @summary Gets the entity tag
             *
             * @readonly
             * @instance
             * @memberof cog.Entity
             *
             * @type {string}
             */

            tag: { get: function() { return this._tag } },

            /**
             * @member valid
             * @summary True after the Entity is initialized. False once destroyed.
             *
             * @readonly
             * @instance
             * @memberof cog.Entity
             *
             * @type {boolean}
             */

            valid: { get: function() { return (this._manager && this._id) ? true : false; } },

            /**
             * @member parent
             * @summary Gets the the Entity's parent.
             *
             * @readonly
             * @instance
             * @memberof cog.Entity
             *
             * @type {Entity}
             */

            parent: { get: function() { return this._parent; } },

            /**
             * Gets an array of the Entity's children.
             *
             * @readonly
             * @instance
             * @memberof cog.Entity
             *
             * @type {Array}
             */

            children: { get: function() { return this._children.slice(0); } }
        },

        /**
         * Initializes the Entity
         *
         * @instance
         * @method
         * @memberof cog.Entity
         *
         * @param {EntityManager} [manager] - EntityManager that created the Entity.
         * @param {number} [id] - Id assigned by the EntityManager.
         * @param {string} [tag] - Entity Tag.
         */

        init: function(manager, id, tag) {
            this._manager = manager;
            this._id = id;
            this._tag = tag || null;
            this._components = {};
            this._parent = null;
            this._children = [];

            /**
             * @name components
             * @memberof cog.Entity
             * @instance
             *
             * @type {cog.Entity~components}
             */

            this.components = components.make(this);
        },

        /**
         * Destroys the instance of the Entity
         *
         * @instance
         * @method
         * @memberof cog.Entity
         */

        destroy: function(managed) {
            if (this._manager && !managed) {
                this._manager.remove(this);
                return;
            }
            this.components.removeAll();
            this._manager = undefined;
            this._id = undefined;
            this._tag = undefined;
            this._children = undefined;
        },

        /**
         * Creates a new instance of the Entity. Components and enumerable properties are copied to the new Entity.
         *
         * @instance
         * @method
         * @memberof cog.Entity
         *
         * @returns {Entity}
         *
         * @example
         * // Creates a clone of the entity.
         * var clonedEntity = entity.clone();
         */

        clone: function() {
            var key,
                component,
                components = this.components._components,
                clone = this._manager.add(this._tag);

            for (key in components) {
                if (components.hasOwnProperty(key)) {
                    component = components[key];
                    clone.components.assign(component.constructor, component.serialize());
                }
            }
            return clone;
        },

        /**
         * Adds a child to the entity.
         *
         * @instance
         * @method
         * @memberof cog.Entity
         *
         * @param {entity} entity - The entity to be added
         * @returns {this}
         */

        addChild: function(entity) {
            if (entity.parent) {
                entity.parent.removeChild(entity);
            }

            entity._parent = this;
            this._children.push(entity);
            this._manager.director.events.emit('entity addChild', this, entity);
            return this;
        },

        /**
         * Removes a child from the entity.
         *
         * @instance
         * @method
         * @memberof cog.Entity
         *
         * @param {entity} entity - The entity to be removed
         * @returns {this}
         */

        removeChild: function(entity) {
            var index;
            if (entity.parent === this) {
                entity._parent = null;
                index = this._children.indexOf(entity);
                if (index > -1) {
                    this._children.splice(index, 1);
                    this._manager.director.events.emit('entity removeChild', this, entity);
                }
            }
            return this;
        },

        /**
         * Removes all children.
         *
         * @instance
         * @method
         * @memberof cog.Entity
         *
         * @returns {this}
         */

        removeAllChildren: function() {
            var children = this._children,
                n = children.length - 1;
            for (; n >= 0; --n) {
                this.removeChild(children[n]);
            }
            return this;
        }
    });

    /**
     * @mixin
     * @inner
     * @memberof cog.Entity
     */

    var components = {

        /**
         * @instance
         *
         * @example
         *  var PositionComponent = cog.Component.extend({...});
         *  ...
         *  // Create an entity and add a PositionComponent
         *  var entity = director.entities.add('exampleEntity');
         *  var component = entity.add(PositionComponent, { x: 0, y: 100 });
         * @param {Component} Component - Constructor function for the entity.
         * @param {Object} [options] - Component Options to be passed to the Component Constructor.
         * @returns {component}
         */

        assign: function (Component, options) {
            if (!Component || !Component.category) {
                return null;
            }
            var component, category = Component.category;
            if ((category & this._componentMask) === category) {
                component = this._components[category];
                component.set(options);
            } else {
                component = this._components[category] = new Component(this._entity, options);
                this._componentMask |= category;
                this._eventManager.emit(Component.eventTarget + ' assigned', component, this._entity);
            }
            return component;
        },

        /**
         * @instance
         * @param {Component} Component
         */

        remove: function (Component) {
            if (Component instanceof cog.Component) {
                Component = Component.constructor;
            }
            var component, category = Component.category;
            if ((category & this._componentMask) === category) {
                component = this._components[category];
                this._componentMask &= ~(category);
                this._components[category] = undefined;
                this._eventManager.emit(Component.eventTarget + ' removed', component, this._entity);
                component.destroy(true);
            }
            return this;
        },

        /**
         * @instance
         * @returns {*}
         */

        removeAll: function() {
            var key;
            for (key in this._components) {
                if (this._components.hasOwnProperty(key)) {
                    this.remove(this._components[key]);
                }
            }
            return this;
        },

        /**
         * Checks if the entity contains one or more matching Components
         *
         * @instance
         *
         * @param {...Component} Component - 1...N Component Constructor(s) to match the components against.
         * @returns {boolean}
         */

        has: function(Component) {
            var inputMask = _mask.apply(_mask, arguments);
            return inputMask !== 0 && (inputMask & this._componentMask) === inputMask;
        },

        /* initial mask value */
        _entity: null,
        _components: null,
        _componentMask: 0,
        _eventManager: null,

        /* Wrap storage in a componentAPI  */
        make: function (entity) {

            /**
             * @summary Gets component(s) from the entity
             * @desc The components method gets a component or an array of components.
             * If a Component constructor is passed to the function, this method will find and return the matching component.
             * If no arguments are passed, this method will create an array containing all of the components on the entity.
             *
             * @instance
             * @method
             * @memberof cog.Entity
             *
             * @param {Component} [Component] - If passed, components will get the matching component.
             * @returns {component|Array} - The component that matches the Constructor or an Array of all components
             */

            function components(Component) {
                var key, array, storage = components._components;

                if (Component) {
                    return Component.category ? storage[Component.category] : null;
                }

                // Get All Components
                array = [];
                for (key in storage) {
                    if (storage.hasOwnProperty(key)) {
                        array.push(storage[key]);
                    }
                }
                return array;
            }

            components._componentMask = this._componentMask;
            components._components = entity._components;
            components._eventManager = entity.manager.director.events;
            components._entity = entity;
            components.has = this.has;
            components.mask = this.mask;
            components.assign = this.assign;
            components.remove = this.remove;
            components.removeAll = this.removeAll;

            Object.defineProperties(components, {

                /**
                 * Gets current component mask
                 * @alias mask
                 * @instance
                 * @memberof cog.Entity~components
                 * @type {number}
                 */

                mask: {
                    get: function() {
                        return this._componentMask;
                    }
                }
            });

            return components;
        }
    };

    cog.extend({
        Entity: Entity
    });

    function assertLimit(num, limit, msg) {
        if (num > limit) {
            throw msg;
        }
    }


    var componentCount = 0;

    /**
     * A component class.
     *
     * @class
     * @memberof cog
     * @augments cog.Construct
     *
     * @param {entity} entity - Entity that created the component
     * @param {props} props - Options for the component
     * @constructor
     */

    var Component = cog.Construct.extend('cog.Component', {

        eventTarget: 'component',

        properties: {
            category: { get: function() { return this._category; } },
            count: { get: function() { return componentCount - 1; } }
        },

        setup: function() {
            assertLimit(componentCount, 64, 'Exceeded 64 Component types.');
            this._category= (componentCount === 0) ? 0 : 1 << (componentCount-1);
            componentCount++;
        }

    }, {

        properties: {
            entity: { get: function() { return this._entity; } },
            valid: { get: function() { return (this._entity !== undefined); } }
        },

        init: function(entity, props) {
            this._entity = entity;
            this._listeners = {};
            this.set(props);
        },

        set: function(props) {
            for(var key in props) {
                if (props.hasOwnProperty(key)) {
                    this.prop(key, props[key]);
                }
            }
        },

        prop: function(propName, value) {
            if (arguments.length === 2) {
                var oldValue = this[propName];
                this[propName] = value;
                this.trigger(propName, value, oldValue);
                return undefined;
            }
            return this[propName];
        },

        on: function(key, handler) {
            var handlers = this._listeners[key];
            if (!handlers) {
                handlers = this._listeners[key] = [];
            }
            handlers.push(handler);
        },

        off: function(key) {
            if (key) {
                if (this._listeners[key]) {
                    this._listeners[key].length = 0;
                }
            } else {
                for (key in this._listeners) {
                    if (this._listeners.hasOwnProperty(key)) {
                        this._listeners[key].length = 0;
                    }
                }
            }
        },

        trigger: function(key, value, oldValue) {
            var i, n, handlers = this._listeners[key];
            if (handlers) {
                for (i = 0, n = handlers.length; i < n; ++i) {
                    handlers[i](value, oldValue);
                }
            }
        },

        keys: function() {
            var key, keys = [];

            for (key in this.defaults) {
                if (this.defaults.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }

            for (key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    if (key === 'entity' || key === 'valid') {
                        continue;
                    }
                    if (keys.indexOf(key) > -1) {
                        continue;
                    }
                    keys.push(key);
                }
            }

            return keys;
        },

        serialize: function() {
            var key,
                target = {};

            for (key in this.defaults) {
                if (this.defaults.hasOwnProperty(key)) {
                    target[key] = this[key];
                }
            }

            for (key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    if ( key === 'entity' || key === 'valid') {
                        continue;
                    }
                    target[key] = this[key];
                }
            }

            return target;
        },

        destroy: function(managed) {
            if (!managed && this._entity && this._entity.components) {
                this._entity.components.remove(this);
                return;
            }
            this.off();
            this._entity = undefined;
        }
    });

    cog.extend({
        Component: Component
    });


    var systemCount = 0;

    /**
     * A system for creating entities.
     *
     * @class
     * @memberof cog
     * @augments cog.System
     *
     * @param {systemManager} manager - SystemManager that created the Entity
     * @constructor
     */

    var System = cog.Construct.extend('cog.System', {

        properties: {
            systemId: { get: function() { return this._systemId; } },
            count: { get: function() { return systemCount -1; } }
        },

        setup: function() {
            this._systemId = (systemCount-1);
            systemCount++;
        }

    }, {

        properties: {
            manager: { get: function() { return this._manager; } }
        },

        init: function(manager) {
            this._manager = manager;
        },

        destroy: function(managed) {
            if (this._manager && !managed) {
                this._manager.remove(this);
                return;
            }
            this._manager = undefined;
        },

        configure: function(entityManager, eventManager, config) {},

        update: function(entityManager, eventManager, dt) {},

        render: function(entityManager) {}

    });

    cog.extend({
        System: System
    });


    /**
     * An abstract system class.
     *
     * @class
     * @abstract
     * @memberof cog
     * @augments cog.System
     *
     * @param {systemManager} manager - SystemManager that created the Entity
     * @constructor
     */

    var Factory = cog.System.extend('cog.Factory', {

        entityTag: null,

        components: {},

        init: function(manager) {
            this._entityManager = manager.director.entities;
            this._super(manager);
            this._entities = [];

            if (cog.isString(this.entityTag)) {
                var self = this;
                this['spawn ' + this.entityTag + ' event'] = function() {
                    self.spawn.apply(self, arguments);
                };
                this['despawn ' + this.entityTag + ' event'] = function() {
                    self.despawn.apply(self, arguments);
                };
                this['despawnAll ' + this.entityTag + ' event'] = function() {
                    self.despawnAll.apply(self, arguments);
                };
            }
        },

        spawn: function(options) {
            var key,
                entity = this._entityManager.add(this.entityTag),
                components = this.components,
                component,
                componentOptions;

            for (key in components) {
                if (components.hasOwnProperty(key)) {
                    component = components[key];
                    componentOptions = (options && options[key]) ? options[key] : {};
                    cog.defaults(componentOptions, component.defaults);
                    entity.components.assign(component.constructor, componentOptions);
                }
            }

            this._entities.push(entity);
            return entity;
        },

        despawn: function(entity) {
            var index = this._entities.indexOf(entity);
            if (index > -1) {
                this._entities.splice(index, 1);
                entity.destroy();
            }
        },

        despawnAll: function() {
            this._entities.forEach(function(entity) {
                entity.destroy();
            });
            this._entities.length = 0;
        }
    });

    cog.extend({
        Factory: Factory
    });


    /**
     * A manager for entities.
     *
     * @class
     * @memberof cog
     * @augments cog.Construct
     *
     * @param {director} director - A director
     * @constructor
     */

    var EntityManager = cog.Construct.extend('cog.EntityManager', {

        properties: {
            director: { get: function() { return this._director; } },
            valid: { get: function() { return (this._director !== undefined); } }
        },

        init: function(director) {
            this._director = director;
            this._entities = [];
            this._entityId = 1;
        },

        destroy: function() {
            this.removeAll();
            this._director = undefined;
        },

        add: function(tag) {
            var entity = new Entity(this, this._entityId++, tag);
            this._entities.push(entity);
            this._director.events.emit('entity added', entity);
            return entity;
        },

        all: function() {
            var i = 0, n = this._entities.length, ret = [];
            for (; i < n; ++i) {
                ret.push(this._entities[i]);
            }
            return ret;
        },

        withTag: function(tag) {
            var entity, i = 0, n = this._entities.length, ret = [];
            if (tag) {
                for (; i < n; ++i) {
                    entity = this._entities[i];
                    if (entity.tag === tag) {
                        ret.push(entity);
                    }
                }
            }
            return ret;
        },

        withComponents: function() {
            var entity,
                inputMask = _mask.apply(_mask, arguments),
                i = 0, n = this._entities.length, ret = [];
            for (; i < n; ++i) {
                entity = this._entities[i];
                if ((inputMask & entity.components._componentMask) === inputMask) {
                    ret.push(entity);
                }
            }
            return ret;
        },

        remove: function(entity) {
            var index = this._entities.indexOf(entity);
            if (index > -1) {
                this._entities.splice(index, 1);
                this._director.events.emit('entity removed', entity);
                entity.destroy(true);
            }
            return this;
        },

        removeAll: function() {
            var entity, i = this._entities.length - 1;
            for (; i > -1; --i) {
                entity = this._entities.splice(i, 1)[0];
                this._director.events.emit('entity removed', entity);
                entity.destroy(true);
            }
            return this;
        },

        removeWithTag: function(tag) {
            var entity, i = this._entities.length - 1;
            for (; i > -1; --i) {
                if (this._entities[i].tag === tag) {
                    entity = this._entities.splice(i, 1)[0];
                    this._director.events.emit('entity removed', entity);
                    entity.destroy(true);
                }
            }
            return this;
        },

        removeWithComponents: function() {
            var entity, i = this._entities.length - 1,
                inputMask = _mask.apply(_mask, arguments);
            for (; i > -1; --i) {
                entity = this._entities[i];
                if ((inputMask & entity.components._componentMask) === inputMask) {
                    entity = this._entities.splice(i, 1)[0];
                    this._director.events.emit('entity removed', entity);
                    entity.destroy(true);
                }
            }
            return this;
        }
    });

    cog.extend({
        EntityManager: EntityManager
    });


    var _eventRegEx = /.* event$/;

    /**
     * A manager for events.
     *
     * @class
     * @memberof cog
     * @augments cog.Construct
     *
     * @param {director} director - A director
     * @constructor
     */

    var EventManager = cog.Construct.extend('cog.SystemManager', {

        properties: {
            director: { get: function() { return this._director; } },
            valid: { get: function() { return (this._director !== undefined); } }
        },

        init: function(director) {
            this._director = director;
            this._eventContexts = {};
            this._eventCallbacks = {};
        },

        destroy:  function() {
            this.unregisterAll();
            this._director = undefined;
        },

        emit: function(eventName) {
            var i, n, args,
                contexts = this._eventContexts[eventName],
                callbacks = this._eventCallbacks[eventName];
            if (contexts && callbacks) {
                args = slice.call(arguments, 1);
                for (i = 0, n = callbacks.length; i < n; ++i) {
                    callbacks[i].apply(contexts[i], args);
                }
            }
            return this;
        },

        register: function(eventName, context, callback) {
            if (!cog.isObject(context) || !cog.isFunction(callback)) {
                return this;
            }
            var contexts = this._eventContexts[eventName],
                callbacks = this._eventCallbacks[eventName];

            if (contexts === undefined || callbacks === undefined) {
                contexts = this._eventContexts[eventName] = [];
                callbacks = this._eventCallbacks[eventName] = [];
            }
            contexts.push(context);
            callbacks.push(callback);
            return this;
        },

        registerContext: function(context) {
            var key, prop;
            for (key in context) {
                //noinspection JSUnfilteredForInLoop
                if ((prop = context[key]) && cog.isFunction(prop) && _eventRegEx.test(key)) {
                    //noinspection JSUnfilteredForInLoop
                    this.register(key.substring(0, key.length-6), context, prop);
                }
            }
            return this;
        },

        unregister: function(eventName, context) {
            var i, contexts = this._eventContexts[eventName],
                callbacks = this._eventCallbacks[eventName];
            if (contexts && callbacks) {
                for (i = contexts.length - 1; i >= 0; --i) {
                    if (contexts[i] === context) {
                        contexts.splice(i, 1);
                        callbacks.splice(i, 1);
                    }
                }
            }
            return this;
        },

        unregisterContext: function(context) {
            for (var event in this._eventContexts) {
                if (this._eventContexts.hasOwnProperty(event)) {
                    this.unregister(event, context);
                }
            }
            return this;
        },

        unregisterEvent: function(eventName) {
            var contexts = this._eventContexts[eventName],
                callbacks = this._eventCallbacks[eventName];
            if (contexts && callbacks) {
                this._eventContexts[eventName].length = 0;
                this._eventCallbacks[eventName].length = 0;
            }
            return this;
        },

        unregisterAll: function() {
            for (var event in this._eventContexts) {
                if (this._eventContexts.hasOwnProperty(event)) {
                    this.unregisterEvent(event);
                }
            }
            return this;
        }
    });

    cog.extend({
        EventManager: EventManager
    });


    /**
     * A manager for systems.
     *
     * @class
     * @memberof cog
     * @augments cog.Construct
     *
     * @param {director} director - A director
     * @constructor
     */

    var SystemManager = cog.Construct.extend('cog.SystemManager', {

        properties: {
            director: { get: function() { return this._director; } },
            valid: { get: function() { return (this._director !== undefined); } }
        },

        init: function(director) {
            this._systems = {};
            this._systemOrder = [];
            this._director = director;
        },

        destroy: function() {
            this.removeAll();
            this._director = undefined;
        },

        add: function(System) {
            if (!System || !System.systemId) {
                return undefined;
            }

            var systemId = System.systemId,
                system = this._systems[systemId];

            if (!system) {
                system = new System(this);
                this._systems[systemId] = system;
                this._systemOrder.push(system);
                this._director.events.registerContext(system);
                system.configure(this._director.entities, this._director.events, this._director.config)
            }
            return system;
        },

        get: function(System) {
            var systemId = System.systemId;
            return this._systems[systemId];
        },

        remove: function(System) {
            var index, systemId, system;

            if (System instanceof cog.System) {
                system = System;
                System = system.constructor;
            }

            if (!System || !System.systemId) {
                return this;
            }

            systemId = System.systemId;

            if (!system) {
                system = this._systems[systemId];
            }

            if (system) {
                index = this._systemOrder.indexOf(system);

                this._director.events.unregisterContext(system);
                this._systemOrder.splice(index, 1);
                this._systems[systemId] = undefined;

                system.destroy(true);
            }

            return this;
        },

        removeAll: function() {
            var index, systemId, system;
            for (systemId in this._systems) {
                if (this._systems.hasOwnProperty(systemId)) {
                    system = this._systems[systemId];
                    if (system) {
                        index = this._systemOrder.indexOf(system);

                        this._director.events.unregisterContext(system);
                        this._systemOrder.splice(index, 1);
                        this._systems[systemId] = undefined;

                        system.destroy(true);
                    }
                }
            }
            return this;
        },

        update: function(dt) {
            var i = 0,
                n = this._systemOrder.length,
                systems = this._systemOrder,
                entities = this._director.entities,
                events = this._director.events;
            for (; i < n; ++i) {
                systems[i].update(entities, events, dt);
            }
            return this;
        },

        render: function() {
            var i = 0,
                n = this._systemOrder.length,
                systems = this._systemOrder,
                entities = this._director.entities;
            for (; i < n; ++i) {
                systems[i].render(entities);
            }
            return this;
        }
    });

    cog.extend({
        SystemManager: SystemManager
    });


    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

    // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

    // MIT license

    (function() {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
        };

        if (!window.performance) {
            window.performance = {
                now: function() {
                    return Date.now();
                }
            }
        }
    }());



    /**
     * The Director represents an instance of cog.
     * This class creates an EntityManager, SystemManager, and EventManager.
     * The Director also manages the timer, calling update/render on each step.
     *
     * @class
     * @memberof cog
     * @augments cog.Construct
     *
     * @param [config] {config} Optional configuration for the director and systems.
     */

    var Director = cog.Construct.extend('cog.Director', {
        create: function(config) {
            return new Director(config);
        }
    }, {

        _entityManager: null,
        _eventManager: null,
        _systemManager: null,
        _animationFrame: null,

        defaults: {
            _targetDt: 1000 / 60,
            _accumulator: 0,
            _lastFrame: 0
        },

        properties: {

            /**
             * Gets the configuration passed to the Director during initialization.
             *
             * @readonly
             * @instance
             * @memberof cog.Director
             *
             * @type {object}
             */

            config: { get: function() { return this._config; } },

            /**
             * Gets the EventManager created during initialization.
             *
             * @readonly
             * @instance
             * @memberof cog.Director
             *
             * @type {EventManager}
             */

            events: { get: function() { return this._eventManager; } },

            /**
             * @member entities
             * @summary Gets the EntityManager created during initialization.
             *
             * @readonly
             * @instance
             * @memberof cog.Director
             *
             * @type {EntityManager}
             */

            entities: { get: function() { return this._entityManager; } },

            /**
             * @member systems
             * @summary Gets the SystemManager created during initialization.
             *
             * @readonly
             * @instance
             * @memberof cog.Director
             *
             * @type {SystemManager}
             */

            systems: { get: function() { return this._systemManager; } },

            /**
             * @member valid
             * @summary True after the Director is initialized. False once destroyed.
             *
             * @readonly
             * @instance
             * @memberof cog.Director
             *
             * @type {boolean}
             */

            valid: { get: function() {
                return (this._entityManager !== undefined &&
                    this._systemManager !== undefined &&
                    this._eventManager !== undefined);
            }}
        },

        /**
         * @name init
         * @summary Initializes the director
         *
         * @instance
         * @method
         * @memberof cog.Director
         *
         * @param {config} [config] Configuration options.
         */

        init: function(config) {
            this._config = config;
            this._eventManager = new EventManager(this);
            this._entityManager = new EntityManager(this);
            this._systemManager = new SystemManager(this);
            this._beginUpdateCallback = null;
            this._animationFrame = null;

            this._fixedDt = config && cog.isBoolean(config.fixedDt) ? config.fixedDt : false;
        },

        /**
         * @name destroy
         * @summary Destroy the director.
         * @desc Destroys the instance of the director and cleans up the attached managers
         *
         * @instance
         * @method
         * @memberof cog.Director
         */

        destroy: function() {
            this.stop();
            this._entityManager.destroy();
            this._eventManager.destroy();
            this._systemManager.destroy();
            this._entityManager = undefined;
            this._systemManager = undefined;
            this._eventManager = undefined;
            this._beginUpdateCallback = undefined;
            this._endUpdateCallback = undefined;
        },

        /**
         * @name start
         * @desc Starts the Director's timer.
         * Schedules the step function via requestAnimationFrame
         *
         * @instance
         * @method
         * @memberof cog.Director
         */

        start:function() {
            if (!this._animationFrame) {
                this._lastFrame = 0;
                this._animationFrame = requestAnimationFrame(this.step.bind(this));
            }
        },

        /**
         * @name stop
         * @desc Stops the Director's timer.
         * Un-schedules the step function via cancelAnimationFrame
         *
         * @instance
         * @method
         * @memberof cog.Director
         */

        stop: function() {
            if (this._animationFrame) {
                cancelAnimationFrame(this._animationFrame);
                this._animationFrame = null;
            }
        },

        /**
         * @name step
         * @desc Steps the attached Systems
         * On step, systems are updated, then rendered.
         * If fixedDt is enabled, update may be called multiple times per step.
         * Render will only be called once.
         *
         * @method
         * @event
         * @memberof cog.Director
         *
         * @param {number} timestamp Timestamp passed by requestAnimationFrame
         */

        step: function(timestamp) {
            var targetDt = this._targetDt,
                lastFrame = this._lastFrame,
                accumulator = this._accumulator,
                dt =  lastFrame === 0 ? targetDt : timestamp - lastFrame;

            

            if (this._beginStepCallback) {
                this._beginStepCallback();
            }

            if (this._fixedDt) {
                accumulator += dt;
                while (accumulator > targetDt) {
                    this.update(targetDt);
                    accumulator -= targetDt;
                }
                this._accumulator = accumulator;
            } else {
                this.update(dt);
            }
            this.render();

            if (this._endStepCallback) {
                this._endStepCallback();
            }

            if (this._animationFrame) {
                this._lastFrame = timestamp;
                this._animationFrame = requestAnimationFrame(this.step.bind(this));
            }
        },

        /**
         * @name update
         * @desc Updates the attached Systems
         *
         * @method
         * @event
         * @memberof cog.Director
         *
         * @param {number} dt Number of milliseconds passed since last update.
         */

        update: function(dt) {
            if (this._beginUpdateCallback) {
                this._beginUpdateCallback();
            }

            

            this._systemManager.update(dt);
            if (this._endUpdateCallback) {
                this._endUpdateCallback();
            }
        },

        /**
         * @name render
         * @desc Renders the attached Systems
         *
         * @method
         * @event
         * @memberof cog.Director
         */

        render: function() {
            

            this._systemManager.render();

            
        },

        /**
         * @name onBeginUpdate
         * @desc Set a callback on the beginning of the update event.
         *
         * @instance
         * @method
         * @memberof cog.Director
         *
         * @param {callback} callback
         * @returns {this}
         */

        onBeginUpdate: function(callback) {
            this._beginUpdateCallback = callback;
            return this;
        },

        /**
         * @name onEndUpdate
         * @desc Set a callback on the ending of the update event.
         *
         * @instance
         * @method
         * @memberof cog.Director
         *
         * @param {callback} callback
         * @returns {this}
         */

        onEndUpdate: function(callback) {
            this._endUpdateCallback = callback;
            return this;
        },

        /**
         * @name onBeginStep
         * @desc Set a callback on the beginning of the step event.
         *
         * @instance
         * @method
         * @memberof cog.Director
         *
         * @param {callback} callback
         * @returns {this}
         */

        onBeginStep: function(callback) {
            this._beginStepCallback = callback;
            return this;
        },

        /**
         * @name onEndStep
         * @desc Set a callback on the ending of the step event.
         *
         * @instance
         * @method
         * @memberof cog.Director
         *
         * @param {callback} callback
         * @returns {this}
         */

        onEndStep: function(callback) {
            this._endStepCallback = callback;
            return this;
        }
    });

    cog.extend({
        Director: Director,
        createDirector: Director.create
    });

    if (typeof define === "function" && define.amd) {
        define('cog', [],function() { return cog; });
    }


    this.cog = cog;

}).call(this); // window