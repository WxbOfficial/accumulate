// import * as Phaser from 'phaser';
import { addTextObject, TextStyle } from "../text.js";
import { Command } from "./command-ui-handler.js";
import MessageUiHandler from "./message-ui-handler.js";
import { Mode } from "./ui.js";

const defaultMessage = 'Choose a Pokémon.';

class PartyUiHandler extends MessageUiHandler {
	constructor(scene) {
		super(scene, Mode.PARTY);
		this.lastCursor = 0;
	}

	setup() {
		const ui = this.getUi();

		const partyContainer = this.scene.add.container(0, 0);
		partyContainer.setVisible(false);
		ui.add(partyContainer);

		this.partyContainer = partyContainer;

		const partyBg = this.scene.add.image(0, 0, 'party_bg');
		partyContainer.add(partyBg);

		partyBg.setOrigin(0, 1);

		const partySlotsContainer = this.scene.add.container(0, 0);
		partyContainer.add(partySlotsContainer);

		this.partySlotsContainer = partySlotsContainer;

		const partyMessageBoxContainer = this.scene.add.container(0, -32);
		partyContainer.add(partyMessageBoxContainer);

		const partyMessageBox = this.scene.add.image(1, 31, 'party_message');
		partyMessageBox.setOrigin(0, 1);
		partyMessageBoxContainer.add(partyMessageBox);

		this.partyMessageBox = partyMessageBox;

		const partyMessageText = addTextObject(this.scene, 8, 10, defaultMessage, TextStyle.WINDOW, { maxLines: 2 });
		partyMessageText.setPositionRelative;

		partyMessageText.setOrigin(0, 0);
		partyMessageBoxContainer.add(partyMessageText);

		this.message = partyMessageText;

		const partyCancelButton = new PartyCancelButton(this.scene, 291, -16);
		partyContainer.add(partyCancelButton);

		this.partyCancelButton = partyCancelButton;

		this.partySlots = [];
	}

	show(args) {
		super.show(args);

		this.partyContainer.setVisible(true);
		this.populatePartySlots();
		this.setCursor(this.cursor < 6 ? this.cursor : 0);

		this.isModal = args.length && args[0];
		if (args.length > 1 && args[1] instanceof Function)
			this.selectCallback = args[1];
		this.selectFilter = args.length > 2 && args[2] instanceof Function
			? args[2]
			: PartyUiHandler.FilterAll;
	}

	processInput(keyCode) {
		const ui = this.getUi();
		const keyCodes = Phaser.Input.Keyboard.KeyCodes;

		if (this.pendingPrompt)
			return;

		if (this.awaitingActionInput) {
			if (keyCode === keyCodes.Z || keyCode === keyCodes.X) {
				if (this.onActionInput) {
					ui.playSelect();
					const originalOnActionInput = this.onActionInput;
					this.onActionInput = null;
					originalOnActionInput();
					this.awaitingActionInput = false;
				}
			}
			return;
		}

		if (keyCode === keyCodes.Z) {
			if (this.cursor < 6) {
				let filterResult = this.selectFilter(this.scene.getParty()[this.cursor]);
				if (filterResult === null) {
					if (this.selectCallback) {
						const selectCallback = this.selectCallback;
						this.selectCallback = null;
						selectCallback(this.cursor);
						return;
					} else if (this.cursor)
						this.scene.getCurrentPhase().handleCommand(Command.POKEMON, this.cursor);
					else
						this.processInput(keyCodes.X);
				} else {
					this.partyMessageBox.setTexture('party_message_large');
					this.message.y -= 15;
					this.showText(filterResult, null, () => {
						this.partyMessageBox.setTexture('party_message');
						this.message.text = defaultMessage;
						this.message.y += 15;
					}, null, true);
				}
			} else if (this.isModal)
				ui.playError();
			else
				this.processInput(keyCodes.X);
			return;
		} else if (keyCode === keyCodes.X) {
			if (!this.isModal) {
				if (this.selectCallback) {
					const selectCallback = this.selectCallback;
					this.selectCallback = null;
					selectCallback(6);
					ui.playSelect();
				} else {
					ui.setMode(Mode.COMMAND);
					ui.playSelect();
				}
			}
			return;
		}

		const slotCount = this.partySlots.length;
		let success = false;

		switch (keyCode) {
			case keyCodes.UP:
				success = this.setCursor(this.cursor ? this.cursor < 6 ? this.cursor - 1 : slotCount - 1 : 6);
				break;
			case keyCodes.DOWN:
				success = this.setCursor(this.cursor < 6 ? this.cursor < slotCount - 1 ? this.cursor + 1 : 6 : 0);
				break;
			case keyCodes.LEFT:
				if (this.cursor && this.cursor < 6)
					success = this.setCursor(0);
				break;
			case keyCodes.RIGHT:
				if (!this.cursor)
					success = this.setCursor(this.lastCursor < 6 ? this.lastCursor || 1 : 1);
				break;
		}

		if (success)
			ui.playSelect();
	}

