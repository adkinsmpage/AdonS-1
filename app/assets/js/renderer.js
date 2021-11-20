/*eslint-disable no-fallthrough */
/*eslint-disable default-case */
/*eslint-disable camelcase */
/*eslint-disable no-undef */
/*
      _                __                             ______   
     / \              |  ]                          .' ____ \  
    / _ \         .--.| |      .--.      _ .--.     | (___ \_| 
   / ___ \      / /'`\' |    / .'`\ \   [ `.-. |     _.____`.  
 _/ /   \ \_    | \__/  |    | \__. |    | | | |    | \____) | 
|____| |____|    '.__.;__]    '.__.'    [___||__]    \______.' 

 _   _           _
| | | | __ _ ___(_)_ __ __ _
| | | |/ _` |_  / | '__/ _` |
| |_| | (_| |/ /| | | | (_| |
 \___/ \__,_/___|_|_|  \__,_|

 */
const Store = require("electron-store");

const store = new Store();

const { ipcRenderer } = require("electron");

const Terminal = require("dom-terminal");

function showError(message) {
	ipcRenderer.send("errorInRenderer", String(message));
	return false;
}

window.onerror = (e) => {
	showError(e);
};

/**
 * Start Screen Animation.
 */

document.addEventListener("DOMContentLoaded", () => {
	setTimeout(() => {
		document.querySelector("#onStart").style.animation = "FadeOut .2s linear";
		setTimeout(() => {
			document.querySelector("#onStart").style.opacity = 0;
			document.querySelector("#onStart").style.display = "none";
			displayMessage("Welcome To AdonS.");
		}, 100);
	}, 5656);
});

/**
 * Get Date Or Time
 */

(function () {
	setInterval(() => {
		document.querySelector("#dockTime").textContent =
			new Date().getHours() + ":" + new Date().getMinutes();
	});
	setInterval(() => {
		document.querySelector("#dockDate").textContent =
			new Date().getFullYear() +
			"/" +
			new Date().getMonth() +
			"/" +
			new Date().getDate();
	});
	setInterval(() => {
		document.querySelector("#LockTime").textContent =
			new Date().getHours() +
			":" +
			new Date().getMinutes() +
			":" +
			new Date().getSeconds();
	});
})();

/**
 * LaunchPad.
 */

function showLauPad() {
	document.querySelector("#laupad").style.animation = "FadeIn .2s linear";
	document.querySelector("#laupad").style.opacity = 1;
	document.querySelector("#laupad").style.display = "block";
	document.querySelector("#dock_time").style.bottom = "calc(55%)";
	document.querySelector("#sysIco").onclick = function () {
		hideLauPad();
	};
}

function hideLauPad() {
	document.querySelector("#laupad").style.animation = "FadeOut .2s linear";
	setTimeout(() => {
		document.querySelector("#laupad").style.opacity = 0;
		document.querySelector("#laupad").style.display = "none";
	}, 100);
	document.querySelector("#dock_time").style.bottom = "0px";
	document.querySelector("#sysIco").onclick = function () {
		showLauPad();
	};
}

/**
 * Lock Screen,Like Windows 11.
 */

function hideLockScr() {
	document.querySelector("#LockScreen").style.animation = "FadeOut .2s linear";
	setTimeout(() => {
		document.querySelector("#LockScreen").style.opacity = 0;
		document.querySelector("#LockScreen").style.display = "none";
	}, 100);
}

function showLockScr() {
	hideLauPad();
	document.querySelector("#LockScreen").style.animation =
		"fadeInDown .2s linear";
	document.querySelector("#LockScreen").style.opacity = 1;
	document.querySelector("#LockScreen").style.display = "block";
}

/**
 * Shutdown Diaglog
 */

document.querySelector("#shutdown_btn").addEventListener("click", () => {
	pxmu
		.diaglog({
			title: {
				text: "警告！",
				color: "red",
				fontsize: 20,
				fontweight: "bold",
				center: false,
			},
			content: {
				text: "您确定要关闭 AdonS 吗？",
				color: "#444",
				fontsize: 14,
				fontweight: "normal",
			},
			line: {
				solid: 1,
				color: "#eee",
			},
			btn: {
				left: {
					text: "取消",
					bg: "#fff",
					solidcolor: "#fff",
					color: "#444",
				},
				right: {
					text: "确定",
					bg: "#fff",
					solidcolor: "#fff",
					color: "red",
				},
			},
			congif: {
				animation: "fade",
			},
		})
		.then(function (res) {
			if (res.btn == "right") {
				setTimeout(() => {
					hideLauPad();
					setTimeout(() => {
						window.location.href = "./closing.html";
					}, 700);
				}, 600);
			}
		});
});

/**
 * To Do List
 */

