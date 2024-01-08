import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'
import './choose-input.mjs'

customElements.define("upload-input", class UploadInput extends BaseElement {
    static get properties() {
        return {
            isChosen: { type: Boolean, default: false},
            value: { type: Object, default: {}},
            file: { type: Object, default: {}},
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: block;
                }
                div {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    padding-top: 10px;
                    width: 100%;
                    height: 100%;
                    outline: auto;
                    overflow: hidden;
                }
                #fileInput {
                    display: none;
                }
                simple-icon {
                    height: 50px;
                    width: 50px;
                }
                span {
                    font-weight: bold;
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }
                span:hover {
                    filter: brightness(0.8);
                }

            `
        ]
    }

    firstUpdated(setPath = false) {
        super.firstUpdated();
    }

    clickButton() {
        this.$id("fileInput").click();
    }

    dropHandler(e) {
        e.preventDefault();
        if (e.dataTransfer.items) {
          [...e.dataTransfer.items].forEach((item, i) => {
            // If dropped items aren't files, reject them
            if (item.kind === "file") {
              this.isChosen = true;

              const file = item.getAsFile();
              this.file = file;
              this.value = file.name;
              console.log(`… file[${i}].name = ${file.name}`);
            }
          });
        } else {
          [...e.dataTransfer.files].forEach((file, i) => {
            console.log(`… file[${i}].name = ${file.name}`);
          });
        }
      }

    dragOverHandler(e) {
        e.preventDefault();
    }

    changeFileInput(e) {
        this.isChosen = true;
        this.file = e.target.files[0];
        this.value = this.file.name
    }

    #dragAndDrop() {
        return html`
            <div @drop=${this.dropHandler} @dragover=${this.dragOverHandler}>
                <input type="file" id="fileInput" multiple @change=${this.changeFileInput}/>
                <simple-icon icon-name="cloud-arrow-up"></simple-icon>
                <p>Drag and drop file or <span @click=${this.clickButton}>Browse</span>.</p>
            </div>
        `
    }

    #chosenFile() {
        console.log(this.value)
        return html`
            <choose-input .value=${this.value} icon-name="file-regular" button-name="trash-xmark-regular" @file-changed=${this.fileChange} @value-changed=${this.valueChange}></choose-input>
        `
    }

    fileChange() {
        this.isChosen = false;
        this.file = {};
        this.value = '';
    }

    valueChange(e) {
        this.value = e.target.value;
    }

    render() {
        return this.isChosen ? this.#chosenFile() : this.#dragAndDrop()
    }
});