	setCursor(cursor) {
		const changed = this.cursor !== cursor;
		if (changed) {
			this.lastCursor = this.cursor;
			this.cursor = cursor;
			if (this.lastCursor < 6)
				this.partySlots[this.lastCursor].deselect();
			else if (this.lastCursor === 6)
				this.partyCancelButton.deselect();
			if (cursor < 6)
				this.partySlots[cursor].select();
			else if (cursor === 6)
				this.partyCancelButton.select();
		}

		return changed;
	}

	populatePartySlots() {
		const party = this.scene.getParty();

		if (this.cursor < 6 && this.cursor >= party.length)
			this.cursor = party.length - 1;
		else if (this.cursor === 6)
			this.partyCancelButton.select();

		for (let p in party) {
			const slotIndex = parseInt(p);
			const partySlot = new PartySlot(this.scene, slotIndex, party[p]);
			this.scene.add.existing(partySlot);
			this.partySlotsContainer.add(partySlot);
			this.partySlots.push(partySlot);
			if (this.cursor === slotIndex)
				partySlot.select();
		}
	}

	clear() {
		super.clear();
		this.partyContainer.setVisible(false);
		this.clearPartySlots();
	}

	clearPartySlots() {
		this.partySlots.splice(0, this.partySlots.length);
		this.partySlotsContainer.removeAll(true);
	}
}
PartyUiHandler.FilterAll = (_pokemon) => null;
PartyUiHandler.FilterNonFainted = (pokemon) => {
	if (!pokemon.hp)
		return `${pokemon.name} has no energy\nleft to battle!`;
	return null;
};
PartyUiHandler.NoEffectMessage = 'It won\'t have any effect.';
export default PartyUiHandler;
class PartySlot extends Phaser.GameObjects.Container {
	constructor(scene, slotIndex, pokemon) {
		super(scene, slotIndex ? 230.5 : 64, slotIndex ? -184 + 28 * slotIndex : -124);

		this.slotIndex = slotIndex;
		this.pokemon = pokemon;

		this.setup();
	}