(function () {
	function newFun() {
		var addItems = document.querySelector(".add-items");
		var itemsList = document.querySelector(".plates");
		var buttons = document.querySelector(".buttons");
		var items = store.get("items") ? JSON.parse(store.get("items")) : [];

		//添加item方法
		function handleSubmit(e) {
			e.preventDefault();
			var name = this.querySelector("[name=item]").value;

			var item = {
				name: name,
				done: false,
			};
			items.push(item);
			store.set("items", JSON.stringify(items));
			updateList(items, itemsList);
			this.reset();
		}

		function updateList(plates = [], plateList) {
			plateList.innerHTML = plates
				.map(function (plate, i) {
					return (
						'<li><input type="checkbox" data-index="' +
						i +
						'" id="plate' +
						i +
						'" ' +
						(plate.done ? "checked" : "") +
						' /><label for="plate' +
						i +
						'">' +
						plate.name +
						"</label></li>"
					);
				})
				.join("");
		}

		function toggleChecked(e) {
			if (!e.target.matches("input")) return;
			var item = e.target.dataset.index;
			items[item].done = !items[item].done;
			store.set("items", JSON.stringify(items));
			updateList(items, itemsList);
		}

		function doButtonPress(e) {
			var action = e.target.dataset.action;
			switch (action) {
				case "clear":
					items = [];
					break;
				case "check":
					items.map(function (item) {
						return (item.done = true);
					});
					break;
				case "clearCheck":
					for (var key in items) {
						if (items[key].done === true) {
							pxmu.toast({
								msg: "可能会无法一次删除所有，请多次点击",
								time: 800,
							});
							items.splice(key, 1);
						}
					}
					break;
				case "uncheck":
					items.map(function (item) {
						return (item.done = false);
					});
					break;
				default:
					return;
			}
			store.set("items", JSON.stringify(items));
			updateList(items, itemsList);
		}

		addItems.addEventListener("submit", handleSubmit);
		itemsList.addEventListener("click", toggleChecked);
		buttons.addEventListener("click", doButtonPress);

		updateList(items, itemsList);
	}

	document.addEventListener("DOMContentLoaded", newFun);
})();

function showTodoList() {
	hideLauPad();
	document.querySelector("#TodoList").style.animation = "FadeIn .2s linear";
	document.querySelector("#TodoList").style.opacity = 1;
	document.querySelector("#TodoList").style.display = "block";
}

function hideTodoList() {
	showLauPad();
	document.querySelector("#TodoList").style.animation = "FadeOut .2s linear";
	setTimeout(() => {
		document.querySelector("#TodoList").style.opacity = 0;
		document.querySelector("#TodoList").style.display = "none";
	}, 100);
}

/**
 * Context Menu DIY.
 */

document.addEventListener("DOMContentLoaded", () => {
	var forRight = document.getElementById("right-menu");
	function showContextmenu() {
		var event = event || window.event;
		//显示菜单
		forRight.style.display = "block";
		setTimeout(() => {
			forRight.style.opacity = "1";
			forRight.style.transform = "scale(1.05)";
		}, 50);
		setTimeout(() => (forRight.style.transform = "scale(1)"), 200);
		forRight.style.left = event.pageX + "px";
		forRight.style.top = event.pageY + "px";
		return false;
	}
	function hideContextMenu() {
		forRight.style.transform = "scale(7.5)";
		forRight.style.opacity = "0";
		setTimeout(() => (forRight.style.display = "none"), 250);
	}
	window.oncontextmenu = function (event) {
		showContextmenu();
	};
	//再次点击，菜单消失
	document.onclick = function () {
		hideContextMenu();
	};
});

/**
 * PopUp.
 */

function showPop(thePopUp) {
	let cover1 = document.querySelector("#cover1.cover1");
	let popObj = document.querySelector("#" + thePopUp);
	cover1.style.display = "block";
	popObj.style.display = "block";
	popObj.style.transform = "scale(1.1)";
	setTimeout(() => {
		cover1.style.opacity = "1";
		popObj.style.opacity = "1";
		setTimeout(() => {
			popObj.style.transform = "scale(1.0)";
		}, 100);
	}, 50);
	cover1.style.opacity = "1";
}

function closePop(obj) {
	cover1.style.opacity = "0";
	obj.style.opacity = "0";
	obj.style.transform = "scale(1.1)";
	setTimeout(() => {
		cover1.style.display = "none";
		obj.style.display = "none";
		obj.style.transform = "scale(0.6)";
		setTimeout(() => {
			obj.style.transform = "scale(1.1)";
		}, 350);
	}, 350);
}

/**
 * Plugin Support.
 */

ipcRenderer.on("Plugin-Content", (_event, path, content) => {
	if (content && path) {
		console.log(content);
		let contentObj = JSON.parse(content);
		let mainJsPathInJson = contentObj.main;
		var items = store.get("InstalledPlugins")
			? JSON.parse(store.get("items"))
			: [];
		let item = {
			name: path,
			main: mainJsPathInJson,
		};
		items.push(item);
		store.set("InstalledPlugins", JSON.stringify(items));
	}
});

