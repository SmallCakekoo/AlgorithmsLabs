export default class CardContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    console.log("Componente creado");
    this.shadowRoot.innerHTML = `
          <style>
        .grid-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    justify-content: center;
    align-items: center;
    max-width: 1000px;
    margin: auto;
  }

  .top-row {
    display: flex;
    gap: 20px;
    justify-content: center;
    width: 100%;
  }

  .bottom-row {
    display: flex;
    gap: 1px;
    justify-content: center;
    width: 100%;
  }

  .small-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  @media (max-width: 800px) {
    .top-row,
    .bottom-row {
      flex-direction: column;
    }
  }

          </style>
          <div class="grid-container">
    <div class="top-row">
      <card-large index="0"></card-large>
      <card-large index="1"></card-large>
    </div>
    <div class="bottom-row">
      <card-medium index="2"></card-medium>
      <div class="small-cards">
        <card-small index="3"></card-small>
        <card-small index="4"></card-small>
      </div>
      <card-medium index="5"></card-medium>
    </div>
      
  </div>

        `;
  }
}
