import Loader from './loader.js';
import Control from './control.js';
import Utils from './utils.js';
import Items from './items.js';
import Icons from './icons.js';
import Maps from './maps.js';
import Enemys from './enemys.js';
import Events from './events.js';
import Actions from './actions.js';
import Data from './data.js';
import Ui from './ui.js';
import Extensions from './extensions.js';
import main from '../main.js';

class Core {
	/////////// 系统事件相关 ///////////
	////// 初始化 //////
	init(callback) {
		{
			this._WIDTH_ = 13;
			this._HEIGHT_ = 13;
			this._PX_ = this._WIDTH_ * 32;
			this._PY_ = this._HEIGHT_ * 32;
			this._HALF_WIDTH_ = Math.floor(this._WIDTH_ / 2);
			this._HALF_HEIGHT_ = Math.floor(this._HEIGHT_ / 2);

			this.__SIZE__ = main.mode == 'editor' ? 13 : this._HEIGHT_;
			this.__PIXELS__ = this.__SIZE__ * 32;
			this.__HALF_SIZE__ = Math.floor(this.__SIZE__ / 2);
			this.material = {
				'animates': {},
				'images': {},
				'bgms': {},
				'sounds': {},
				'items': {},
				'enemys': {},
				'icons': {},
				'ground': null,
				'grundCanvas': null,
				'groundPattern': null,
				'autotileEdges': {},
			};
			this.timeout = {
				'turnHeroTimeout': null,
				'onDownTimeout': null,
				'sleepTimeout': null,
			};
			this.interval = {
				'heroMoveInterval': null,
				'onDownInterval': null,
			};
			this.animateFrame = {
				'totalTime': 0,
				'totalTimeStart': 0,
				'globalAnimate': false,
				'globalTime': 0,
				'selectorTime': 0,
				'selectorUp': true,
				'animateTime': 0,
				'moveTime': 0,
				'lastLegTime': 0,
				'leftLeg': true,
				'weather': {
					'time': 0,
					'type': null,
					'level': 1,
					'nodes': [],
					'data': null,
					'fog': null,
					'cloud': null,
					'sun': null
				},
				"tip": null,
				"asyncId": {},
				"lastAsyncId": null
			};
			this.musicStatus = {
				'audioContext': null, // WebAudioContext
				'bgmStatus': false, // 是否播放BGM
				'soundStatus': true, // 是否播放SE
				'playingBgm': null, // 正在播放的BGM
				'pauseTime': 0, // 上次暂停的时间
				'lastBgm': null, // 上次播放的bgm
				'gainNode': null,
				'playingSounds': {}, // 正在播放的SE
				'userVolume': 1.0, // 用户音量
				'designVolume': 1.0, //设计音量
				'bgmSpeed': 100, // 背景音乐速度
				'bgmUsePitch': null, // 是否同时修改音调
				'cachedBgms': [], // 缓存BGM内容
				'cachedBgmCount': 8, // 缓存的bgm数量
			};
			this.platform = {
				'isOnline': true, // 是否http
				'isPC': true, // 是否是PC
				'isAndroid': false, // 是否是Android
				'isIOS': false, // 是否是iOS
				'string': 'PC',
				'isWeChat': false, // 是否是微信
				'isQQ': false, // 是否是QQ
				'isChrome': false, // 是否是Chrome
				'supportCopy': false, // 是否支持复制到剪切板

				'fileInput': null, // FileInput
				'fileReader': null, // 是否支持FileReader
				'successCallback': null, // 读取成功
				'errorCallback': null, // 读取失败
			};
			// 样式
			this.domStyle = {
				scale: 1.0,
				ratio: 1.0,
				hdCanvas: ["damage", "ui", "data"],
				availableScale: [],
				isVertical: false,
				showStatusBar: true,
				toolbarBtn: false,
			};
			this.bigmap = {
				canvas: ["bg", "event", "event2", "fg", "damage"],
				offsetX: 0, // in pixel
				offsetY: 0,
				posX: 0, // 
				posY: 0,
				width: main.mode == 'editor' ? this.__SIZE__ : this._WIDTH_, // map width and height
				height: main.mode == 'editor' ? this.__SIZE__ : this._HEIGHT_,
				v2: false,
				threshold: 1024,
				extend: 10,
				scale: 1.0,
				tempCanvas: null, // A temp canvas for drawing
				cacheCanvas: null, // A cache canvas
			};
			this.saves = {
				"saveIndex": null,
				"ids": {},
				"autosave": {
					"data": null,
					"time": 0,
					"updated": false,
					"storage": true, // 是否把自动存档写入文件a
					"max": 20, // 自动存档最大回退数
					"now": 0,
				},
				"favorite": [],
				"favoriteName": {},
				"cache": {}
			};
			this.initStatus = {
				'played': false,
				'gameOver': false,

				// 勇士属性
				'hero': {},
				'heroCenter': { 'px': null, 'py': null },

				// 当前地图
				'floorId': null,
				'thisMap': null,
				'maps': null,
				'bgmaps': {},
				'fgmaps': {},
				'mapBlockObjs': {},
				'checkBlock': {}, // 每个点的阻激夹域信息
				'damage': {
					'posX': 0,
					'posY': 0,
					'data': [],
					'extraData': [],
				},

				'lockControl': false,

				// 勇士移动状态
				'heroMoving': 0,
				'heroStop': true,

				// 自动寻路相关
				'automaticRoute': {
					'autoHeroMove': false,
					'autoStep': 0,
					'movedStep': 0,
					'destStep': 0,
					'destX': null,
					'destY': null,
					'offsetX': null,
					'offsetY': null,
					'autoStepRoutes': [],
					'moveStepBeforeStop': [],
					'lastDirection': null,
					'cursorX': 0,
					'cursorY': 0,
					"moveDirectly": false,
				},

				// 按下键的时间：为了判定双击
				'downTime': null,
				'ctrlDown': false,
				'preview': {
					'enabled': false,
					'prepareDragging': false,
					'dragging': false,
					'px': 0,
					'py': 0,
				},

				// 路线&回放
				'route': [],
				'replay': {
					'replaying': false,
					'pausing': false,
					'animate': false, // 正在某段动画中
					'failed': false,
					'toReplay': [],
					'totalList': [],
					'speed': 1.0,
					'steps': 0,
					'save': [],
				},
				// 录像折叠
				'routeFolding': {},

				// event事件
				'shops': {},
				'event': {
					'id': null,
					'data': null,
					'selection': null,
					'ui': null,
					'interval': null,
				},
				'autoEvents': [],
				'textAttribute': {
					'position': "center",
					"offset": 0,
					"title": [255, 215, 0, 1],
					"background": [0, 0, 0, 0.85],
					"text": [255, 255, 255, 1],
					"titlefont": 22,
					"textfont": 16,
					"bold": false,
					"time": 0,
					"letterSpacing": 0,
					"animateTime": 0,
				},
				"globalAttribute": {
					'equipName': main.equipName || [],
					"statusLeftBackground": main.styles.statusLeftBackground || "url(project/materials/ground.png) repeat",
					"statusTopBackground": main.styles.statusTopBackground || "url(project/materials/ground.png) repeat",
					"toolsBackground": main.styles.toolsBackground || "url(project/materials/ground.png) repeat",
					"borderColor": main.styles.borderColor || [204, 204, 204, 1],
					"statusBarColor": main.styles.statusBarColor || [255, 255, 255, 1],
					"floorChangingStyle": main.styles.floorChangingStyle || "background-color: black; color: white",
					"selectColor": main.styles.selectColor || [255, 215, 0, 1],
					"font": main.styles.font || "Verdana"
				},
				'curtainColor': null,

				// 动画
				'globalAnimateObjs': [],
				'floorAnimateObjs': [],
				'boxAnimateObjs': [],
				'autotileAnimateObjs': [],
				"globalAnimateStatus": 0,
				'animateObjs': [],
			};
			// 标记的楼层列表，用于数据统计
			this.markedFloorIds = {};
			this.status = {};
			this.dymCanvas = {};

			if (main.mode == 'editor') {
				document.documentElement.style.setProperty('--size', this.__SIZE__);
				document.documentElement.style.setProperty('--pixel', this.__PIXELS__ + 'px');
			}
		}
		{
			this.loader = new Loader();
			this.control = new Control();
			this.utils = new Utils();
			this.items = new Items();
			this.icons = new Icons();
			this.maps = new Maps();
			this.enemys = new Enemys();
			this.events = new Events();
			this.actions = new Actions();
			this.data = new Data();
			this.ui = new Ui();
			this.extensions = new Extensions();

			globalThis.loader = Loader;
			globalThis.control = Control;
			globalThis.utils = Utils;
			globalThis.items = Items;
			globalThis.icons = Icons;
			globalThis.maps = Maps;
			globalThis.enemys = Enemys;
			globalThis.events = Events;
			globalThis.actions = Actions;
			globalThis.data = Data;
			globalThis.ui = Ui;
			globalThis.extensions = Extensions;

			this.dom = main.dom;
			this.statusBar = main.statusBar;
			this.canvas = main.canvas;
			this.images = main.images;
			this.tilesets = main.tilesets;
			this.materials = main.materials;
			this.animates = main.animates;
			this.bgms = main.bgms;
			this.sounds = main.sounds;
			this.floorIds = main.floorIds;
			this.floors = main.floors;
			this.floorPartitions = main.floorPartitions;
		}

		this._init_flags();
		this._init_platform();
		this._init_others();
		this._init_plugins();
		var b = main.mode == 'editor';
		// 初始化画布
		for (var name in core.canvas) {
			if (core.domStyle.hdCanvas.indexOf(name) >= 0)
				core.maps._setHDCanvasSize(core.canvas[name], b ? core.__PIXELS__ : core._PX_, b ? core.__PIXELS__ : core._PY_);
			else {
				core.canvas[name].canvas.width = (b ? core.__PIXELS__ : core._PX_);
				core.canvas[name].canvas.height = (b ? core.__PIXELS__ : core._PY_);
			}
		}

		core.loader._load(function () {
			core.extensions._load(function () {
				core._afterLoadResources(callback);
			});
		});
		core.dom.musicBtn.style.display = 'block';
		core.setMusicBtn();
	}
	_init_flags() {
		core.flags = core.clone(core.data.flags);
		core.values = core.clone(core.data.values);
		core.firstData = core.clone(core.data.firstData);
		this._init_sys_flags();

		// 让你总是拼错！
		window.on = true;
		window.off = false;
		window.ture = true;
		window.flase = false;

		core.dom.versionLabel.innerText = core.firstData.version;
		core.dom.logoLabel.innerText = core.firstData.title;
		document.title = core.firstData.title + " - HTML5魔塔";
		document.getElementById("startLogo").innerText = core.firstData.title;
		(core.firstData.shops || []).forEach(function (t) { core.initStatus.shops[t.id] = t; });

		core.maps._initFloors();
		// 初始化怪物、道具等
		core.material.enemys = core.enemys.getEnemys();
		core.material.items = core.items.getItems();
		core.material.icons = core.icons.getIcons();

		// 初始化自动事件
		for (var floorId in core.floors) {
			var autoEvents = core.floors[floorId].autoEvent || {};
			for (var loc in autoEvents) {
				var locs = loc.split(","), x = parseInt(locs[0]), y = parseInt(locs[1]);
				for (var index in autoEvents[loc]) {
					var autoEvent = core.clone(autoEvents[loc][index]);
					if (autoEvent && autoEvent.condition && autoEvent.data) {
						autoEvent.floorId = floorId;
						autoEvent.x = x;
						autoEvent.y = y;
						autoEvent.index = index;
						autoEvent.symbol = floorId + "@" + x + "@" + y + "@" + index;
						autoEvent.condition = core.replaceValue(autoEvent.condition);
						autoEvent.data = core.precompile(autoEvent.data);
						core.initStatus.autoEvents.push(autoEvent);
					}
				}
			}
		}
		// 道具的穿上/脱下，视为自动事件
		for (var equipId in core.material.items) {
			var equip = core.material.items[equipId];
			if (equip.cls != 'equips' || !equip.equip) continue;
			if (!equip.equip.equipEvent && !equip.equip.unequipEvent) continue;
			var equipFlag = '_equipEvent_' + equipId;
			var autoEvent1 = {
				symbol: "_equipEvent_" + equipId,
				currentFloor: false,
				multiExecute: true,
				condition: "core.hasEquip('" + equipId + "') && !core.hasFlag('" + equipFlag + "')",
				data: core.precompile([{ "type": "setValue", "name": "flag:" + equipFlag, "value": "true" }].concat(equip.equip.equipEvent || [])),
			};
			var autoEvent2 = {
				symbol: "_unequipEvent_" + equipId,
				currentFloor: false,
				multiExecute: true,
				condition: "!core.hasEquip('" + equipId + "') && core.hasFlag('" + equipFlag + "')",
				data: core.precompile([{ "type": "setValue", "name": "flag:" + equipFlag, "value": "null" }].concat(equip.equip.unequipEvent || [])),
			};
			core.initStatus.autoEvents.push(autoEvent1);
			core.initStatus.autoEvents.push(autoEvent2);
		}

		core.initStatus.autoEvents.sort(function (e1, e2) {
			if (e1.floorId == null) return 1;
			if (e2.floorId == null) return -1;
			if (e1.priority != e2.priority) return e2.priority - e1.priority;
			if (e1.floorId != e2.floorId) return core.floorIds.indexOf(e1.floorId) - core.floorIds.indexOf(e2.floorId);
			if (e1.x != e2.x) return e1.x - e2.x;
			if (e1.y != e2.y) return e1.y - e2.y;
			return e1.index - e2.index;
		});

	}
	_init_sys_flags() {
		if (core.flags.equipboxButton) core.flags.equipment = true;
		core.flags.displayEnemyDamage = core.getLocalStorage('enemyDamage', true);
		core.flags.displayCritical = core.getLocalStorage('critical', true);
		core.flags.displayExtraDamage = core.getLocalStorage('extraDamage', true);
		core.flags.enableEnemyPoint = core.getLocalStorage('enableEnemyPoint', core.flags.enableEnemyPoint);
		core.flags.leftHandPrefer = core.getLocalStorage('leftHandPrefer', false);
		core.flags.extraDamageType = core.getLocalStorage('extraDamageType', 2);
		// 行走速度
		core.values.moveSpeed = core.getLocalStorage('moveSpeed', core.values.moveSpeed || 100);
		core.values.floorChangeTime = core.getLocalStorage('floorChangeTime', core.values.floorChangeTime);
		if (core.values.floorChangeTime == null) core.values.floorChangeTime = 500;
		core.flags.enableHDCanvas = core.getLocalStorage('enableHDCanvas', !core.platform.isIOS);
	}
	_init_platform() {
		core.platform.isOnline = location.protocol.indexOf("http") == 0;
		if (!core.platform.isOnline) alert("请勿直接打开html文件！使用启动服务或者APP进行离线游戏。");
		window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
		core.musicStatus.bgmStatus = core.getLocalStorage('bgmStatus', true);
		core.musicStatus.soundStatus = core.getLocalStorage('soundStatus', true);
		//新增 userVolume 默认值0.7
		core.musicStatus.userVolume = core.getLocalStorage('userVolume', 0.7);
		try {
			core.musicStatus.audioContext = new window.AudioContext();
			core.musicStatus.gainNode = core.musicStatus.audioContext.createGain();
			core.musicStatus.gainNode.gain.value = core.musicStatus.userVolume;
			core.musicStatus.gainNode.connect(core.musicStatus.audioContext.destination);
		} catch (e) {
			console.log("该浏览器不支持AudioContext");
			core.musicStatus.audioContext = null;
		}
		["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"].forEach(function (t) {
			if (navigator.userAgent.indexOf(t) >= 0) {
				if (t == 'iPhone' || t == 'iPad' || t == 'iPod') core.platform.isIOS = true;
				if (t == 'Android') core.platform.isAndroid = true;
				core.platform.isPC = false;
			}
		});
		core.platform.string = core.platform.isPC ? "PC" : core.platform.isAndroid ? "Android" : core.platform.isIOS ? "iOS" : "";
		core.platform.supportCopy = document.queryCommandSupported && document.queryCommandSupported("copy");
		var chrome = /Chrome\/(\d+)\./i.exec(navigator.userAgent);
		if (chrome && parseInt(chrome[1]) >= 50) core.platform.isChrome = true;
		core.platform.isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
		core.platform.isQQ = /QQ/i.test(navigator.userAgent);
		core.platform.isWeChat = /MicroMessenger/i.test(navigator.userAgent);
		if (window.FileReader) {
			core.platform.fileReader = new FileReader();
			core.platform.fileReader.onload = function () {
				core.readFileContent(core.platform.fileReader.result);
			};
			core.platform.fileReader.onerror = function () {
				if (core.platform.errorCallback)
					core.platform.errorCallback();
			};
		}

		core.flags.enableHDCanvas = core.getLocalStorage('enableHDCanvas', !core.platform.isIOS);
		if (main.mode != 'editor') {
			core.domStyle.scale = core.getLocalStorage('scale', 1);
			if (core.flags.enableHDCanvas) core.domStyle.ratio = Math.max(window.devicePixelRatio || 1, core.domStyle.scale);
		}
	}
	_init_others() {
		// 一些额外的东西
		core.material.groundCanvas = document.createElement('canvas').getContext('2d');
		core.material.groundCanvas.canvas.width = core.material.groundCanvas.canvas.height = 32;
		core.material.groundPattern = core.material.groundCanvas.createPattern(core.material.groundCanvas.canvas, 'repeat');
		core.bigmap.tempCanvas = document.createElement('canvas').getContext('2d');
		core.bigmap.cacheCanvas = document.createElement('canvas').getContext('2d');
		core.loadImage("materials", 'fog', function (name, img) { core.animateFrame.weather.fog = img; });
		core.loadImage("materials", "cloud", function (name, img) { core.animateFrame.weather.cloud = img; });
		core.loadImage("materials", "sun", function (name, img) { core.animateFrame.weather.sun = img; });
		core.loadImage("materials", 'keyboard', function (name, img) { core.material.images.keyboard = img; });
		// 记录存档编号
		core.saves.saveIndex = core.getLocalStorage('saveIndex', 1);
		core.control.getSaveIndexes(function (indexes) { core.saves.ids = indexes; });
	}
	_afterLoadResources(callback) {
		// 初始化地图
		core.initStatus.maps = core.maps._initMaps();
		core.control._setRequestAnimationFrame();
		// 图片裁剪
		(main.splitImages || []).forEach(function (one) {
			var name = core.getMappedName(one.name);
			if (!core.material.images.images[name]) {
				console.warn('找不到图片：' + name + '，无法裁剪');
				return;
			}
			if (!name.endsWith('.png')) {
				console.warn('无法裁剪非png格式图片：' + name);
				return;
			}
			var arr = core.splitImage(core.material.images.images[name], one.width, one.height);
			for (var i = 0; i < arr.length; ++i) {
				core.material.images.images[(one.prefix || "") + i + '.png'] = arr[i];
			}
		});

		if (core.plugin._afterLoadResources)
			core.plugin._afterLoadResources();
		core.showStartAnimate();
		if (callback) callback();
	}
	_init_plugins() {
		core.plugin = new function () { };

		for (var name in plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1) {
			if (plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1[name] instanceof Function) {
				try {
					plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1[name].apply(core.plugin);
				}
				catch (e) {
					console.error(e);
					console.error("无法初始化插件" + name);
				}
			}
		}
		core._forwardFunc("plugin");
	}
	_forwardFuncs = function () {
		for (var i = 0; i < main.loadList.length; ++i) {
			var name = main.loadList[i];
			if (name == 'core') continue;
			this._forwardFunc(name);
		}
	}
	_forwardFunc = function (name, funcname) {
		if (funcname == null) {
			for (funcname in core[name]) {
				if (funcname.charAt(0) != "_" && core[name][funcname] instanceof Function) {
					this._forwardFunc(name, funcname);
				}
			}
			return;
		}

		if (core[funcname]) {
			console.error("ERROR: 无法转发 " + name + " 中的函数 " + funcname + " 到 core 中！同名函数已存在。");
			return;
		}
		var parameterInfo = /^\s*function\s*[\w_$]*\(([\w_,$\s]*)\)\s*\{/.exec(core[name][funcname].toString());
		var parameters = (parameterInfo == null ? "" : parameterInfo[1]).replace(/\s*/g, '').replace(/,/g, ', ');
		// core[funcname] = new Function(parameters, "return core."+name+"."+funcname+"("+parameters+");");
		eval("core." + funcname + " = function (" + parameters + ") {\n\treturn core." + name + "." + funcname + ".apply(core." + name + ", arguments);\n}");
	}
	doFunc(func, _this) {
		if (typeof func == 'string') {
			func = core.plugin[func];
			_this = core.plugin;
		}
		return func.apply(_this, Array.prototype.slice.call(arguments, 2));
	}

	loadImages() {// loader.loadImages
		return core.loader.loadImages.apply(core.loader, arguments);
	}
	loadImage() {// loader.loadImage
		return core.loader.loadImage.apply(core.loader, arguments);
	}
	loadImagesFromZip() {// loader.loadImagesFromZip
		return core.loader.loadImagesFromZip.apply(core.loader, arguments);
	}
	loadOneMusic() {// loader.loadOneMusic
		return core.loader.loadOneMusic.apply(core.loader, arguments);
	}
	loadOneSound() {// loader.loadOneSound
		return core.loader.loadOneSound.apply(core.loader, arguments);
	}
	loadBgm() {// loader.loadBgm
		return core.loader.loadBgm.apply(core.loader, arguments);
	}
	freeBgm() {// loader.freeBgm
		return core.loader.freeBgm.apply(core.loader, arguments);
	}
	registerAnimationFrame() {// control.registerAnimationFrame
		return core.control.registerAnimationFrame.apply(core.control, arguments);
	}
	unregisterAnimationFrame() {// control.unregisterAnimationFrame
		return core.control.unregisterAnimationFrame.apply(core.control, arguments);
	}
	showStartAnimate() {// control.showStartAnimate
		return core.control.showStartAnimate.apply(core.control, arguments);
	}
	hideStartAnimate() {// control.hideStartAnimate
		return core.control.hideStartAnimate.apply(core.control, arguments);
	}
	isPlaying() {// control.isPlaying
		return core.control.isPlaying.apply(core.control, arguments);
	}
	clearStatus() {// control.clearStatus
		return core.control.clearStatus.apply(core.control, arguments);
	}
	clearAutomaticRouteNode() {// control.clearAutomaticRouteNode
		return core.control.clearAutomaticRouteNode.apply(core.control, arguments);
	}
	stopAutomaticRoute() {// control.stopAutomaticRoute
		return core.control.stopAutomaticRoute.apply(core.control, arguments);
	}
	saveAndStopAutomaticRoute() {// control.saveAndStopAutomaticRoute
		return core.control.saveAndStopAutomaticRoute.apply(core.control, arguments);
	}
	continueAutomaticRoute() {// control.continueAutomaticRoute
		return core.control.continueAutomaticRoute.apply(core.control, arguments);
	}
	clearContinueAutomaticRoute() {// control.clearContinueAutomaticRoute
		return core.control.clearContinueAutomaticRoute.apply(core.control, arguments);
	}
	setAutomaticRoute() {// control.setAutomaticRoute
		return core.control.setAutomaticRoute.apply(core.control, arguments);
	}
	setAutoHeroMove() {// control.setAutoHeroMove
		return core.control.setAutoHeroMove.apply(core.control, arguments);
	}
	setHeroMoveInterval() {// control.setHeroMoveInterval
		return core.control.setHeroMoveInterval.apply(core.control, arguments);
	}
	moveOneStep() {// control.moveOneStep
		return core.control.moveOneStep.apply(core.control, arguments);
	}
	moveAction() {// control.moveAction
		return core.control.moveAction.apply(core.control, arguments);
	}
	moveHero() {// control.moveHero
		return core.control.moveHero.apply(core.control, arguments);
	}
	isMoving() {// control.isMoving
		return core.control.isMoving.apply(core.control, arguments);
	}
	waitHeroToStop() {// control.waitHeroToStop
		return core.control.waitHeroToStop.apply(core.control, arguments);
	}
	turnHero() {// control.turnHero
		return core.control.turnHero.apply(core.control, arguments);
	}
	moveDirectly() {// control.moveDirectly
		return core.control.moveDirectly.apply(core.control, arguments);
	}
	tryMoveDirectly() {// control.tryMoveDirectly
		return core.control.tryMoveDirectly.apply(core.control, arguments);
	}
	drawHero() {// control.drawHero
		return core.control.drawHero.apply(core.control, arguments);
	}
	setHeroOpacity() {// control.setHeroOpacity
		return core.control.setHeroOpacity.apply(core.control, arguments);
	}
	setGameCanvasTranslate() {// control.setGameCanvasTranslate
		return core.control.setGameCanvasTranslate.apply(core.control, arguments);
	}
	addGameCanvasTranslate() {// control.addGameCanvasTranslate
		return core.control.addGameCanvasTranslate.apply(core.control, arguments);
	}
	updateViewport() {// control.updateViewport
		return core.control.updateViewport.apply(core.control, arguments);
	}
	setViewport() {// control.setViewport
		return core.control.setViewport.apply(core.control, arguments);
	}
	moveViewport() {// control.moveViewport
		return core.control.moveViewport.apply(core.control, arguments);
	}
	nextX() {// control.nextX
		return core.control.nextX.apply(core.control, arguments);
	}
	nextY() {// control.nextY
		return core.control.nextY.apply(core.control, arguments);
	}
	nearHero() {// control.nearHero
		return core.control.nearHero.apply(core.control, arguments);
	}
	gatherFollowers() {// control.gatherFollowers
		return core.control.gatherFollowers.apply(core.control, arguments);
	}
	updateFollowers() {// control.updateFollowers
		return core.control.updateFollowers.apply(core.control, arguments);
	}
	updateCheckBlock() {// control.updateCheckBlock
		return core.control.updateCheckBlock.apply(core.control, arguments);
	}
	checkBlock() {// control.checkBlock
		return core.control.checkBlock.apply(core.control, arguments);
	}
	updateDamage() {// control.updateDamage
		return core.control.updateDamage.apply(core.control, arguments);
	}
	drawDamage() {// control.drawDamage
		return core.control.drawDamage.apply(core.control, arguments);
	}
	chooseReplayFile() {// control.chooseReplayFile
		return core.control.chooseReplayFile.apply(core.control, arguments);
	}
	startReplay() {// control.startReplay
		return core.control.startReplay.apply(core.control, arguments);
	}
	triggerReplay() {// control.triggerReplay
		return core.control.triggerReplay.apply(core.control, arguments);
	}
	pauseReplay() {// control.pauseReplay
		return core.control.pauseReplay.apply(core.control, arguments);
	}
	resumeReplay() {// control.resumeReplay
		return core.control.resumeReplay.apply(core.control, arguments);
	}
	stepReplay() {// control.stepReplay
		return core.control.stepReplay.apply(core.control, arguments);
	}
	speedUpReplay() {// control.speedUpReplay
		return core.control.speedUpReplay.apply(core.control, arguments);
	}
	speedDownReplay() {// control.speedDownReplay
		return core.control.speedDownReplay.apply(core.control, arguments);
	}
	setReplaySpeed() {// control.setReplaySpeed
		return core.control.setReplaySpeed.apply(core.control, arguments);
	}
	stopReplay() {// control.stopReplay
		return core.control.stopReplay.apply(core.control, arguments);
	}
	rewindReplay() {// control.rewindReplay
		return core.control.rewindReplay.apply(core.control, arguments);
	}
	isReplaying() {// control.isReplaying
		return core.control.isReplaying.apply(core.control, arguments);
	}
	replay() {// control.replay
		return core.control.replay.apply(core.control, arguments);
	}
	registerReplayAction() {// control.registerReplayAction
		return core.control.registerReplayAction.apply(core.control, arguments);
	}
	unregisterReplayAction() {// control.unregisterReplayAction
		return core.control.unregisterReplayAction.apply(core.control, arguments);
	}
	autosave() {// control.autosave
		return core.control.autosave.apply(core.control, arguments);
	}
	checkAutosave() {// control.checkAutosave
		return core.control.checkAutosave.apply(core.control, arguments);
	}
	doSL() {// control.doSL
		return core.control.doSL.apply(core.control, arguments);
	}
	syncSave() {// control.syncSave
		return core.control.syncSave.apply(core.control, arguments);
	}
	syncLoad() {// control.syncLoad
		return core.control.syncLoad.apply(core.control, arguments);
	}
	saveData() {// control.saveData
		return core.control.saveData.apply(core.control, arguments);
	}
	loadData() {// control.loadData
		return core.control.loadData.apply(core.control, arguments);
	}
	getSave() {// control.getSave
		return core.control.getSave.apply(core.control, arguments);
	}
	getSaves() {// control.getSaves
		return core.control.getSaves.apply(core.control, arguments);
	}
	getAllSaves() {// control.getAllSaves
		return core.control.getAllSaves.apply(core.control, arguments);
	}
	getSaveIndexes() {// control.getSaveIndexes
		return core.control.getSaveIndexes.apply(core.control, arguments);
	}
	hasSave() {// control.hasSave
		return core.control.hasSave.apply(core.control, arguments);
	}
	removeSave() {// control.removeSave
		return core.control.removeSave.apply(core.control, arguments);
	}
	setStatus() {// control.setStatus
		return core.control.setStatus.apply(core.control, arguments);
	}
	addStatus() {// control.addStatus
		return core.control.addStatus.apply(core.control, arguments);
	}
	getStatus() {// control.getStatus
		return core.control.getStatus.apply(core.control, arguments);
	}
	getStatusOrDefault() {// control.getStatusOrDefault
		return core.control.getStatusOrDefault.apply(core.control, arguments);
	}
	getRealStatus() {// control.getRealStatus
		return core.control.getRealStatus.apply(core.control, arguments);
	}
	getRealStatusOrDefault() {// control.getRealStatusOrDefault
		return core.control.getRealStatusOrDefault.apply(core.control, arguments);
	}
	getNakedStatus() {// control.getNakedStatus
		return core.control.getNakedStatus.apply(core.control, arguments);
	}
	getStatusLabel() {// control.getStatusLabel
		return core.control.getStatusLabel.apply(core.control, arguments);
	}
	setBuff() {// control.setBuff
		return core.control.setBuff.apply(core.control, arguments);
	}
	addBuff() {// control.addBuff
		return core.control.addBuff.apply(core.control, arguments);
	}
	getBuff() {// control.getBuff
		return core.control.getBuff.apply(core.control, arguments);
	}
	triggerDebuff() {// control.triggerDebuff
		return core.control.triggerDebuff.apply(core.control, arguments);
	}
	setHeroLoc() {// control.setHeroLoc
		return core.control.setHeroLoc.apply(core.control, arguments);
	}
	getHeroLoc() {// control.getHeroLoc
		return core.control.getHeroLoc.apply(core.control, arguments);
	}
	getLvName() {// control.getLvName
		return core.control.getLvName.apply(core.control, arguments);
	}
	getNextLvUpNeed() {// control.getNextLvUpNeed
		return core.control.getNextLvUpNeed.apply(core.control, arguments);
	}
	setFlag() {// control.setFlag
		return core.control.setFlag.apply(core.control, arguments);
	}
	addFlag() {// control.addFlag
		return core.control.addFlag.apply(core.control, arguments);
	}
	getFlag() {// control.getFlag
		return core.control.getFlag.apply(core.control, arguments);
	}
	hasFlag() {// control.hasFlag
		return core.control.hasFlag.apply(core.control, arguments);
	}
	removeFlag() {// control.removeFlag
		return core.control.removeFlag.apply(core.control, arguments);
	}
	getSwitch() {// control.getSwitch
		return core.control.getSwitch.apply(core.control, arguments);
	}
	setSwitch() {// control.setSwitch
		return core.control.setSwitch.apply(core.control, arguments);
	}
	addSwitch() {// control.addSwitch
		return core.control.addSwitch.apply(core.control, arguments);
	}
	hasSwitch() {// control.hasSwitch
		return core.control.hasSwitch.apply(core.control, arguments);
	}
	removeSwitch() {// control.removeSwitch
		return core.control.removeSwitch.apply(core.control, arguments);
	}
	lockControl() {// control.lockControl
		return core.control.lockControl.apply(core.control, arguments);
	}
	unlockControl() {// control.unlockControl
		return core.control.unlockControl.apply(core.control, arguments);
	}
	debug() {// control.debug
		return core.control.debug.apply(core.control, arguments);
	}
	clearRouteFolding() {// control.clearRouteFolding
		return core.control.clearRouteFolding.apply(core.control, arguments);
	}
	checkRouteFolding() {// control.checkRouteFolding
		return core.control.checkRouteFolding.apply(core.control, arguments);
	}
	getMappedName() {// control.getMappedName
		return core.control.getMappedName.apply(core.control, arguments);
	}
	setWeather() {// control.setWeather
		return core.control.setWeather.apply(core.control, arguments);
	}
	registerWeather() {// control.registerWeather
		return core.control.registerWeather.apply(core.control, arguments);
	}
	unregisterWeather() {// control.unregisterWeather
		return core.control.unregisterWeather.apply(core.control, arguments);
	}
	setCurtain() {// control.setCurtain
		return core.control.setCurtain.apply(core.control, arguments);
	}
	screenFlash() {// control.screenFlash
		return core.control.screenFlash.apply(core.control, arguments);
	}
	playBgm() {// control.playBgm
		return core.control.playBgm.apply(core.control, arguments);
	}
	setBgmSpeed() {// control.setBgmSpeed
		return core.control.setBgmSpeed.apply(core.control, arguments);
	}
	pauseBgm() {// control.pauseBgm
		return core.control.pauseBgm.apply(core.control, arguments);
	}
	resumeBgm() {// control.resumeBgm
		return core.control.resumeBgm.apply(core.control, arguments);
	}
	setMusicBtn() {// control.setMusicBtn
		return core.control.setMusicBtn.apply(core.control, arguments);
	}
	triggerBgm() {// control.triggerBgm
		return core.control.triggerBgm.apply(core.control, arguments);
	}
	playSound() {// control.playSound
		return core.control.playSound.apply(core.control, arguments);
	}
	stopSound() {// control.stopSound
		return core.control.stopSound.apply(core.control, arguments);
	}
	getPlayingSounds() {// control.getPlayingSounds
		return core.control.getPlayingSounds.apply(core.control, arguments);
	}
	checkBgm() {// control.checkBgm
		return core.control.checkBgm.apply(core.control, arguments);
	}
	setDisplayScale() {// control.setDisplayScale
		return core.control.setDisplayScale.apply(core.control, arguments);
	}
	clearStatusBar() {// control.clearStatusBar
		return core.control.clearStatusBar.apply(core.control, arguments);
	}
	updateStatusBar() {// control.updateStatusBar
		return core.control.updateStatusBar.apply(core.control, arguments);
	}
	updateStatusBar_update() {// control.updateStatusBar_update
		return core.control.updateStatusBar_update.apply(core.control, arguments);
	}
	showStatusBar() {// control.showStatusBar
		return core.control.showStatusBar.apply(core.control, arguments);
	}
	hideStatusBar() {// control.hideStatusBar
		return core.control.hideStatusBar.apply(core.control, arguments);
	}
	updateHeroIcon() {// control.updateHeroIcon
		return core.control.updateHeroIcon.apply(core.control, arguments);
	}
	setToolbarButton() {// control.setToolbarButton
		return core.control.setToolbarButton.apply(core.control, arguments);
	}
	registerResize() {// control.registerResize
		return core.control.registerResize.apply(core.control, arguments);
	}
	unregisterResize() {// control.unregisterResize
		return core.control.unregisterResize.apply(core.control, arguments);
	}
	resize() {// control.resize
		return core.control.resize.apply(core.control, arguments);
	}
	replaceText() {// utils.replaceText
		return core.utils.replaceText.apply(core.utils, arguments);
	}
	replaceValue() {// utils.replaceValue
		return core.utils.replaceValue.apply(core.utils, arguments);
	}
	calValue() {// utils.calValue
		return core.utils.calValue.apply(core.utils, arguments);
	}
	unshift() {// utils.unshift
		return core.utils.unshift.apply(core.utils, arguments);
	}
	push() {// utils.push
		return core.utils.push.apply(core.utils, arguments);
	}
	decompress() {// utils.decompress
		return core.utils.decompress.apply(core.utils, arguments);
	}
	setLocalStorage() {// utils.setLocalStorage
		return core.utils.setLocalStorage.apply(core.utils, arguments);
	}
	getLocalStorage() {// utils.getLocalStorage
		return core.utils.getLocalStorage.apply(core.utils, arguments);
	}
	removeLocalStorage() {// utils.removeLocalStorage
		return core.utils.removeLocalStorage.apply(core.utils, arguments);
	}
	setLocalForage() {// utils.setLocalForage
		return core.utils.setLocalForage.apply(core.utils, arguments);
	}
	getLocalForage() {// utils.getLocalForage
		return core.utils.getLocalForage.apply(core.utils, arguments);
	}
	removeLocalForage() {// utils.removeLocalForage
		return core.utils.removeLocalForage.apply(core.utils, arguments);
	}
	clearLocalForage() {// utils.clearLocalForage
		return core.utils.clearLocalForage.apply(core.utils, arguments);
	}
	iterateLocalForage() {// utils.iterateLocalForage
		return core.utils.iterateLocalForage.apply(core.utils, arguments);
	}
	keysLocalForage() {// utils.keysLocalForage
		return core.utils.keysLocalForage.apply(core.utils, arguments);
	}
	lengthLocalForage() {// utils.lengthLocalForage
		return core.utils.lengthLocalForage.apply(core.utils, arguments);
	}
	setGlobal() {// utils.setGlobal
		return core.utils.setGlobal.apply(core.utils, arguments);
	}
	getGlobal() {// utils.getGlobal
		return core.utils.getGlobal.apply(core.utils, arguments);
	}
	clone() {// utils.clone
		return core.utils.clone.apply(core.utils, arguments);
	}
	cloneArray() {// utils.cloneArray
		return core.utils.cloneArray.apply(core.utils, arguments);
	}
	splitImage() {// utils.splitImage
		return core.utils.splitImage.apply(core.utils, arguments);
	}
	formatDate() {// utils.formatDate
		return core.utils.formatDate.apply(core.utils, arguments);
	}
	formatDate2() {// utils.formatDate2
		return core.utils.formatDate2.apply(core.utils, arguments);
	}
	formatTime() {// utils.formatTime
		return core.utils.formatTime.apply(core.utils, arguments);
	}
	setTwoDigits() {// utils.setTwoDigits
		return core.utils.setTwoDigits.apply(core.utils, arguments);
	}
	formatSize() {// utils.formatSize
		return core.utils.formatSize.apply(core.utils, arguments);
	}
	formatBigNumber() {// utils.formatBigNumber
		return core.utils.formatBigNumber.apply(core.utils, arguments);
	}
	applyEasing() {// utils.applyEasing
		return core.utils.applyEasing.apply(core.utils, arguments);
	}
	arrayToRGB() {// utils.arrayToRGB
		return core.utils.arrayToRGB.apply(core.utils, arguments);
	}
	arrayToRGBA() {// utils.arrayToRGBA
		return core.utils.arrayToRGBA.apply(core.utils, arguments);
	}
	encodeRoute() {// utils.encodeRoute
		return core.utils.encodeRoute.apply(core.utils, arguments);
	}
	decodeRoute() {// utils.decodeRoute
		return core.utils.decodeRoute.apply(core.utils, arguments);
	}
	isset() {// utils.isset
		return core.utils.isset.apply(core.utils, arguments);
	}
	subarray() {// utils.subarray
		return core.utils.subarray.apply(core.utils, arguments);
	}
	inArray() {// utils.inArray
		return core.utils.inArray.apply(core.utils, arguments);
	}
	clamp() {// utils.clamp
		return core.utils.clamp.apply(core.utils, arguments);
	}
	getCookie() {// utils.getCookie
		return core.utils.getCookie.apply(core.utils, arguments);
	}
	setStatusBarInnerHTML() {// utils.setStatusBarInnerHTML
		return core.utils.setStatusBarInnerHTML.apply(core.utils, arguments);
	}
	strlen() {// utils.strlen
		return core.utils.strlen.apply(core.utils, arguments);
	}
	turnDirection() {// utils.turnDirection
		return core.utils.turnDirection.apply(core.utils, arguments);
	}
	matchWildcard() {// utils.matchWildcard
		return core.utils.matchWildcard.apply(core.utils, arguments);
	}
	matchRegex() {// utils.matchRegex
		return core.utils.matchRegex.apply(core.utils, arguments);
	}
	encodeBase64() {// utils.encodeBase64
		return core.utils.encodeBase64.apply(core.utils, arguments);
	}
	decodeBase64() {// utils.decodeBase64
		return core.utils.decodeBase64.apply(core.utils, arguments);
	}
	rand() {// utils.rand
		return core.utils.rand.apply(core.utils, arguments);
	}
	rand2() {// utils.rand2
		return core.utils.rand2.apply(core.utils, arguments);
	}
	readFile() {// utils.readFile
		return core.utils.readFile.apply(core.utils, arguments);
	}
	readFileContent() {// utils.readFileContent
		return core.utils.readFileContent.apply(core.utils, arguments);
	}
	download() {// utils.download
		return core.utils.download.apply(core.utils, arguments);
	}
	copy() {// utils.copy
		return core.utils.copy.apply(core.utils, arguments);
	}
	myconfirm() {// utils.myconfirm
		return core.utils.myconfirm.apply(core.utils, arguments);
	}
	myprompt() {// utils.myprompt
		return core.utils.myprompt.apply(core.utils, arguments);
	}
	showWithAnimate() {// utils.showWithAnimate
		return core.utils.showWithAnimate.apply(core.utils, arguments);
	}
	hideWithAnimate() {// utils.hideWithAnimate
		return core.utils.hideWithAnimate.apply(core.utils, arguments);
	}
	getGuid() {// utils.getGuid
		return core.utils.getGuid.apply(core.utils, arguments);
	}
	hashCode() {// utils.hashCode
		return core.utils.hashCode.apply(core.utils, arguments);
	}
	same() {// utils.same
		return core.utils.same.apply(core.utils, arguments);
	}
	unzip() {// utils.unzip
		return core.utils.unzip.apply(core.utils, arguments);
	}
	http() {// utils.http
		return core.utils.http.apply(core.utils, arguments);
	}
	getItems() {// items.getItems
		return core.items.getItems.apply(core.items, arguments);
	}
	getItemEffect() {// items.getItemEffect
		return core.items.getItemEffect.apply(core.items, arguments);
	}
	getItemEffectTip() {// items.getItemEffectTip
		return core.items.getItemEffectTip.apply(core.items, arguments);
	}
	useItem() {// items.useItem
		return core.items.useItem.apply(core.items, arguments);
	}
	canUseItem() {// items.canUseItem
		return core.items.canUseItem.apply(core.items, arguments);
	}
	itemCount() {// items.itemCount
		return core.items.itemCount.apply(core.items, arguments);
	}
	hasItem() {// items.hasItem
		return core.items.hasItem.apply(core.items, arguments);
	}
	hasEquip() {// items.hasEquip
		return core.items.hasEquip.apply(core.items, arguments);
	}
	getEquip() {// items.getEquip
		return core.items.getEquip.apply(core.items, arguments);
	}
	setItem() {// items.setItem
		return core.items.setItem.apply(core.items, arguments);
	}
	addItem() {// items.addItem
		return core.items.addItem.apply(core.items, arguments);
	}
	removeItem() {// items.removeItem
		return core.items.removeItem.apply(core.items, arguments);
	}
	getEquipTypeByName() {// items.getEquipTypeByName
		return core.items.getEquipTypeByName.apply(core.items, arguments);
	}
	getEquipTypeById() {// items.getEquipTypeById
		return core.items.getEquipTypeById.apply(core.items, arguments);
	}
	canEquip() {// items.canEquip
		return core.items.canEquip.apply(core.items, arguments);
	}
	loadEquip() {// items.loadEquip
		return core.items.loadEquip.apply(core.items, arguments);
	}
	unloadEquip() {// items.unloadEquip
		return core.items.unloadEquip.apply(core.items, arguments);
	}
	compareEquipment() {// items.compareEquipment
		return core.items.compareEquipment.apply(core.items, arguments);
	}
	quickSaveEquip() {// items.quickSaveEquip
		return core.items.quickSaveEquip.apply(core.items, arguments);
	}
	quickLoadEquip() {// items.quickLoadEquip
		return core.items.quickLoadEquip.apply(core.items, arguments);
	}
	setEquip() {// items.setEquip
		return core.items.setEquip.apply(core.items, arguments);
	}
	getIcons() {// icons.getIcons
		return core.icons.getIcons.apply(core.icons, arguments);
	}
	getClsFromId() {// icons.getClsFromId
		return core.icons.getClsFromId.apply(core.icons, arguments);
	}
	getAllIconIds() {// icons.getAllIconIds
		return core.icons.getAllIconIds.apply(core.icons, arguments);
	}
	getTilesetOffset() {// icons.getTilesetOffset
		return core.icons.getTilesetOffset.apply(core.icons, arguments);
	}
	loadFloor() {// maps.loadFloor
		return core.maps.loadFloor.apply(core.maps, arguments);
	}
	extractBlocks() {// maps.extractBlocks
		return core.maps.extractBlocks.apply(core.maps, arguments);
	}
	extractBlocksForUI() {// maps.extractBlocksForUI
		return core.maps.extractBlocksForUI.apply(core.maps, arguments);
	}
	getNumberById() {// maps.getNumberById
		return core.maps.getNumberById.apply(core.maps, arguments);
	}
	getBlockByNumber() {// maps.getBlockByNumber
		return core.maps.getBlockByNumber.apply(core.maps, arguments);
	}
	getBlockById() {// maps.getBlockById
		return core.maps.getBlockById.apply(core.maps, arguments);
	}
	getIdOfThis() {// maps.getIdOfThis
		return core.maps.getIdOfThis.apply(core.maps, arguments);
	}
	initBlock() {// maps.initBlock
		return core.maps.initBlock.apply(core.maps, arguments);
	}
	compressMap() {// maps.compressMap
		return core.maps.compressMap.apply(core.maps, arguments);
	}
	setBlockOpacity() {// maps.setBlockOpacity
		return core.maps.setBlockOpacity.apply(core.maps, arguments);
	}
	setBlockFilter() {// maps.setBlockFilter
		return core.maps.setBlockFilter.apply(core.maps, arguments);
	}
	isMapBlockDisabled() {// maps.isMapBlockDisabled
		return core.maps.isMapBlockDisabled.apply(core.maps, arguments);
	}
	setMapBlockDisabled() {// maps.setMapBlockDisabled
		return core.maps.setMapBlockDisabled.apply(core.maps, arguments);
	}
	decompressMap() {// maps.decompressMap
		return core.maps.decompressMap.apply(core.maps, arguments);
	}
	saveMap() {// maps.saveMap
		return core.maps.saveMap.apply(core.maps, arguments);
	}
	loadMap() {// maps.loadMap
		return core.maps.loadMap.apply(core.maps, arguments);
	}
	resizeMap() {// maps.resizeMap
		return core.maps.resizeMap.apply(core.maps, arguments);
	}
	getMapArray() {// maps.getMapArray
		return core.maps.getMapArray.apply(core.maps, arguments);
	}
	getMapNumber() {// maps.getMapNumber
		return core.maps.getMapNumber.apply(core.maps, arguments);
	}
	getMapBlocksObj() {// maps.getMapBlocksObj
		return core.maps.getMapBlocksObj.apply(core.maps, arguments);
	}
	getBgMapArray() {// maps.getBgMapArray
		return core.maps.getBgMapArray.apply(core.maps, arguments);
	}
	getFgMapArray() {// maps.getFgMapArray
		return core.maps.getFgMapArray.apply(core.maps, arguments);
	}
	getBgNumber() {// maps.getBgNumber
		return core.maps.getBgNumber.apply(core.maps, arguments);
	}
	getFgNumber() {// maps.getFgNumber
		return core.maps.getFgNumber.apply(core.maps, arguments);
	}
	generateMovableArray() {// maps.generateMovableArray
		return core.maps.generateMovableArray.apply(core.maps, arguments);
	}
	canMoveHero() {// maps.canMoveHero
		return core.maps.canMoveHero.apply(core.maps, arguments);
	}
	canMoveDirectly() {// maps.canMoveDirectly
		return core.maps.canMoveDirectly.apply(core.maps, arguments);
	}
	canMoveDirectlyArray() {// maps.canMoveDirectlyArray
		return core.maps.canMoveDirectlyArray.apply(core.maps, arguments);
	}
	automaticRoute() {// maps.automaticRoute
		return core.maps.automaticRoute.apply(core.maps, arguments);
	}
	drawBlock() {// maps.drawBlock
		return core.maps.drawBlock.apply(core.maps, arguments);
	}
	generateGroundPattern() {// maps.generateGroundPattern
		return core.maps.generateGroundPattern.apply(core.maps, arguments);
	}
	drawMap() {// maps.drawMap
		return core.maps.drawMap.apply(core.maps, arguments);
	}
	redrawMap() {// maps.redrawMap
		return core.maps.redrawMap.apply(core.maps, arguments);
	}
	drawBg() {// maps.drawBg
		return core.maps.drawBg.apply(core.maps, arguments);
	}
	drawEvents() {// maps.drawEvents
		return core.maps.drawEvents.apply(core.maps, arguments);
	}
	drawFg() {// maps.drawFg
		return core.maps.drawFg.apply(core.maps, arguments);
	}
	drawThumbnail() {// maps.drawThumbnail
		return core.maps.drawThumbnail.apply(core.maps, arguments);
	}
	noPass() {// maps.noPass
		return core.maps.noPass.apply(core.maps, arguments);
	}
	npcExists() {// maps.npcExists
		return core.maps.npcExists.apply(core.maps, arguments);
	}
	terrainExists() {// maps.terrainExists
		return core.maps.terrainExists.apply(core.maps, arguments);
	}
	stairExists() {// maps.stairExists
		return core.maps.stairExists.apply(core.maps, arguments);
	}
	nearStair() {// maps.nearStair
		return core.maps.nearStair.apply(core.maps, arguments);
	}
	enemyExists() {// maps.enemyExists
		return core.maps.enemyExists.apply(core.maps, arguments);
	}
	getBlock() {// maps.getBlock
		return core.maps.getBlock.apply(core.maps, arguments);
	}
	getBlockId() {// maps.getBlockId
		return core.maps.getBlockId.apply(core.maps, arguments);
	}
	getBlockNumber() {// maps.getBlockNumber
		return core.maps.getBlockNumber.apply(core.maps, arguments);
	}
	getBlockCls() {// maps.getBlockCls
		return core.maps.getBlockCls.apply(core.maps, arguments);
	}
	getBlockOpacity() {// maps.getBlockOpacity
		return core.maps.getBlockOpacity.apply(core.maps, arguments);
	}
	getBlockFilter() {// maps.getBlockFilter
		return core.maps.getBlockFilter.apply(core.maps, arguments);
	}
	getBlockInfo() {// maps.getBlockInfo
		return core.maps.getBlockInfo.apply(core.maps, arguments);
	}
	searchBlock() {// maps.searchBlock
		return core.maps.searchBlock.apply(core.maps, arguments);
	}
	searchBlockWithFilter() {// maps.searchBlockWithFilter
		return core.maps.searchBlockWithFilter.apply(core.maps, arguments);
	}
	getFaceDownId() {// maps.getFaceDownId
		return core.maps.getFaceDownId.apply(core.maps, arguments);
	}
	showBlock() {// maps.showBlock
		return core.maps.showBlock.apply(core.maps, arguments);
	}
	hideBlock() {// maps.hideBlock
		return core.maps.hideBlock.apply(core.maps, arguments);
	}
	hideBlockByIndex() {// maps.hideBlockByIndex
		return core.maps.hideBlockByIndex.apply(core.maps, arguments);
	}
	hideBlockByIndexes() {// maps.hideBlockByIndexes
		return core.maps.hideBlockByIndexes.apply(core.maps, arguments);
	}
	removeBlock() {// maps.removeBlock
		return core.maps.removeBlock.apply(core.maps, arguments);
	}
	removeBlockByIndex() {// maps.removeBlockByIndex
		return core.maps.removeBlockByIndex.apply(core.maps, arguments);
	}
	removeBlockByIndexes() {// maps.removeBlockByIndexes
		return core.maps.removeBlockByIndexes.apply(core.maps, arguments);
	}
	showBgFgMap() {// maps.showBgFgMap
		return core.maps.showBgFgMap.apply(core.maps, arguments);
	}
	hideBgFgMap() {// maps.hideBgFgMap
		return core.maps.hideBgFgMap.apply(core.maps, arguments);
	}
	showFloorImage() {// maps.showFloorImage
		return core.maps.showFloorImage.apply(core.maps, arguments);
	}
	hideFloorImage() {// maps.hideFloorImage
		return core.maps.hideFloorImage.apply(core.maps, arguments);
	}
	setBlock() {// maps.setBlock
		return core.maps.setBlock.apply(core.maps, arguments);
	}
	animateSetBlock() {// maps.animateSetBlock
		return core.maps.animateSetBlock.apply(core.maps, arguments);
	}
	animateSetBlocks() {// maps.animateSetBlocks
		return core.maps.animateSetBlocks.apply(core.maps, arguments);
	}
	turnBlock() {// maps.turnBlock
		return core.maps.turnBlock.apply(core.maps, arguments);
	}
	replaceBlock() {// maps.replaceBlock
		return core.maps.replaceBlock.apply(core.maps, arguments);
	}
	setBgFgBlock() {// maps.setBgFgBlock
		return core.maps.setBgFgBlock.apply(core.maps, arguments);
	}
	resetMap() {// maps.resetMap
		return core.maps.resetMap.apply(core.maps, arguments);
	}
	moveBlock() {// maps.moveBlock
		return core.maps.moveBlock.apply(core.maps, arguments);
	}
	jumpBlock() {// maps.jumpBlock
		return core.maps.jumpBlock.apply(core.maps, arguments);
	}
	animateBlock() {// maps.animateBlock
		return core.maps.animateBlock.apply(core.maps, arguments);
	}
	addGlobalAnimate() {// maps.addGlobalAnimate
		return core.maps.addGlobalAnimate.apply(core.maps, arguments);
	}
	removeGlobalAnimate() {// maps.removeGlobalAnimate
		return core.maps.removeGlobalAnimate.apply(core.maps, arguments);
	}
	drawBoxAnimate() {// maps.drawBoxAnimate
		return core.maps.drawBoxAnimate.apply(core.maps, arguments);
	}
	drawAnimate() {// maps.drawAnimate
		return core.maps.drawAnimate.apply(core.maps, arguments);
	}
	drawHeroAnimate() {// maps.drawHeroAnimate
		return core.maps.drawHeroAnimate.apply(core.maps, arguments);
	}
	getPlayingAnimates() {// maps.getPlayingAnimates
		return core.maps.getPlayingAnimates.apply(core.maps, arguments);
	}
	stopAnimate() {// maps.stopAnimate
		return core.maps.stopAnimate.apply(core.maps, arguments);
	}
	getEnemys() {// enemys.getEnemys
		return core.enemys.getEnemys.apply(core.enemys, arguments);
	}
	hasSpecial() {// enemys.hasSpecial
		return core.enemys.hasSpecial.apply(core.enemys, arguments);
	}
	getSpecials() {// enemys.getSpecials
		return core.enemys.getSpecials.apply(core.enemys, arguments);
	}
	getSpecialText() {// enemys.getSpecialText
		return core.enemys.getSpecialText.apply(core.enemys, arguments);
	}
	getSpecialColor() {// enemys.getSpecialColor
		return core.enemys.getSpecialColor.apply(core.enemys, arguments);
	}
	getSpecialFlag() {// enemys.getSpecialFlag
		return core.enemys.getSpecialFlag.apply(core.enemys, arguments);
	}
	getSpecialHint() {// enemys.getSpecialHint
		return core.enemys.getSpecialHint.apply(core.enemys, arguments);
	}
	getEnemyValue() {// enemys.getEnemyValue
		return core.enemys.getEnemyValue.apply(core.enemys, arguments);
	}
	canBattle() {// enemys.canBattle
		return core.enemys.canBattle.apply(core.enemys, arguments);
	}
	getDamageString() {// enemys.getDamageString
		return core.enemys.getDamageString.apply(core.enemys, arguments);
	}
	nextCriticals() {// enemys.nextCriticals
		return core.enemys.nextCriticals.apply(core.enemys, arguments);
	}
	getDefDamage() {// enemys.getDefDamage
		return core.enemys.getDefDamage.apply(core.enemys, arguments);
	}
	getEnemyInfo() {// enemys.getEnemyInfo
		return core.enemys.getEnemyInfo.apply(core.enemys, arguments);
	}
	getDamageInfo() {// enemys.getDamageInfo
		return core.enemys.getDamageInfo.apply(core.enemys, arguments);
	}
	getDamage() {// enemys.getDamage
		return core.enemys.getDamage.apply(core.enemys, arguments);
	}
	getCurrentEnemys() {// enemys.getCurrentEnemys
		return core.enemys.getCurrentEnemys.apply(core.enemys, arguments);
	}
	hasEnemyLeft() {// enemys.hasEnemyLeft
		return core.enemys.hasEnemyLeft.apply(core.enemys, arguments);
	}
	resetGame() {// events.resetGame
		return core.events.resetGame.apply(core.events, arguments);
	}
	startGame() {// events.startGame
		return core.events.startGame.apply(core.events, arguments);
	}
	win() {// events.win
		return core.events.win.apply(core.events, arguments);
	}
	lose() {// events.lose
		return core.events.lose.apply(core.events, arguments);
	}
	gameOver() {// events.gameOver
		return core.events.gameOver.apply(core.events, arguments);
	}
	restart() {// events.restart
		return core.events.restart.apply(core.events, arguments);
	}
	confirmRestart() {// events.confirmRestart
		return core.events.confirmRestart.apply(core.events, arguments);
	}
	registerSystemEvent() {// events.registerSystemEvent
		return core.events.registerSystemEvent.apply(core.events, arguments);
	}
	unregisterSystemEvent() {// events.unregisterSystemEvent
		return core.events.unregisterSystemEvent.apply(core.events, arguments);
	}
	doSystemEvent() {// events.doSystemEvent
		return core.events.doSystemEvent.apply(core.events, arguments);
	}
	trigger() {// events.trigger
		return core.events.trigger.apply(core.events, arguments);
	}
	battle() {// events.battle
		return core.events.battle.apply(core.events, arguments);
	}
	beforeBattle() {// events.beforeBattle
		return core.events.beforeBattle.apply(core.events, arguments);
	}
	afterBattle() {// events.afterBattle
		return core.events.afterBattle.apply(core.events, arguments);
	}
	openDoor() {// events.openDoor
		return core.events.openDoor.apply(core.events, arguments);
	}
	afterOpenDoor() {// events.afterOpenDoor
		return core.events.afterOpenDoor.apply(core.events, arguments);
	}
	getItem() {// events.getItem
		return core.events.getItem.apply(core.events, arguments);
	}
	afterGetItem() {// events.afterGetItem
		return core.events.afterGetItem.apply(core.events, arguments);
	}
	getNextItem() {// events.getNextItem
		return core.events.getNextItem.apply(core.events, arguments);
	}
	changeFloor() {// events.changeFloor
		return core.events.changeFloor.apply(core.events, arguments);
	}
	changingFloor() {// events.changingFloor
		return core.events.changingFloor.apply(core.events, arguments);
	}
	afterChangeFloor() {// events.afterChangeFloor
		return core.events.afterChangeFloor.apply(core.events, arguments);
	}
	hasVisitedFloor() {// events.hasVisitedFloor
		return core.events.hasVisitedFloor.apply(core.events, arguments);
	}
	visitFloor() {// events.visitFloor
		return core.events.visitFloor.apply(core.events, arguments);
	}
	pushBox() {// events.pushBox
		return core.events.pushBox.apply(core.events, arguments);
	}
	afterPushBox() {// events.afterPushBox
		return core.events.afterPushBox.apply(core.events, arguments);
	}
	onSki() {// events.onSki
		return core.events.onSki.apply(core.events, arguments);
	}
	registerEvent() {// events.registerEvent
		return core.events.registerEvent.apply(core.events, arguments);
	}
	unregisterEvent() {// events.unregisterEvent
		return core.events.unregisterEvent.apply(core.events, arguments);
	}
	doEvent() {// events.doEvent
		return core.events.doEvent.apply(core.events, arguments);
	}
	setEvents() {// events.setEvents
		return core.events.setEvents.apply(core.events, arguments);
	}
	startEvents() {// events.startEvents
		return core.events.startEvents.apply(core.events, arguments);
	}
	doAction() {// events.doAction
		return core.events.doAction.apply(core.events, arguments);
	}
	insertAction() {// events.insertAction
		return core.events.insertAction.apply(core.events, arguments);
	}
	insertCommonEvent() {// events.insertCommonEvent
		return core.events.insertCommonEvent.apply(core.events, arguments);
	}
	getCommonEvent() {// events.getCommonEvent
		return core.events.getCommonEvent.apply(core.events, arguments);
	}
	recoverEvents() {// events.recoverEvents
		return core.events.recoverEvents.apply(core.events, arguments);
	}
	checkAutoEvents() {// events.checkAutoEvents
		return core.events.checkAutoEvents.apply(core.events, arguments);
	}
	autoEventExecuting() {// events.autoEventExecuting
		return core.events.autoEventExecuting.apply(core.events, arguments);
	}
	autoEventExecuted() {// events.autoEventExecuted
		return core.events.autoEventExecuted.apply(core.events, arguments);
	}
	pushEventLoc() {// events.pushEventLoc
		return core.events.pushEventLoc.apply(core.events, arguments);
	}
	popEventLoc() {// events.popEventLoc
		return core.events.popEventLoc.apply(core.events, arguments);
	}
	precompile() {// events.precompile
		return core.events.precompile.apply(core.events, arguments);
	}
	openBook() {// events.openBook
		return core.events.openBook.apply(core.events, arguments);
	}
	useFly() {// events.useFly
		return core.events.useFly.apply(core.events, arguments);
	}
	flyTo() {// events.flyTo
		return core.events.flyTo.apply(core.events, arguments);
	}
	openEquipbox() {// events.openEquipbox
		return core.events.openEquipbox.apply(core.events, arguments);
	}
	openToolbox() {// events.openToolbox
		return core.events.openToolbox.apply(core.events, arguments);
	}
	openQuickShop() {// events.openQuickShop
		return core.events.openQuickShop.apply(core.events, arguments);
	}
	openKeyBoard() {// events.openKeyBoard
		return core.events.openKeyBoard.apply(core.events, arguments);
	}
	save() {// events.save
		return core.events.save.apply(core.events, arguments);
	}
	load() {// events.load
		return core.events.load.apply(core.events, arguments);
	}
	openSettings() {// events.openSettings
		return core.events.openSettings.apply(core.events, arguments);
	}
	hasAsync() {// events.hasAsync
		return core.events.hasAsync.apply(core.events, arguments);
	}
	stopAsync() {// events.stopAsync
		return core.events.stopAsync.apply(core.events, arguments);
	}
	hasAsyncAnimate() {// events.hasAsyncAnimate
		return core.events.hasAsyncAnimate.apply(core.events, arguments);
	}
	follow() {// events.follow
		return core.events.follow.apply(core.events, arguments);
	}
	unfollow() {// events.unfollow
		return core.events.unfollow.apply(core.events, arguments);
	}
	setValue() {// events.setValue
		return core.events.setValue.apply(core.events, arguments);
	}
	setEnemy() {// events.setEnemy
		return core.events.setEnemy.apply(core.events, arguments);
	}
	setEnemyOnPoint() {// events.setEnemyOnPoint
		return core.events.setEnemyOnPoint.apply(core.events, arguments);
	}
	resetEnemyOnPoint() {// events.resetEnemyOnPoint
		return core.events.resetEnemyOnPoint.apply(core.events, arguments);
	}
	moveEnemyOnPoint() {// events.moveEnemyOnPoint
		return core.events.moveEnemyOnPoint.apply(core.events, arguments);
	}
	setFloorInfo() {// events.setFloorInfo
		return core.events.setFloorInfo.apply(core.events, arguments);
	}
	setGlobalAttribute() {// events.setGlobalAttribute
		return core.events.setGlobalAttribute.apply(core.events, arguments);
	}
	setGlobalFlag() {// events.setGlobalFlag
		return core.events.setGlobalFlag.apply(core.events, arguments);
	}
	setNameMap() {// events.setNameMap
		return core.events.setNameMap.apply(core.events, arguments);
	}
	setTextAttribute() {// events.setTextAttribute
		return core.events.setTextAttribute.apply(core.events, arguments);
	}
	moveTextBox() {// events.moveTextBox
		return core.events.moveTextBox.apply(core.events, arguments);
	}
	clearTextBox() {// events.clearTextBox
		return core.events.clearTextBox.apply(core.events, arguments);
	}
	closeDoor() {// events.closeDoor
		return core.events.closeDoor.apply(core.events, arguments);
	}
	showImage() {// events.showImage
		return core.events.showImage.apply(core.events, arguments);
	}
	hideImage() {// events.hideImage
		return core.events.hideImage.apply(core.events, arguments);
	}
	moveImage() {// events.moveImage
		return core.events.moveImage.apply(core.events, arguments);
	}
	rotateImage() {// events.rotateImage
		return core.events.rotateImage.apply(core.events, arguments);
	}
	scaleImage() {// events.scaleImage
		return core.events.scaleImage.apply(core.events, arguments);
	}
	showGif() {// events.showGif
		return core.events.showGif.apply(core.events, arguments);
	}
	setVolume() {// events.setVolume
		return core.events.setVolume.apply(core.events, arguments);
	}
	vibrate() {// events.vibrate
		return core.events.vibrate.apply(core.events, arguments);
	}
	eventMoveHero() {// events.eventMoveHero
		return core.events.eventMoveHero.apply(core.events, arguments);
	}
	jumpHero() {// events.jumpHero
		return core.events.jumpHero.apply(core.events, arguments);
	}
	setHeroIcon() {// events.setHeroIcon
		return core.events.setHeroIcon.apply(core.events, arguments);
	}
	checkLvUp() {// events.checkLvUp
		return core.events.checkLvUp.apply(core.events, arguments);
	}
	tryUseItem() {// events.tryUseItem
		return core.events.tryUseItem.apply(core.events, arguments);
	}
	registerAction() {// actions.registerAction
		return core.actions.registerAction.apply(core.actions, arguments);
	}
	unregisterAction() {// actions.unregisterAction
		return core.actions.unregisterAction.apply(core.actions, arguments);
	}
	doRegisteredAction() {// actions.doRegisteredAction
		return core.actions.doRegisteredAction.apply(core.actions, arguments);
	}
	onkeyDown() {// actions.onkeyDown
		return core.actions.onkeyDown.apply(core.actions, arguments);
	}
	onkeyUp() {// actions.onkeyUp
		return core.actions.onkeyUp.apply(core.actions, arguments);
	}
	pressKey() {// actions.pressKey
		return core.actions.pressKey.apply(core.actions, arguments);
	}
	keyDown() {// actions.keyDown
		return core.actions.keyDown.apply(core.actions, arguments);
	}
	keyUp() {// actions.keyUp
		return core.actions.keyUp.apply(core.actions, arguments);
	}
	ondown() {// actions.ondown
		return core.actions.ondown.apply(core.actions, arguments);
	}
	onmove() {// actions.onmove
		return core.actions.onmove.apply(core.actions, arguments);
	}
	onup() {// actions.onup
		return core.actions.onup.apply(core.actions, arguments);
	}
	onmousewheel() {// actions.onmousewheel
		return core.actions.onmousewheel.apply(core.actions, arguments);
	}
	keyDownCtrl() {// actions.keyDownCtrl
		return core.actions.keyDownCtrl.apply(core.actions, arguments);
	}
	longClick() {// actions.longClick
		return core.actions.longClick.apply(core.actions, arguments);
	}
	onStatusBarClick() {// actions.onStatusBarClick
		return core.actions.onStatusBarClick.apply(core.actions, arguments);
	}
	getContextByName() {// ui.getContextByName
		return core.ui.getContextByName.apply(core.ui, arguments);
	}
	clearMap() {// ui.clearMap
		return core.ui.clearMap.apply(core.ui, arguments);
	}
	fillText() {// ui.fillText
		return core.ui.fillText.apply(core.ui, arguments);
	}
	setFontForMaxWidth() {// ui.setFontForMaxWidth
		return core.ui.setFontForMaxWidth.apply(core.ui, arguments);
	}
	fillBoldText() {// ui.fillBoldText
		return core.ui.fillBoldText.apply(core.ui, arguments);
	}
	fillRect() {// ui.fillRect
		return core.ui.fillRect.apply(core.ui, arguments);
	}
	strokeRect() {// ui.strokeRect
		return core.ui.strokeRect.apply(core.ui, arguments);
	}
	fillRoundRect() {// ui.fillRoundRect
		return core.ui.fillRoundRect.apply(core.ui, arguments);
	}
	strokeRoundRect() {// ui.strokeRoundRect
		return core.ui.strokeRoundRect.apply(core.ui, arguments);
	}
	fillPolygon() {// ui.fillPolygon
		return core.ui.fillPolygon.apply(core.ui, arguments);
	}
	strokePolygon() {// ui.strokePolygon
		return core.ui.strokePolygon.apply(core.ui, arguments);
	}
	fillEllipse() {// ui.fillEllipse
		return core.ui.fillEllipse.apply(core.ui, arguments);
	}
	fillCircle() {// ui.fillCircle
		return core.ui.fillCircle.apply(core.ui, arguments);
	}
	strokeEllipse() {// ui.strokeEllipse
		return core.ui.strokeEllipse.apply(core.ui, arguments);
	}
	strokeCircle() {// ui.strokeCircle
		return core.ui.strokeCircle.apply(core.ui, arguments);
	}
	fillArc() {// ui.fillArc
		return core.ui.fillArc.apply(core.ui, arguments);
	}
	strokeArc() {// ui.strokeArc
		return core.ui.strokeArc.apply(core.ui, arguments);
	}
	drawLine() {// ui.drawLine
		return core.ui.drawLine.apply(core.ui, arguments);
	}
	drawArrow() {// ui.drawArrow
		return core.ui.drawArrow.apply(core.ui, arguments);
	}
	setFont() {// ui.setFont
		return core.ui.setFont.apply(core.ui, arguments);
	}
	setLineWidth() {// ui.setLineWidth
		return core.ui.setLineWidth.apply(core.ui, arguments);
	}
	saveCanvas() {// ui.saveCanvas
		return core.ui.saveCanvas.apply(core.ui, arguments);
	}
	loadCanvas() {// ui.loadCanvas
		return core.ui.loadCanvas.apply(core.ui, arguments);
	}
	setAlpha() {// ui.setAlpha
		return core.ui.setAlpha.apply(core.ui, arguments);
	}
	setOpacity() {// ui.setOpacity
		return core.ui.setOpacity.apply(core.ui, arguments);
	}
	setFilter() {// ui.setFilter
		return core.ui.setFilter.apply(core.ui, arguments);
	}
	setFillStyle() {// ui.setFillStyle
		return core.ui.setFillStyle.apply(core.ui, arguments);
	}
	setStrokeStyle() {// ui.setStrokeStyle
		return core.ui.setStrokeStyle.apply(core.ui, arguments);
	}
	setTextAlign() {// ui.setTextAlign
		return core.ui.setTextAlign.apply(core.ui, arguments);
	}
	setTextBaseline() {// ui.setTextBaseline
		return core.ui.setTextBaseline.apply(core.ui, arguments);
	}
	calWidth() {// ui.calWidth
		return core.ui.calWidth.apply(core.ui, arguments);
	}
	splitLines() {// ui.splitLines
		return core.ui.splitLines.apply(core.ui, arguments);
	}
	drawImage() {// ui.drawImage
		return core.ui.drawImage.apply(core.ui, arguments);
	}
	drawIcon() {// ui.drawIcon
		return core.ui.drawIcon.apply(core.ui, arguments);
	}
	closePanel() {// ui.closePanel
		return core.ui.closePanel.apply(core.ui, arguments);
	}
	clearUI() {// ui.clearUI
		return core.ui.clearUI.apply(core.ui, arguments);
	}
	drawTip() {// ui.drawTip
		return core.ui.drawTip.apply(core.ui, arguments);
	}
	drawText() {// ui.drawText
		return core.ui.drawText.apply(core.ui, arguments);
	}
	drawUIEventSelector() {// ui.drawUIEventSelector
		return core.ui.drawUIEventSelector.apply(core.ui, arguments);
	}
	clearUIEventSelector() {// ui.clearUIEventSelector
		return core.ui.clearUIEventSelector.apply(core.ui, arguments);
	}
	drawWindowSkin() {// ui.drawWindowSkin
		return core.ui.drawWindowSkin.apply(core.ui, arguments);
	}
	drawBackground() {// ui.drawBackground
		return core.ui.drawBackground.apply(core.ui, arguments);
	}
	drawTextContent() {// ui.drawTextContent
		return core.ui.drawTextContent.apply(core.ui, arguments);
	}
	getTextContentHeight() {// ui.getTextContentHeight
		return core.ui.getTextContentHeight.apply(core.ui, arguments);
	}
	drawTextBox() {// ui.drawTextBox
		return core.ui.drawTextBox.apply(core.ui, arguments);
	}
	drawScrollText() {// ui.drawScrollText
		return core.ui.drawScrollText.apply(core.ui, arguments);
	}
	textImage() {// ui.textImage
		return core.ui.textImage.apply(core.ui, arguments);
	}
	drawChoices() {// ui.drawChoices
		return core.ui.drawChoices.apply(core.ui, arguments);
	}
	drawConfirmBox() {// ui.drawConfirmBox
		return core.ui.drawConfirmBox.apply(core.ui, arguments);
	}
	drawWaiting() {// ui.drawWaiting
		return core.ui.drawWaiting.apply(core.ui, arguments);
	}
	drawPagination() {// ui.drawPagination
		return core.ui.drawPagination.apply(core.ui, arguments);
	}
	drawBook() {// ui.drawBook
		return core.ui.drawBook.apply(core.ui, arguments);
	}
	drawFly() {// ui.drawFly
		return core.ui.drawFly.apply(core.ui, arguments);
	}
	getToolboxItems() {// ui.getToolboxItems
		return core.ui.getToolboxItems.apply(core.ui, arguments);
	}
	drawStatusBar() {// ui.drawStatusBar
		return core.ui.drawStatusBar.apply(core.ui, arguments);
	}
	createCanvas() {// ui.createCanvas
		return core.ui.createCanvas.apply(core.ui, arguments);
	}
	relocateCanvas() {// ui.relocateCanvas
		return core.ui.relocateCanvas.apply(core.ui, arguments);
	}
	rotateCanvas() {// ui.rotateCanvas
		return core.ui.rotateCanvas.apply(core.ui, arguments);
	}
	resizeCanvas() {// ui.resizeCanvas
		return core.ui.resizeCanvas.apply(core.ui, arguments);
	}
	deleteCanvas() {// ui.deleteCanvas
		return core.ui.deleteCanvas.apply(core.ui, arguments);
	}
	deleteAllCanvas() {// ui.deleteAllCanvas
		return core.ui.deleteAllCanvas.apply(core.ui, arguments);
	}
}

const core = new Core();
globalThis.core = core;
export default core;