ipcRenderer.on("Plugin-Uninstall-All", (_event, mess) => {
	if (mess === "checked") {
		pxmu
			.diaglog({
				title: {
					text: "警告！",
					color: "red",
					fontsize: 20,
					fontweight: "bold",
					center: false,
				},
				content: {
					text: "您确定要删除所有插件吗？",
					color: "#444",
					fontsize: 14,
					fontweight: "normal",
				},
				line: {
					solid: 1,
					color: "#eee",
				},
				btn: {
					left: {
						text: "取消",
						bg: "#fff",
						solidcolor: "#fff",
						color: "#444",
					},
					right: {
						text: "确定",
						bg: "#fff",
						solidcolor: "#fff",
						color: "red",
					},
				},
				congif: {
					animation: "fade",
				},
			})
			.then(function (res) {
				if (res.btn == "right") {
					store.delete("InstalledPlugins");
					history.go(0);
				}
			});
	}
});

if (store.get("InstalledPlugins")) {
	window.addEventListener("load", () => {
		let InstalledPluginsObj = JSON.parse(store.get("InstalledPlugins"));
		InstalledPluginsObj.forEach((obj) => {
			let elementObj = document.createElement("script");
			obj.main
				? (elementObj.src = obj.main)
				: console.log(
						"Path 为 " + obj.name + " 的插件没有 main 属性，无法添加至 DOM."
				  );
			elementObj.defer = true;
			document.querySelector("body").append(elementObj);
		});
	});
}

/**
 * Change Wallpaper
 */

function getWallpaperInfo() {
	let wallpaperBool = store.get("wallpaperSrc") ? true : false;
	if (wallpaperBool) {
		let wallpaperSrc = store.get("wallpaperSrc");
		return String(wallpaperSrc);
	}
	return false;
}

function setWallpaper(src) {
	if (src) {
		document.querySelector("#WallpaperBackGround").src = String(src);
		store.set("wallpaperSrc", String(src));
	} else {
		showError("Can not Read Background Src of 'setWallpaper' function.");
	}
	return "Done.";
}

document.addEventListener("DOMContentLoaded", () => {
	if (getWallpaperInfo()) {
		setWallpaper(getWallpaperInfo());
	}
});

document
	.querySelector("#wallpaperInputSummit")
	.addEventListener("click", () => {
		setWallpaper(String(document.querySelector("#wallpaperInput").value));
	});

/**
 * Terminal
 */
document.querySelector("#terminalButton").onclick = function () {
	document.querySelector("#terminalCon").style.animation = "FadeIn .2s linear";
	document.querySelector("#terminalCon").style.opacity = 1;
	document.querySelector("#terminalCon").style.display = "block";
	document.querySelector("#TerminalCloseBtn").onclick = function () {
		document.querySelector("#terminalCon").style.animation =
			"FadeOut .2s linear";
		setTimeout(() => {
			document.querySelector("#terminalCon").style.opacity = 0;
			document.querySelector("#terminalCon").style.display = "none";
		}, 100);
	};
};

var ter = new Terminal(
	"terminal",
	{
		welcome: "Welcome to Adon terminal!",
		prompt: "AdonTerminal ",
		separator: "&gt;",
	},
	{
		execute: function (cmd, args) {
			switch (cmd) {
				case "clear":
					terminal.clear();
					return "";

				case "help":
					return 'Commands: clear, help, theme, ver or version<br>More help available <a class="external" href="http://github.com/sasadjolic/dom-terminal" target="_blank">here</a>';

				case "theme":
					if (args && args[0]) {
						if (args.length > 1) return "Too many arguments";
						else if (args[0].match(/^interlaced|modern|white$/u)) {
							terminal.setTheme(args[0]);
							return "";
						}
						return "Invalid theme";
					}
					return terminal.getTheme();

				case "ver":
				case "version":
					return "1.0.2";

				default:
					return false;
			}
		},
	}
);

/**
 * Message Toast
 *
 * By `Leng Yi Bai`
 *
 * @param str 'String'
 */

function displayMessage(str) {
	let alert = document.querySelector("alert");
	let timer = null;

	function display_S() {
		alert.style.top = "35px";
		alert.style.opacity = "1";
		alert.innerHTML = str;
		timer = setTimeout(function () {
			alert.style.top = "-50px";
			alert.style.opacity = "0";
		}, 5000);
	}

	alert.addEventListener("mouseover", function () {
		clearTimeout(timer);
		console.log("用户已知晓");
	});

	alert.addEventListener("mouseleave", function () {
		console.log("用户已阅读完毕");
		setTimeout(() => {
			alert.style.top = "-50px";
			alert.style.opacity = "0";
		}, 100);
	});

	function display_C() {
		clearTimeout(timer);
		alert.style.backgroundColor = "white";
		alert.style.color = "black";
		let twinkle1 = setInterval(() => {
			alert.style.backgroundColor = "rgb(51, 51, 51)";
			alert.style.color = "white";
		}, 250);
		let twinkle2 = setInterval(() => {
			alert.style.backgroundColor = "white";
			alert.style.color = "black";
		}, 500);
		setTimeout(() => {
			clearInterval(twinkle1);
			clearInterval(twinkle2);
		}, 750);
	}

	display_C();
	display_S();
	return true;
}
