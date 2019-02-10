// Trashpile | https://github.com/eth-p/trashpile | Copyright (C) 2019 eth-p

/**
 * A class that generates HTMLSpanElement nodes that can't be easily scraped by bots built from headless web browsers.
 */
export default class Trashpile {

	/**
	 * Creates an HTMLSpanElement containing a delightful mixture of garbage and real nodes.
	 *
	 * @param text The text you're trying to prevent from being scraped.
	 * @param options The generator options.
	 * @returns An HTML element that renders correctly, but can't be scraped easily.
	 */
	public createNode(text: string, options?: TrashpileOptions): HTMLSpanElement {
		const opt_trashMin = (options == null || options.trashMin == null ? 5 : options.trashMin);
		const opt_trashMax = (options == null || options.trashMax == null ? 10 : options.trashMax);
		const opt_realMin = (options == null || options.realMin == null ? 5 : options.realMin);
		const opt_realMax = (options == null || options.realMax == null ? 10 : options.realMax);

		// Determine the number of nodes to use.
		const trashCount = opt_trashMin + Math.floor(Math.random() * (opt_trashMax - opt_trashMin));
		const realCount = opt_realMax + Math.floor(Math.random() * (opt_realMax - opt_realMin));
		const fragMin = Math.max(1, Math.floor(text.length / realCount) * 0.5);
		const fragMax = Math.max(1, Math.floor(text.length / realCount) * 3);

		// Determine the number of and length of the real text fragments.
		let fragments: (string | number)[] = this._generateFragmentArrangement(realCount, text.length, fragMin, fragMax);
		let elements = this._generateElementArrangement(realCount, trashCount);
		let container = document.createElement('container');

		// Split the text into fragments.
		let index = 0;
		for (let i = 0; i < fragments.length; i++) {
			let size = fragments[i] as number;
			fragments[i] = text.substring(index, index + size);
			index += size;
		}

		// Create the elements.
		index = 0;
		for (let i = 0; i < elements.length; i++) {
			if (elements[i] === true) {
				container.appendChild(this._createRealNode(fragments[index++] as string));
			} else {
				container.appendChild(this._createFakeNode());
			}
		}

		// Set container attributes.
		container.setAttribute('data-trashpile', '');

		// Return container.
		return container;
	}

	/**
	 * Creates a garbage string of random length.
	 * @returns An alphanumeric string.
	 */
	public createGarbage(length?: number): string {
		return Math.random().toString(36).substring(2);
	}

	/**
	 * Generates a shuffled array of fragment sizes.
	 *
	 * @param count The number of fragments to genrate.
	 * @param itemTotal The sum of all fragments.
	 * @param itemMin The minimum size of a fragment.
	 * @param itemMax The maximum size of a fragment.
	 * @returns An array of fragment sizes.
	 * @protected
	 */
	protected _generateFragmentArrangement(count: number, itemTotal: number, itemMin: number, itemMax: number): number[] {
		let fragmentSizes = new Array(count);
		let remaining = itemTotal;
		for (let i = 1; i < fragmentSizes.length; i++) {
			let size = Math.min(remaining, itemMin + Math.floor(Math.random() * (itemMax - itemMin)));

			fragmentSizes[i] = size;
			remaining -= size;
		}

		fragmentSizes[0] = remaining;
		this._shuffle(fragmentSizes);
		return fragmentSizes;
	}

	/**
	 * Generates a shuffled array of element arrangements.
	 *
	 * @param realCount The number of real elements.
	 * @param fakeCount The number of fake elements.
	 * @returns An array where true represents a real element.
	 * @protected
	 */
	protected _generateElementArrangement(realCount: number, fakeCount: number): boolean[] {
		let arrangement = new Array(realCount + fakeCount);
		for (let i = 0; i < arrangement.length; i++) {
			arrangement[i] = i < realCount;
		}

		this._shuffle(arrangement);
		return arrangement;
	}

	/**
	 * Creates a real node with visible text content.
	 *
	 * @param text The text content.
	 * @returns The new node.
	 * @protected
	 */
	protected _createRealNode(text: string): HTMLElement {
		let element: any = document.createElement('span');
		let shadow: Node = this._attachShadow(element) || element;

		// Append garbage (if valid shadow root).
		if (shadow !== element) {
			element.appendChild(document.createTextNode(this.createGarbage()));
		}

		// Append real text.
		shadow.appendChild(document.createTextNode(text));

		// Return.
		return element;
	}

	/**
	 * Creates a fake "garbage" node to trick scrapers.
	 *
	 * @returns The new node.
	 * @potected
	 */
	protected _createFakeNode(): HTMLElement {
		let element: any = document.createElement('span');

		// Append garbage.
		element.appendChild(document.createTextNode(this.createGarbage()));

		// Hide garbage.
		if (this._attachShadow(element) === null) {
			this._styleFakeNode(element);
		}

		// Return.
		return element;
	}

	/**
	 * Attaches a Shadow DOM root to an element.
	 * This will attempt to use Shadow DOM V1, followed by V0.
	 *
	 * If the Shadow DOM is not supported, this will simply return null to indicate an error.
	 *
	 * @param element The target element.
	 * @returns The shadow root, or null if unsupported.
	 * @private
	 */
	protected _attachShadow(element: HTMLElement): ShadowRoot | null {
		if (element.attachShadow != null) {
			return element.attachShadow({mode: 'closed'});
		} else if ((element as any).createShadowRoot != null) {
			return (element as any).createShadowRoot();
		} else {
			return null;
		}
	}

	/**
	 * Applies CSS styles to a fake node to prevent it from visibly rendering and being selected by the user.
	 * This is a fallback for older browsers where Shadow DOM is unsupported.
	 *
	 * @param element The element to stylize.
	 * @protected
	 */
	protected _styleFakeNode(element: HTMLElement): void {
		let style = element.style as any;
		style.userSelect = 'none';
		style.msUserSelect = 'none';
		style.mozUserSelect = 'none';
		style.MozUserSelect = 'none';
		style.webkitUserSelect = 'none';
		style.WebkitUserSelect = 'none';
		style.userSelect = 'none';
		style.fontSize = '0px';
	}

	/**
	 * In-place shuffles an array to help keep things random.
	 * The default implementation uses the Fisher-Yates shuffle algorithm.
	 *
	 * @param arr The array to shuffle.
	 * @protected
	 */
	protected _shuffle(arr: any[]): void {
		let end = arr.length;
		while (end > 0) {
			let index = Math.floor(Math.random() * end--);
			let temp = arr[end];
			arr[end] = arr[index];
			arr[index] = temp;
		}
	}

}

interface TrashpileOptions {

	trashMin: number,
	trashMax: number,
	realMin: number,
	realMax: number

}
