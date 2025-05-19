class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-flex;
            align-items: center;
            font-family: Arial, sans-serif;
            padding-left: 29rem;
          }
          .search-container {
            display: flex;
            align-items: center;
            gap: 5px;
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 5px 10px;
            background: white;
            flex-grow: 1;
          }
          input {
            border: none;
            outline: none;
            font-size: 14px;
            flex-grow: 1;
            padding: 5px;
          }
          .icon {
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .button-container {
            margin-left: 10px;
          }
          .button {
            background: white;
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 10px;
            cursor: pointer;
          }
        </style>
        <div class="search-container">
          <span class="icon"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall css-1pi2lzz" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SearchRoundedIcon"><path d="M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"></path></svg></span>
          <input type="text" placeholder="Search...">
        </div>
        <div class="button-container">
          <button class="button">
            <span class="icon"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RssFeedRoundedIcon"><circle cx="6.18" cy="17.82" r="2.18"></circle><path d="M5.59 10.23c-.84-.14-1.59.55-1.59 1.4 0 .71.53 1.28 1.23 1.4 2.92.51 5.22 2.82 5.74 5.74.12.7.69 1.23 1.4 1.23.85 0 1.54-.75 1.41-1.59-.68-4.2-3.99-7.51-8.19-8.18m-.03-5.71C4.73 4.43 4 5.1 4 5.93c0 .73.55 1.33 1.27 1.4 6.01.6 10.79 5.38 11.39 11.39.07.73.67 1.28 1.4 1.28.84 0 1.5-.73 1.42-1.56-.73-7.34-6.57-13.19-13.92-13.92"></path></svg></span>
          </button>
        </div>
      `;
  }
}

export default SearchBar;
