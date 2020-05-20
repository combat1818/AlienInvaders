import Phaser from "phaser";
import BootScene from "./scenes/BootScene.js"
import PreloaderScene from "./scenes/PreloaderScene.js"
import TitleScene from "./scenes/TitleScene.js"
import OptionsScene from "./scenes/OptionsScene.js"
import ChooseLevelScene from "./scenes/ChooseLevelScene.js"
import CreditsScene from "./scenes/CreditsScene.js"
import Level1Scene from './scenes/Level1Scene.js'
import Level2Scene from './scenes/Level2Scene.js'
import Level3Scene from "./scenes/Level3Scene.js";
import Level4Scene from "./scenes/Level4Scene.js";
import Level5Scene from "./scenes/Level5Scene.js";
import Level7Scene from "./scenes/Level7Scene.js";

import Model from './scenes/Model.js';



const config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: { y: 0 }
		}
	},
	scene: [BootScene,PreloaderScene,TitleScene,OptionsScene,ChooseLevelScene,CreditsScene,Level1Scene,Level2Scene,Level3Scene,Level4Scene, Level5Scene,Level7Scene]
};

const game = new Phaser.Game(config);

const model = new Model();
game.globals = { model };