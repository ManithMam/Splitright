import React from "react";
import { render } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import GameInfoBox from "./GameInfoBox";

describe("GameInfoBox", () => {
  const game = {
    title: "Test Game",
    mode: "Communist",
    amount: 5,
    adminUsername: "Admin",
  };
  const code = "ABCD1234";

  it("render game title", () => {
    const { getByText } = render(<GameInfoBox game={game} code={code} />);
    const titleElement = getByText(game.title);
    expect(titleElement).toBeInTheDocument();
  });

  it("render game mode", () => {
    const { getByText } = render(<GameInfoBox game={game} code={code} />);
    const modeElement = getByText("Mode:");
    const modeValueElement = getByText(game.mode);
    expect(modeElement).toBeInTheDocument();
    expect(modeValueElement).toBeInTheDocument();
  });

  it("render game amount", () => {
    const { getByText } = render(<GameInfoBox game={game} code={code} />);
    const amountElement = getByText("Amount:");
    const amountValueElement = getByText(game.amount.toString());
    expect(amountElement).toBeInTheDocument();
    expect(amountValueElement).toBeInTheDocument();
  });

  it("render game host", () => {
    const { getByText } = render(<GameInfoBox game={game} code={code} />);
    const hostElement = getByText("Host:");
    const hostValueElement = getByText(game.adminUsername);
    expect(hostElement).toBeInTheDocument();
    expect(hostValueElement).toBeInTheDocument();
  });

  it("render CodeBtn", () => {
    const { getByText } = render(<GameInfoBox game={game} code={code} />);
    const codeButtonElement = getByText(code);
    expect(codeButtonElement).toBeInTheDocument();
  });
});