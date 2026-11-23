import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import VersusScene from "./VersusScene";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";

const goku: CharacterSummary = {
  id: 1,
  name: "Goku",
  ki: "60.000.000",
  maxKi: "90.000.000",
  race: "Saiyan",
  gender: "Male",
  description: "Guerrero saiyajin.",
  image: "https://example.com/goku.png",
  affiliation: "Z Fighter",
  deletedAt: null,
};

const vegeta: CharacterSummary = {
  ...goku,
  id: 2,
  name: "Vegeta",
  ki: "50.000.000",
  maxKi: "80.000.000",
  image: "https://example.com/vegeta.png",
};

const playMock = vi.hoisted(() => vi.fn());
const useMediaQueryMock = vi.hoisted(() => vi.fn(() => false));
const useCharacterDetailMock = vi.hoisted(() => vi.fn());

vi.mock("@hooks/useArcadeAudio", () => ({ useArcadeAudio: () => playMock }));
vi.mock("@hooks/useMediaQuery", () => ({ useMediaQuery: useMediaQueryMock }));
vi.mock("@hooks/useCharacterDetail", () => ({
  useCharacterDetail: useCharacterDetailMock,
}));

const LocationProbe = () => {
  const location = useLocation();
  return (
    <output data-testid="location">
      {`${location.pathname}${location.search}`}
    </output>
  );
};

const renderVersus = (initialEntry = "/versus/1/2") =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LocationProbe />
      <Routes>
        <Route path="/versus/:p1Id/:p2Id" element={<VersusScene />} />
        <Route path="/select" element={<p>Pantalla de selección</p>} />
      </Routes>
    </MemoryRouter>,
  );

const makeDetailEntry = (summary: CharacterSummary) => ({
  id: summary.id,
  summary,
  detail: {
    ...summary,
    originPlanet: {
      id: 6,
      name: "Tierra",
      isDestroyed: false,
      description: "Planeta natal.",
      image: "https://example.com/earth.png",
      deletedAt: null,
    },
    transformations: [],
  },
  status: "ready",
  error: undefined,
  retry: vi.fn(),
});

describe("VersusScene navigation", () => {
  beforeEach(() => {
    playMock.mockClear();
    useMediaQueryMock.mockReturnValue(false);
    useCharacterDetailMock.mockImplementation((id: string | number) =>
      makeDetailEntry(Number(id) === 1 ? goku : vegeta),
    );
  });

  it("links back to the roster focused on P1", () => {
    renderVersus();
    expect(screen.getByRole("link", { name: "Volver a luchadores" })).toHaveAttribute(
      "href",
      "/select?focus=1",
    );
    expect(screen.getByRole("link", { name: "Cambiar luchadores" })).toHaveAttribute(
      "href",
      "/select?focus=1",
    );
  });

  it("returns to the roster with Escape and plays the back cue", () => {
    renderVersus();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByTestId("location")).toHaveTextContent("/select?focus=1");
    expect(playMock).toHaveBeenCalledWith("back");
  });

  it("shows the compact hint on small screens", () => {
    useMediaQueryMock.mockReturnValue(true);
    renderVersus();
    expect(screen.getByText("toca para regresar")).toBeInTheDocument();
    expect(screen.queryByText("Esc")).not.toBeInTheDocument();
  });

  it("reveals the visual Ki duel when VS is pressed", () => {
    renderVersus();

    expect(document.querySelector(".versus-scene__duel")).toBeNull();

    fireEvent.click(
      screen.getByRole("button", { name: "Medir el Ki de ambos luchadores" }),
    );

    expect(document.querySelector(".versus-scene__duel--p1")).not.toBeNull();
    expect(screen.getByText("Pulsa VS para repetir el duelo")).toBeInTheDocument();
    expect(screen.getByText(/Ventaja para Goku/)).toBeInTheDocument();
    expect(playMock).toHaveBeenCalledWith("lock-in");
  });

  it("marks a Ki tie when both fighters share the same values", () => {
    useCharacterDetailMock.mockImplementation((id: string | number) =>
      makeDetailEntry(
        Number(id) === 1
          ? goku
          : { ...vegeta, ki: goku.ki, maxKi: goku.maxKi },
      ),
    );
    renderVersus();

    fireEvent.click(
      screen.getByRole("button", { name: "Medir el Ki de ambos luchadores" }),
    );

    expect(document.querySelector(".versus-scene__duel--tie")).not.toBeNull();
    expect(screen.getByText(/Empate técnico/)).toBeInTheDocument();
  });

  it("compares Ki values with text multipliers", () => {
    useCharacterDetailMock.mockImplementation((id: string | number) =>
      makeDetailEntry(
        Number(id) === 1
          ? { ...goku, ki: "60 Septillion", maxKi: "90 Septillion" }
          : { ...vegeta, ki: "12.34 Septillion", maxKi: "19.84 Septillion" },
      ),
    );
    renderVersus();

    fireEvent.click(
      screen.getByRole("button", { name: "Medir el Ki de ambos luchadores" }),
    );

    expect(document.querySelector(".versus-scene__duel--p1")).not.toBeNull();
  });

  it("activates the Ki duel with Enter without focusing the button", () => {
    renderVersus();

    fireEvent.keyDown(window, { key: "Enter" });

    expect(document.querySelector(".versus-scene__duel--p1")).not.toBeNull();
    expect(playMock).toHaveBeenCalledWith("lock-in");
  });

  it("activates the Ki duel with gamepad A", () => {
    const frames: FrameRequestCallback[] = [];
    const buttons = Array.from({ length: 17 }, () => ({
      pressed: false,
      touched: false,
      value: 0,
    }));
    const gamepad = {
      index: 0,
      connected: true,
      axes: [0, 0],
      buttons,
    } as unknown as Gamepad;
    const originalGetGamepads = Object.getOwnPropertyDescriptor(
      navigator,
      "getGamepads",
    );

    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    Object.defineProperty(navigator, "getGamepads", {
      configurable: true,
      value: () => [gamepad],
    });

    try {
      renderVersus();
      expect(frames.length).toBeGreaterThan(0);
      act(() => {
        frames.shift()?.(0);
      });
      expect(frames.length).toBeGreaterThan(0);
      buttons[0].pressed = true;
      act(() => {
        frames.shift()?.(200);
      });

      expect(document.querySelector(".versus-scene__duel--p1")).not.toBeNull();
      expect(playMock).toHaveBeenCalledWith("lock-in");
    } finally {
      if (originalGetGamepads) {
        Object.defineProperty(navigator, "getGamepads", originalGetGamepads);
      } else {
        Reflect.deleteProperty(navigator, "getGamepads");
      }
      vi.unstubAllGlobals();
    }
  });

  it("activates the Ki duel with the keyboard", async () => {
    const user = userEvent.setup();
    renderVersus();

    screen
      .getByRole("button", { name: "Medir el Ki de ambos luchadores" })
      .focus();
    await user.keyboard("{Enter}");

    expect(document.querySelector(".versus-scene__duel--p1")).not.toBeNull();
    expect(playMock).toHaveBeenCalledTimes(1);
  });
});