	setup() {
		const slotKey = `party_slot${this.slotIndex ? '' : '_main'}`;

		const slotBg = this.scene.add.sprite(0, 0, slotKey, `${slotKey}${this.pokemon.hp ? '' : '_fnt'}`);
		this.slotBg = slotBg;

		this.add(slotBg);

		const slotPb = this.scene.add.sprite(this.slotIndex ? -85.5 : -51, this.slotIndex ? 0 : -20.5, 'party_pb');
		this.slotPb = slotPb;

		this.add(slotPb);

		const pokemonIcon = this.scene.add.sprite(slotPb.x, slotPb.y, this.pokemon.getIconAtlasKey());
		console.log(pokemonIcon);
		pokemonIcon.play(this.pokemon.getIconKey());
		this.slotPokemonIcon = pokemonIcon;

		this.add(pokemonIcon);

		const slotInfoContainer = this.scene.add.container(0, 0);
		this.add(slotInfoContainer);

		const slotName = addTextObject(this.scene, 0, 0, this.pokemon.name, TextStyle.PARTY);
		slotName.setPositionRelative(slotBg, this.slotIndex ? 21 : 24, this.slotIndex ? 3 : 10);
		slotName.setOrigin(0, 0);

		const slotLevelLabel = this.scene.add.image(0, 0, 'party_slot_overlay_lv');
		slotLevelLabel.setPositionRelative(slotName, 8, 12);
		slotLevelLabel.setOrigin(0, 0);

		const slotLevelText = addTextObject(this.scene, 0, 0, this.pokemon.level.toString(), TextStyle.PARTY);
		slotLevelText.setPositionRelative(slotLevelLabel, 9, 0);
		slotLevelText.setOrigin(0, 0.25);

		const slotHpBar = this.scene.add.image(0, 0, 'party_slot_hp_bar');
		slotHpBar.setPositionRelative(slotBg, this.slotIndex ? 72 : 8, this.slotIndex ? 7 : 31);
		slotHpBar.setOrigin(0, 0);

		const hpRatio = this.pokemon.hp / this.pokemon.getMaxHp();

		const slotHpOverlay = this.scene.add.sprite(0, 0, 'party_slot_hp_overlay', hpRatio > 0.5 ? 'high' : hpRatio > 0.25 ? 'medium' : 'low');
		slotHpOverlay.setPositionRelative(slotHpBar, 16, 2);
		slotHpOverlay.setOrigin(0, 0);
		slotHpOverlay.setScale(hpRatio, 1);

		const slotHpText = addTextObject(this.scene, 0, 0, `${this.pokemon.hp}/${this.pokemon.getMaxHp()}`, TextStyle.PARTY);
		slotHpText.setPositionRelative(slotHpBar, slotHpBar.width - 3, slotHpBar.height - 2);
		slotHpText.setOrigin(1, 0);

		slotInfoContainer.add([slotName, slotLevelLabel, slotLevelText, slotHpBar, slotHpOverlay, slotHpText]);

		this.slotHpOverlay = slotHpOverlay;
	}

	select() {
		if (this.selected)
			return;

		this.selected = true;

		this.slotBg.setTexture(`party_slot${this.slotIndex ? '' : '_main'}`, `party_slot${this.slotIndex ? '' : '_main'}${this.pokemon.hp ? '' : '_fnt'}_sel`);
		this.slotPb.setFrame('party_pb_sel');
	}

	deselect() {
		if (!this.selected)
			return;

		this.selected = false;

		this.slotBg.setTexture(`party_slot${this.slotIndex ? '' : '_main'}`, `party_slot${this.slotIndex ? '' : '_main'}${this.pokemon.hp ? '' : '_fnt'}`);
		this.slotPb.setFrame('party_pb');
	}
}

class PartyCancelButton extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);

		this.setup();
	}

	setup() {
		const partyCancelBg = this.scene.add.sprite(0, 0, 'party_cancel');
		this.add(partyCancelBg);

		this.partyCancelBg = partyCancelBg;

		const partyCancelPb = this.scene.add.sprite(-17, 0, 'party_pb');
		this.add(partyCancelPb);

		this.partyCancelPb = partyCancelPb;

		const partyCancelText = addTextObject(this.scene, -7, -6, 'CANCEL', TextStyle.PARTY);
		this.add(partyCancelText);
	}

	select() {
		if (this.selected)
			return;

		this.selected = true;

		this.partyCancelBg.setFrame(`party_cancel_sel`);
		this.partyCancelPb.setFrame('party_pb_sel');
	}

	deselect() {
		if (!this.selected)
			return;

		this.selected = false;

		this.partyCancelBg.setFrame('party_cancel');
		this.partyCancelPb.setFrame('party_pb');
	}
}