const BASE_PATH_AGENT_API = "/_api";

export default class Agent {
  constructor(readonly agentId: string) {}

  async getView(name: string, params: Record<string, any>) {
    const urlQueryParams = Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      })
      .join("&");

    const resp = await fetch(
      `${BASE_PATH_AGENT_API}/${this.agentId}/${name}?${urlQueryParams}`
    );
    try {
      const data = await resp.json();
      return data.result;
    } catch (e) {
      return true;
    }
  }

  async runAction(name: string, params: any) {
    const resp = await fetch(`${BASE_PATH_AGENT_API}/${this.agentId}/${name}`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    });
    try {
      const data = await resp.json();
      return data;
    } catch (e) {
      return true;
    }
  }
}
